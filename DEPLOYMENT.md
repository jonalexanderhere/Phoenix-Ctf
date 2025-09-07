# Panduan Deployment ke Netlify

## Persiapan Awal

### 1. Setup Database Production
Untuk production, gunakan database cloud seperti:
- **PlanetScale** (MySQL) - Recommended
- **Supabase** (PostgreSQL) - Free tier available
- **Railway** (PostgreSQL/MySQL) - Easy setup

### 2. Environment Variables
Buat file `.env.local` dengan konfigurasi berikut:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=https://your-app-name.netlify.app
NEXTAUTH_SECRET=your-super-secret-key-here

# Database Configuration (Production)
DATABASE_URL="postgresql://username:password@host:port/database"

# Timezone
TZ=Asia/Jakarta

# Build Configuration
NEXT_TELEMETRY_DISABLED=1
```

## Deployment Steps

### 1. Push ke GitHub
```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: CTF Platform with Indonesian timezone"

# Tambahkan remote repository
git remote add origin https://github.com/username/phx-ctf.git

# Push ke GitHub
git push -u origin main
```

### 2. Deploy ke Netlify

#### Opsi A: Deploy dari GitHub (Recommended)
1. Buka [Netlify](https://netlify.com)
2. Klik "New site from Git"
3. Pilih GitHub dan repository Anda
4. Konfigurasi build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

#### Opsi B: Deploy manual
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 3. Konfigurasi Environment Variables di Netlify
1. Buka dashboard Netlify
2. Pilih site Anda
3. Pergi ke "Site settings" > "Environment variables"
4. Tambahkan semua environment variables dari `.env.local`

### 4. Setup Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database production
npx prisma db push

# (Optional) Seed database dengan data awal
npx prisma db seed
```

## Konfigurasi Real-time Updates

### 1. Enable Auto Deploy
- Netlify akan otomatis deploy setiap kali ada push ke branch main
- Pastikan branch main adalah branch production

### 2. Preview Deployments
- Setiap pull request akan membuat preview deployment
- Berguna untuk testing sebelum merge ke main

### 3. Webhook untuk Database Updates
Jika menggunakan database external, setup webhook untuk sync data real-time.

## Monitoring dan Maintenance

### 1. Netlify Analytics
- Enable Netlify Analytics untuk monitoring traffic
- Monitor build logs untuk error

### 2. Database Monitoring
- Monitor database performance
- Setup backup otomatis

### 3. Error Tracking
- Consider adding Sentry atau error tracking service
- Monitor API response times

## Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check build logs di Netlify dashboard
# Common fixes:
npm install
npm run build
```

#### Database Connection Issues
- Pastikan DATABASE_URL benar
- Check database credentials
- Verify network access

#### Timezone Issues
- Pastikan TZ=Asia/Jakarta di environment variables
- Check server timezone settings

### Performance Optimization

#### 1. Enable Caching
- Static assets sudah di-cache otomatis
- API responses bisa di-cache dengan Redis

#### 2. CDN
- Netlify menggunakan global CDN
- Pastikan static assets di-optimize

#### 3. Database Optimization
- Index database fields yang sering di-query
- Monitor query performance

## Security Checklist

- [ ] Environment variables tidak hardcoded
- [ ] Database credentials aman
- [ ] HTTPS enabled (otomatis di Netlify)
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation pada semua forms

## Backup Strategy

### 1. Database Backup
- Setup automated daily backups
- Test restore process

### 2. Code Backup
- GitHub sebagai primary backup
- Regular local backups

### 3. Environment Backup
- Document semua environment variables
- Store securely (password manager)

## Scaling Considerations

### 1. Database Scaling
- Monitor database performance
- Consider read replicas untuk high traffic

### 2. CDN Optimization
- Optimize images dan static assets
- Use WebP format untuk images

### 3. Caching Strategy
- Implement Redis untuk session storage
- Cache frequently accessed data

## Support dan Maintenance

### 1. Regular Updates
- Update dependencies monthly
- Monitor security advisories

### 2. Performance Monitoring
- Monitor Core Web Vitals
- Optimize based on real user metrics

### 3. User Feedback
- Implement feedback system
- Monitor user behavior analytics