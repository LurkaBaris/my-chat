import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const authConfig = {
  providers: [
    Credentials({
      authorize() {
        return null
      },
    }),
  ],
} satisfies NextAuthConfig

export default authConfig
