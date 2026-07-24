import type { MessageWithSender } from '@/entities/message'

export type SendMessageResult =
  | {
      success: true
      message: MessageWithSender
    }
  | {
      success: false
      message: string
    }
