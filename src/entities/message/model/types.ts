import type { Message as PrismaMessage, User } from '@prisma/client'

export type Message = PrismaMessage

export interface MessageWithSender extends Message {
  sender: Pick<User, 'id' | 'email' | 'name'>
}

// TODO: нужен для того, чтобы во время передастся как string
export type SerializedMessageWithSender = Omit<MessageWithSender, 'createdAt'> & {
  createdAt: string
}
