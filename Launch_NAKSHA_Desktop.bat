@echo off
title NAKSHA 2.0 3D Desktop Application Suite (v2.4.0)
cd /d "%~dp0"
echo ===================================================================
echo   NAKSHA 2.0 3D Desktop Workstation - Ministry of Rural Development
echo   Starting Standalone Desktop Application Window (Native Window)...
echo ===================================================================
if exist "node_modules\electron\dist\electron.exe" (
    start "" "node_modules\electron\dist\electron.exe" "electron\main.cjs"
) else (
    start "" npx electron electron/main.cjs
)
exit
