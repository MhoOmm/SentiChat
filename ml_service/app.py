from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)

# -------- Load GoEmotion Sentiment Model --------

sentiment_model = load_model("GoEmotion/sentiment_lstm.keras")

with open("GoEmotion/tokenizer.pkl", "rb") as f:
    sentiment_tokenizer = pickle.load(f)

with open("GoEmotion/max_len.pkl", "rb") as f:
    sentiment_max_len = pickle.load(f)

with open("GoEmotion/label_map.pkl", "rb") as f:
    sentiment_label_map = pickle.load(f)


# -------- Load HateXplain Model --------

hate_model = load_model("HateXplain/hateXplain_lstm.keras")

with open("HateXplain/tokenizerX.pkl", "rb") as f:
    hate_tokenizer = pickle.load(f)

with open("HateXplain/max_lenX.pkl", "rb") as f:
    hate_max_len = pickle.load(f)

with open("HateXplain/label_mapX.pkl", "rb") as f:
    hate_label_map = pickle.load(f)


# -------- Request Schema --------

class TextRequest(BaseModel):
    text: str


# -------- Health Endpoint --------

@app.get("/health")
def health():
    return {"status": "ok"}


# -------- Warmup Endpoint --------

@app.get("/warmup")
def warmup():
    sample = "This is a sample text"

    seq = sentiment_tokenizer.texts_to_sequences([sample])
    padded = pad_sequences(seq, maxlen=sentiment_max_len, padding="post")
    sentiment_model.predict(padded, verbose=0)

    seq2 = hate_tokenizer.texts_to_sequences([sample])
    padded2 = pad_sequences(seq2, maxlen=hate_max_len, padding="post")
    hate_model.predict(padded2, verbose=0)

    return {"status": "models warmed"}


# -------- Sentiment Prediction --------

@app.post("/predict/sentiment")
def predict_sentiment(data: TextRequest):

    text = data.text

    seq = sentiment_tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, maxlen=sentiment_max_len, padding="post")

    pred = sentiment_model.predict(padded, verbose=0)

    class_id = int(np.argmax(pred))
    probability = float(np.max(pred))

    return {
        "model": "sentiment",
        "text": text,
        "prediction": sentiment_label_map[class_id],
        "confidence": probability
    }


# -------- Hate Speech Prediction --------

@app.post("/predict/hate")
def predict_hate(data: TextRequest):

    text = data.text

    seq = hate_tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, maxlen=hate_max_len, padding="post")

    pred = hate_model.predict(padded, verbose=0)

    class_id = int(np.argmax(pred))
    probability = float(np.max(pred))

    return {
        "model": "hate-speech",
        "text": text,
        "prediction": hate_label_map[class_id],
        "confidence": probability
    }


# -------- Root Endpoint --------

@app.get("/")
def home():
    return {
        "message": "ML Service running",
        "endpoints": [
            "/predict/sentiment",
            "/predict/hate"
        ]
    }
    
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
    