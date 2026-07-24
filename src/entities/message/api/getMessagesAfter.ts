import 'server-only';

import { prisma } from '@/shared/db/index.server';

import type { MessageWithSender } from '../model/types';

export const getMessagesAfter = async (
  conversationId: string,
  lastMessageId: string | null,
): Promise<MessageWithSender[]> => {
  const lastMessage = lastMessageId
    ? await prisma.message.findFirst({
        where: {
          id: lastMessageId,
          conversationId,
        },
        select: {
          id: true,
          createdAt: true,
        },
      })
    : null;

  return prisma.message.findMany({
    where: {
      conversationId,
      ...(lastMessage && {
        OR: [
          {
            createdAt: {
              gt: lastMessage.createdAt,
            },
          },
          {
            createdAt: lastMessage.createdAt,
            id: {
              gt: lastMessage.id,
            },
          },
        ],
      }),
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  });
};
