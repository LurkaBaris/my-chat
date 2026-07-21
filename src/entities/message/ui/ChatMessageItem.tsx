import clsx from 'clsx'

import type { ChatMessage } from '../model/types'
import styles from './ChatMessageItem.module.css'

interface ChatMessageItemProps {
  message: ChatMessage
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  return (
    <div
      className={clsx(
        styles.message,
        message.own ? styles.outgoingMessage : styles.incomingMessage,
      )}
    >
      <span className={styles.author}>{message.author}</span>
      <p className={styles.text}>{message.text}</p>
    </div>
  )
}
