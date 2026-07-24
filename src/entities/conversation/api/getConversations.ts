import 'server-only';

import { prisma } from '@/shared/db/index.server';
import { formatConversationTime } from '../lib/formatConversationTime';
import { getConversationDisplayTitle } from '../lib/getConversationDisplayTitle';
import type { ConversationPreview } from '../model/types';

export const getConversations = async (currentUserId: string): Promise<ConversationPreview[]> => {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId: currentUserId },
      },
    },
    select: {
      id: true,
      type: true,
      title: true,
      createdAt: true,
      participants: {
        select: {
          userId: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        take: 1,
      },
    },
  });

  return conversations
    .sort((first, second) => {
      const firstActivityAt = first.messages[0]?.createdAt ?? first.createdAt;
      const secondActivityAt = second.messages[0]?.createdAt ?? second.createdAt;

      return secondActivityAt.getTime() - firstActivityAt.getTime();
    })
    .map((conversation) => {
      const lastMessage = conversation.messages[0] ?? null;

      return {
        id: conversation.id,
        type: conversation.type,
        title: conversation.title,
        createdAt: conversation.createdAt,
        displayTitle: getConversationDisplayTitle(conversation, currentUserId),
        lastMessage,
        time: formatConversationTime(lastMessage?.createdAt ?? conversation.createdAt),
      };
    });
};

export const getConversationPreview = async (
  conversationId: string,
  currentUserId: string,
): Promise<ConversationPreview | null> => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { userId: currentUserId },
      },
    },
    select: {
      id: true,
      type: true,
      title: true,
      createdAt: true,
      participants: {
        select: {
          userId: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        take: 1,
      },
    },
  });

  if (!conversation) return null;

  const lastMessage = conversation.messages[0] ?? null;

  return {
    id: conversation.id,
    type: conversation.type,
    title: conversation.title,
    createdAt: conversation.createdAt,
    displayTitle: getConversationDisplayTitle(conversation, currentUserId),
    lastMessage,
    time: formatConversationTime(lastMessage?.createdAt ?? conversation.createdAt),
  };
};
