import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { isAuthUser } from '@/shared/lib';
import { auth } from '@/shared/lib/index.server';

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth();

  if (isAuthUser(session?.user)) {
    redirect('/chat');
  }

  return children;
}
