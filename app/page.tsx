import { redirect } from 'next/navigation'

import { HomePage } from '@/_pages/home'
import { auth } from '@/shared/lib/index.server'

export default async function HomeRoute() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return <HomePage />
}
