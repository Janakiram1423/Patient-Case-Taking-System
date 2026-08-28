"""
Standalone launcher for the CliniCase AI Backend.
Attempts to launch with uvicorn (FastAPI).
"""
import sys
import os

# Ensure Windows handles Unicode properly
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

try:
    import uvicorn
    from main import app
    print("==================================================")
    print("Starting CliniCase AI FastAPI Backend...")
    print("Local API: http://127.0.0.1:8000")
    print("Swagger Docs: http://127.0.0.1:8000/docs")
    print("==================================================")
    uvicorn.run(app, host="127.0.0.1", port=8000)
except ImportError:
    print("uvicorn/fastapi not found. Installing requirements...")
    os.system(f"{sys.executable} -m pip install fastapi uvicorn pydantic python-multipart")
    import uvicorn
    from main import app
    uvicorn.run(app, host="127.0.0.1", port=8000)

