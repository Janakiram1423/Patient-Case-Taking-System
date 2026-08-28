@echo off
title CliniCase AI Backend Server
echo ====================================================
echo Starting CliniCase AI Backend API on Port 8000...
echo ====================================================
py -m pip install -r requirements.txt
py run.py
pause
