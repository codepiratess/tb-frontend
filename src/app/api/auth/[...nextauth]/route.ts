import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      try {
        // Send Google user to our NestJS backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account?.providerAccountId,
            }),
          }
        )
        const result = await response.json()
        if (result.success && result.data) {
          user.accessToken = result.data.accessToken
          user.role = result.data.user.role
          user.id = result.data.user.id
          return true
        }
        return false
      } catch (error) {
        console.error('Google Sign In Error:', error)
        return false
      }
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.accessToken = token.accessToken
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
