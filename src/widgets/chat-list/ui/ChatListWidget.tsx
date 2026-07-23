import { Flex } from 'antd'
import type { ReactNode } from 'react'

import { MessageListItem, type MessagePreview } from '@/entities/message'

import styles from './ChatListWidget.module.css'

interface ChatListWidgetProps {
  activeChatId: string
  chats: MessagePreview[]
  children: ReactNode
}

export const ChatListWidget = ({ activeChatId, chats, children }: ChatListWidgetProps) => {
  return (
    <aside className={styles.sidebar} id="chat-list-panel">
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <p className={styles.subtitle}>Последние диалоги</p>
      </header>

      <nav className={styles.content}>
        <Flex className={styles.chatList} vertical>
          {chats.map((chat) => {
            return (
              <MessageListItem isActive={chat.id === activeChatId} key={chat.id} message={chat} />
            )
          })}
        </Flex>
      </nav>

      <footer className={styles.actions}>{children}</footer>
    </aside>
  )
}
