import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer, util

# ==========================================
# 🧠 DUAL-MODEL ENGINE INITIALIZATION
# ==========================================

# Set cache paths according to the organized model directory layout
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
news_model_dir = os.path.join(base_dir, "models", "news")
os.makedirs(news_model_dir, exist_ok=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"[News Verifier] Initializing Stylistic Classifier in: {news_model_dir}")
ROBERTA_MODEL = "winterForestStump/Roberta-fake-news-detector"
text_tokenizer = AutoTokenizer.from_pretrained(ROBERTA_MODEL, cache_dir=news_model_dir)
style_model = AutoModelForSequenceClassification.from_pretrained(ROBERTA_MODEL, cache_dir=news_model_dir)
style_model = style_model.to(device)
style_model.eval()

print(f"[News Verifier] Initializing Factual Semantic Encoder in: {news_model_dir}")
fact_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2", cache_folder=news_model_dir)
fact_encoder = fact_encoder.to(device)

# 📂 Temporary Fact Cache Registry (Local cross-referencing truth anchors)
TRUTH_KNOWLEDGE_BASE = [
    "The official election polling numbers were audited and confirmed accurate by national security agencies.",
    "Global climate metrics indicate an average temperature increase across historical tracking zones.",
    "Health authorities verified that the newly distributed vaccine sequence passed all baseline human trials.",
    "Economic database indices confirmed that inflation metrics settled back under standard levels this quarter."
]
truth_embeddings = fact_encoder.encode(TRUTH_KNOWLEDGE_BASE, convert_to_tensor=True)


class NewsVerifierManager:
    def verify(self, input_text: str):
        """
        Executes a dual-pass evaluation loop across stylistic and semantic fact indices.
        """
        try:
            if not input_text or not input_text.strip():
                return {"success": False, "message": "Text payload is empty."}

            cleaned_text = input_text.strip()

            # ----------------------------------------------------
            # 🎯 PASS 1: Stylistic Anomaly Check (RoBERTa)
            # ----------------------------------------------------
            # In this specific model framework: Label 0 = FAKE, Label 1 = REAL
            inputs = text_tokenizer(cleaned_text, max_length=512, padding=True, truncation=True, return_tensors="pt")
            inputs = {k: v.to(device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = style_model(**inputs)
                probabilities = torch.softmax(outputs.logits, dim=1)
                
                fake_probability = float(probabilities[0][0].item() * 100) # Percentage index for 'FAKE' class
                real_probability = float(probabilities[0][1].item() * 100) # Percentage index for 'REAL' class

            # ----------------------------------------------------
            # 🔍 PASS 2: Factual Alignment Check (Sentence-BERT)
            # ----------------------------------------------------
            input_embedding = fact_encoder.encode(cleaned_text, convert_to_tensor=True)
            # Ensure input_embedding is on same device as truth_embeddings
            input_embedding = input_embedding.to(device)
            global truth_embeddings
            truth_embeddings = truth_embeddings.to(device)
            
            cosine_scores = util.cos_sim(input_embedding, truth_embeddings)
            
            # Pull the maximum match percentage coefficient relative to our truth cache
            max_score, max_index = torch.max(cosine_scores, dim=1)
            factual_alignment_score = max(0.0, float(max_score.item()) * 100)

            # ----------------------------------------------------
            # 📊 AGGREGATION ENGINE (Unified Trust Matrix Outputs)
            # ----------------------------------------------------
            # Higher score means more manipulative language tokens were extracted
            propaganda_bias_rating = round(fake_probability, 2)
            factual_consistency_rating = round(factual_alignment_score, 2)

            return {
                "success": True,
                "propaganda_bias_index": propaganda_bias_rating,
                "factual_consistency_index": factual_consistency_rating,
                "stylistic_verdict": "HIGHLY_MANIPULATIVE" if propaganda_bias_rating > 60 else "NEUTRAL_TONE",
                "factual_verdict": "VERIFIED_ALIGNMENT" if factual_consistency_rating > 50 else "UNVERIFIED_CLAIM"
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

# Export single instance compatible with main.py endpoint import
news_verifier = NewsVerifierManager()
