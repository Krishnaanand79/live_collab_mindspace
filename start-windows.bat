@echo off
title LiveCollab Runner
echo ======================================================
echo    Starting LiveCollab (Backend + Frontend)
echo ======================================================
echo.

cd /d "%~dp0"
call npm run dev
pause
