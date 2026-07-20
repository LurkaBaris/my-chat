import type { ChatMessage, MessagePreview } from './types'

export const chats: MessagePreview[] = [
  {
    id: 'general',
    title: 'Общий чат',
    lastMessage: 'Кто сегодня играет?',
    time: '12:30',
  },
  {
    id: 'rating',
    title: 'Рейтинг',
    lastMessage: 'Апнул сегодня 200 MMR',
    time: '11:48',
  },
  {
    id: 'tournaments',
    title: 'Турниры',
    lastMessage: 'Финал начнётся вечером',
    time: '10:05',
  },
  {
    id: 'party',
    title: 'Пати',
    lastMessage: 'Нужен ещё один игрок на пятую позицию',
    time: '09:22',
  },
]

export const messages: ChatMessage[] = [
  {
    id: 'message-1',
    author: 'Invoker',
    text: 'Кто пойдёт сегодня в рейтинг?',
    own: false,
  },
  {
    id: 'message-2',
    author: 'Вы',
    text: 'Я буду через десять минут',
    own: true,
  },
]

export const activeChat = chats[0]
