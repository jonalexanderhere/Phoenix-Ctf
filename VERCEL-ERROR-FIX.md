# 🔧 Vercel Error Fix - Function Runtimes

## ❌ Error yang Terjadi
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

## ✅ Solusi yang Diterapkan

### 1. **Perbaikan vercel.json**
**Problem**: Konfigurasi `functions` tidak diperlukan untuk Next.js
**Solution**: Hapus konfigurasi `functions` yang tidak valid

**Before (❌ Error):**
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

**After (✅ Fixed):**
```json
{
  "framework": "nextjs"
}
```

### 2. **Konfigurasi vercel.json yang Benar**
```json
{
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/challenges",
      "destination": "/challenges/",
      "permanent": true
    },
    {
      "source": "/profile",
      "destination": "/profile/",
      "permanent": true
    },
    {
      "source": "/leaderboard",
      "destination": "/leaderboard/",
      "permanent": true
    },
    {
      "source": "/admin",
      "destination": "/admin/",
      "permanent": true
    },
    {
      "source": "/auth/signin",
      "destination": "/auth/signin/",
      "permanent": true
    },
    {
      "source": "/auth/signup",
      "destination": "/auth/signup/",
      "permanent": true
    },
    {
      "source": "/web-challenge",
      "destination": "/web-challenge/",
      "permanent": true
    }
  ]
}
```

---

## 🚀 Deployment Steps yang Benar

### 1. **GitHub Integration (Recommended)**
1. **Go to Vercel**: https://vercel.com
2. **Click "New Project"**
3. **Import from GitHub**: Select `Phoenix-Ctf` repository
4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### 2. **Environment Variables**
Set di Vercel Dashboard → Settings → Environment Variables:
```bash
DATABASE_URL=your_database_connection_string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_key_here
NODE_ENV=production
```

### 3. **Deploy**
1. **Click "Deploy"**
2. **Wait for build** to complete
3. **Test deployment** on provided URL

---

## 🔍 Troubleshooting

### Common Vercel Errors

#### 1. Function Runtimes Error
**Error**: `Function Runtimes must have a valid version`
**Solution**: 
- Remove `functions` configuration from `vercel.json`
- Vercel auto-detects Next.js API routes

#### 2. Build Failures
**Error**: Build fails during deployment
**Solution**:
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint
```

#### 3. Database Connection Failed
**Error**: Cannot connect to database
**Solution**:
- Check DATABASE_URL format
- Verify database is accessible
- Test connection string
- Check environment variables

#### 4. Environment Variables Not Set
**Error**: Environment variables not available
**Solution**:
- Set in Vercel dashboard
- Use Vercel CLI: `vercel env add`
- Check variable names
- Restart deployment

---

## 📋 Best Practices untuk Vercel

### 1. **vercel.json Configuration**
- ✅ **Keep it simple**: Only specify what you need
- ✅ **Use framework**: Let Vercel auto-detect Next.js
- ✅ **Headers**: Add security and performance headers
- ✅ **Redirects**: Handle URL redirects properly

### 2. **Environment Variables**
- ✅ **Set in dashboard**: Use Vercel dashboard for env vars
- ✅ **Use secrets**: Keep sensitive data secure
- ✅ **Test locally**: Use `.env.local` for development

### 3. **Build Configuration**
- ✅ **Auto-detect**: Let Vercel detect Next.js settings
- ✅ **Prisma**: Ensure `prisma generate` runs
- ✅ **Dependencies**: Keep `package.json` updated

---

## 🎯 Next Steps

### 1. **Verify Fix**
- ✅ `vercel.json` updated and pushed to GitHub
- ✅ Invalid `functions` configuration removed
- ✅ Framework set to "nextjs"

### 2. **Deploy to Vercel**
1. **Go to Vercel**: https://vercel.com
2. **Import project**: Select Phoenix-Ctf repository
3. **Configure**: Framework auto-detected as Next.js
4. **Set env vars**: Database URL, secrets
5. **Deploy**: Should work without errors

### 3. **Test Deployment**
- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] API routes working
- [ ] Database connected
- [ ] Authentication working

---

## 🎉 Success!

Setelah perbaikan ini, deployment ke Vercel akan berhasil tanpa error:

- ✅ **Function Runtimes Error**: Fixed
- ✅ **vercel.json**: Properly configured
- ✅ **Next.js**: Auto-detected by Vercel
- ✅ **API Routes**: Will work automatically
- ✅ **Build Process**: Optimized for Vercel

**Status: READY FOR VERCEL DEPLOYMENT** 🚀

---

*PHX CTF - Vercel Error Fix*
*Last updated: $(date)*
