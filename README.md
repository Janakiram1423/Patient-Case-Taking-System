# CliniCase AI™ — Deployment & Project Guide
### Smart India Hackathon (SIH) Clinical Intelligence & EHR Platform

This repository is structured into two standalone folders:
- **`frontend/`**: React 19 + TypeScript + Vite + Tailwind CSS (Ready for **Vercel** deployment)
- **`backend/`**: Python FastAPI + MongoDB async driver + Clinical Inference Services (Ready for **Render** deployment)

---

## 📁 Project Architecture

```
d:/SIH/
├── frontend/                          # 🌐 FRONTEND (Deploy to VERCEL)
│   ├── vercel.json                    # Vercel SPA routing configuration
│   ├── .env.example                   # Environment variable template (VITE_API_BASE_URL)
│   ├── package.json                   # Dependencies & build scripts
│   ├── vite.config.ts                 # Bundler config
│   ├── index.html                     # HTML5 entry with Plus Jakarta Sans typography
│   └── src/
│       ├── components/                # Modular clinical UI components
│       │   ├── admin/                 # Staff, Audit Logs, Settings, Analytics
│       │   ├── ai/                    # AI Case Assistant & Symptom Explorer
│       │   ├── appointments/          # OPD Queue & Token Management
│       │   ├── cases/                 # 5-Step Case Taking Wizard
│       │   ├── clinical/              # Voice Scribe, Lab OCR, Emergency Triage, Pediatric Calc
│       │   ├── common/                # Navbar, Sidebar, Modals, Badges
│       │   ├── dashboard/             # Role Portals (Doctor, Reception, Admin, Patient)
│       │   ├── patients/              # Patient Directory, Timeline, Registration
│       │   └── reports/               # NABH Case Sheet PDF Generator & Print Layouts
│       ├── context/                   # AuthContext, HospitalContext, ToastContext
│       ├── services/                  # api.ts (Unified API client with fallback)
│       ├── types/                     # Domain TypeScript interfaces
│       └── utils/                     # NEWS-2 evaluator, Speech Recognition, OCR parser
│
└── backend/                           # ⚙️ BACKEND (Deploy to RENDER + MONGODB)
    ├── render.yaml                    # Render Blueprint configuration
    ├── Procfile                       # Process file for Render web service
    ├── Dockerfile                     # Container image for Docker deployment
    ├── requirements.txt               # Dependencies (FastAPI, uvicorn, motor, pymongo)
    ├── .env.example                   # Environment template (MONGODB_URI, PORT, CORS)
    ├── main.py                        # FastAPI main app with lifespan & CORS
    ├── run.py                         # Startup launcher script
    ├── run.bat                        # One-click Windows runner
    ├── models/                        # Pydantic schemas (Patient, Case, Vitals, Rx, Lab, Appointment)
    ├── database/                      # MongoDB async connector (mongo.py) & In-memory Store (store.py)
    ├── routers/                       # REST API Endpoints (patients, cases, appointments, ai, voice, ocr, drugs, admin)
    └── services/                      # Clinical inference engines & NLP parsers
```

---

## 🚀 Deployment Guide

### 1. Database Setup: MongoDB Atlas (Free Cloud Database)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free shared cluster (M0).
2. Under **Database Access**, create a user with a username and password.
3. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere).
4. Click **Connect** → **Connect your application** → Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

---

### 2. Backend Deployment: Render
1. Push this repository to **GitHub** (or connect your repo on [render.com](https://render.com)).
2. On Render Dashboard:
   - Click **New** → **Web Service**
   - Connect your GitHub repository.
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add **Environment Variables** in Render:
   | Key | Value |
   | :--- | :--- |
   | `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority` |
   | `DATABASE_NAME` | `clinicase_db` |
   | `CORS_ORIGINS` | `*` |
4. Click **Deploy Web Service**.
5. Once deployed, note your Render URL (e.g. `https://clinicase-backend.onrender.com`).
   - Interactive Swagger API Docs will be available at: `https://clinicase-backend.onrender.com/docs`

---

### 3. Frontend Deployment: Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New** → **Project**.
2. Import your GitHub repository.
3. In the project configuration:
   - **Root Directory**: Click edit and select **`frontend`**
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://<your-render-backend-name>.onrender.com/api` |
5. Click **Deploy**.
   - Your frontend application will be live with full client-side routing, automated HTTPS, and global edge CDN!

---

## 💻 Local Development

### Run Backend Locally
```powershell
cd d:\SIH\backend
pip install -r requirements.txt
python run.py
```
- API will run at: `http://127.0.0.1:8000`
- Swagger Docs: `http://127.0.0.1:8000/docs`

### Run Frontend Locally
```powershell
cd d:\SIH\frontend
npm install
npm run dev
```
- Web App will run at: `http://localhost:5173`
