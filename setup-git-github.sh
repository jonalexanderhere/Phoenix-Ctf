#!/bin/bash

# ========================================
# PHX CTF - Git & GitHub Setup Script
# ========================================

echo ""
echo "🚀 PHX CTF - Setting up Git & GitHub"
echo "===================================="
echo ""

echo "📝 Creating README.md..."
cat > README.md << 'EOF'
# Phoenix-Ctf

A modern CTF (Capture The Flag) platform built with Next.js, featuring challenges, leaderboards, and user authentication.

## Features
- 🏆 Challenge Management System
- 👥 User Authentication & Profiles
- 🏅 Leaderboard & Badges
- 📊 Admin Dashboard
- 🎯 Web-based Challenges

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Prisma ORM
- NextAuth.js
- Tailwind CSS
- Vercel Deployment

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup environment variables
4. Run database migrations: `npx prisma db push`
5. Start development server: `npm run dev`

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jonalexanderhere/Phoenix-Ctf)
EOF

echo "✅ README.md created successfully!"

echo ""
echo "🔧 Initializing Git repository..."
git init
if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize Git repository"
    exit 1
fi

echo ""
echo "📁 Adding files to Git..."
git add .
if [ $? -ne 0 ]; then
    echo "❌ Failed to add files to Git"
    exit 1
fi

echo ""
echo "💾 Committing changes..."
git commit -m "Initial commit - PHX CTF platform with Next.js, Prisma, and Vercel deployment"
if [ $? -ne 0 ]; then
    echo "❌ Failed to commit changes"
    exit 1
fi

echo ""
echo "🌿 Setting main branch..."
git branch -M main
if [ $? -ne 0 ]; then
    echo "❌ Failed to set main branch"
    exit 1
fi

echo ""
echo "🔗 Adding remote origin..."
git remote add origin https://github.com/jonalexanderhere/Phoenix-Ctf.git
if [ $? -ne 0 ]; then
    echo "❌ Failed to add remote origin"
    exit 1
fi

echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main
if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub"
    echo ""
    echo "🔧 Manual steps required:"
    echo "   1. Create repository on GitHub: https://github.com/jonalexanderhere/Phoenix-Ctf"
    echo "   2. Run: git push -u origin main"
    exit 1
fi

echo ""
echo "✅ Git & GitHub setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Go to https://vercel.com"
echo "   2. Import project from GitHub"
echo "   3. Set environment variables"
echo "   4. Deploy to Vercel"
echo ""
echo "🔧 Required environment variables for Vercel:"
echo "   DATABASE_URL=your_database_connection_string"
echo "   NEXTAUTH_URL=https://your-app.vercel.app"
echo "   NEXTAUTH_SECRET=your_secret_key"
echo "   NODE_ENV=production"
echo ""
