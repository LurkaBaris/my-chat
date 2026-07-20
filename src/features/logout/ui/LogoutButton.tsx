import { Button } from 'antd'

import { logout } from '../actions/logout.action'

export const LogoutButton = () => {
  return (
    <form action={logout}>
      <Button htmlType="submit" type="default">
        Выйти из аккаунта
      </Button>
    </form>
  )
}
