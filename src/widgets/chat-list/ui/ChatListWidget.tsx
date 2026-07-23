'use client'

import { Flex } from 'antd'
import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'

import { ConversationListItem, type ConversationPreview } from '@/entities/conversation'

import styles from './ChatListWidget.module.css'

interface ChatListWidgetProps {
  children: ReactNode
  conversations: ConversationPreview[]
}

export const ChatListWidget = ({ children, conversations }: ChatListWidgetProps) => {
  const { conversationId } = useParams<{ conversationId?: string }>()

  return (
    <aside className={styles.sidebar} id="chat-list-panel">
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <p className={styles.subtitle}>Последние диалоги</p>
      </header>

      <nav className={styles.content}>
        <Flex className={styles.chatList} vertical>
          {conversations.map((conversation) => {
            return (
              <ConversationListItem
                conversation={conversation}
                isActive={conversation.id === conversationId}
                key={conversation.id}
              />
            )
          })}
        </Flex>
      </nav>

      <footer className={styles.actions}>{children}</footer>
    </aside>
  )
}
