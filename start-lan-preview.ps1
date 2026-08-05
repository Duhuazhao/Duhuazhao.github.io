param(
    [ValidateRange(1024, 65535)]
    [int]$Port = 4178
)

$ErrorActionPreference = 'Stop'
$projectDir = $PSScriptRoot
$pidFile = Join-Path $env:TEMP ".lan-preview-$Port.pid"
$stdoutLog = Join-Path $env:TEMP "personal-page-lan-$Port.out.log"
$stderrLog = Join-Path $env:TEMP "personal-page-lan-$Port.err.log"

function Get-ServerCommandLine([int]$ProcessId) {
    $processInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
    if ($null -eq $processInfo) { return $null }
    return $processInfo.CommandLine
}

function Get-LanAddress {
    $privateAliases = @(
        Get-NetConnectionProfile -ErrorAction SilentlyContinue |
            Where-Object { $_.NetworkCategory -eq 'Private' } |
            Select-Object -ExpandProperty InterfaceAlias
    )
    $addresses = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object {
            $_.IPAddress -notlike '127.*' -and
            $_.AddressState -eq 'Preferred' -and
            ($privateAliases.Count -eq 0 -or $_.InterfaceAlias -in $privateAliases)
        }
    return $addresses | Select-Object -First 1 -ExpandProperty IPAddress
}

if (Test-Path -LiteralPath $pidFile) {
    $existingPid = [int](Get-Content -LiteralPath $pidFile -Raw)
    $existingCommand = Get-ServerCommandLine -ProcessId $existingPid
    if ($existingCommand -and $existingCommand -match 'lan_server\.py' -and $existingCommand -match "--port\s+$Port") {
        $existingIp = Get-LanAddress
        Write-Host "LAN preview is already running: http://${existingIp}:$Port/"
        exit 0
    }
    Remove-Item -LiteralPath $pidFile -Force
}

$bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
if (Test-Path -LiteralPath $bundledPython) {
    $pythonExe = $bundledPython
} else {
    $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
    if ($null -eq $pythonCommand) {
        throw 'Python was not found. Install Python 3 or run this task again in Codex.'
    }
    $pythonExe = $pythonCommand.Source
}

$serverScript = Join-Path $projectDir 'lan_server.py'
$indexFile = Join-Path $projectDir 'index.html'
$serverArgs = "`"$serverScript`" --host 0.0.0.0 --port $Port --index `"$indexFile`""

$server = Start-Process `
    -FilePath $pythonExe `
    -ArgumentList $serverArgs `
    -WorkingDirectory $projectDir `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog `
    -PassThru

$server.Id | Set-Content -LiteralPath $pidFile -Encoding ascii

$ready = $false
for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
    try {
        $health = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/health" -TimeoutSec 1
        if ($health.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {
        Start-Sleep -Milliseconds 100
    }
}

if (-not $ready) {
    Stop-Process -Id $server.Id -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
    $errorText = if (Test-Path -LiteralPath $stderrLog) { Get-Content -LiteralPath $stderrLog -Raw } else { '' }
    throw "LAN preview failed to start. $errorText"
}

$lanIp = Get-LanAddress
if (-not $lanIp) {
    throw 'The server started, but no usable LAN IPv4 address was found.'
}

Write-Host "LAN preview started." -ForegroundColor Green
Write-Host "Local URL: http://127.0.0.1:$Port/"
Write-Host "LAN URL: http://${lanIp}:$Port/" -ForegroundColor Cyan
Write-Host "Stop command: powershell -ExecutionPolicy Bypass -File `"$projectDir\stop-lan-preview.ps1`" -Port $Port"
