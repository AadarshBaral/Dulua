@echo off
cd dulua-backend
call dulua-env\Scripts\activate.bat
fastapi dev app/main.py
