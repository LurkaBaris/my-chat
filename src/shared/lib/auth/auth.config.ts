import { prisma } from '@/shared/db/prisma'
import { compare } from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { credentialsSchema } from './credentialsSchema'

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const result = credentialsSchema.safeParse(credentials)

        if (!result.success) return null
        const { email, password } = result.data

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
          },
        })

        if (!user) return null

        const isPasswordValid = await compare(password, user.passwordHash)

        if (!isPasswordValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id
      }
      return session
    },
  },
} satisfies NextAuthConfig
