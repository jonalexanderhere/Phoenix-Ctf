#!/bin/bash

# ========================================
# PHX CTF - Vercel Deployment Script
# ========================================

echo ""
echo "🚀 PHX CTF - Deploying to Vercel"
echo "================================"
echo ""

echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo ""
echo "🏗️ Building Next.js application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🔍 Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI"
        exit 1
    fi
fi

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Configure database connection"
echo "   3. Test all features"
echo ""
echo "🔧 Required environment variables:"
echo "   DATABASE_URL=your_database_url"
echo "   NEXTAUTH_URL=https://your-app.vercel.app"
echo "   NEXTAUTH_SECRET=your_secret_key"
echo "   NODE_ENV=production"
echo ""
