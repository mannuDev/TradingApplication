# PowerShell script to kill process on port 5000
Write-Host "Finding process on port 5000..." -ForegroundColor Yellow

$port = 5000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Found process ID: $process" -ForegroundColor Red
    $processInfo = Get-Process -Id $process -ErrorAction SilentlyContinue
    if ($processInfo) {
        Write-Host "Process Name: $($processInfo.ProcessName)" -ForegroundColor Cyan
        Write-Host "Killing process..." -ForegroundColor Yellow
        Stop-Process -Id $process -Force
        Write-Host "✅ Process killed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Process not found" -ForegroundColor Red
    }
} else {
    Write-Host "No process found on port $port" -ForegroundColor Green
}

