@echo off
REM ========================================
REM PHX CTF - Vercel Deployment Script
REM ========================================

echo.
echo 🚀 PHX CTF - Deploying to Vercel
echo ================================
echo.

echo 📦 Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🔧 Generating Prisma client...
npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo 🏗️ Building Next.js application...
npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo 🔍 Checking Vercel CLI...
vercel --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 📥 Installing Vercel CLI...
    npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Vercel CLI
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Deploying to Vercel...
vercel --prod
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed successfully!
echo.
echo 📋 Next steps:
echo    1. Set environment variables in Vercel dashboard
echo    2. Configure database connection
echo    3. Test all features
echo.
echo 🔧 Required environment variables:
echo    DATABASE_URL=your_database_url
echo    NEXTAUTH_URL=https://your-app.vercel.app
echo    NEXTAUTH_SECRET=your_secret_key
echo    NODE_ENV=production
echo.
pause
