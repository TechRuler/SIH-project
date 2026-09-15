import os
import sys
import math
import json
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from google import genai

from dotenv import load_dotenv
load_dotenv()  # Loads variables from .env into os.environ

# Setup Environment
PORT = int(os.getenv("PORT", 8000))
DIST_DIR = os.path.join(os.path.dirname(__file__), 'dist')
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'real_mplads.json')

app = Flask(__name__, static_folder=DIST_DIR)
gemini_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY")) if os.environ.get("GEMINI_API_KEY") else None

# Load Dataset
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        REAL_DATA = json.load(f)
    print(f"[✓] Loaded Real Dataset from {DATA_FILE}")
else:
    REAL_DATA = {"kpis": {}, "projects": [], "duplicatePairs": []}

MPLADS_DATA = REAL_DATA.get('projects', [])
KPIS_DATA = REAL_DATA.get('kpis', {})

# ==========================================
# REAL ML ENGINE (SCIKIT-LEARN)
# ==========================================

print("[+] Training Isolation Forest Anomaly Detection Model...")
# Convert projects list to pandas DataFrame for ML processing
df_projects = pd.DataFrame(MPLADS_DATA)

if not df_projects.empty and 'sanctionedAmount' in df_projects.columns:
    # Fill missing values for feature engineering
    df_projects['sanctionedAmount'] = df_projects['sanctionedAmount'].fillna(0)
    df_projects['expenditure'] = df_projects.get('expenditure', pd.Series(0)).fillna(0)
    
    # Feature 1: Financial Ratio (Expenditure vs Sanctioned Amount)
    df_projects['exp_ratio'] = df_projects['expenditure'] / (df_projects['sanctionedAmount'] + 1)
    
    # Train Isolation Forest model to detect statistical outliers
    features = df_projects[['sanctionedAmount', 'exp_ratio']]
    model = IsolationForest(contamination=0.05, random_state=42)
    df_projects['ml_anomaly_score'] = model.fit_predict(features) # -1 for anomaly, 1 for normal
    
    # Convert back to dictionary
    MPLADS_DATA = df_projects.to_dict(orient='records')
    print("[✓] Isolation Forest model trained successfully!")

# Build TF-IDF Vectorizer for Duplicate Text Matching
print("[+] Building TF-IDF Vectorizer for Duplicate Work Order Detection...")
if MPLADS_DATA:
    work_names = [p.get('workName', '') for p in MPLADS_DATA]
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(work_names)
    print("[✓] TF-IDF Matrix built!")
else:
    tfidf_vectorizer, tfidf_matrix = None, None


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)


@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# ==========================================
# REST API ENDPOINTS
# ==========================================

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify(KPIS_DATA)

@app.route('/api/projects', methods=['GET'])
def get_projects():
    risk_filter = request.args.get('risk', 'All')
    state_filter = request.args.get('state', 'All')
    search_query = request.args.get('q', '').lower()

    results = MPLADS_DATA
    
    if risk_filter != 'All':
        results = [p for p in results if p.get('riskLevel') == risk_filter]
    if state_filter != 'All':
        results = [p for p in results if state_filter.lower() in p.get('state', '').lower()]
    if search_query:
        results = [p for p in results if search_query in p.get('workName', '').lower() or 
                                         search_query in p.get('mpName', '').lower() or 
                                         search_query in p.get('district', '').lower()]

    return jsonify(results[:100])

@app.route('/api/duplicate-check', methods=['POST'])
def check_duplicate():
    """ML-Powered Duplicate Check using TF-IDF + Cosine Similarity + Haversine Distance"""
    body = request.get_json(silent=True) or {}
    work_title = body.get('workName', '')
    lat = body.get('lat', 26.1542)
    lon = body.get('lon', 85.8918)
    
    # Step 1: Compute TF-IDF Text Similarity
    similarity_score = 0
    if tfidf_vectorizer and work_title:
        query_vec = tfidf_vectorizer.transform([work_title])
        cosine_sim = cosine_similarity(query_vec, tfidf_matrix).flatten()
        similarity_score = round(float(np.max(cosine_sim)) * 100, 2)
    
    # Step 2: Calculate Geographic Distance to Nearest Project
    min_distance = 999999
    for p in MPLADS_DATA[:500]: # Sample check across projects
        plat = p.get('lat')
        plon = p.get('lon')
        if plat and plon:
            d = calculate_haversine_distance(lat, lon, plat, plon)
            if d < min_distance:
                min_distance = d

    is_duplicate = similarity_score > 75 or min_distance < 300

    return jsonify({
        "textSimilarityPercentage": similarity_score,
        "nearestProjectDistanceMeters": min_distance,
        "isDuplicateProximity": is_duplicate,
        "verdict": "CRITICAL_DUPLICATE_FLAGGED" if is_duplicate else "VERIFIED_UNIQUE_WORK"
    })

@app.route('/api/chat', methods=['POST'])
def chat_assistant():
    """Hybrid AI: ML Outlier Detection + Gemini Contextual Explanation"""
    body = request.get_json(silent=True) or {}
    query = body.get('query', '').lower()

    # Retrieve ML-flagged anomalies relevant to the query
    matched = [p for p in MPLADS_DATA if p.get('ml_anomaly_score') == -1]
    if query:
        matched = [p for p in matched if query in p.get('state','').lower() or query in p.get('district','').lower() or query in p.get('workName','').lower()]
    
    matched = matched[:6] if matched else MPLADS_DATA[:6]

    # Generate LLM response using Gemini
    if gemini_client:
        prompt = f"""
        You are the AI Risk Officer for the MoSPI MPLADS Platform built by Team Semicolon.
        Our Scikit-Learn IsolationForest model flagged the following high-risk outlier projects:
        {json.dumps(matched, indent=2)}

        Answer the user query concisely based on these ML findings: {query}
        """
        try:
            res = gemini_client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
            reply = res.text
        except Exception as e:
            reply = f"ML Anomaly Engine analyzed records. Flagged {len(matched)} high-risk work orders."
    else:
        reply = f"Scikit-Learn ML Anomaly Engine flagged {len(matched)} high-priority work orders requiring audit review."

    return jsonify({"reply": reply, "projects": matched})

# Static SPA route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)