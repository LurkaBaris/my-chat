import 'server-only'

import { prisma } from '@/shared/db/index.server'

export const getConversationParticipantUserIds = async (
  conversationId: string,
): Promise<string[]> => {
  const participants = await prisma.conversationParticipant.findMany({
    where: {
      conversationId,
    },
    select: {
      userId: true,
    },
  })

  return participants.map((participant) => participant.userId)
}
