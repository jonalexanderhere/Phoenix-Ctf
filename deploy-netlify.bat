@echo off
REM ========================================
REM PHX CTF - Netlify Deployment Script
REM ========================================

echo.
echo 🚀 PHX CTF - Netlify Deployment
echo ================================
echo.

REM Check if Netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Netlify CLI not found. Installing...
    npm install -g netlify-cli
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Netlify CLI
        pause
        exit /b 1
    )
)

REM Check if user is logged in
netlify status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 🔐 Please login to Netlify first...
    netlify login
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Login failed
        pause
        exit /b 1
    )
)

echo.
echo 📋 Available Deployment Options:
echo ================================
echo 1. Deploy to current site (preview)
echo 2. Deploy to production
echo 3. Deploy to production and open
echo 4. Deploy without build
echo 5. Deploy with custom message
echo 6. Deploy with environment variables
echo 7. Create new site and deploy
echo 8. Deploy with custom site ID
echo 9. Deploy with trigger
echo 0. Exit
echo.

set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto deploy_preview
if "%choice%"=="2" goto deploy_prod
if "%choice%"=="3" goto deploy_prod_open
if "%choice%"=="4" goto deploy_no_build
if "%choice%"=="5" goto deploy_message
if "%choice%"=="6" goto deploy_env
if "%choice%"=="7" goto deploy_create_site
if "%choice%"=="8" goto deploy_custom_site
if "%choice%"=="9" goto deploy_trigger
if "%choice%"=="0" goto end
goto invalid_choice

:deploy_preview
echo.
echo 🚀 Deploying to preview...
netlify deploy
goto end

:deploy_prod
echo.
echo 🚀 Deploying to production...
netlify deploy --prod
goto end

:deploy_prod_open
echo.
echo 🚀 Deploying to production and opening...
netlify deploy --prod --open
goto end

:deploy_no_build
echo.
echo 🚀 Deploying without build...
netlify deploy --no-build
goto end

:deploy_message
echo.
set /p message="Enter deployment message: "
echo 🚀 Deploying with message: %message%
netlify deploy --message "%message%"
goto end

:deploy_env
echo.
echo 🚀 Deploying with environment variables...
set /p auth_token="Enter Netlify Auth Token (optional): "
if "%auth_token%"=="" (
    netlify deploy --prod
) else (
    netlify deploy --prod --auth %auth_token%
)
goto end

:deploy_create_site
echo.
echo 🚀 Creating new site and deploying...
set /p site_name="Enter site name: "
set /p team_name="Enter team name (optional): "
if "%team_name%"=="" (
    netlify deploy --create-site %site_name%
) else (
    netlify deploy --create-site %site_name% --team %team_name%
)
goto end

:deploy_custom_site
echo.
set /p site_id="Enter site ID: "
echo 🚀 Deploying to site: %site_id%
netlify deploy --site %site_id%
goto end

:deploy_trigger
echo.
echo 🚀 Deploying with trigger...
netlify deploy --trigger
goto end

:invalid_choice
echo.
echo ❌ Invalid choice. Please try again.
pause
goto start

:end
echo.
echo ✅ Deployment completed!
echo.
pause
