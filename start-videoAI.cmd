@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"
set "CODEX_AUTO_SKILLS=1"
set "CODEX_GLOBAL_AGENTS=C:\dev\AGENTS.md"
set "CODEX_PROJECT_ROOT=%cd%"
set "CODEX_PROJECT_AGENTS=%cd%\AGENTS.md"
set "CODEX_AI_ROUTING_DOC=%cd%\docs\AI_ROUTING.md"
set "CODEX_PRIMARY_SKILL=master-fullstack"
set "CODEX_RECOMMENDED_SEQUENCE=brand-system,dashboard-director,app-shell-architect,design-system-builder,master-fullstack,design-critic"
set "CODEX_ROUTE_REASON=marketing-dashboard-auth-billing-provider-stack"
set "PORT=5000"
set "HOST=127.0.0.1"
set "APP_URL=http://%HOST%:%PORT%"
set "NEXT_PUBLIC_APP_URL=%APP_URL%"
set "PORT_PID="
set "PORT_PROCESS="

for /f "usebackq delims=" %%P in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess)"`) do (
  set "PORT_PID=%%P"
)

if defined PORT_PID (
  for /f "usebackq delims=" %%N in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-Process -Id %PORT_PID% -ErrorAction SilentlyContinue | Select-Object -ExpandProperty ProcessName)"`) do (
    set "PORT_PROCESS=%%N"
  )

  if /I "!PORT_PROCESS!"=="node" (
    echo Port %PORT% is in use by a previous Node.js process ^(PID !PORT_PID!^). Restarting it...
    taskkill /PID !PORT_PID! /T /F >nul 2>&1
    timeout /t 1 /nobreak >nul
  ) else (
    echo Port %PORT% is already in use by process "!PORT_PROCESS!" ^(PID !PORT_PID!^).
    echo Free that port or change the launcher configuration before starting VideoForge AI.
    exit /b 1
  )
)

start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; for ($i = 0; $i -lt 120; $i++) { try { Invoke-WebRequest -Uri '%APP_URL%' -UseBasicParsing -TimeoutSec 2 | Out-Null; Start-Process '%APP_URL%'; exit 0 } catch { Start-Sleep -Milliseconds 500 } }"

echo AI Stack: %CODEX_RECOMMENDED_SEQUENCE%
echo Starting VideoForge AI on %APP_URL%
call npm run dev -- --hostname %HOST% --port %PORT%
