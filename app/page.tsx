import { HomePage } from '@/_pages/home'
import { LogoutButton } from '@/features/logout/index.server'
import { isAuthUser } from '@/shared/lib'
import { auth } from '@/shared/lib/index.server'
import { redirect } from 'next/navigation'

export default async function HomeRoute() {
  const session = await auth()

  if (!isAuthUser(session?.user)) {
    redirect('/login')
  }

  return (
    <HomePage
      authUser={{
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      }}

      actions={<LogoutButton iconOnly />}
    />
  )
}
