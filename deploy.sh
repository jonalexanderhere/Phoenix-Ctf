#!/bin/bash

# PHX CTF Platform - Netlify Deployment Script
echo "🚀 Starting PHX CTF Platform deployment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found. Creating from example..."
    cp env.example .env.local
    echo "📝 Please edit .env.local with your configuration before deploying."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Ready for deployment to Netlify"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your repository to Netlify"
    echo "3. Set environment variables in Netlify dashboard:"
    echo "   - NEXTAUTH_URL=https://your-site.netlify.app"
    echo "   - NEXTAUTH_SECRET=your-secret-key"
    echo "   - DATABASE_URL=file:./dev.db"
    echo "4. Deploy!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
