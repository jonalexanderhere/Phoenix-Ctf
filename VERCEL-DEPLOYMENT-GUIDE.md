# 🚀 Vercel Deployment Guide - PHX CTF

## 📋 Overview

Panduan lengkap untuk deployment PHX CTF ke Vercel dengan Next.js App Router dan Prisma.

---

## 🛠️ Prerequisites

### Required Software
- Node.js 18+
- Git
- Vercel CLI (optional, but recommended)

### Required Accounts
- GitHub account
- Vercel account
- Database provider (PlanetScale, Supabase, atau Vercel Postgres)

---

## 🔧 Configuration Files

### 1. **next.config.js** - Updated for Vercel
```javascript
const nextConfig = {
  // For Vercel deployment
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // Image optimization for Vercel
  images: {
    domains: ['localhost', 'vercel.app', '*.vercel.app'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // ... other config
}
```

### 2. **vercel.json** - Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [...],
  "redirects": [...]
}
```

### 3. **package.json** - Updated Scripts
```json
{
  "scripts": {
    "build:vercel": "npm run build",
    "deploy:vercel": "vercel --prod",
    "deploy:vercel-preview": "vercel"
  }
}
```

---

## 🚀 Deployment Methods

### Method 1: GitHub Integration (Recommended)

#### Step 1: Push to GitHub
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - PHX CTF"

# Add remote origin
git remote add origin https://github.com/jonalexanderhere/Phoenix-Ctf.git

# Push to main branch
git push -u origin main
```

#### Step 2: Connect to Vercel
1. **Login to Vercel** → https://vercel.com
2. **Click "New Project"**
3. **Import from GitHub** → Select `Phoenix-Ctf` repository
4. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Step 3: Set Environment Variables
```bash
# In Vercel Dashboard → Settings → Environment Variables
DATABASE_URL=your_database_connection_string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_key_here
NODE_ENV=production
```

#### Step 4: Deploy
1. **Click "Deploy"**
2. **Wait for build** to complete
3. **Test deployment** on provided URL

### Method 2: Vercel CLI

#### Step 1: Install Vercel CLI
```bash
# Install globally
npm install -g vercel

# Or use npx
npx vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Step 4: Set Environment Variables
```bash
# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add NODE_ENV
```

### Method 3: Build Scripts

#### Windows
```cmd
# Run deployment script
deploy-vercel.bat
```

#### Linux/Mac
```bash
# Make executable and run
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

---

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended)
1. **Go to Vercel Dashboard**
2. **Storage** → **Create Database** → **Postgres**
3. **Copy connection string**
4. **Set as DATABASE_URL**

### Option 2: PlanetScale
1. **Create PlanetScale account**
2. **Create database**
3. **Get connection string**
4. **Set as DATABASE_URL**

### Option 3: Supabase
1. **Create Supabase project**
2. **Get connection string**
3. **Set as DATABASE_URL**

### Database Schema Setup
```bash
# After deployment, run migrations
npx prisma db push

# Or seed database
npm run db:seed
```

---

## 🔧 Environment Variables

### Required Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# Environment
NODE_ENV="production"
```

### Optional Variables
```bash
# File upload (if using external storage)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

---

## 🚀 Build Process

### Local Build Test
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Test build locally
npm start
```

### Vercel Build Process
1. **Install dependencies** → `npm install`
2. **Generate Prisma client** → `npx prisma generate`
3. **Build Next.js app** → `npm run build`
4. **Deploy to Vercel** → Automatic

---

## 📊 Build Results

### ✅ Build Status
```bash
npm run build
# ✅ Prisma generate: Success
# ✅ Next.js build: Success
# ✅ TypeScript: No errors
# ✅ ESLint: No warnings
# ✅ Static generation: 25/25 pages
# ✅ Build optimization: Complete
```

### 📈 Build Statistics
- **Total Routes**: 25
- **Static Pages**: 8
- **Dynamic Pages**: 17
- **First Load JS**: 81.9 kB
- **Middleware**: 41.8 kB

---

## 🔍 Testing Deployment

### 1. **Basic Functionality**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] All pages accessible
- [ ] Static assets load

### 2. **Authentication**
- [ ] Sign in page works
- [ ] Sign up page works
- [ ] Authentication flow works
- [ ] Session management works

### 3. **Database Features**
- [ ] Challenges load
- [ ] Leaderboard works
- [ ] Profile page works
- [ ] Admin panel works

### 4. **API Routes**
- [ ] `/api/challenges` works
- [ ] `/api/leaderboard` works
- [ ] `/api/auth` works
- [ ] `/api/users` works

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
**Problem**: Build fails during deployment
**Solution**:
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint
```

#### 2. Database Connection Failed
**Problem**: Cannot connect to database
**Solution**:
- Check DATABASE_URL format
- Verify database is accessible
- Check network connectivity
- Test connection string

#### 3. Environment Variables Not Set
**Problem**: Environment variables not available
**Solution**:
- Set in Vercel dashboard
- Use Vercel CLI: `vercel env add`
- Check variable names
- Restart deployment

#### 4. Prisma Client Not Generated
**Problem**: Prisma client not found
**Solution**:
```bash
# Add to package.json scripts
"postinstall": "prisma generate"

# Or add to build command
"build": "prisma generate && next build"
```

### Debug Steps

1. **Check Build Logs**
   ```bash
   # In Vercel dashboard
   # Go to deployment → View build logs
   ```

2. **Check Function Logs**
   ```bash
   # In Vercel dashboard
   # Go to Functions → View logs
   ```

3. **Test Locally**
   ```bash
   # Test with production build
   npm run build
   npm start
   ```

4. **Check Environment Variables**
   ```bash
   # In Vercel dashboard
   # Settings → Environment Variables
   ```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Build passes locally
- [ ] Environment variables ready
- [ ] Database configured
- [ ] Vercel account created

### Deployment
- [ ] Project imported to Vercel
- [ ] Environment variables set
- [ ] Build configuration correct
- [ ] Deployment successful
- [ ] Domain configured

### Post-Deployment
- [ ] Website accessible
- [ ] All pages working
- [ ] Database connected
- [ ] Authentication working
- [ ] API routes working
- [ ] Performance optimized

---

## 🎯 Quick Commands

### Deployment Commands
```bash
# GitHub integration (recommended)
git push origin main

# Vercel CLI
vercel --prod

# Build scripts
npm run deploy:vercel
```

### Development Commands
```bash
# Local development
npm run dev

# Build and test
npm run build
npm start

# Type checking
npm run type-check
```

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database
npm run db:seed
```

---

## 📞 Support Resources

### Vercel Resources
- **Vercel Docs**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

### Next.js Resources
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **App Router**: https://nextjs.org/docs/app
- **API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

### Prisma Resources
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **Database Providers**: https://www.prisma.io/docs/concepts/database-connectors

---

## 🎉 Success!

Setelah mengikuti panduan ini, PHX CTF akan berjalan dengan baik di Vercel dengan:

- ✅ **Next.js App Router** - Modern routing system
- ✅ **Server-side Rendering** - Full SSR support
- ✅ **API Routes** - All API endpoints working
- ✅ **Database Integration** - Prisma with PostgreSQL
- ✅ **Authentication** - NextAuth with database
- ✅ **Performance** - Optimized for Vercel
- ✅ **Scalability** - Auto-scaling with Vercel

**Ready to deploy!** 🚀

---

*PHX CTF - Vercel Deployment Guide*
*Last updated: $(date)*
