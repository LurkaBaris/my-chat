'use client'

import type { ConversationDetails } from '@/entities/conversation'
import { ChatMessageItem, type MessageWithSender } from '@/entities/message'
import { MessageComposer } from '@/features/send-message'
import { Avatar, Flex } from 'antd'
import { useEffect, useRef } from 'react'
import styles from './ChatMessagesWidget.module.css'

interface ChatMessagesWidgetProps {
  conversation: ConversationDetails
  currentUserId: string
  messages: MessageWithSender[]
}

export const ChatMessagesWidget = ({
  conversation,
  currentUserId,
  messages,
}: ChatMessagesWidgetProps) => {
  const messagesRef = useRef<HTMLDivElement>(null)
  const latestMessageId = messages[messages.length - 1]?.id

  useEffect(() => {
    const messagesContainer = messagesRef.current

    if (!messagesContainer) return

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth',
    })
  }, [conversation.id, latestMessageId])

  return (
    <section className={styles.chatPanel}>
      <header className={styles.chatHeader}>
        <Avatar className={styles.avatar}>{conversation.displayTitle[0]}</Avatar>

        <Flex className={styles.chatInfo} vertical>
          <h2 className={styles.chatTitle} id="active-chat-title">
            {conversation.displayTitle}
          </h2>
          <span className={styles.chatStatus}>Онлайн</span>
        </Flex>
      </header>

      <div className={styles.messages} ref={messagesRef}>
        {messages.map((message) => (
          <ChatMessageItem currentUserId={currentUserId} key={message.id} message={message} />
        ))}
      </div>

      <MessageComposer conversationId={conversation.id} />
    </section>
  )
}
