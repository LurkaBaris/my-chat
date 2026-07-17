import 'server-only'

import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import { prisma } from '@/shared/db/index.server'

import { authConfig } from './auth.config'

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
})
