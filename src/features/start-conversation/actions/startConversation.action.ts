'use server'

import { prisma } from '@/shared/db/index.server'
import { isAuthUser } from '@/shared/lib'
import { auth } from '@/shared/lib/index.server'
import { Prisma } from '@prisma/client'
import { createDirectConversationKey } from '../lib/createDirectConversationKey'
import { startConversationSchema } from '../model/startConversationSchema'
import type { DirectConversationResult, StartConversationResult } from '../model/types'

const START_CONVERSATION_ERROR_MESSAGE = 'Не удалось создать чат'

async function findExistingDirectConversation(
  database: Pick<Prisma.TransactionClient, 'conversation'>,
  directKey: string,
): Promise<DirectConversationResult | null> {
  const conversation = await database.conversation.findUnique({
    where: { directKey },
    select: { id: true },
  })

  if (!conversation) {
    return null
  }

  return {
    conversationId: conversation.id,
  }
}

async function findOrCreateDirectConversation(
  currentUserId: string,
  otherUserId: string,
): Promise<DirectConversationResult> {
  const participantIds = [currentUserId, otherUserId]
  const directKey = createDirectConversationKey(currentUserId, otherUserId)

  try {
    return await prisma.$transaction(async (transaction) => {
      const existingConversation = await findExistingDirectConversation(transaction, directKey)

      if (existingConversation) {
        return existingConversation
      }

      const conversation = await transaction.conversation.create({
        data: {
          type: 'DIRECT',
          directKey,
          participants: {
            create: participantIds.map((userId) => ({ userId })),
          },
        },
        select: { id: true },
      })

      return {
        conversationId: conversation.id,
      }
    })
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
      throw error
    }

    const existingConversation = await findExistingDirectConversation(prisma, directKey)

    if (!existingConversation) {
      throw error
    }

    return existingConversation
  }
}

export async function startConversationByEmail(data: unknown): Promise<StartConversationResult> {
  const session = await auth()

  if (!isAuthUser(session?.user)) {
    return { success: false, message: 'Необходимо войти в аккаунт' }
  }

  const formResult = startConversationSchema.safeParse(data)

  if (!formResult.success) {
    return {
      success: false,
      message: formResult.error.issues[0]?.message ?? 'Некорректный email',
    }
  }

  try {
    const otherUser = await prisma.user.findUnique({
      where: { email: formResult.data.email },
      select: { id: true, email: true, name: true },
    })

    if (!otherUser) {
      return {
        success: false,
        message: START_CONVERSATION_ERROR_MESSAGE,
      }
    }

    if (session.user.id === otherUser.id) {
      return { success: false, message: START_CONVERSATION_ERROR_MESSAGE }
    }

    const conversation = await findOrCreateDirectConversation(session.user.id, otherUser.id)

    return { success: true, conversationId: conversation.conversationId }
  } catch {
    return {
      success: false,
      message: START_CONVERSATION_ERROR_MESSAGE,
    }
  }
}
