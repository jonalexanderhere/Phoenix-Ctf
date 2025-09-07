# 🚀 cPanel Deployment Guide - PHX CTF

## 📋 Overview

Panduan lengkap untuk deployment PHX CTF ke cPanel hosting dengan static export.

---

## 🛠️ Prerequisites

### Required Software
- Node.js 18+ (untuk build)
- cPanel hosting account
- File Manager access di cPanel

### Required Files
- ✅ `next.config.js` - Updated untuk static export
- ✅ `public/.htaccess` - Routing configuration
- ✅ `build-cpanel.bat` - Windows build script
- ✅ `build-cpanel.sh` - Linux/Mac build script

---

## 🔧 Configuration Changes

### 1. Next.js Configuration
```javascript
// next.config.js
const nextConfig = {
  output: 'export',           // Static export
  trailingSlash: true,        // URL dengan trailing slash
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,        // Disable image optimization
  },
  // ... other config
}
```

### 2. .htaccess Configuration
```apache
# public/.htaccess
RewriteEngine On
# Client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]
```

---

## 🚀 Build Process

### Windows
```cmd
# Run build script
build-cpanel.bat

# Or manual build
npm install
npx prisma generate
npm run build
npm run export
```

### Linux/Mac
```bash
# Make executable and run
chmod +x build-cpanel.sh
./build-cpanel.sh

# Or manual build
npm install
npx prisma generate
npm run build
npm run export
```

### NPM Scripts
```bash
# Build for cPanel
npm run build:cpanel

# Export only
npm run export
```

---

## 📁 File Structure After Build

```
cpanel-deploy/
├── index.html
├── _next/
│   ├── static/
│   └── ...
├── challenges/
│   ├── index.html
│   └── [id]/
├── profile/
│   └── index.html
├── leaderboard/
│   └── index.html
├── auth/
│   ├── signin/
│   └── signup/
├── admin/
│   └── index.html
├── web-challenge/
│   └── index.html
├── .htaccess
└── ... (other static files)
```

---

## 📤 cPanel Upload Process

### Step 1: Login to cPanel
1. Login ke cPanel hosting account
2. Navigate ke **File Manager**
3. Buka folder **public_html**

### Step 2: Upload Files
1. **Backup existing files** (jika ada)
2. Upload semua file dari folder `cpanel-deploy/`
3. Extract/upload ke root `public_html/`

### Step 3: Set Permissions
```bash
# Folder permissions
chmod 755 public_html/
chmod 755 public_html/_next/
chmod 755 public_html/challenges/
chmod 755 public_html/profile/
chmod 755 public_html/leaderboard/
chmod 755 public_html/auth/
chmod 755 public_html/admin/
chmod 755 public_html/web-challenge/

# File permissions
chmod 644 public_html/index.html
chmod 644 public_html/.htaccess
chmod 644 public_html/_next/static/*
```

### Step 4: Verify Upload
1. Check file structure di File Manager
2. Verify `.htaccess` file uploaded
3. Check permissions

---

## 🔧 cPanel Configuration

### 1. File Manager Settings
- **Show Hidden Files**: Enable
- **File Permissions**: 755 for folders, 644 for files

### 2. .htaccess Configuration
- Pastikan `.htaccess` file ada di root
- Check rewrite rules aktif
- Verify security headers

### 3. Domain Settings
- **Primary Domain**: Point ke public_html
- **Subdomains**: Configure jika perlu
- **SSL**: Enable HTTPS

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Page Not Found (404)
**Problem**: Halaman tidak ditemukan
**Solution**:
```apache
# Check .htaccess file
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]
```

#### 2. CSS/JS Not Loading
**Problem**: Static assets tidak load
**Solution**:
- Check file permissions (644)
- Verify `_next/static/` folder uploaded
- Check .htaccess MIME types

#### 3. Images Not Displaying
**Problem**: Gambar tidak muncul
**Solution**:
- Check image file permissions
- Verify image paths
- Check .htaccess image rules

#### 4. Routing Issues
**Problem**: Client-side routing tidak work
**Solution**:
- Verify .htaccess rewrite rules
- Check index.html di setiap folder
- Test URL patterns

### Debug Steps

1. **Check File Structure**
   ```bash
   ls -la public_html/
   ls -la public_html/_next/
   ```

2. **Check .htaccess**
   ```bash
   cat public_html/.htaccess
   ```

3. **Check Permissions**
   ```bash
   ls -la public_html/
   ```

4. **Test URLs**
   - `https://yourdomain.com/`
   - `https://yourdomain.com/challenges/`
   - `https://yourdomain.com/profile/`

---

## 📊 Performance Optimization

### 1. Enable Gzip Compression
```apache
# .htaccess
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript
</IfModule>
```

### 2. Set Cache Headers
```apache
# .htaccess
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

### 3. Security Headers
```apache
# .htaccess
<IfModule mod_headers.c>
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
</IfModule>
```

---

## 🔐 Security Considerations

### 1. File Permissions
- **Folders**: 755
- **Files**: 644
- **Sensitive files**: 600

### 2. .htaccess Security
```apache
# Prevent access to sensitive files
<FilesMatch "\.(env|log|md|json)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Prevent directory browsing
Options -Indexes
```

### 3. Environment Variables
- **Database**: Use cPanel database
- **Secrets**: Set via cPanel environment
- **API Keys**: Store securely

---

## 📋 Checklist

### Pre-Deployment
- [ ] Next.js config updated for static export
- [ ] .htaccess file created
- [ ] Build script tested
- [ ] Dependencies installed

### Build Process
- [ ] `npm install` completed
- [ ] `npx prisma generate` completed
- [ ] `npm run build` completed
- [ ] `npm run export` completed
- [ ] Files copied to cpanel-deploy/

### Upload Process
- [ ] cPanel File Manager accessed
- [ ] public_html folder opened
- [ ] Files uploaded to correct location
- [ ] .htaccess file uploaded
- [ ] Permissions set correctly

### Post-Deployment
- [ ] Website accessible
- [ ] All pages working
- [ ] Static assets loading
- [ ] Client-side routing working
- [ ] Security headers active

---

## 🎯 Quick Commands

### Build Commands
```bash
# Windows
build-cpanel.bat

# Linux/Mac
chmod +x build-cpanel.sh
./build-cpanel.sh

# NPM
npm run build:cpanel
```

### Verification Commands
```bash
# Check build output
ls -la out/

# Check cPanel package
ls -la cpanel-deploy/

# Test local build
npx serve out/
```

---

## 📞 Support

### cPanel Resources
- **cPanel Documentation**: https://docs.cpanel.net/
- **File Manager Guide**: https://docs.cpanel.net/cpanel/files/file-manager/
- **.htaccess Guide**: https://docs.cpanel.net/cpanel/security/htaccess/

### Next.js Static Export
- **Next.js Docs**: https://nextjs.org/docs/advanced-features/static-html-export
- **Static Export Guide**: https://nextjs.org/docs/advanced-features/static-html-export

---

## 🎉 Success!

Setelah mengikuti panduan ini, PHX CTF akan berjalan dengan baik di cPanel hosting dengan:

- ✅ **Static Export** - Semua halaman di-generate sebagai HTML
- ✅ **Client-side Routing** - Routing bekerja dengan .htaccess
- ✅ **Performance** - Optimized untuk hosting statis
- ✅ **Security** - Headers dan permissions yang tepat
- ✅ **SEO** - URL yang SEO-friendly

**Ready to deploy!** 🚀

---

*PHX CTF - cPanel Deployment Guide*
*Last updated: $(date)*
