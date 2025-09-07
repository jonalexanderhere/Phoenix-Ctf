@echo off
REM ========================================
REM PHX CTF - cPanel Build Script
REM ========================================

echo.
echo 🚀 PHX CTF - Building for cPanel
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
echo 📁 Creating cPanel deployment package...
if exist "cpanel-deploy" rmdir /s /q "cpanel-deploy"
mkdir "cpanel-deploy"

echo Copying files to cPanel package...
xcopy "out\*" "cpanel-deploy\" /E /I /Y
xcopy "public\.htaccess" "cpanel-deploy\" /Y

echo.
echo ✅ Build completed successfully!
echo.
echo 📁 Files ready for cPanel upload:
echo    - cpanel-deploy\ folder contains all files
echo    - Upload contents to public_html\ on cPanel
echo.
echo 📋 Next steps:
echo    1. Login to cPanel
echo    2. Go to File Manager
echo    3. Navigate to public_html
echo    4. Upload all files from cpanel-deploy\ folder
echo    5. Set permissions (755 for folders, 644 for files)
echo.
pause
