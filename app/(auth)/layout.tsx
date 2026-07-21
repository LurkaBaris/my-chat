import { redirect } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { auth } from '@/shared/lib/index.server'

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth()

  if (session?.user) {
    redirect('/')
  }

  return children
}
