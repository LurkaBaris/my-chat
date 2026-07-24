import { Button } from 'antd';
import { LogOut } from 'lucide-react';

import { logout } from '../actions/logout.action';

interface LogoutButtonProps {
  iconOnly?: boolean;
}

export const LogoutButton = ({ iconOnly = false }: LogoutButtonProps) => {
  return (
    <form action={logout}>
      <Button
        htmlType="submit"
        icon={iconOnly ? <LogOut aria-hidden size={18} strokeWidth={1.8} /> : undefined}
        shape={iconOnly ? 'circle' : 'default'}
        type={iconOnly ? 'text' : 'default'}
      >
        {iconOnly ? null : 'Выйти из аккаунта'}
      </Button>
    </form>
  );
};
