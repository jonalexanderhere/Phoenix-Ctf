import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // Remove adapter for now to use JWT only
  // adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
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
          console.log('Attempting login for:', credentials.email)
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }

          console.log('User found:', user.email, 'Role:', user.role)

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          console.log('Password valid for user:', credentials.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role,
            score: user.score || 0,
          }
        } catch (error) {
          console.error('Auth error:', error)
          
          // Handle specific Prisma errors
          if (error instanceof Error && error.message.includes('connection')) {
            console.error('Database connection error during authentication')
          }
          
          // Log the full error for debugging
          console.error('Full error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : 'Unknown'
          })
          
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day (shorter for development)
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - user:', user ? 'present' : 'null', 'token:', token ? 'present' : 'null')
      if (user) {
        token.role = user.role
        token.username = user.username
        token.score = user.score
        console.log('JWT token updated with user data:', { role: user.role, username: user.username, score: user.score })
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token ? 'present' : 'null', 'session.user:', session.user ? 'present' : 'null')
      if (token && session?.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.username = token.username as string
        session.user.score = token.score as number
        console.log('Session updated with token data:', { id: session.user.id, role: session.user.role, username: session.user.username, score: session.user.score })
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
  debug: false, // Disabled to reduce error messages
}