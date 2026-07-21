export interface MessagePreview {
  id: string
  title: string
  lastMessage: string
  time: string
}

export interface ChatMessage {
  id: string
  author: string
  text: string
  own: boolean
}
