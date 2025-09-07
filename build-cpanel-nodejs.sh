#!/bin/bash

# ========================================
# PHX CTF - cPanel Node.js Build Script
# ========================================

echo ""
echo "🚀 PHX CTF - Building for cPanel Node.js"
echo "========================================"
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
echo "📁 Creating cPanel Node.js deployment package..."
if [ -d "cpanel-nodejs-deploy" ]; then
    rm -rf "cpanel-nodejs-deploy"
fi
mkdir "cpanel-nodejs-deploy"

echo "Copying files to cPanel package..."
cp -r .next cpanel-nodejs-deploy/
cp -r public cpanel-nodejs-deploy/
cp -r prisma cpanel-nodejs-deploy/
cp -r node_modules cpanel-nodejs-deploy/
cp package.json cpanel-nodejs-deploy/
cp next.config.js cpanel-nodejs-deploy/
cp server.js cpanel-nodejs-deploy/
cp .env.example cpanel-nodejs-deploy/.env

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Files ready for cPanel Node.js upload:"
echo "   - cpanel-nodejs-deploy/ folder contains all files"
echo "   - Upload contents to public_html/ on cPanel"
echo ""
echo "📋 Next steps:"
echo "   1. Login to cPanel"
echo "   2. Go to File Manager"
echo "   3. Navigate to public_html"
echo "   4. Upload all files from cpanel-nodejs-deploy/ folder"
echo "   5. Go to Node.js Selector"
echo "   6. Create Node.js App (App Root: public_html)"
echo "   7. Set Startup File: server.js"
echo "   8. Create MySQL database"
echo "   9. Update environment variables"
echo "   10. Start application"
echo ""
echo "🔧 Environment variables needed:"
echo "   DATABASE_URL=mysql://username:password@localhost:3306/database_name"
echo "   NEXTAUTH_URL=https://yourdomain.com"
echo "   NEXTAUTH_SECRET=your-secret-key"
echo "   NODE_ENV=production"
echo ""
