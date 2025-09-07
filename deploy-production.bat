@echo off
echo 🚀 PHX CTF Platform - Production Deployment Script
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available. Please check your Node.js installation.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Generate Prisma client
echo.
echo 🗄️ Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

REM Run type check
echo.
echo 🔍 Running TypeScript type check...
call npm run type-check
if %errorlevel% neq 0 (
    echo ❌ TypeScript type check failed
    pause
    exit /b 1
)

REM Build the application
echo.
echo 🔨 Building application for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo 🌐 Your PHX CTF Platform is ready for deployment!
echo.
echo 📋 Next steps:
echo 1. Choose your deployment platform (Netlify, Vercel, Railway)
echo 2. Set up environment variables
echo 3. Deploy your application
echo.
echo 📖 See PRODUCTION-READY.md for detailed deployment instructions
echo.
pause