import os
import requests
import pandas as pd
import json
import urllib3

# Suppress SSL warnings for a clean console output
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 1. Initialize a session to capture cookies automatically
session = requests.Session()

# 2. Visit main page to generate session cookies
dashboard_url = "https://mplads.mospi.gov.in/digigov/dashboard.html"
headers_base = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
session.get(dashboard_url, headers=headers_base, verify=False)

# 3. Target API Endpoint
api_url = "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData"

headers_post = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "https://mplads.mospi.gov.in",
    "Referer": "https://mplads.mospi.gov.in/digigov/dashboard.html"
}

# 4. YOUR EXACT PAYLOAD FROM DEVTOOLS
payload = {
    "combo": "0,0,0,2",
    "key": "Allocated Limit for Hon'ble MPs"
}

print(f"[*] Sending POST request with payload: {payload}...")

# 5. Execute POST Request
response = session.post(api_url, headers=headers_post, json=payload, verify=False)

if response.status_code == 200:
    raw_data = response.json()
    print("\n[+] Response received from MoSPI server!")
    
    # Check if we got the expected dictionary response
    if isinstance(raw_data, dict):
        # Dynamically grab the stringified JSON list (it's the first and only value in the dict)
        stringified_list = list(raw_data.values())[0]
        
        # Verify it's actually a string that looks like a JSON array
        if isinstance(stringified_list, str) and stringified_list.startswith("["):
            # Unpack the stringified JSON into a real Python list
            parsed_records = json.loads(stringified_list)
            
            # Filter out the final "Total_Amt" row (Keep only rows with an actual MP Name)
            clean_records = [row for row in parsed_records if "MP_NAME" in row]
            
            # Load directly into Pandas DataFrame
            df = pd.DataFrame(clean_records)
            print(f"[+] Successfully extracted {len(df)} project records!")
            print("\n--- SAMPLE DATA PREVIEW ---")
            print(df.head())
            
            # Safely create the 'data' directory if it doesn't exist yet
            os.makedirs("data", exist_ok=True)
            
            # Save JSON directly into data directory for your ML engine
            df.to_json("data/allocated_limit.json", orient="records", indent=4)
            print("\n[OK] Saved records to data/real_mplads_data.json!")
            
        else:
            print("[-] The server response format has changed. Cannot parse the string.")
            print(str(stringified_list)[:500])
    else:
        print("[!] Raw Response Structure is not a dictionary:")
        print(json.dumps(raw_data, indent=2)[:1000])

else:
    print(f"[-] Request failed with status code: {response.status_code}")
    print(response.text)