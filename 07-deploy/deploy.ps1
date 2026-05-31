# Materia ERP Native Windows Deployment Script
# Usage: .\deploy.ps1 [-Action build|start|stop|restart|status]

param(
    [ValidateSet("build","start","stop","restart","status")]
    [string]$Action = "start"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackendDir = Join-Path $ProjectRoot "04-backend"
$FrontendDir = Join-Path $ProjectRoot "05-frontend"
$BackendPort = 3000
$FrontendPort = 8080

function Write-Step { param($Msg) Write-Host "`n>>> $Msg" -ForegroundColor Cyan }

function Check-PostgreSQL {
    $svc = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if (-not $svc) { throw "PostgreSQL service not found. Install PostgreSQL 15+ first." }
    if ($svc.Status -ne "Running") { Start-Service $svc.Name }
    Write-Host "  PostgreSQL: $($svc.Name) is $($svc.Status)" -ForegroundColor Green
}

function Test-Port { param($Port)
    $listener = netstat -ano | Select-String ":$Port.*LISTEN"
    return $listener -ne $null
}

function Invoke-Build {
    Write-Step "Building backend..."
    Push-Location $BackendDir
    npm install --silent
    npx prisma generate
    npm run build
    Pop-Location

    Write-Step "Building frontend..."
    Push-Location $FrontendDir
    npm install --silent
    npx umi build
    Pop-Location

    Write-Host "Build complete." -ForegroundColor Green
}

function Invoke-Start {
    Check-PostgreSQL

    Write-Step "Starting backend (port $BackendPort)..."
    if (Test-Port $BackendPort) {
        Write-Host "  Backend port $BackendPort already in use, skipping." -ForegroundColor Yellow
    } else {
        $backendJob = Start-Job -Name "materia-backend" -ScriptBlock {
            param($dir)
            Set-Location $dir
            node dist/main
        } -ArgumentList $BackendDir
        Write-Host "  Backend started (job $($backendJob.Id))" -ForegroundColor Green
    }

    Start-Sleep -Seconds 3

    Write-Step "Starting frontend (port $FrontendPort)..."
    if (Test-Port $FrontendPort) {
        Write-Host "  Frontend port $FrontendPort already in use, skipping." -ForegroundColor Yellow
    } else {
        $frontendJob = Start-Job -Name "materia-frontend" -ScriptBlock {
            param($dir, $port)
            Set-Location $dir
            npx serve dist -l $port --single
        } -ArgumentList $FrontendDir, $FrontendPort
        Write-Host "  Frontend started (job $($frontendJob.Id))" -ForegroundColor Green
    }

    Write-Host "`n=== Materia ERP Running ===" -ForegroundColor Green
    Write-Host "  Frontend: http://localhost:$FrontendPort" -ForegroundColor White
    Write-Host "  Backend:  http://localhost:$BackendPort" -ForegroundColor White
    Write-Host "  Database: localhost:5432" -ForegroundColor White
}

function Invoke-Stop {
    Write-Step "Stopping services..."
    Get-Job -Name "materia-*" -ErrorAction SilentlyContinue | Stop-Job -PassThru | Remove-Job
    Write-Host "All services stopped." -ForegroundColor Green
}

function Invoke-Status {
    Write-Host "=== Materia ERP Status ===" -ForegroundColor Cyan
    $jobs = Get-Job -Name "materia-*" -ErrorAction SilentlyContinue
    if ($jobs) {
        $jobs | Format-Table Id, Name, State
    } else {
        Write-Host "No running jobs." -ForegroundColor Yellow
    }

    Write-Host "`nPort Status:"
    @($BackendPort, $FrontendPort) | ForEach-Object {
        $status = if (Test-Port $_) { "LISTENING" } else { "CLOSED" }
        $color = if ($status -eq "LISTENING") { "Green" } else { "Red" }
        Write-Host "  Port $_ : $status" -ForegroundColor $color
    }
}

switch ($Action) {
    "build"   { Invoke-Build }
    "start"   { Invoke-Start }
    "stop"    { Invoke-Stop }
    "restart" { Invoke-Stop; Start-Sleep 2; Invoke-Start }
    "status"  { Invoke-Status }
}
