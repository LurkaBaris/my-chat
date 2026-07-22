import clsx from 'clsx'

import type { MessageWithSender } from '../model/types'
import styles from './ChatMessageItem.module.css'

interface ChatMessageItemProps {
  currentUserId: string
  message: MessageWithSender
}

export const ChatMessageItem = ({ currentUserId, message }: ChatMessageItemProps) => {
  const isOwn = message.senderId === currentUserId
  const author = isOwn ? 'Вы' : message.sender.name?.trim() || message.sender.email

  return (
    <div className={clsx(styles.message, isOwn ? styles.outgoingMessage : styles.incomingMessage)}>
      <span className={styles.author}>{author}</span>
      <p className={styles.text}>{message.body}</p>
    </div>
  )
}
