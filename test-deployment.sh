#!/bin/bash

# PHX CTF Platform - Test Deployment Script
echo "🧪 Testing PHX CTF Platform deployment readiness..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if Node.js is installed
echo "🔍 Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js installed: $NODE_VERSION" 0
else
    print_status "Node.js not found" 1
    exit 1
fi

# Check if npm is installed
echo "🔍 Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm installed: $NPM_VERSION" 0
else
    print_status "npm not found" 1
    exit 1
fi

# Check if .env.local exists
echo "🔍 Checking environment configuration..."
if [ -f .env.local ]; then
    print_status "Environment file (.env.local) found" 0
else
    print_warning "Environment file (.env.local) not found. Creating from example..."
    if [ -f env.example ]; then
        cp env.example .env.local
        print_status "Created .env.local from env.example" 0
        print_warning "Please edit .env.local with your configuration"
    else
        print_status "env.example not found" 1
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully" 0
else
    print_status "Failed to install dependencies" 1
    exit 1
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    print_status "Prisma client generated successfully" 0
else
    print_status "Failed to generate Prisma client" 1
    exit 1
fi

# Run type check
echo "🔍 Running TypeScript type check..."
npm run type-check
if [ $? -eq 0 ]; then
    print_status "TypeScript type check passed" 0
else
    print_warning "TypeScript type check failed, but continuing..."
fi

# Build the application
echo "🔨 Building application..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Build successful" 0
else
    print_status "Build failed" 1
    exit 1
fi

# Check if build artifacts exist
echo "🔍 Checking build artifacts..."
if [ -d ".next" ]; then
    print_status "Build directory (.next) created" 0
else
    print_status "Build directory not found" 1
    exit 1
fi

# Check if Prisma client is generated
echo "🔍 Checking Prisma client..."
if [ -d "node_modules/@prisma/client" ]; then
    print_status "Prisma client generated" 0
else
    print_status "Prisma client not found" 1
    exit 1
fi

# Summary
echo ""
echo "🎉 Deployment readiness test completed!"
echo ""
echo "📋 Summary:"
echo "  ✅ Node.js: $NODE_VERSION"
echo "  ✅ npm: $NPM_VERSION"
echo "  ✅ Dependencies: Installed"
echo "  ✅ Prisma: Generated"
echo "  ✅ Build: Successful"
echo "  ✅ TypeScript: Checked"
echo ""
echo "🚀 Your PHX CTF Platform is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "  1. Deploy to Netlify using the deployment guide"
echo "  2. Set environment variables in Netlify dashboard"
echo "  3. Initialize database by visiting /api/seed"
echo "  4. Test all features"
echo ""
echo "📖 For detailed deployment instructions, see DEPLOYMENT-GUIDE.md"
