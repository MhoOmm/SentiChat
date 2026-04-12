from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import torch
import torch.nn as nn
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = FastAPI()


sentiment_model = load_model("GoEmotion/sentiment_lstm.keras")

with open("GoEmotion/tokenizer.pkl", "rb") as f:
    sentiment_tokenizer = pickle.load(f)

with open("GoEmotion/max_len.pkl", "rb") as f:
    sentiment_max_len = pickle.load(f)

with open("GoEmotion/label_map.pkl", "rb") as f:
    sentiment_label_map = pickle.load(f)



# hate_model = load_model("HateXplain/hateXplain_lstm.keras")

# with open("HateXplain/tokenizerX.pkl", "rb") as f:
#     hate_tokenizer = pickle.load(f)

# with open("HateXplain/max_lenX.pkl", "rb") as f:
#     hate_max_len = pickle.load(f)

# with open("HateXplain/label_mapX.pkl", "rb") as f:
#     hate_label_map = pickle.load(f)



with open("HateXplain/tfidf.pkl", "rb") as f:
    tf = pickle.load(f)

class RNN(nn.Module):
    def __init__(self, input_size, hidden_size=128):
        super().__init__()
        self.hidden_size = hidden_size
        self.rnn = nn.RNN(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, 3)

    def forward(self, x):
        h0 = torch.zeros(1, x.size(0), self.hidden_size).to(x.device)
        out, _ = self.rnn(x, h0)
        return self.fc(out[:, -1, :])

checkpoint = torch.load("HateXplain/model.pth", map_location="cpu")

rnn_model = RNN(checkpoint["input_size"])
rnn_model.load_state_dict(checkpoint["model_state"])
rnn_model.eval()

rnn_labels = ["hate", "offensive", "neutral"]


class TextRequest(BaseModel):
    text: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/warmup")
def warmup():
    sample = "This is a sample text"

    # sentiment warmup
    seq = sentiment_tokenizer.texts_to_sequences([sample])
    padded = pad_sequences(seq, maxlen=sentiment_max_len, padding="post")
    sentiment_model.predict(padded, verbose=0)

    # rnn warmup
    vector = tf.transform([sample]).toarray()
    tensor = torch.from_numpy(vector).float().unsqueeze(1)
    with torch.no_grad():
        rnn_model(tensor)

    return {"status": "models warmed"}


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



@app.post("/predict/hate-rnn")
def predict_hate_rnn(data: TextRequest):

    text = data.text.lower()

    vector = tf.transform([text]).toarray()
    tensor = torch.from_numpy(vector).float().unsqueeze(1)

    with torch.no_grad():
        output = rnn_model(tensor)
        probs = torch.softmax(output, dim=1)

        class_id = torch.argmax(probs, dim=1).item()
        confidence = probs[0][class_id].item()

    return {
        "model": "hate-speech-rnn",
        "text": text,
        "prediction": rnn_labels[class_id],
        "confidence": confidence
    }


# -------- Root Endpoint --------
# uvicorn app:app --reload --port 10000 
@app.get("/")
def home():
    return {
        "message": "ML Service running",
        "endpoints": [
            "/predict/sentiment",
            "/predict/hate-rnn"
        ]
    }