# 🎭 SentiChat  
# Understanding Campus Voices, Intelligently

---

## 📌 Overview  
SentiChat is an AI-powered platform designed to analyze **student sentiment and detect hate speech** within a university environment. It enables students to express themselves anonymously while allowing administrators to monitor campus mood using **machine learning and data visualization tools**.

The platform transforms raw student input into **actionable insights**, helping institutions make better decisions and get better insights.

---

## 🚀 Key Features  

### 👤 User Side
- Anonymous login system (no identity exposure)  
- Create posts and comment on discussions  
- Submit grievances related to campus issues  
- View admin announcements and participate in polls  

### 🛠️ Admin Side
- Pre-authorized secure access  
- Analyze campus sentiment using **Power BI dashboards**  
- Monitor emotional trends on a weekly basis  
- Create announcements and polls for students  

---

## 🧠 Machine Learning Models  

### 1. Hate Speech Detection Model  
- Built using **NLP + TF-IDF**  
- Classifies text into:
  - Neutral  
  - Offensive  
  - Hate  

### 2. Emotion Detection Model (GoEmotion)  
- Built using **LSTM (Deep Learning)**  
- Detects emotions such as:
  - Happy  
  - Sad  
  - Angry  

---

## 🏗️ System Architecture  

SentiChat follows a **microservices-based architecture**:

- **Frontend:** React + Redux + Tailwind CSS  
- **Backend:** Node.js + Express.js  
- **ML Service:** FastAPI (Python)  
- **Database:** MongoDB  
- **Cache:** Redis  
- **Visualization:** Power BI  
- **AI Integration:** Google Gemini API  

---

## 🔄 Workflow  

1. User submits text (post/comment/grievance)  
2. Backend validates and processes the request  
3. Text is sent to ML service (FastAPI)  
4. ML models analyze:
   - Sentiment (emotion)  
   - Hate speech (toxicity)  
5. Results are stored in MongoDB  
6. Data is visualized via Power BI dashboards  
7. Admin monitors insights and takes action  

---

## 🌍 Real-World Applications  

- 🎓 University campus sentiment monitoring  
- 📱 Social media content moderation  
- 🏢 Corporate employee feedback analysis  
- 🌐 Online community/forum moderation  
- 🧠 Mental health and well-being tracking  

---

## 💡 Impact  

- Real-time understanding of campus mood  
- Early detection of student issues  
- Reduction in toxic communication  
- Data-driven administrative decisions  
- Improved student-admin communication  

---

## 🔐 Privacy & Security  

- Fully **anonymous user system**  
- No identity tracking by admins  
- JWT-based authentication  
- Rate limiting to prevent abuse  

---

## 🛠️ Tech Stack  

### Frontend  
- React  
- Redux Toolkit  
- Tailwind CSS  
- Framer Motion  

### Backend  
- Node.js  
- Express.js  

### Database & Cache  
- MongoDB  
- Redis  

### Machine Learning  
- Python  
- FastAPI  
- TensorFlow / Keras  
- NLP (TF-IDF, LSTM)  

### Analytics & AI  
- Power BI  
- Google Gemini API  

---

## 🔮 Future Enhancements  

- Real-time alerts for flagged content  
- Role-based access (moderators, users)  
- Cloud deployment (AWS/GCP)  
- Improved explainability of ML models  
- Advanced analytics dashboards  

---

## 🤝 Contribution  

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---


# Datasets:- 

HAteXplain- https://huggingface.co/datasets/Abhi0072/HateXplain

GoEmotions- https://www.kaggle.com/datasets/debarshichanda/goemotions/data

Hindi Abuses Datasets - https://github.com/pmathur5k10/Hinglish-Offensive-Text-Classification/blob/main/Hinglish_Profanity_List.csv
