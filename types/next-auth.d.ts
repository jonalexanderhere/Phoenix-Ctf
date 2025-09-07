// eslint-disable-next-line no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      username: string
      role: string
      score: number
    }
  }

  // eslint-disable-next-line no-unused-vars
  interface User {
    role: string
    username: string
    score: number
  }
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line no-unused-vars
  interface JWT {
    role: string
    username: string
    score: number
  }
}
