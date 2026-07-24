import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';

import { ChatPage } from '@/_pages/chat';
import { getConversations } from '@/entities/conversation/index.server';
import { LogoutButton } from '@/features/logout/index.server';
import { isAuthUser } from '@/shared/lib';
import { auth } from '@/shared/lib/index.server';

export default async function ChatLayout({ children }: PropsWithChildren) {
  const session = await auth();

  if (!isAuthUser(session?.user)) {
    redirect('/login');
  }

  const conversations = await getConversations(session.user.id);

  return (
    <ChatPage
      actions={<LogoutButton iconOnly />}
      authUser={{
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      }}
      conversations={conversations}
    >
      {children}
    </ChatPage>
  );
}
