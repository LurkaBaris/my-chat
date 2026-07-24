import type { Session } from 'next-auth';

type SessionUser = Session['user'];

export interface AuthUser extends SessionUser {
  id: string;
}

export const isAuthUser = (user: Session['user'] | null | undefined): user is AuthUser => {
  return typeof user?.id === 'string' && user.id.length > 0;
};
