@echo off
title NAKSHA 2.0 3D Desktop Application Suite (v2.0.0)
cd /d "%~dp0"
echo ===================================================================
echo   NAKSHA 2.0 3D Desktop Workstation - SIH Innovation Prototype
echo   Starting Standalone Desktop Application Window...
echo ===================================================================
if exist "public\downloads\Naksha 2.0.exe" (
    start "" "public\downloads\Naksha 2.0.exe"
    exit
)
if exist "dist-desktop\Naksha 2.0.exe" (
    start "" "dist-desktop\Naksha 2.0.exe"
    exit
)
if exist "Naksha 2.0.exe" (
    start "" "Naksha 2.0.exe"
    exit
)
if exist "node_modules\electron\dist\electron.exe" (
    start "" "node_modules\electron\dist\electron.exe" "electron\main.cjs"
) else (
    start "" npx electron electron/main.cjs
)
exit
