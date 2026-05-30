# 🛡️ TruthGuard — AI Fake News & Job Scam Detector

> AI-powered web app that detects fake news and job scams using Groq + Llama.
> Built with React + Python Flask.

---

## 🚀 How to Run (Local)

### Step 1 — Get FREE Groq API Key
1. Go to: https://console.groq.com
2. Create an API key
3. Copy the key

### Step 2 — Add API Key
Create `backend/.env` (or copy `backend/.env.example`) and set:
```
GROQ_API_KEY=your_groq_api_key_here
```

### Step 3 — Start Backend (Terminal 1)
```bash
cd backend
python app.py
```
Backend runs at: http://localhost:5000

### Step 4 — Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

Open browser and go to: **http://localhost:5173**

---

## 🌍 Deploy for Free (Recommended)

### Frontend (Vercel)
- Push your code to GitHub
- Import the repo in Vercel
- Set **Root Directory** to `frontend`
- Add env var on Vercel:
  - `VITE_API_BASE = https://<your-render-backend>/api`

### Backend (Render)
- Create a Render **Web Service** from your GitHub repo
- Set **Root Directory** to `backend`
- Build command:
  - `pip install -r requirements.txt`
- Start command:
  - `python app.py`
- Add env vars on Render:
  - `GROQ_API_KEY = <your key>`
  - `CORS_ORIGINS = https://<your-vercel-domain>` (recommended)

## 📁 Project Structure
```
Fake News Job Scam Detector/
├── backend/
│   ├── app.py          ← Flask API server
│   └── .env            ← Your API key (don't share!)
└── frontend/
    ├── src/
    │   ├── App.jsx     ← Main React component
    │   ├── index.css   ← Styling
    │   └── main.jsx    ← Entry point
    └── index.html
```

## 🛠️ Tech Stack
- **Frontend:** React.js + Vite
- **Backend:** Python Flask
- **AI:** Groq + Llama (FREE tier available)
- **Styling:** Pure CSS (Glassmorphism + Dark Mode)

## ✨ Features
- ✅ Fake News Detection with Trust Score (0-100)
- ✅ Job Scam Detection with Red Flag list
- ✅ AI-generated explanation and safety tips
- ✅ Analysis History (stored locally)
- ✅ Copy Report button
- ✅ Beautiful dark mode UI

---
*Built as a resume project by a Diploma CS Student 🎓*
