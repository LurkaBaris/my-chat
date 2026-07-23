import type { Conversation as PrismaConversation } from '@prisma/client'

import type { MessageWithSender } from '@/entities/message'

export type Conversation = PrismaConversation

export interface ConversationPreview extends Conversation {
  displayTitle: string
  lastMessage: MessageWithSender | null
  time: string
}

export interface ConversationDetails extends Conversation {
  displayTitle: string
}
