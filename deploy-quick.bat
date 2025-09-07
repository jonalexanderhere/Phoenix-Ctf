@echo off
REM ========================================
REM PHX CTF - Quick Netlify Deployment
REM ========================================

echo.
echo 🚀 PHX CTF - Quick Deployment
echo =============================
echo.

REM Check if Netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Netlify CLI not found. Installing...
    npm install -g netlify-cli
)

REM Check if user is logged in
netlify status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 🔐 Please login to Netlify first...
    netlify login
)

echo.
echo 📋 Quick Deployment Options:
echo ============================
echo 1. Deploy Preview (netlify deploy)
echo 2. Deploy Production (netlify deploy --prod)
echo 3. Deploy Production + Open (netlify deploy --prod --open)
echo 4. Deploy No Build (netlify deploy --no-build)
echo 5. Deploy with Message (netlify deploy --message "message")
echo 6. Deploy to Specific Site (netlify deploy --site site-id)
echo 7. Create New Site (netlify deploy --create-site site-name)
echo 8. Deploy with Trigger (netlify deploy --trigger)
echo 9. Deploy Production If Unlocked (netlify deploy --prod-if-unlocked)
echo 0. Exit
echo.

set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" (
    echo 🚀 Deploying to preview...
    netlify deploy
) else if "%choice%"=="2" (
    echo 🚀 Deploying to production...
    netlify deploy --prod
) else if "%choice%"=="3" (
    echo 🚀 Deploying to production and opening...
    netlify deploy --prod --open
) else if "%choice%"=="4" (
    echo 🚀 Deploying without build...
    netlify deploy --no-build
) else if "%choice%"=="5" (
    set /p message="Enter deployment message: "
    echo 🚀 Deploying with message: %message%
    netlify deploy --message "%message%"
) else if "%choice%"=="6" (
    set /p site_id="Enter site ID: "
    echo 🚀 Deploying to site: %site_id%
    netlify deploy --site %site_id%
) else if "%choice%"=="7" (
    set /p site_name="Enter site name: "
    echo 🚀 Creating new site and deploying: %site_name%
    netlify deploy --create-site %site_name%
) else if "%choice%"=="8" (
    echo 🚀 Deploying with trigger...
    netlify deploy --trigger
) else if "%choice%"=="9" (
    echo 🚀 Deploying to production if unlocked...
    netlify deploy --prod-if-unlocked
) else if "%choice%"=="0" (
    echo 👋 Goodbye!
    exit /b 0
) else (
    echo ❌ Invalid choice. Please try again.
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed!
echo.
pause
