import 'server-only'

import { prisma } from '@/shared/db/index.server'

import type { ConversationParticipant } from '../model/types'

export const getConversationParticipant = async (
  conversationId: string,
  userId: string,
): Promise<ConversationParticipant | null> => {
  return prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  })
}
