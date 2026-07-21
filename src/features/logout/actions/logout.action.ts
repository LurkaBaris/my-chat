'use server'

import { signOut } from '@/shared/lib/index.server'

export async function logout() {
  await signOut({ redirectTo: '/login' })
}
