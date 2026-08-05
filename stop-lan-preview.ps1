param(
    [ValidateRange(1024, 65535)]
    [int]$Port = 4178
)

$ErrorActionPreference = 'Stop'
$pidFile = Join-Path $env:TEMP ".lan-preview-$Port.pid"

if (-not (Test-Path -LiteralPath $pidFile)) {
    Write-Host "No LAN preview is running on port $Port."
    exit 0
}

$serverPid = [int](Get-Content -LiteralPath $pidFile -Raw)
$processInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $serverPid" -ErrorAction SilentlyContinue

if ($null -eq $processInfo) {
    Remove-Item -LiteralPath $pidFile -Force
    Write-Host 'Removed a stale LAN preview state file.'
    exit 0
}

if ($processInfo.CommandLine -notlike '*lan_server.py*' -or $processInfo.CommandLine -notmatch "--port\s+$Port") {
    throw "PID $serverPid is not the expected portfolio server. Nothing was stopped."
}

Stop-Process -Id $serverPid
Remove-Item -LiteralPath $pidFile -Force
Write-Host "LAN preview stopped on port $Port." -ForegroundColor Green
