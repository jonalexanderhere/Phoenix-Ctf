# 🚀 Netlify CLI Deployment Commands

## 📋 Quick Reference

### Basic Deployment Commands

```bash
# Deploy to preview (current site)
netlify deploy

# Deploy to production
netlify deploy --prod

# Deploy to production and open in browser
netlify deploy --prod --open

# Deploy without running build first
netlify deploy --no-build
```

### Site-Specific Deployment

```bash
# Deploy to specific site
netlify deploy --site my-first-project

# Deploy to production with specific site
netlify deploy --site my-first-project --prod
```

### Advanced Deployment Options

```bash
# Deploy with custom message
netlify deploy --message "A message with an $ENV_VAR"

# Deploy with authentication token
netlify deploy --auth $NETLIFY_AUTH_TOKEN

# Deploy with trigger
netlify deploy --trigger

# Deploy with context
netlify deploy --context deploy-preview
```

### Site Creation and Deployment

```bash
# Create new site and deploy
netlify deploy --create-site my-new-site

# Create site with team and deploy
netlify deploy --create-site my-new-site --team my-team

# Deploy to production if unlocked
netlify deploy --prod-if-unlocked
```

## 🛠️ Setup Commands

### Install Netlify CLI

```bash
# Install globally
npm install -g netlify-cli

# Or install locally
npm install --save-dev netlify-cli
```

### Authentication

```bash
# Login to Netlify
netlify login

# Logout
netlify logout

# Check login status
netlify status
```

### Site Management

```bash
# List all sites
netlify sites:list

# Get site info
netlify sites:info

# Create new site
netlify sites:create --name my-site-name

# Link to existing site
netlify link
```

## 🔧 Configuration

### netlify.toml (Already configured)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Environment Variables

```bash
# Set environment variables
netlify env:set NEXTAUTH_SECRET "your-secret-key"
netlify env:set DATABASE_URL "your-database-url"

# List environment variables
netlify env:list

# Get environment variable
netlify env:get NEXTAUTH_SECRET
```

## 📦 Build Commands

### Manual Build and Deploy

```bash
# Build first, then deploy
npm run build
netlify deploy --prod

# Deploy without build (if already built)
netlify deploy --prod --no-build
```

### Build with Environment

```bash
# Build with production environment
NODE_ENV=production npm run build
netlify deploy --prod
```

## 🚀 Deployment Scripts

### Windows (deploy-netlify.bat)

```cmd
# Run interactive deployment script
deploy-netlify.bat

# Or run specific commands
netlify deploy --prod
netlify deploy --prod --open
```

### Linux/Mac (deploy-netlify.sh)

```bash
# Make executable and run
chmod +x deploy-netlify.sh
./deploy-netlify.sh

# Or run specific commands
netlify deploy --prod
netlify deploy --prod --open
```

## 🔍 Monitoring and Debugging

### Check Deployment Status

```bash
# Check site status
netlify status

# Check deployment logs
netlify logs

# Check function logs
netlify functions:log
```

### Debug Commands

```bash
# Debug mode
netlify deploy --debug

# Verbose output
netlify deploy --verbose

# Check configuration
netlify status --verbose
```

## 📊 Performance Optimization

### Deploy with Performance Monitoring

```bash
# Deploy with performance monitoring
netlify deploy --prod --message "Performance optimization update"

# Deploy with analytics
netlify deploy --prod --analytics
```

### Build Optimization

```bash
# Build with analysis
ANALYZE=true npm run build
netlify deploy --prod

# Build with bundle analysis
npm run build:analyze
netlify deploy --prod
```

## 🔐 Security and Authentication

### Deploy with Security Headers

```bash
# Deploy with security configuration
netlify deploy --prod --message "Security headers update"
```

### Environment-Specific Deployment

```bash
# Deploy to staging
netlify deploy --context deploy-preview

# Deploy to production
netlify deploy --context production
```

## 📝 Best Practices

### 1. Always Test First
```bash
# Deploy to preview first
netlify deploy

# Test thoroughly, then deploy to production
netlify deploy --prod
```

### 2. Use Meaningful Messages
```bash
# Good deployment message
netlify deploy --prod --message "Fix: Resolve authentication issue"

# Bad deployment message
netlify deploy --prod --message "update"
```

### 3. Monitor Deployments
```bash
# Check deployment status
netlify status

# Monitor logs
netlify logs --follow
```

### 4. Environment Variables
```bash
# Set all required environment variables
netlify env:set NEXTAUTH_SECRET "your-secret"
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"
netlify env:set DATABASE_URL "your-database-url"
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check build locally
   npm run build
   
   # Check environment variables
   netlify env:list
   ```

2. **Authentication Issues**
   ```bash
   # Re-login
   netlify logout
   netlify login
   ```

3. **Site Not Found**
   ```bash
   # Link to correct site
   netlify link
   
   # Or specify site ID
   netlify deploy --site your-site-id
   ```

4. **Deployment Stuck**
   ```bash
   # Cancel and retry
   netlify deploy --prod --no-build
   ```

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com/
- **CLI Reference**: https://cli.netlify.com/
- **Community**: https://community.netlify.com/

---

*Last updated: $(date)*
*PHX CTF Deployment Guide*
