import type { Conversation } from '../model/types';

interface ConversationTitleData {
  type: Conversation['type'];
  title: Conversation['title'];
  participants: Array<{
    userId: string;
    user: {
      email: string;
      name: string | null;
    };
  }>;
}

export const getConversationDisplayTitle = (
  conversation: ConversationTitleData,
  currentUserId: string,
) => {
  if (conversation.type === 'GROUP') {
    return conversation.title ?? 'Групповой чат';
  }

  const otherUser = conversation.participants.find(
    (participant) => participant.userId !== currentUserId,
  )?.user;

  return otherUser?.name?.trim() || otherUser?.email || 'Пользователь';
};
