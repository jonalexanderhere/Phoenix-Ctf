# Production Setup Guide

## Database Setup

### 1. PostgreSQL Database

Untuk production, aplikasi menggunakan PostgreSQL. Anda perlu setup database PostgreSQL terlebih dahulu.

#### Option 1: Vercel Postgres
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Create Postgres database
vercel postgres create phoenix-ctf-db

# Get connection string
vercel postgres connect phoenix-ctf-db
```

#### Option 2: Supabase
1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Copy connection string dari Settings > Database

#### Option 3: Railway
1. Buat akun di [Railway](https://railway.app)
2. Buat PostgreSQL service
3. Copy connection string

### 2. Environment Variables

Buat file `.env.production` dengan isi:

```env
# Database - PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-production-secret-key-here-make-it-very-long-and-secure"

# Environment
NODE_ENV="production"
```

### 3. Setup Database Schema

```bash
# Copy production schema
cp prisma/schema.production.prisma prisma/schema.prisma

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with initial data
curl -X POST https://your-app.vercel.app/api/seed
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Go to your project > Settings > Environment Variables
```

## Default Accounts

Setelah seeding database, akun default yang tersedia:

### Admin Account
- Email: `admin@ctf.com`
- Username: `admin`
- Password: `admin123`
- Role: `ADMIN`

### Test User Account
- Email: `user@ctf.com`
- Username: `user`
- Password: `user123`
- Role: `USER`

## Features

### Challenges
- 6 sample challenges dengan berbagai kategori
- MISC, CRYPTO, WEB, FORENSICS, REVERSE, PWN
- Difficulty: EASY, MEDIUM, HARD
- Points: 10-150

### Admin Panel
- Create/Edit/Delete challenges
- View leaderboard
- Manage users

### User Features
- Submit flags
- View profile
- Leaderboard
- Activity feed

## Security Notes

1. **Change default passwords** setelah deployment
2. **Use strong NEXTAUTH_SECRET** (minimal 32 karakter)
3. **Enable HTTPS** di production
4. **Regular database backups**
5. **Monitor logs** untuk aktivitas mencurigakan

## Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install

# Regenerate Prisma client
npx prisma generate
```

### Database Connection Issues
1. Check DATABASE_URL format
2. Verify database is accessible
3. Check firewall settings
4. Test connection dengan `npx prisma db push`

### Authentication Issues
1. Verify NEXTAUTH_URL matches domain
2. Check NEXTAUTH_SECRET is set
3. Clear browser cookies
4. Check server logs
