import os
import torch
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util

class NewsVerifier:
    def __init__(self) -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Set cache paths according to the organized model directory layout
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
        self.news_model_dir = os.path.join(base_dir, "models", "news")
        os.makedirs(self.news_model_dir, exist_ok=True)
        
        print(f"[News Verifier] Initializing Hugging Face classification pipeline in: {self.news_model_dir}")
        self.classifier = pipeline(
            "text-classification",
            model="mrm8488/bert-tiny-finetuned-fake-news-detection",
            device=0 if torch.cuda.is_available() else -1,
            model_kwargs={"cache_dir": self.news_model_dir}
        )
        
        print(f"[News Verifier] Initializing Sentence Transformer consensus model in: {self.news_model_dir}")
        self.embedder = SentenceTransformer(
            "all-MiniLM-L6-v2",
            cache_folder=self.news_model_dir
        )
        
        # Peer journalistic consensus base bank
        self.consensus_db = [
            {"claim": "Deepfake technology utilizes deep neural networks to generate synthetic face replacements.", "label": "true"},
            {"claim": "Vite is a modern frontend build tool designed for rapid hot module replacement.", "label": "true"},
            {"claim": "FastAPI is a high-performance Python web framework for building REST APIs.", "label": "true"},
            {"claim": "Media authenticity is assessed by examining edge blending anomalies and temporal sequence irregularities.", "label": "true"},
            {"claim": "Official reports confirm that the international space station remains in stable orbit.", "label": "true"}
        ]

    def verify(self, text: str) -> dict:
        """
        Performs text authenticity classification and consensus matching.
        """
        try:
            if not text or not text.strip():
                return {"success": False, "detail": "Text content cannot be empty"}

            cleaned_text = text.strip()
            
            # 1. Classification
            pred = self.classifier(cleaned_text)[0]
            label = pred["label"]
            score = float(pred["score"])
            
            # Map labels: LABEL_0 is FAKE, LABEL_1 is REAL for mrm8488's model
            verdict = "REAL" if label == "LABEL_1" else "FAKE"
            
            # 2. Semantic matching against our consensus bank
            text_emb = self.embedder.encode(cleaned_text, convert_to_tensor=True)
            db_claims = [item["claim"] for item in self.consensus_db]
            db_embs = self.embedder.encode(db_claims, convert_to_tensor=True)
            
            cos_scores = util.cos_sim(text_emb, db_embs)[0]
            best_idx = int(torch.argmax(cos_scores).item())
            best_similarity = float(cos_scores[best_idx].item())
            matched_claim = self.consensus_db[best_idx]["claim"]
            
            # 3. Compile credibility metric scores
            if verdict == "FAKE":
                credibility_score = (1.0 - score) * 100
                sensationalism = score * 100
            else:
                credibility_score = score * 100
                sensationalism = (1.0 - score) * 100

            # Dynamic verification summary response
            return {
                "success": True,
                "verdict": verdict,
                "confidence": round(score, 4),
                "credibility_score": round(credibility_score, 1),
                "sensationalism_index": round(sensationalism, 1),
                "sentiment_bias": "high" if score < 0.6 else "low",
                "matched_consensus_claim": matched_claim,
                "consensus_similarity": round(best_similarity, 4)
            }
        except Exception as e:
            print(f"[News Verifier Error] Analysis failed: {str(e)}")
            return {"success": False, "detail": str(e)}

# Single instance coordinator
news_verifier = NewsVerifier()
