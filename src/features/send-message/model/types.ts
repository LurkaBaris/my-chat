export type SendMessageResult =
  | {
      success: true
      messageId: string
    }
  | {
      success: false
      message: string
    }
