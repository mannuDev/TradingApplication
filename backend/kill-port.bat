@echo off
echo Finding process on port 5000...
netstat -ano | findstr :5000
echo.
echo To kill the process, run:
echo taskkill /PID <PID_NUMBER> /F
echo.
echo Or use the PowerShell script: kill-port.ps1
pause

