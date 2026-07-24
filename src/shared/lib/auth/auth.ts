import 'server-only';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { prisma } from '@/shared/db/index.server';
import { baseAuthConfig } from './auth.config';
import { credentialsSchema } from './credentialsSchema';

const authConfigWithProvider = {
  ...baseAuthConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const result = credentialsSchema.safeParse(credentials);
        if (!result.success) return null;

        const { email, password } = result.data;
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, passwordHash: true },
        });
        if (!user) return null;

        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authConfigWithProvider);
