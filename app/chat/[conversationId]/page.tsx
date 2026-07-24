import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { getConversationPreview } from '@/entities/conversation/index.server';
import { getMessages } from '@/entities/message/index.server';
import { isAuthUser } from '@/shared/lib';
import { auth } from '@/shared/lib/index.server';
import { ChatMessagesWidget } from '@/widgets/chat-messages';

interface ConversationRouteProps {
  params: Promise<{ conversationId: string }>;
}

export const metadata: Metadata = {
  title: 'Чат | My Chat',
  description: 'Переписка в My Chat',
};

export default async function ConversationRoute({ params }: ConversationRouteProps) {
  const session = await auth();

  if (!isAuthUser(session?.user)) {
    redirect('/login');
  }

  const { conversationId } = await params;
  const currentUserId = session.user.id;
  const [conversation, messages] = await Promise.all([
    getConversationPreview(conversationId, currentUserId),
    getMessages(conversationId, currentUserId),
  ]);

  if (!conversation || !messages) {
    notFound();
  }

  return (
    <ChatMessagesWidget
      conversation={conversation}
      currentUserId={currentUserId}
      messages={messages}
    />
  );
}
