export type StartConversationResult =
  | {
      success: true
      conversationId: string
    }
  | {
      success: false
      message: string
    }
