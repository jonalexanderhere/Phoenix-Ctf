#!/bin/bash

# Production Deployment Script for PHX CTF
echo "🚀 Starting PHX CTF Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache
print_success "Cleanup completed"

# Step 2: Install dependencies
print_status "Installing dependencies..."
npm ci --production=false
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed"

# Step 3: Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    print_error "Failed to generate Prisma client"
    exit 1
fi
print_success "Prisma client generated"

# Step 4: Run database tests
print_status "Running database tests..."
node scripts/test-all-features.js
if [ $? -ne 0 ]; then
    print_error "Database tests failed"
    exit 1
fi
print_success "Database tests passed"

# Step 5: Build the application
print_status "Building application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
print_success "Build completed successfully"

# Step 6: Run linting
print_status "Running linting..."
npm run lint
if [ $? -ne 0 ]; then
    print_warning "Linting issues found, but continuing..."
else
    print_success "Linting passed"
fi

# Step 7: Check build size
print_status "Checking build size..."
BUILD_SIZE=$(du -sh .next | cut -f1)
print_success "Build size: $BUILD_SIZE"

# Step 8: Create deployment package
print_status "Creating deployment package..."
tar -czf phx-ctf-deployment.tar.gz \
    .next \
    public \
    prisma \
    package.json \
    package-lock.json \
    next.config.js \
    netlify.toml \
    middleware.ts \
    .env.example \
    README.md

print_success "Deployment package created: phx-ctf-deployment.tar.gz"

# Step 9: Display deployment information
echo ""
print_success "🎉 Deployment preparation completed!"
echo ""
echo "📦 Deployment Package: phx-ctf-deployment.tar.gz"
echo "📊 Build Size: $BUILD_SIZE"
echo "🔧 Environment: Production"
echo ""
echo "📋 Next Steps:"
echo "1. Upload phx-ctf-deployment.tar.gz to your hosting provider"
echo "2. Extract the package in your production directory"
echo "3. Run 'npm ci --production' in production"
echo "4. Set up your environment variables"
echo "5. Run 'npx prisma migrate deploy' to set up the database"
echo "6. Start your application with 'npm start'"
echo ""
echo "🌐 For Netlify deployment:"
echo "1. Connect your GitHub repository to Netlify"
echo "2. Set build command: npm run build"
echo "3. Set publish directory: .next"
echo "4. Add environment variables in Netlify dashboard"
echo "5. Deploy!"
echo ""
print_success "Ready for deployment! 🚀"

