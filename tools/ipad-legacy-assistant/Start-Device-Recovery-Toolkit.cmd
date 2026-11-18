@echo off
setlocal
cd /d "%~dp0"
where powershell.exe >nul 2>&1
if errorlevel 1 (
  echo Windows PowerShell 5.1 is required.
  pause
  exit /b 1
)
if not exist "%~dp0DeviceRecovery.Core.psm1" (
  echo Missing DeviceRecovery.Core.psm1 - extract the complete ZIP.
  pause
  exit /b 2
)
powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File "%~dp0DeviceRecoveryToolkit.ps1"
if errorlevel 1 (
  echo.
  echo The recovery toolkit could not start. Review the message above.
  pause
)
