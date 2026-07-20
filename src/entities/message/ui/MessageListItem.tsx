import { Avatar, Flex } from 'antd'
import clsx from 'clsx'

import type { MessagePreview } from '../model/types'
import styles from './MessageListItem.module.css'

interface MessageListItemProps {
  isActive: boolean
  message: MessagePreview
}

export const MessageListItem = ({ isActive, message }: MessageListItemProps) => {
  return (
    <button className={clsx(styles.item, isActive && styles.active)} type="button">
      <Avatar className={styles.avatar} size={44}>
        {message.title[0]}
      </Avatar>

      <Flex className={styles.preview} vertical>
        <Flex align="center" className={styles.info}>
          <span className={styles.name}>{message.title}</span>
          <time className={styles.time}>{message.time}</time>
        </Flex>

        <span className={styles.lastMessage}>{message.lastMessage}</span>
      </Flex>
    </button>
  )
}
