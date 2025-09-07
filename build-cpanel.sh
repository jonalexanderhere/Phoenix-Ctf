#!/bin/bash

# ========================================
# PHX CTF - cPanel Build Script
# ========================================

echo ""
echo "🚀 PHX CTF - Building for cPanel"
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
echo "📁 Creating cPanel deployment package..."
if [ -d "cpanel-deploy" ]; then
    rm -rf "cpanel-deploy"
fi
mkdir "cpanel-deploy"

echo "Copying files to cPanel package..."
cp -r out/* cpanel-deploy/
cp public/.htaccess cpanel-deploy/

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Files ready for cPanel upload:"
echo "   - cpanel-deploy/ folder contains all files"
echo "   - Upload contents to public_html/ on cPanel"
echo ""
echo "📋 Next steps:"
echo "   1. Login to cPanel"
echo "   2. Go to File Manager"
echo "   3. Navigate to public_html"
echo "   4. Upload all files from cpanel-deploy/ folder"
echo "   5. Set permissions (755 for folders, 644 for files)"
echo ""
