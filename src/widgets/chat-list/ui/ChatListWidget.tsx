'use client'

import {
  ConversationListItem,
  formatConversationTime,
  parseChatListEvent,
  type ConversationPreview,
} from '@/entities/conversation'
import { App, Flex } from 'antd'
import { useParams } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { ChatListEmptyState } from './ChatListEmptyState'
import styles from './ChatListWidget.module.css'

interface ChatListWidgetProps {
  children: ReactNode
  conversations: ConversationPreview[]
}

export const ChatListWidget = ({ children, conversations }: ChatListWidgetProps) => {
  const { conversationId } = useParams<{ conversationId?: string }>()
  const { notification } = App.useApp()
  const [liveConversations, setLiveConversations] = useState(conversations)

  useEffect(() => {
    const eventSource = new EventSource('/api/chat/stream')

    eventSource.onmessage = (event) => {
      const chatListEvent = parseChatListEvent(event.data)

      if (!chatListEvent) {
        notification.error({
          title: 'Не удалось обновить список чатов',
          description: 'Не удалось обработать новое событие. Обновите страницу.',
          key: 'realtime-chat-list-error',
          placement: 'topRight',
        })
        return
      }

      setLiveConversations((currentConversations) => {
        if (chatListEvent.type === 'conversation.created') {
          return [
            chatListEvent.conversation,
            ...currentConversations.filter(
              (conversation) => conversation.id !== chatListEvent.conversation.id,
            ),
          ]
        }

        const conversation = currentConversations.find(
          (conversation) => conversation.id === chatListEvent.message.conversationId,
        )

        if (!conversation || conversation.lastMessage?.id === chatListEvent.message.id) {
          return currentConversations
        }

        return [
          {
            ...conversation,
            lastMessage: chatListEvent.message,
            time: formatConversationTime(chatListEvent.message.createdAt),
          },
          ...currentConversations.filter(
            (currentConversation) => currentConversation.id !== conversation.id,
          ),
        ]
      })
    }

    return () => eventSource.close()
  }, [notification])

  return (
    <aside className={styles.sidebar} id="chat-list-panel">
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <p className={styles.subtitle}>Последние диалоги</p>
      </header>

      <nav className={styles.content}>
        {liveConversations.length === 0 ? (
          <ChatListEmptyState />
        ) : (
          <Flex className={styles.chatList} vertical>
            {liveConversations.map((conversation) => {
              return (
                <ConversationListItem
                  conversation={conversation}
                  isActive={conversation.id === conversationId}
                  key={conversation.id}
                />
              )
            })}
          </Flex>
        )}
      </nav>

      <footer className={styles.actions}>{children}</footer>
    </aside>
  )
}
