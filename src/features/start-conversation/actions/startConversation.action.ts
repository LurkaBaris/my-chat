'use server'

import { prisma } from '@/shared/db/index.server'
import { isAuthUser } from '@/shared/lib'
import { auth } from '@/shared/lib/index.server'
import { Prisma } from '@prisma/client'
import { refresh } from 'next/cache'
import { startConversationSchema } from '../model/startConversationSchema'
import type { StartConversationResult } from '../model/types'

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
        message: 'Не удалось найти пользователя с таким email',
      }
    }

    if (session.user.id === otherUser.id) {
      return { success: false, message: 'Нельзя создать чат с самим собой' }
    }

    const participantIds = [session.user.id, otherUser.id]
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { participants: { some: { userId: session.user.id } } },
          { participants: { some: { userId: otherUser.id } } },
          { participants: { every: { userId: { in: participantIds } } } },
        ],
      },
      select: { id: true },
    })

    if (existingConversation) {
      return { success: true, conversationId: existingConversation.id }
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: participantIds.map((userId) => ({ userId })),
        },
      },
      select: { id: true },
    })

    refresh()

    return { success: true, conversationId: conversation.id }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        message: 'Ошибка базы данных при создании чата',
      }
    }

    return {
      success: false,
      message: 'Не удалось создать чат',
    }
  }
}
