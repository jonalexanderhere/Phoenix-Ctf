# 🚀 PHX CTF Platform - Complete Deployment Guide

## Overview
This guide will help you deploy the PHX CTF Platform to Netlify with all features working correctly.

## Prerequisites
- GitHub account
- Netlify account
- Node.js 18+ installed locally

## Quick Deployment (5 minutes)

### Step 1: Prepare Your Repository
1. **Fork this repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/phx-ctf.git
   cd phx-ctf
   ```

### Step 2: Configure Environment
1. **Create environment file**:
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local`** with your settings:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="https://your-site-name.netlify.app"
   NEXTAUTH_SECRET="your-super-secret-key-here"
   TZ="Asia/Jakarta"
   ```

### Step 3: Deploy to Netlify
1. **Go to [Netlify](https://netlify.com)**
2. **Click "New site from Git"**
3. **Connect your GitHub repository**
4. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18
5. **Set environment variables** in Netlify dashboard:
   - `NEXTAUTH_URL` = `https://your-site-name.netlify.app`
   - `NEXTAUTH_SECRET` = `your-super-secret-key-here`
   - `DATABASE_URL` = `file:./dev.db`
   - `TZ` = `Asia/Jakarta`
6. **Click "Deploy site"**

### Step 4: Initialize Database
1. **Visit your deployed site**
2. **Go to `/api/seed`** to initialize the database
3. **Sign up** for a new account
4. **Start using the platform!**

## Advanced Configuration

### Custom Domain
1. **In Netlify dashboard**, go to "Domain settings"
2. **Add your custom domain**
3. **Update `NEXTAUTH_URL`** in environment variables
4. **Redeploy** the site

### Database Options
- **SQLite (Default)**: File-based database, good for small to medium usage
- **PostgreSQL**: For production with high traffic
- **MySQL**: Alternative relational database option

### Security Enhancements
1. **Generate strong secrets**:
   ```bash
   openssl rand -base64 32
   ```
2. **Enable HTTPS** (automatic with Netlify)
3. **Set up monitoring** with Netlify Analytics

## Troubleshooting

### Common Issues

#### Build Fails
- **Check Node.js version**: Must be 18+
- **Clear cache**: Delete `node_modules` and `package-lock.json`, then `npm install`
- **Check environment variables**: Ensure all required variables are set

#### Authentication Not Working
- **Verify `NEXTAUTH_URL`**: Must match your actual domain
- **Check `NEXTAUTH_SECRET`**: Must be set and consistent
- **Clear browser cache**: Sometimes old sessions cause issues

#### Database Issues
- **Check `DATABASE_URL`**: Ensure it's correctly formatted
- **Run seed script**: Visit `/api/seed` to initialize data
- **Check file permissions**: Ensure database file is writable

#### File Uploads Not Working
- **Check uploads directory**: Ensure it exists and is writable
- **Verify file size limits**: Default is 10MB
- **Check file types**: Ensure uploaded files match allowed types

### Performance Optimization

#### Enable Caching
- **Static assets**: Automatically cached by Netlify
- **API responses**: Add appropriate cache headers
- **Images**: Use Next.js Image component for optimization

#### Monitor Performance
- **Netlify Analytics**: Built-in performance monitoring
- **Core Web Vitals**: Check in Netlify dashboard
- **Bundle analysis**: Run `npm run build:analyze`

## Maintenance

### Regular Updates
1. **Keep dependencies updated**:
   ```bash
   npm update
   npm audit fix
   ```
2. **Monitor security advisories**
3. **Backup database regularly**

### Scaling
- **Upgrade Netlify plan** for higher limits
- **Use external database** for large datasets
- **Implement CDN** for global performance

## Support

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this guide and README
- **Community**: Join our Discord server

### Contributing
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Submit a pull request**

## Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` generated
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] File uploads validated
- [ ] Input sanitization enabled
- [ ] Rate limiting configured
- [ ] Security headers set

## Performance Checklist

- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Caching configured
- [ ] Bundle size optimized
- [ ] Core Web Vitals passing
- [ ] Mobile performance tested
- [ ] CDN configured (if needed)

---

**🎉 Congratulations!** Your PHX CTF Platform is now deployed and ready to use!

For additional support, please check the main README.md file or create an issue on GitHub.
