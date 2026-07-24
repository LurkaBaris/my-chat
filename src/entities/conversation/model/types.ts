import type { Conversation as PrismaConversation } from '@prisma/client';

import type { MessageWithSender } from '@/entities/message';

export type Conversation = PrismaConversation;

type PublicConversation = Omit<Conversation, 'directKey'>;

export interface ConversationPreview extends PublicConversation {
  displayTitle: string;
  lastMessage: MessageWithSender | null;
  time: string;
}

export interface ConversationDetails extends PublicConversation {
  displayTitle: string;
}

export type ChatListEvent =
  | {
      type: 'message.created';
      message: MessageWithSender;
    }
  | {
      type: 'conversation.created';
      conversation: ConversationPreview;
    };
