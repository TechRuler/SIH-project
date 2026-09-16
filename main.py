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
ALLOCATION_FILE = os.path.join(os.path.dirname(__file__), 'data', 'real_mplads_data.json')

app = Flask(__name__, static_folder=DIST_DIR)
gemini_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY")) if os.environ.get("GEMINI_API_KEY") else None

# Load Real Dataset (Allocations)
if os.path.exists(ALLOCATION_FILE):
    with open(ALLOCATION_FILE, 'r', encoding='utf-8') as f:
        MP_ALLOCATIONS = json.load(f)
    print(f"[OK] Loaded Real MP Allocations from {ALLOCATION_FILE}")
else:
    MP_ALLOCATIONS = []
    print(f"[!] Warning: {ALLOCATION_FILE} not found!")

# ==========================================
# SIMULATION CALCULATOR (Based on Real Allocations)
# ==========================================
import random
def generate_simulated_projects(allocations):
    print("[+] Dynamically calculating realistic project metrics from real allocations...")
    projects = []
    work_templates = [
        ("Community Hall Construction", "Infrastructure"),
        ("Drinking Water RO Plant", "Water & Sanitation"),
        ("Solar Street Lights", "Power"),
        ("Primary School Additional Classroom", "Education"),
        ("Healthcare Sub-center Equipment", "Health"),
        ("Rural Link Road", "Infrastructure"),
        ("Public Library Setup", "Education"),
        ("Drainage System Modernization", "Infrastructure")
    ]
    
    random.seed(42) # For reproducibility between server restarts
    for idx, mp in enumerate(allocations):
        allocated = mp.get('ALLOCATED_AMT', 0)
        target_expenditure = allocated * random.uniform(0.65, 0.95) # 65% to 95% utilization
        current_exp = 0
        
        state = mp.get('STATE_NAME', 'Unknown')
        district = mp.get('CONSTITUENCY', 'Unknown')
        mp_name = mp.get('MP_NAME', 'Unknown')
        
        proj_idx = 0
        while current_exp < target_expenditure:
            template = random.choice(work_templates)
            # Average project cost 20L to 50L to keep dataset size reasonable (~30k projects)
            cost = random.uniform(2000000, 5000000) 
            
            # Don't exceed allocated
            if current_exp + cost > allocated:
                cost = allocated - current_exp
                
            status_roll = random.random()
            if status_roll < 0.4:
                status = "Completed"
                exp = cost
            elif status_roll < 0.8:
                status = "Ongoing"
                exp = cost * random.uniform(0.4, 0.9)
            else:
                status = "Unsanctioned"
                exp = 0
                
            current_exp += exp
            
            anomaly_type = ""
            risk_level = "Low"
            
            if random.random() < 0.05:
                anomaly_type = random.choice(["Fund utilization delay", "Suspicious contractor matching"])
                risk_level = "High"
            
            projects.append({
                "id": f"SIM-{idx}-{proj_idx}",
                "workName": f"{template[0]} in {district}",
                "category": template[1],
                "state": state,
                "district": district,
                "constituency": district,
                "mpName": mp_name,
                "sanctionedAmount": cost,
                "expenditure": exp,
                "status": status,
                "anomalyType": anomaly_type,
                "riskLevel": risk_level,
                "lat": 22.0 + random.uniform(-5, 5),
                "lon": 78.0 + random.uniform(-5, 5)
            })
            proj_idx += 1
            
    print(f"[✓] Successfully generated {len(projects)} realistic project records!")
    return projects

MPLADS_DATA = generate_simulated_projects(MP_ALLOCATIONS)

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
print("[+] Building TF-IDF Vectorizer for ML Engines...")
if MPLADS_DATA:
    work_names = [p.get('workName', '') for p in MPLADS_DATA]
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(work_names)
    
    # TF-IDF for AI Assistant Search (Content-based retrieval)
    chat_corpus = [f"{p.get('state', '')} {p.get('district', '')} {p.get('workName', '')} {p.get('anomalyType', '')} {p.get('riskLevel', '')}".lower() for p in MPLADS_DATA]
    chat_vectorizer = TfidfVectorizer(stop_words='english')
    chat_tfidf_matrix = chat_vectorizer.fit_transform(chat_corpus)
    
    print("[✓] TF-IDF Matrices built!")
else:
    tfidf_vectorizer, tfidf_matrix = None, None
    chat_vectorizer, chat_tfidf_matrix = None, None


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
    # 1. Financials
    total_allocated = sum(mp.get('ALLOCATED_AMT', 0) for mp in MP_ALLOCATIONS)
    total_expenditure = sum(p.get('expenditure', 0) for p in MPLADS_DATA)
    fund_utilization = round((total_expenditure / total_allocated * 100), 2) if total_allocated > 0 else 0

    # 2. Work Metrics
    total_works = len(MPLADS_DATA)
    completed_works = sum(1 for p in MPLADS_DATA if p.get('status') == 'Completed')
    ongoing_works = sum(1 for p in MPLADS_DATA if p.get('status') == 'Ongoing')
    
    # 3. Risk and Delay
    delayed_works = sum(1 for p in MPLADS_DATA if 'delay' in str(p.get('anomalyType', '')).lower())
    high_risk_projects = sum(1 for p in MPLADS_DATA if p.get('riskLevel') == 'High' or p.get('ml_anomaly_score') == -1)

    # 4. Aggregations
    from collections import defaultdict
    district_exp = defaultdict(float)
    cat_exp = defaultdict(float)
    
    for p in MPLADS_DATA:
        exp = p.get('expenditure', 0)
        if exp > 0:
            if p.get('district'):
                district_exp[p['district']] += exp
            if p.get('category'):
                cat_exp[p['category']] += exp
    
    district_wise = [{"name": k, "value": round(v, 2)} for k, v in sorted(district_exp.items(), key=lambda x: x[1], reverse=True)[:10]]
    category_wise = [{"name": k, "value": round(v, 2)} for k, v in sorted(cat_exp.items(), key=lambda x: x[1], reverse=True)]

    return jsonify({
        "totalAllocatedFunds": total_allocated,
        "totalExpenditure": total_expenditure,
        "fundUtilizationPercent": fund_utilization,
        "totalWorks": total_works,
        "completedWorks": completed_works,
        "ongoingWorks": ongoing_works,
        "delayedWorks": delayed_works,
        "highRiskProjects": high_risk_projects,
        "districtWiseExpenditure": district_wise,
        "categoryWiseSpending": category_wise
    })

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
    """Hybrid AI: ML Content Retrieval + Outlier Detection + Gemini Contextual Explanation"""
    body = request.get_json(silent=True) or {}
    query = body.get('query', '').lower()

    matched = []
    if query and chat_vectorizer:
        # Step 1: Use TF-IDF and Cosine Similarity to find relevant projects
        query_vec = chat_vectorizer.transform([query])
        sim_scores = cosine_similarity(query_vec, chat_tfidf_matrix).flatten()
        top_indices = sim_scores.argsort()[::-1]
        
        # Check if user is looking for suspicious/anomalous projects
        suspicious_keywords = ['suspicious', 'anomaly', 'anomalies', 'risk', 'fraud', 'fake']
        is_suspicious_query = any(word in query for word in suspicious_keywords)
        
        for idx in top_indices:
            if sim_scores[idx] == 0:
                break  # No more relevant matches
            
            p = MPLADS_DATA[idx]
            if is_suspicious_query:
                # Filter to only anomalous projects if requested
                if p.get('ml_anomaly_score') == -1 or p.get('riskLevel', '').lower() == 'high':
                    matched.append(p)
            else:
                matched.append(p)
                
            if len(matched) >= 6:
                break
                
    if not matched:
        # Fallback to general high-risk anomalies if no query match
        matched = [p for p in MPLADS_DATA if p.get('ml_anomaly_score') == -1][:6]
        if not matched:
            matched = MPLADS_DATA[:6]

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