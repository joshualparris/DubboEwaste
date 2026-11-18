@echo off
setlocal
cd /d "%~dp0"
where powershell.exe >nul 2>&1
if errorlevel 1 (
  echo Windows PowerShell 5.1 is required.
  pause
  exit /b 1
)
powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File "%~dp0iPadLegacyAssistant.ps1"
if errorlevel 1 (
  echo.
  echo The app could not start. Check the error displayed above.
  pause
)
