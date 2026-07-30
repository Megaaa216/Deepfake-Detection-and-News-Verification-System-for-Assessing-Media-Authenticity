import os
import sys
import json
import time
import requests
from typing import List, Dict, Any

# Ensure stdout uses UTF-8 encoding on Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
  sys.stdout.reconfigure(encoding='utf-8')

# API Endpoints
AI_SERVICE_URL = "http://127.0.0.1:8000"
ANALYZE_LINK_URL = f"{AI_SERVICE_URL}/analyze-link"
ANALYZE_FILE_URL = f"{AI_SERVICE_URL}/analyze"

# Curated Benchmark Dataset
BENCHMARK_DATASET = [
  {
    "id": "auth-01",
    "name": "Chevy Acoustic Cover (Backlighting/Singing)",
    "url": "https://youtu.be/aH5iLBMWgjI",
    "expected_label": "AUTHENTIC",
    "notes": "Backlighting, acoustic vocal performance, expressive mouth movements."
  },
  {
    "id": "auth-02",
    "name": "Markiplier Let's Play (2016 Low Bitrate Webcam)",
    "url": "https://youtu.be/jOeuhZ9HYhQ",
    "expected_label": "AUTHENTIC",
    "notes": "Low bitrate webcam, H.264 macroblock compression noise."
  },
  {
    "id": "auth-03",
    "name": "Ted Talk Keynote (Fast Head Gestures & Stage Glare)",
    "url": "https://youtu.be/OIPDOFsQcCM",
    "expected_label": "AUTHENTIC",
    "notes": "Rapid head turns, dynamic stage spotlighting, speech articulation."
  },
  {
    "id": "auth-04",
    "name": "Live Broadcast Anchor (Studio Lighting)",
    "url": "https://youtu.be/9bZkp7q19f0",
    "expected_label": "AUTHENTIC",
    "notes": "Studio broadcast lighting, high resolution authentic video."
  },
  {
    "id": "fake-01",
    "name": "DeepFaceLab Face-Swap Specimen (High Anomaly)",
    "url": "https://youtu.be/cQ54GDm1eL0",
    "expected_label": "DEEPFAKE",
    "notes": "DeepFaceLab face swap, spatial boundary jitter, ocular misalignment."
  },
  {
    "id": "fake-02",
    "name": "Synthesized AI Avatar Video Specimen",
    "url": "https://youtu.be/oxXpB9pSETo",
    "expected_label": "DEEPFAKE",
    "notes": "Wav2Lip / AI avatar synthetic lip sync desynchronization."
  }
]

def run_benchmark():
  print("=" * 80)
  print("🧪 TRUSTLENS DEEPFAKE DETECTION PIPELINE BENCHMARK EVALUATOR")
  print("=" * 80)
  
  # Check backend connectivity
  try:
    health_resp = requests.get(f"{AI_SERVICE_URL}/health", timeout=5)
    if health_resp.status_code != 200:
      print(f"❌ AI Service health check failed with status: {health_resp.status_code}")
      return
  except Exception as err:
    print(f"❌ Could not connect to AI Service at {AI_SERVICE_URL}: {err}")
    print("Please make sure the FastAPI AI service is running on port 8000.")
    return

  print(f"[Info] AI Service connected cleanly at {AI_SERVICE_URL}")
  print(f"[Info] Evaluating {len(BENCHMARK_DATASET)} dataset samples...\n")

  results: List[Dict[str, Any]] = []
  
  tp, tn, fp, fn = 0, 0, 0, 0
  total_overrides = 0
  correct_overrides = 0
  bad_overrides = 0

  for idx, sample in enumerate(BENCHMARK_DATASET, start=1):
    print(f"--------------------------------------------------------------------------------")
    print(f"[{idx}/{len(BENCHMARK_DATASET)}] Testing: {sample['name']}")
    print(f"      Expected: {sample['expected_label']} | URL: {sample['url']}")
    
    start_time = time.time()
    
    try:
      payload = {"video_url": sample["url"]}
      resp = requests.post(ANALYZE_LINK_URL, json=payload, timeout=300)
      latency = round(time.time() - start_time, 2)

      if resp.status_code != 200:
        print(f"      ❌ API Request Failed! Code: {resp.status_code} | Text: {resp.text}")
        continue

      data = resp.json()
      
      # Extract key pipeline metrics
      predicted_result = data.get("result", "unknown").upper() # "REAL" or "FAKE"
      predicted_label = "AUTHENTIC" if predicted_result == "REAL" else "DEEPFAKE"
      
      risk_score = float(data.get("riskScore", data.get("risk_score", data.get("confidence", 0.0) * 100)))
      model_results = data.get("model_results", {})
      raw_face_score = float(model_results.get("face_model", 0.0))
      temporal_score = float(model_results.get("temporal_model", 0.0))
      
      gemini_audit = data.get("gemini_audit", {})
      override_applied = gemini_audit.get("override_applied", False) if isinstance(gemini_audit, dict) else False
      is_false_pos = gemini_audit.get("is_false_positive", False) if isinstance(gemini_audit, dict) else False
      override_reason = gemini_audit.get("false_positive_cause", "none") if isinstance(gemini_audit, dict) else "none"

      is_correct = (predicted_label == sample["expected_label"])

      if sample["expected_label"] == "DEEPFAKE":
        if predicted_label == "DEEPFAKE":
          tp += 1
        else:
          fn += 1
      else:
        if predicted_label == "AUTHENTIC":
          tn += 1
        else:
          fp += 1

      if override_applied or is_false_pos:
        total_overrides += 1
        if sample["expected_label"] == "AUTHENTIC" and predicted_label == "AUTHENTIC":
          correct_overrides += 1
        elif sample["expected_label"] == "DEEPFAKE" and predicted_label == "AUTHENTIC":
          bad_overrides += 1

      status_symbol = "✅ PASS" if is_correct else "❌ FAIL"
      override_str = f"YES ({override_reason})" if (override_applied or is_false_pos) else "NO"

      print(f"      Status: {status_symbol} | Predicted: {predicted_label} (Risk: {risk_score:.1f}%)")
      print(f"      Raw Model Score: {raw_face_score:.4f} | Temporal Cluster: {temporal_score:.4f}")
      print(f"      Gemini Override: {override_str} | Latency: {latency}s")

      results.append({
        "sample_id": sample["id"],
        "name": sample["name"],
        "expected_label": sample["expected_label"],
        "predicted_label": predicted_label,
        "is_correct": is_correct,
        "risk_score": risk_score,
        "raw_face_score": raw_face_score,
        "temporal_cluster_score": temporal_score,
        "gemini_override_applied": override_applied or is_false_pos,
        "gemini_override_reason": override_reason,
        "latency_seconds": latency,
        "gemini_summary": data.get("summary_text", "")
      })

    except Exception as e:
      print(f"      ❌ Exception occurred during evaluation: {e}")

  # Calculate Summary Metrics
  total_eval = tp + tn + fp + fn
  accuracy = (tp + tn) / total_eval * 100 if total_eval > 0 else 0.0
  fpr = (fp / (fp + tn) * 100) if (fp + tn) > 0 else 0.0
  fnr = (fn / (fn + tp) * 100) if (fn + tp) > 0 else 0.0
  precision = (tp / (tp + fp) * 100) if (tp + fp) > 0 else 0.0
  recall = (tp / (tp + fn) * 100) if (tp + fn) > 0 else 0.0
  f1_score = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0

  print("\n" + "=" * 80)
  print("📊 BENCHMARK EVALUATION SUMMARY REPORT")
  print("=" * 80)
  print(f" Samples Evaluated  : {total_eval}")
  print(f" True Positives (TP): {tp:<5} | False Positives (FP): {fp}")
  print(f" True Negatives (TN): {tn:<5} | False Negatives (FN): {fn}")
  print("-" * 80)
  print(f" Overall Accuracy   : {accuracy:.2f}%")
  print(f" False Positive Rate: {fpr:.2f}% (Goal: < 5.0%) {'✅ PASSED' if fpr <= 5.0 else '⚠️ ATTENTION'}")
  print(f" False Negative Rate: {fnr:.2f}% (Goal: < 2.0%) {'✅ PASSED' if fnr <= 2.0 else '⚠️ ATTENTION'}")
  print(f" Precision          : {precision:.2f}%")
  print(f" Recall             : {recall:.2f}%")
  print(f" F1-Score           : {f1_score:.2f}%")
  print("-" * 80)
  print(f" Gemini Overrides   : Total: {total_overrides} | Correct: {correct_overrides} | Bad (False Neg): {bad_overrides}")
  print("=" * 80)

  # Save detailed log report to ai_service/logs/benchmark_results.json
  logs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "logs"))
  os.makedirs(logs_dir, exist_ok=True)
  report_path = os.path.join(logs_dir, "benchmark_results.json")

  benchmark_report = {
    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "summary": {
      "total_samples": total_eval,
      "accuracy_pct": round(accuracy, 2),
      "false_positive_rate_pct": round(fpr, 2),
      "false_negative_rate_pct": round(fnr, 2),
      "precision_pct": round(precision, 2),
      "recall_pct": round(recall, 2),
      "f1_score_pct": round(f1_score, 2),
      "confusion_matrix": {"TP": tp, "TN": tn, "FP": fp, "FN": fn},
      "gemini_overrides": {"total": total_overrides, "correct": correct_overrides, "bad": bad_overrides}
    },
    "sample_results": results
  }

  with open(report_path, "w", encoding="utf-8") as f:
    json.dump(benchmark_report, f, indent=2, ensure_ascii=False)

  print(f"📁 Benchmark report successfully exported to:\n   {report_path}\n")

if __name__ == "__main__":
  run_benchmark()
