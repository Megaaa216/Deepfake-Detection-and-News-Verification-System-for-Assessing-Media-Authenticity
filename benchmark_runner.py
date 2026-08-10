import time
import json
import urllib.request
import urllib.error
import urllib.parse
import sys

# Reconfigure stdout for UTF-8 compatibility on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BENCHMARK_TARGETS = [
    ("Real NASA (YouTube)", "https://www.youtube.com/watch?v=WeA7edXsU40"),
    ("Fake Queen (YouTube)", "https://www.youtube.com/watch?v=IvY-Abd2FfM"),
    ("Real NASA Earth (FB)", "https://www.facebook.com/NASA/videos/ultra-high-definition-4k-view-of-planet-earth/10154050193306772/"),
    ("Fake Queen (FB)", "https://www.facebook.com/Channel4/videos/deepfake-queen-2020-alternative-christmas-message/243343943850219/"),
    ("Real BBC (TikTok)", "https://www.tiktok.com/@bbc/video/7185138923570547973"),
    ("Fake DeepTomCruise (TikTok)", "https://www.tiktok.com/@deeptomcruise/video/6932640712861224198"),
    ("Real NatGeo (Instagram)", "https://www.instagram.com/reel/DLfFAEiiyOQ/"),
    ("Fake AI (Instagram)", "https://www.instagram.com/reel/DV2x8zgjc6f/"),
]

def sanitize_url(raw_url: str) -> str:
    cleaned = raw_url.strip().strip("'\"")
    if cleaned.startswith("blob:"):
        cleaned = cleaned[5:]
    return cleaned

def run_benchmark(api_endpoint: str = "http://localhost:5000/api/verify-media"):
    print("=" * 115)
    print(f"RUNNING DEEPFAKE DETECTION BENCHMARK SUITE ({len(BENCHMARK_TARGETS)} Targets)")
    print(f"Target API Endpoint: {api_endpoint}")
    print("=" * 115)
    print(f"{'Target Label':<30} | {'Time (s)':<10} | {'HTTP Status':<12} | {'Risk Score':<12} | {'Final Verdict'}")
    print("-" * 115)

    results = []

    for label, raw_url in BENCHMARK_TARGETS:
        sanitized_url = sanitize_url(raw_url)
        start_time = time.time()
        
        status_code = "ERR"
        risk_score = "N/A"
        verdict = "UNKNOWN"
        
        try:
            payload = json.dumps({"url": sanitized_url, "video_url": sanitized_url}).encode("utf-8")
            req = urllib.request.Request(
                api_endpoint,
                data=payload,
                headers={"Content-Type": "application/json", "User-Agent": "BenchmarkRunner/1.0"},
                method="POST"
            )
            
            with urllib.request.urlopen(req, timeout=120) as resp:
                status_code = resp.status
                resp_bytes = resp.read()
                try:
                    data = json.loads(resp_bytes.decode("utf-8"))
                    risk_score_val = data.get("riskScore") if data.get("riskScore") is not None else data.get("risk_score")
                    if risk_score_val is not None:
                        risk_score = f"{float(risk_score_val):.1f}%"
                    elif "confidence" in data:
                        risk_score = f"{(float(data['confidence']) * 100):.1f}%"
                        
                    verdict = data.get("result") or data.get("status") or data.get("verdict") or "SUCCESS"
                    if isinstance(verdict, str) and len(verdict) > 42:
                        verdict = verdict[:39] + "..."
                except Exception as parse_err:
                    verdict = f"JSON Parse Error: {parse_err}"
                    
        except urllib.error.HTTPError as http_err:
            status_code = http_err.code
            try:
                err_bytes = http_err.read()
                err_data = json.loads(err_bytes.decode("utf-8"))
                verdict = err_data.get("message") or err_data.get("error_code") or err_data.get("detail") or str(http_err.reason)
            except Exception:
                verdict = f"HTTP {http_err.code}: {http_err.reason}"
        except Exception as exc:
            status_code = "FAIL"
            verdict = str(exc)

        exec_time = time.time() - start_time
        print(f"{label:<30} | {exec_time:<10.2f} | {str(status_code):<12} | {str(risk_score):<12} | {str(verdict)}")
        results.append({
            "label": label,
            "url": sanitized_url,
            "exec_time": exec_time,
            "status": status_code,
            "risk_score": risk_score,
            "verdict": verdict
        })

    print("=" * 115)
    print("BENCHMARK SUITE COMPLETE")
    print("=" * 115)
    return results

if __name__ == "__main__":
    endpoint = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5000/api/verify-media"
    run_benchmark(endpoint)
