'use server'

import { getConversationParticipantUserIds } from '@/entities/conversation-participant/index.server'
import { publishChatListEventToUsers } from '@/entities/conversation/index.server'
import { publishToConversation } from '@/entities/message/index.server'
import { prisma } from '@/shared/db/index.server'
import { isAuthUser } from '@/shared/lib'
import { auth } from '@/shared/lib/index.server'
import { Prisma } from '@prisma/client'
import { sendMessageSchema } from '../model/sendMessageSchema'
import type { SendMessageResult } from '../model/types'

export async function sendMessage(
  conversationId: string,
  body: string,
): Promise<SendMessageResult> {
  const session = await auth()

  if (!isAuthUser(session?.user)) {
    return { success: false, message: 'Необходимо войти в аккаунт' }
  }

  const messageResult = sendMessageSchema.safeParse({ conversationId, body })

  if (!messageResult.success) {
    return {
      success: false,
      message: messageResult.error.issues[0]?.message ?? 'Некорректное сообщение',
    }
  }

  const data = messageResult.data

  try {
    const participantUserIds = await getConversationParticipantUserIds(data.conversationId)

    if (!participantUserIds.includes(session.user.id)) {
      return {
        success: false,
        message: 'Нет доступа к этой беседе',
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: session.user.id,
        body: data.body,
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
    })

    publishToConversation(message.conversationId, message)
    publishChatListEventToUsers(participantUserIds, {
      type: 'message.created',
      message,
    })

    return {
      success: true,
      message,
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return { success: false, message: 'Беседа больше недоступна' }
    }

    return { success: false, message: 'Не удалось отправить сообщение' }
  }
}
