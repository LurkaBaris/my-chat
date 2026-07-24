import type { NextAuthConfig } from 'next-auth';

export const baseAuthConfig: Omit<NextAuthConfig, 'providers'> = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
