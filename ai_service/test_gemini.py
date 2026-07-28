import os
import sys
import json
import time
import requests
from dotenv import load_dotenv

# Ensure stdout uses UTF-8 encoding on Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
  sys.stdout.reconfigure(encoding='utf-8')

# Load environment variables from .env
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def test_gemini_key():
  print("=" * 60)
  print("TRUSTLENS GEMINI API KEY VALIDATOR")
  print("=" * 60)

  if not GEMINI_API_KEY:
    print("[WARNING] GEMINI_API_KEY environment variable is missing.")
    print("Please set GEMINI_API_KEY in your ai_service/.env file.")
    return

  masked_key = f"...{GEMINI_API_KEY[-4:]}" if len(GEMINI_API_KEY) >= 4 else "INVALID_KEY"
  print(f"[Info] Key Detected: {masked_key}")
  print("[Info] Sending test query to Google Gemini REST endpoint...")

  # Test endpoint model strings according to Google API spec
  models = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro"
  ]
  
  payload = {
    "contents": [
      {
        "parts": [
          {"text": "Hello, return JSON: {\"status\": \"ok\"}"}
        ]
      }
    ],
    "generationConfig": {
      "response_mime_type": "application/json"
    }
  }

  success = False
  for model_name in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={GEMINI_API_KEY}"
    try:
      response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=15)
      
      if response.status_code == 200:
        result_json = response.json()
        raw_text = result_json["candidates"][0]["content"]["parts"][0]["text"]
        print(f"\n✅ Gemini API Key is VALID and working! (Model: {model_name})")
        print(f"[Output] Response payload: {raw_text.strip()}")
        success = True
        break
      elif response.status_code == 429:
        print(f"\n❌ Gemini API Key ERROR: [429 RATE LIMIT EXCEEDED / QUOTA EXHAUSTED]")
        print(f"   Model '{model_name}' response: {response.json().get('error', {}).get('message')}")
      else:
        print(f"\n❌ Gemini API Key ERROR for model '{model_name}': [{response.status_code}] {response.text}")
    except Exception as e:
      print(f"\n❌ Gemini API Key ERROR: {str(e)}")

  if not success:
    print("\n[FAILED] Gemini verification failed across test models.")
  print("=" * 60)

if __name__ == "__main__":
  test_gemini_key()
