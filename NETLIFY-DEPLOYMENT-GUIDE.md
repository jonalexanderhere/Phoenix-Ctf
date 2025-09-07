# 🚀 Netlify CLI Deployment Guide - PHX CTF

## 📋 Overview

Script deployment lengkap untuk PHX CTF menggunakan Netlify CLI dengan berbagai opsi yang Anda minta.

---

## 🛠️ Files Created

### 1. **deploy-netlify.bat** (Windows)
Interactive deployment script dengan menu lengkap

### 2. **deploy-netlify.sh** (Linux/Mac)
Interactive deployment script dengan menu lengkap

### 3. **deploy-quick.bat** (Windows)
Quick deployment script untuk opsi cepat

### 4. **deploy-quick.sh** (Linux/Mac)
Quick deployment script untuk opsi cepat

### 5. **netlify-deploy-commands.md**
Dokumentasi lengkap semua command Netlify CLI

---

## 🚀 Quick Start

### Windows
```cmd
# Run interactive script
deploy-netlify.bat

# Or run quick script
deploy-quick.bat
```

### Linux/Mac
```bash
# Make executable and run
chmod +x deploy-netlify.sh
./deploy-netlify.sh

# Or run quick script
chmod +x deploy-quick.sh
./deploy-quick.sh
```

---

## 📦 NPM Scripts Added

### Basic Deployment
```bash
npm run deploy:netlify      # Build + Deploy to production
npm run deploy:preview      # Build + Deploy to preview
npm run deploy:prod         # Deploy to production (no build)
npm run deploy:prod-open    # Deploy to production + open browser
npm run deploy:no-build     # Deploy without build
```

### Advanced Deployment
```bash
npm run deploy:create       # Create new site and deploy
npm run deploy:trigger      # Deploy with trigger
npm run deploy:message      # Deploy with custom message
npm run deploy:site         # Deploy to specific site
```

### Netlify Management
```bash
npm run netlify:login       # Login to Netlify
npm run netlify:status      # Check status
npm run netlify:logs        # View logs
npm run netlify:env:set     # Set environment variables
npm run netlify:env:list    # List environment variables
```

---

## 🔧 All Netlify CLI Commands

### 1. **Basic Deployment**
```bash
netlify deploy                    # Deploy to preview
netlify deploy --prod             # Deploy to production
netlify deploy --prod --open      # Deploy to production + open
netlify deploy --no-build         # Deploy without build
```

### 2. **Site-Specific Deployment**
```bash
netlify deploy --site my-first-project
netlify deploy --site my-first-project --prod
```

### 3. **Advanced Options**
```bash
netlify deploy --message "A message with an $ENV_VAR"
netlify deploy --auth $NETLIFY_AUTH_TOKEN
netlify deploy --trigger
netlify deploy --context deploy-preview
```

### 4. **Site Creation**
```bash
netlify deploy --create-site my-new-site
netlify deploy --create-site my-new-site --team my-team
netlify deploy --prod-if-unlocked
```

---

## 🎯 Usage Examples

### Example 1: First Time Deployment
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Create site and deploy
netlify deploy --create-site phx-ctf

# 4. Deploy to production
netlify deploy --prod
```

### Example 2: Regular Deployment
```bash
# Quick production deployment
netlify deploy --prod

# Deploy with message
netlify deploy --prod --message "Fix: Resolve authentication issue"

# Deploy and open in browser
netlify deploy --prod --open
```

### Example 3: Development Workflow
```bash
# Deploy preview for testing
netlify deploy

# Test thoroughly, then deploy to production
netlify deploy --prod

# Deploy without build (if already built)
netlify deploy --no-build
```

---

## 🔐 Environment Variables Setup

### Set Required Variables
```bash
# NextAuth Configuration
netlify env:set NEXTAUTH_SECRET "your-secret-key-here"
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"

# Database
netlify env:set DATABASE_URL "your-database-url"

# App Configuration
netlify env:set NODE_ENV "production"
netlify env:set TZ "Asia/Jakarta"
```

### List Environment Variables
```bash
netlify env:list
```

---

## 📊 Monitoring and Debugging

### Check Deployment Status
```bash
netlify status
netlify logs
netlify functions:log
```

### Debug Commands
```bash
netlify deploy --debug
netlify deploy --verbose
netlify status --verbose
```

---

## 🚨 Troubleshooting

### Common Issues

1. **Netlify CLI Not Found**
   ```bash
   npm install -g netlify-cli
   ```

2. **Not Logged In**
   ```bash
   netlify login
   ```

3. **Site Not Found**
   ```bash
   netlify link
   # Or specify site ID
   netlify deploy --site your-site-id
   ```

4. **Build Fails**
   ```bash
   # Check build locally
   npm run build
   
   # Check environment variables
   netlify env:list
   ```

---

## 📋 Script Features

### Interactive Scripts
- ✅ Menu-driven interface
- ✅ Automatic Netlify CLI installation
- ✅ Login verification
- ✅ Error handling
- ✅ Multiple deployment options

### Quick Scripts
- ✅ Fast deployment options
- ✅ Minimal interaction
- ✅ All major commands available

### NPM Scripts
- ✅ Integrated with package.json
- ✅ Easy to remember commands
- ✅ Consistent with project workflow

---

## 🎉 Ready to Deploy!

### Step 1: Choose Your Method
- **Interactive**: Run `deploy-netlify.bat` or `./deploy-netlify.sh`
- **Quick**: Run `deploy-quick.bat` or `./deploy-quick.sh`
- **NPM**: Use `npm run deploy:*` commands

### Step 2: Set Environment Variables
```bash
netlify env:set NEXTAUTH_SECRET "your-secret"
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"
netlify env:set DATABASE_URL "your-database-url"
```

### Step 3: Deploy!
```bash
# First time
netlify deploy --create-site phx-ctf

# Regular deployment
netlify deploy --prod
```

---

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com/
- **CLI Reference**: https://cli.netlify.com/
- **Community**: https://community.netlify.com/

---

*PHX CTF - Netlify CLI Deployment Guide*
*All commands tested and ready to use!* 🚀