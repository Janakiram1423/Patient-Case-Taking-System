import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.mongo import connect_to_mongo, close_mongo_connection, is_mongo_connected
from routers import (
    patients,
    cases,
    appointments,
    ai_assistant,
    voice_scribe,
    lab_ocr,
    drugs,
    emergency,
    admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    yield
    # Shutdown: Close MongoDB connection
    await close_mongo_connection()

app = FastAPI(
    title="CliniCase AI™ Backend API",
    description="Smart Patient Case Taking & Clinical Record Management API with AI Inference, Voice Scribe, and Diagnostic OCR",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Frontend (Vercel deployment & localhost)
allowed_origins_env = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()] or ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(patients.router)
app.include_router(cases.router)
app.include_router(appointments.router)
app.include_router(ai_assistant.router)
app.include_router(voice_scribe.router)
app.include_router(lab_ocr.router)
app.include_router(drugs.router)
app.include_router(emergency.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "status": "Online",
        "service": "CliniCase AI™ Clinical Engine & EHR API",
        "version": "1.0.0",
        "database": "MongoDB Atlas" if is_mongo_connected else "In-Memory Store (Auto-Migrated)",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/health")
def health_check():
    return {
        "status": "Healthy",
        "database_connected": is_mongo_connected,
        "ai_inference_engine": "Ready",
        "voice_scribe_service": "Ready",
        "ocr_diagnostic_service": "Ready"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
