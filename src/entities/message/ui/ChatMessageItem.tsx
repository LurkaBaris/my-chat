import clsx from 'clsx';

import { formatChatDate } from '@/shared/lib';

import { Flex } from 'antd';
import type { MessageWithSender } from '../model/types';
import styles from './ChatMessageItem.module.css';

interface ChatMessageItemProps {
  currentUserId: string;
  message: MessageWithSender;
}

export const ChatMessageItem = ({ currentUserId, message }: ChatMessageItemProps) => {
  const isOwn = message.senderId === currentUserId;
  const author = isOwn ? 'Вы' : message.sender.name?.trim() || message.sender.email;

  return (
    <div className={clsx(styles.message, isOwn ? styles.outgoingMessage : styles.incomingMessage)}>
      <Flex gap="medium" align="center" justify="space-between" className={styles.top}>
        <span className={styles.author}>{author}</span>
        <time className={styles.time} dateTime={message.createdAt.toISOString()}>
          {formatChatDate(message.createdAt, 'message')}
        </time>
      </Flex>

      <p className={styles.text}>{message.body}</p>
    </div>
  );
};
