import 'server-only'

import { prisma } from '@/shared/db/index.server'

import type { MessageWithSender } from '../model/types'

export const getMessages = async (
  conversationId: string,
  currentUserId: string,
): Promise<MessageWithSender[] | null> => {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: currentUserId,
      },
    },
    select: { id: true },
  })

  if (!participant) return null

  const messages = await prisma.message.findMany({
    where: { conversationId },
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
  })

  return messages
}
