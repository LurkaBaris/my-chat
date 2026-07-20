import type { Metadata } from 'next'

import { LoginPage } from '@/_pages/login'

export const metadata: Metadata = {
  title: 'Вход | My Chat',
  description: 'Войдите в аккаунт My Chat',
}

export default function LoginRoute() {
  return <LoginPage />
}
