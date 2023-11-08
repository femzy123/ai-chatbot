import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental // will be removed in future
} = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      authorize: async (
        credentials: Partial<Record<string, unknown>>,
        request: Request
      ) => {
        const { id, email, name, picture } = credentials as {
          id: string
          email: string
          name: string
          picture: string
        }
        if (id && email && name && picture) {
          const user = {
            id,
            email,
            name,
            image: picture
          }
          return user || null
        }
        return null
      }
    }),
    GitHub
  ],
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.avatar_url || profile.picture
      }
      return token
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  },
  secret: process.env.NEXTAUTH_SECRET
})
