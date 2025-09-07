# 🚀 cPanel Node.js Setup Guide - PHX CTF

## 📋 Overview

Panduan untuk setup PHX CTF di cPanel dengan Node.js hosting (bukan static hosting).

---

## 🛠️ Prerequisites

### Required cPanel Features
- **Node.js Selector** - Untuk menjalankan Node.js
- **File Manager** - Untuk upload files
- **Database** - MySQL/MariaDB untuk Prisma
- **Terminal/SSH** - Untuk menjalankan commands

### Required Software
- Node.js 18+ (via cPanel Node.js Selector)
- MySQL/MariaDB database
- Git (jika tersedia)

---

## 🔧 Step-by-Step Setup

### Step 1: Prepare Files

1. **Build Application**
   ```bash
   npm install
   npx prisma generate
   npm run build
   ```

2. **Create Deployment Package**
   ```bash
   # Create cpanel-deploy folder
   mkdir cpanel-deploy
   
   # Copy necessary files
   cp -r .next cpanel-deploy/
   cp -r public cpanel-deploy/
   cp -r prisma cpanel-deploy/
   cp -r node_modules cpanel-deploy/
   cp package.json cpanel-deploy/
   cp next.config.js cpanel-deploy/
   cp .env.example cpanel-deploy/.env
   ```

### Step 2: Upload to cPanel

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to public_html**
4. **Upload cpanel-deploy folder**
5. **Extract contents to public_html**

### Step 3: Setup Node.js

1. **Go to Node.js Selector**
2. **Create Node.js App**
   - **App Root**: `/public_html`
   - **App URL**: `/` (root domain)
   - **Node.js Version**: 18.x
   - **App Startup File**: `server.js`

### Step 4: Create Server File

Create `server.js` in public_html:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  .once('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

### Step 5: Setup Database

1. **Go to MySQL Databases**
2. **Create Database**
   - Database name: `phx_ctf`
   - Username: `phx_ctf_user`
   - Password: `strong_password`

3. **Update Environment Variables**
   ```bash
   # In cPanel Node.js Selector
   DATABASE_URL="mysql://phx_ctf_user:strong_password@localhost:3306/phx_ctf"
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="your-secret-key"
   NODE_ENV="production"
   ```

### Step 6: Install Dependencies

1. **Go to Terminal/SSH**
2. **Navigate to public_html**
3. **Install dependencies**
   ```bash
   cd public_html
   npm install
   ```

### Step 7: Setup Database Schema

1. **Run Prisma migrations**
   ```bash
   npx prisma db push
   ```

2. **Seed database (optional)**
   ```bash
   npm run db:seed
   ```

### Step 8: Start Application

1. **Go to Node.js Selector**
2. **Start Application**
3. **Check logs for errors**

---

## 🔧 Alternative: Static Export with API Proxy

Jika cPanel tidak support Node.js, gunakan static export dengan API proxy:

### Step 1: Create Static Version

```bash
# Update next.config.js for static export
output: 'export'
images: { unoptimized: true }
```

### Step 2: Create API Proxy

Create `api-proxy.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$request = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

// Handle different API routes
switch($path) {
    case '/challenges':
        // Return static challenges data
        echo file_get_contents('data/challenges.json');
        break;
    case '/leaderboard':
        // Return static leaderboard data
        echo file_get_contents('data/leaderboard.json');
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
}
?>
```

### Step 3: Create Static Data Files

```bash
# Create data directory
mkdir public/data

# Create static JSON files
echo '[]' > public/data/challenges.json
echo '[]' > public/data/leaderboard.json
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Node.js Not Available
**Problem**: cPanel tidak support Node.js
**Solution**: 
- Gunakan static export dengan API proxy
- Atau pindah ke hosting yang support Node.js

#### 2. Database Connection Failed
**Problem**: Prisma tidak bisa connect ke database
**Solution**:
```bash
# Check database credentials
# Update DATABASE_URL
# Test connection
npx prisma db push
```

#### 3. Build Errors
**Problem**: Build gagal
**Solution**:
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### 4. Permission Issues
**Problem**: File permission errors
**Solution**:
```bash
# Set correct permissions
chmod 755 public_html
chmod 644 public_html/*
chmod 755 public_html/.next
```

---

## 📋 Checklist

### Pre-Deployment
- [ ] cPanel supports Node.js
- [ ] Database created
- [ ] Environment variables ready
- [ ] Files prepared

### Deployment
- [ ] Files uploaded to public_html
- [ ] Node.js app created
- [ ] Server.js file created
- [ ] Dependencies installed
- [ ] Database schema setup
- [ ] Application started

### Post-Deployment
- [ ] Website accessible
- [ ] Database connected
- [ ] All pages working
- [ ] API routes working
- [ ] Authentication working

---

## 🎯 Quick Commands

### Build and Deploy
```bash
# Build application
npm run build

# Create deployment package
mkdir cpanel-deploy
cp -r .next public prisma node_modules package.json next.config.js .env.example cpanel-deploy/

# Upload to cPanel
# Extract to public_html
```

### Database Setup
```bash
# Setup database
npx prisma db push

# Seed database
npm run db:seed
```

---

## 📞 Support

### cPanel Resources
- **Node.js Selector**: https://docs.cpanel.net/cpanel/software/nodejs-selector/
- **File Manager**: https://docs.cpanel.net/cpanel/files/file-manager/
- **MySQL Databases**: https://docs.cpanel.net/cpanel/databases/mysql-databases/

### Next.js Resources
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Node.js Deployment**: https://nextjs.org/docs/deployment#nodejs-server

---

## 🎉 Success!

Setelah mengikuti panduan ini, PHX CTF akan berjalan dengan baik di cPanel dengan:

- ✅ **Node.js Support** - Full server-side rendering
- ✅ **Database Integration** - Prisma dengan MySQL
- ✅ **API Routes** - Semua API berfungsi
- ✅ **Authentication** - NextAuth dengan database
- ✅ **Performance** - Optimized untuk production

**Ready to deploy!** 🚀

---

*PHX CTF - cPanel Node.js Setup Guide*
*Last updated: $(date)*
