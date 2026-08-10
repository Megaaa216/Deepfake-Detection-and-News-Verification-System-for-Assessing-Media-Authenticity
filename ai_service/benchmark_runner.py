import os
import sys
import time
import requests
import json
from typing import List, Dict, Any

# Force fast 8-keyframe benchmark sampling in preprocessor
os.environ["FAST_BENCHMARK_MODE"] = "true"

# Define API endpoints
EXPRESS_ENDPOINT = "http://localhost:5000/api/verify-url"
AI_SERVICE_ENDPOINT = "http://127.0.0.1:8000/analyze-link"

# Pre-loaded 4-target benchmark test matrix
BENCHMARK_TARGETS = [
    {
        "label": "Real NASA (YouTube)",
        "url": "https://www.youtube.com/watch?v=WeA7edXsU40"
    },
    {
        "label": "Fake Queen (YouTube)",
        "url": "https://www.youtube.com/watch?v=IvY-Abd2FfM"
    },
    {
        "label": "Real NASA Earth (FB)",
        "url": "https://www.facebook.com/NASA/videos/ultra-high-definition-4k-view-of-planet-earth/10154050193306772/"
    },
    {
        "label": "Fake Queen (FB)",
        "url": "https://www.facebook.com/Channel4/videos/deepfake-queen-2020-alternative-christmas-message/243343943850219/"
    }
]

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def run_benchmark():
    print("=" * 95)
    print("[BENCHMARK] AUTOMATED MEDIA AUTHENTICITY & ACCELERATED INFERENCE TEST RUNNER")
    print("   [Fast Sampling Active: Capped at 8 Keyframes / Video Stream]")
    print("=" * 95)
    print()

    results: List[Dict[str, Any]] = []

    for index, item in enumerate(BENCHMARK_TARGETS, start=1):
        target_label = item["label"]
        target_url = item["url"]

        print(f"[{index}/{len(BENCHMARK_TARGETS)}] Processing: {target_label} ...")
        start_time = time.time()

        status_code = 0
        risk_score_str = "N/A"
        verdict_str = "Unknown"

        try:
            # Send sequential POST request to local verification endpoint
            response = requests.post(
                EXPRESS_ENDPOINT,
                json={"videoUrl": target_url, "url": target_url},
                headers={"Content-Type": "application/json"},
                timeout=60
            )
            execution_time = round(time.time() - start_time, 2)
            status_code = response.status_code

            if status_code == 200:
                data = response.json()
                score_num = data.get("riskScore", data.get("risk_score", 0.0))
                risk_score_str = f"{score_num:.1f}%"
                verdict_str = data.get("status", data.get("result", "likely_authentic"))
            else:
                data = response.json() if response.content else {}
                err_msg = data.get("detail", data.get("message", f"HTTP {status_code}"))
                risk_score_str = "N/A (Blocked)"
                verdict_str = str(err_msg)

        except requests.exceptions.RequestException as req_err:
            execution_time = round(time.time() - start_time, 2)
            status_code = 500
            risk_score_str = "N/A (Error)"
            verdict_str = f"Connection Exception ({type(req_err).__name__})"

        results.append({
            "label": target_label,
            "execution_time": f"{execution_time:.2f}s",
            "status": status_code,
            "risk_score": risk_score_str,
            "verdict": str(verdict_str)[:40]
        })

    # Print Clean Terminal Summary Table
    print("\n" + "=" * 95)
    print("📊 BENCHMARK TARGET MATRIX REPORT SUMMARY")
    print("=" * 95)
    header_fmt = "{:<30} | {:<18} | {:<13} | {:<12} | {:<15}"
    row_fmt = "{:<30} | {:<18} | {:<13} | {:<12} | {:<15}"

    print(header_fmt.format("Target Label", "Execution Time (s)", "HTTP Status", "Risk Score", "Final Verdict"))
    print("-" * 95)

    for res in results:
        print(row_fmt.format(
            res["label"],
            res["execution_time"],
            str(res["status"]),
            res["risk_score"],
            res["verdict"]
        ))

    print("=" * 95 + "\n")

if __name__ == "__main__":
    run_benchmark()
