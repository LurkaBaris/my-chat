import type { Conversation as PrismaConversation, Prisma } from '@prisma/client';

type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        id: true;
        email: true;
        name: true;
      };
    };
  };
}>;

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
