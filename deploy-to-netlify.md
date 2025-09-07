# 🚀 Panduan Deploy ke Netlify - Step by Step

## ⚡ Quick Deploy (5 Menit)

### Opsi 1: Deploy Manual (Tanpa Git)

1. **Buka [Netlify](https://netlify.com)**
2. **Login atau Sign Up**
3. **Klik "Add new site" > "Deploy manually"**
4. **Drag & Drop folder `.next` ke area deploy**
5. **Set Environment Variables**:
   ```
   NEXTAUTH_URL=https://your-site-name.netlify.app
   NEXTAUTH_SECRET=your-super-secret-key-here
   DATABASE_URL=file:./dev.db
   TZ=Asia/Jakarta
   ```
6. **Klik "Deploy site"**
7. **Selesai!** Website Anda akan live dalam 1-2 menit

### Opsi 2: Deploy dari GitHub (Recommended)

1. **Upload ke GitHub**:
   - Buka [GitHub](https://github.com)
   - Buat repository baru
   - Upload semua file (atau gunakan GitHub Desktop)

2. **Connect ke Netlify**:
   - Buka [Netlify](https://netlify.com)
   - Klik "Add new site" > "Import an existing project"
   - Pilih GitHub dan repository Anda

3. **Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

4. **Environment Variables**:
   ```
   NEXTAUTH_URL=https://your-site-name.netlify.app
   NEXTAUTH_SECRET=your-super-secret-key-here
   DATABASE_URL=file:./dev.db
   TZ=Asia/Jakarta
   ```

5. **Deploy**: Klik "Deploy site"

## 🔧 Advanced Configuration

### Custom Domain
1. Di Netlify dashboard, pilih site Anda
2. Go to "Domain settings"
3. Add custom domain
4. Update DNS records

### SSL Certificate
- Otomatis enabled di Netlify
- Custom domain akan mendapat SSL otomatis

### Performance Optimization
- CDN global otomatis enabled
- Image optimization enabled
- Gzip compression enabled

## 📊 Monitoring & Analytics

### Netlify Analytics
1. Go to "Analytics" tab
2. Enable "Netlify Analytics"
3. Monitor traffic dan performance

### Error Monitoring
1. Go to "Functions" tab
2. Monitor function logs
3. Set up error alerts

## 🔒 Security Checklist

- [x] HTTPS enabled (otomatis)
- [x] Security headers configured
- [x] Environment variables secured
- [x] No sensitive data in code
- [x] Input validation implemented
- [x] CORS configured

## 🚨 Troubleshooting

### Build Fails
```bash
# Check build logs di Netlify dashboard
# Common fixes:
npm install
npm run build
```

### Database Issues
- Pastikan DATABASE_URL benar
- Check file permissions
- Verify database file exists

### Authentication Issues
- Verify NEXTAUTH_SECRET
- Check NEXTAUTH_URL matches domain
- Ensure environment variables set

## 📈 Performance Tips

1. **Enable Netlify Analytics**
2. **Use CDN** (otomatis enabled)
3. **Optimize images** (WebP/AVIF enabled)
4. **Monitor Core Web Vitals**
5. **Set up caching** (otomatis configured)

## 🔄 Auto Deploy Setup

1. **Connect GitHub repository**
2. **Set branch**: main (default)
3. **Auto deploy**: enabled by default
4. **Preview deployments**: enabled for PRs

## 📱 Mobile Optimization

- Responsive design enabled
- Touch-friendly interface
- Fast loading on mobile
- PWA ready (optional)

## 🌐 Internationalization

- Indonesian timezone (WIB)
- Localized date/time format
- Indonesian language interface
- RTL support ready

## 🎯 Next Steps After Deploy

1. **Test all functionality**
2. **Set up monitoring**
3. **Configure custom domain**
4. **Set up analytics**
5. **Create admin account**
6. **Add sample challenges**
7. **Invite users**

## 📞 Support

- Netlify Documentation: https://docs.netlify.com
- Next.js Documentation: https://nextjs.org/docs
- Project Issues: Create GitHub issue

---

**Happy Deploying! 🚀**
