import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LoginPage } from '@/_pages/login'
import { auth } from '@/shared/lib/index.server'

export const metadata: Metadata = {
  title: 'Вход | My Chat',
  description: 'Войдите в аккаунт My Chat',
}

export default async function LoginRoute() {
  const session = await auth()

  if (session?.user) {
    redirect('/')
  }

  return <LoginPage />
}
