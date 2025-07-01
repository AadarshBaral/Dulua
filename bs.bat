@echo off
cd dulua-backend
call venv\Scripts\activate.bat
fastapi dev app/main.py
