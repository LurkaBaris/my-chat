import type { Metadata } from 'next'

import { RegisterPage } from '@/_pages/register'

export const metadata: Metadata = {
  title: 'Регистрация | My Chat',
  description: 'Создайте аккаунт в My Chat',
}

export default function RegisterRoute() {
  return <RegisterPage />
}
