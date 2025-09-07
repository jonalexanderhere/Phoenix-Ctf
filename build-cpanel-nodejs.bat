@echo off
REM ========================================
REM PHX CTF - cPanel Node.js Build Script
REM ========================================

echo.
echo 🚀 PHX CTF - Building for cPanel Node.js
echo ========================================
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
echo 📁 Creating cPanel Node.js deployment package...
if exist "cpanel-nodejs-deploy" rmdir /s /q "cpanel-nodejs-deploy"
mkdir "cpanel-nodejs-deploy"

echo Copying files to cPanel package...
xcopy ".next" "cpanel-nodejs-deploy\.next\" /E /I /Y
xcopy "public" "cpanel-nodejs-deploy\public\" /E /I /Y
xcopy "prisma" "cpanel-nodejs-deploy\prisma\" /E /I /Y
xcopy "node_modules" "cpanel-nodejs-deploy\node_modules\" /E /I /Y
copy "package.json" "cpanel-nodejs-deploy\"
copy "next.config.js" "cpanel-nodejs-deploy\"
copy "server.js" "cpanel-nodejs-deploy\"
copy ".env.example" "cpanel-nodejs-deploy\.env"

echo.
echo ✅ Build completed successfully!
echo.
echo 📁 Files ready for cPanel Node.js upload:
echo    - cpanel-nodejs-deploy\ folder contains all files
echo    - Upload contents to public_html\ on cPanel
echo.
echo 📋 Next steps:
echo    1. Login to cPanel
echo    2. Go to File Manager
echo    3. Navigate to public_html
echo    4. Upload all files from cpanel-nodejs-deploy\ folder
echo    5. Go to Node.js Selector
echo    6. Create Node.js App (App Root: public_html)
echo    7. Set Startup File: server.js
echo    8. Create MySQL database
echo    9. Update environment variables
echo    10. Start application
echo.
echo 🔧 Environment variables needed:
echo    DATABASE_URL=mysql://username:password@localhost:3306/database_name
echo    NEXTAUTH_URL=https://yourdomain.com
echo    NEXTAUTH_SECRET=your-secret-key
echo    NODE_ENV=production
echo.
pause
