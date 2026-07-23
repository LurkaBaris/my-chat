import { messageWithSenderSchema } from '../model/messageWithSenderSchema'
import type { MessageWithSender } from '../model/types'

export const parseMessageWithSender = (data: string): MessageWithSender | null => {
  try {
    return messageWithSenderSchema.parse(JSON.parse(data))
  } catch {
    return null
  }
}
