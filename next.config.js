/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Vercel deployment
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // Image optimization for Vercel
  images: {
    domains: ['localhost', 'vercel.app', '*.vercel.app'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Environment variables
  env: {
    TZ: 'Asia/Jakarta',
  },
  
  // Headers for security (disabled for now to avoid deployment issues)
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //       ],
  //     },
  //   ]
  // },
  
  // Performance optimizations (simplified for deployment)
  poweredByHeader: false,
  compress: true,
  
  // Experimental features (disabled for stability)
  // experimental: {
  //   optimizePackageImports: ['@heroicons/react', 'react-hot-toast'],
  // },
}

module.exports = nextConfig