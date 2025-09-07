@echo off
echo Setting up Production Database...
echo.

echo 1. Copy production schema...
copy prisma\schema.production.prisma prisma\schema.prisma

echo 2. Generate Prisma client...
npx prisma generate

echo 3. Push database schema...
npx prisma db push

echo 4. Seed database with real data...
echo POST to /api/seed to initialize data

echo.
echo Production database setup complete!
echo Make sure to set DATABASE_URL and DIRECT_URL in your environment variables.
pause
