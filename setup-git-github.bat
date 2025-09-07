@echo off
REM ========================================
REM PHX CTF - Git & GitHub Setup Script
REM ========================================

echo.
echo 🚀 PHX CTF - Setting up Git & GitHub
echo ====================================
echo.

echo 📝 Creating README.md...
echo # Phoenix-Ctf > README.md
echo. >> README.md
echo A modern CTF (Capture The Flag) platform built with Next.js, featuring challenges, leaderboards, and user authentication. >> README.md
echo. >> README.md
echo ## Features >> README.md
echo - 🏆 Challenge Management System >> README.md
echo - 👥 User Authentication & Profiles >> README.md
echo - 🏅 Leaderboard & Badges >> README.md
echo - 📊 Admin Dashboard >> README.md
echo - 🎯 Web-based Challenges >> README.md
echo. >> README.md
echo ## Tech Stack >> README.md
echo - Next.js 14 with App Router >> README.md
echo - TypeScript >> README.md
echo - Prisma ORM >> README.md
echo - NextAuth.js >> README.md
echo - Tailwind CSS >> README.md
echo - Vercel Deployment >> README.md
echo. >> README.md
echo ## Getting Started >> README.md
echo. >> README.md
echo 1. Clone the repository >> README.md
echo 2. Install dependencies: `npm install` >> README.md
echo 3. Setup environment variables >> README.md
echo 4. Run database migrations: `npx prisma db push` >> README.md
echo 5. Start development server: `npm run dev` >> README.md
echo. >> README.md
echo ## Deployment >> README.md
echo. >> README.md
echo Deploy to Vercel with one click: >> README.md
echo. >> README.md
echo [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jonalexanderhere/Phoenix-Ctf) >> README.md

echo ✅ README.md created successfully!

echo.
echo 🔧 Initializing Git repository...
git init
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)

echo.
echo 📁 Adding files to Git...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to add files to Git
    pause
    exit /b 1
)

echo.
echo 💾 Committing changes...
git commit -m "Initial commit - PHX CTF platform with Next.js, Prisma, and Vercel deployment"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to commit changes
    pause
    exit /b 1
)

echo.
echo 🌿 Setting main branch...
git branch -M main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to set main branch
    pause
    exit /b 1
)

echo.
echo 🔗 Adding remote origin...
git remote add origin https://github.com/jonalexanderhere/Phoenix-Ctf.git
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to add remote origin
    pause
    exit /b 1
)

echo.
echo 🚀 Pushing to GitHub...
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to push to GitHub
    echo.
    echo 🔧 Manual steps required:
    echo    1. Create repository on GitHub: https://github.com/jonalexanderhere/Phoenix-Ctf
    echo    2. Run: git push -u origin main
    pause
    exit /b 1
)

echo.
echo ✅ Git & GitHub setup completed successfully!
echo.
echo 📋 Next steps:
echo    1. Go to https://vercel.com
echo    2. Import project from GitHub
echo    3. Set environment variables
echo    4. Deploy to Vercel
echo.
echo 🔧 Required environment variables for Vercel:
echo    DATABASE_URL=your_database_connection_string
echo    NEXTAUTH_URL=https://your-app.vercel.app
echo    NEXTAUTH_SECRET=your_secret_key
echo    NODE_ENV=production
echo.
pause
