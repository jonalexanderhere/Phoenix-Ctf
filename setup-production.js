#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Phoenix CTF for Production...\n');

// Check if .env.production exists
if (!fs.existsSync('.env.production')) {
  console.log('❌ .env.production not found!');
  console.log('📝 Please create .env.production with your database credentials');
  console.log('📋 Use env.production.template as reference\n');
  process.exit(1);
}

try {
  // Step 1: Copy production schema
  console.log('1️⃣ Copying production schema...');
  if (fs.existsSync('prisma/schema.production.prisma')) {
    fs.copyFileSync('prisma/schema.production.prisma', 'prisma/schema.prisma');
    console.log('✅ Production schema copied\n');
  } else {
    console.log('❌ prisma/schema.production.prisma not found\n');
    process.exit(1);
  }

  // Step 2: Generate Prisma client
  console.log('2️⃣ Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  // Step 3: Test build
  console.log('3️⃣ Testing build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');

  // Step 4: Instructions
  console.log('🎉 Production setup complete!\n');
  console.log('📋 Next steps:');
  console.log('1. Set up your PostgreSQL database');
  console.log('2. Update .env.production with your DATABASE_URL');
  console.log('3. Run: npx prisma db push');
  console.log('4. Deploy to Vercel: vercel --prod');
  console.log('5. Seed database: POST to /api/seed\n');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
