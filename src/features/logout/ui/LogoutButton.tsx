import { Button } from '@mantine/core'

import { logout } from '../actions/logout.action'

export const LogoutButton = () => {
  return (
    <form action={logout}>
      <Button type="submit" variant="light">
        Выйти из аккаунта
      </Button>
    </form>
  )
}
