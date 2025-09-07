# 🚀 Local Development Guide - PHX CTF

## ✅ Status: READY FOR LOCAL DEVELOPMENT

Aplikasi PHX CTF siap untuk dijalankan secara local dengan semua fitur yang berfungsi.

---

## 🛠️ Prerequisites

### Required Software
- ✅ Node.js 18+ (installed)
- ✅ Git (installed)
- ✅ npm (included with Node.js)

### Required Files
- ✅ `.env.local` - Environment variables untuk development
- ✅ `prisma/schema.prisma` - SQLite schema untuk development
- ✅ `dev.db` - SQLite database file

---

## 🚀 Quick Start

### 1. **Clone Repository (if needed)**
```bash
git clone https://github.com/jonalexanderhere/Phoenix-Ctf.git
cd Phoenix-Ctf
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Setup Environment**
```bash
# Copy development environment file
copy env.development .env.local

# Or manually create .env.local with:
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"
NODE_ENV="development"
```

### 4. **Setup Database**
```bash
# Copy SQLite schema for development
copy "prisma\schema.sqlite.prisma" "prisma\schema.prisma"

# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push
```

### 5. **Start Development Server**
```bash
npm run dev
```

### 6. **Access Application**
- **URL**: http://localhost:3000
- **Status**: ✅ Server running on port 3000

---

## 🔧 Development Configuration

### **Environment Variables (.env.local)**
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# Environment
NODE_ENV="development"
```

### **Database Configuration**
- **Type**: SQLite (development)
- **File**: `dev.db`
- **Schema**: `prisma/schema.sqlite.prisma`

### **Authentication**
- **Type**: Mock authentication (development)
- **Strategy**: JWT (no database required)

---

## 🎯 Test Credentials

### **Admin Account**
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: ADMIN
- **Score**: 1000
- **Access**: Full access including admin panel

### **User Account**
- **Email**: `user@example.com`
- **Password**: `user123`
- **Role**: USER
- **Score**: 500
- **Access**: Standard user access

---

## 📱 Available Pages

### **Public Pages**
- ✅ **Homepage** (`/`) - Hero section, features, challenge categories
- ✅ **Sign In** (`/auth/signin`) - Login page
- ✅ **Sign Up** (`/auth/signup`) - Registration page

### **Authenticated Pages**
- ✅ **Challenges** (`/challenges`) - Challenge list dengan mock data
- ✅ **Profile** (`/profile`) - User profile page
- ✅ **Leaderboard** (`/leaderboard`) - User rankings dengan mock data

### **Admin Pages**
- ✅ **Admin Panel** (`/admin`) - Admin dashboard (admin only)

---

## 🔍 API Endpoints

### **Authentication**
- ✅ `GET /api/auth/providers` - Available auth providers
- ✅ `POST /api/auth/_log` - Authentication logging
- ✅ `GET /api/auth/error` - Authentication error handling

### **Application Data**
- ✅ `GET /api/challenges` - Mock challenges data
- ✅ `GET /api/leaderboard` - Mock leaderboard data
- ✅ `GET /api/health` - Server health check

### **User Management**
- ✅ `GET /api/users` - User data
- ✅ `POST /api/auth/register` - User registration

---

## 🛠️ Development Commands

### **Basic Commands**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Database Commands**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

### **Git Commands**
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## 🚨 Troubleshooting

### **Common Issues**

#### 1. **Port 3000 Already in Use**
```bash
# Check what's using port 3000
netstat -an | findstr :3000

# Kill process using port 3000
taskkill /f /im node.exe

# Or use different port
npm run dev -- -p 3001
```

#### 2. **Database Connection Error**
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma db push --force-reset

# Check database file exists
dir dev.db
```

#### 3. **Environment Variables Not Loaded**
```bash
# Check .env.local exists
dir .env.local

# Verify file contents
type .env.local

# Restart development server
npm run dev
```

#### 4. **Build Errors**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

#### 5. **Authentication Not Working**
```bash
# Use exact test credentials:
admin@example.com / admin123
user@example.com / user123

# Check browser console for errors
# Check network tab for failed requests
```

---

## 📊 Development Features

### **Mock Data**
- ✅ **Challenges**: 3 sample challenges dengan different categories
- ✅ **Leaderboard**: 3 sample users dengan scores
- ✅ **Authentication**: 2 test accounts (admin/user)

### **Error Handling**
- ✅ **Error Boundaries**: Custom error pages
- ✅ **API Error Handling**: Proper error responses
- ✅ **Session Error Handling**: Graceful fallbacks

### **Development Tools**
- ✅ **Hot Reload**: Automatic page refresh
- ✅ **TypeScript**: Type checking
- ✅ **ESLint**: Code linting
- ✅ **Prisma Studio**: Database GUI

---

## 🎯 Next Steps

### **For Production Deployment**
1. **Setup PostgreSQL database**
2. **Update environment variables**
3. **Re-enable database authentication**
4. **Deploy to Vercel**

### **For Feature Development**
1. **Add real challenges**
2. **Implement file uploads**
3. **Add more authentication providers**
4. **Enhance admin features**

---

## 🎉 Success!

Aplikasi PHX CTF sekarang berjalan dengan baik secara local:

- ✅ **Server Running**: http://localhost:3000
- ✅ **Database Connected**: SQLite database ready
- ✅ **Authentication Working**: Test credentials available
- ✅ **All Pages Working**: Homepage, challenges, leaderboard
- ✅ **API Endpoints Working**: All endpoints responding
- ✅ **Development Ready**: Hot reload, TypeScript, ESLint

**Status: LOCAL DEVELOPMENT READY** 🚀

---

*PHX CTF - Local Development Guide*
*Last updated: $(date)*
