import { HomePage } from '@/_pages/home'
import { LogoutButton } from '@/features/logout/index.server'
import { auth } from '@/shared/lib/index.server'
import { redirect } from 'next/navigation'

export default async function HomeRoute() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return <HomePage actions={<LogoutButton iconOnly />} />
}
