'use client'

import { Avatar, Button, Flex, Tooltip } from 'antd'
import TextArea from 'antd/es/input/TextArea.js'
import { Paperclip } from 'lucide-react'

import { ChatMessageItem, type ChatMessage, type MessagePreview } from '@/entities/message'

import styles from './ChatMessagesWidget.module.css'

interface ChatMessagesWidgetProps {
  chat: MessagePreview
  messages: ChatMessage[]
}

export const ChatMessagesWidget = ({ chat, messages }: ChatMessagesWidgetProps) => {
  return (
    <section className={styles.chatPanel}>
      <header className={styles.chatHeader}>
        <Avatar className={styles.avatar}>{chat.title[0]}</Avatar>

        <Flex className={styles.chatInfo} vertical>
          <h2 className={styles.chatTitle} id="active-chat-title">
            {chat.title}
          </h2>
          <span className={styles.chatStatus}>Онлайн</span>
        </Flex>
      </header>

      <div className={styles.messages}>
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </div>

      <form className={styles.composer}>
        <Tooltip title="Прикрепить файл">
          <Button
            className={styles.attachButton}
            color="default"
            htmlType="button"
            icon={<Paperclip aria-hidden size={20} strokeWidth={1.8} />}
            shape="circle"
            type="text"
          />
        </Tooltip>

        <label className={styles.visuallyHidden} htmlFor="chat-message">
          Сообщение
        </label>
        <TextArea
          autoSize={{ minRows: 1, maxRows: 3 }}
          className={styles.textarea}
          id="chat-message"
          placeholder="Напишите сообщение..."
        />

        <Button className={styles.sendButton} htmlType="submit" type="primary">
          Отправить
        </Button>
      </form>
    </section>
  )
}
