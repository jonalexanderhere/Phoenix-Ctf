import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@next-auth/prisma-adapter' // Disabled for now
// import { prisma } from './prisma' // Disabled for now
// import bcrypt from 'bcryptjs' // Disabled for now

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Disabled for now to avoid database errors
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Temporary mock authentication for deployment
          // TODO: Re-enable database authentication after database setup
          if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
            return {
              id: '1',
              email: 'admin@example.com',
              name: 'Admin User',
              username: 'admin',
              role: 'ADMIN',
              score: 1000,
            }
          }

          if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
            return {
              id: '2',
              email: 'user@example.com',
              name: 'Test User',
              username: 'user',
              role: 'USER',
              score: 500,
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
        token.score = user.score
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.username = token.username as string
        session.user.score = token.score as number
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Prevents redirect loops
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
}