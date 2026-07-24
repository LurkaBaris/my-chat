import { Avatar, Flex } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';

import type { ConversationPreview } from '../model/types';
import styles from './ConversationListItem.module.css';

interface ConversationListItemProps {
  conversation: ConversationPreview;
  isActive: boolean;
  onSelect?: () => void;
}

export const ConversationListItem = ({
  conversation,
  isActive,
  onSelect,
}: ConversationListItemProps) => {
  const activityAt = conversation.lastMessage?.createdAt ?? conversation.createdAt;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={clsx(styles.item, isActive && styles.active)}
      href={`/chat/${conversation.id}`}
      onClick={onSelect}
    >
      <Avatar className={styles.avatar} size={44}>
        {conversation.displayTitle[0]}
      </Avatar>

      <Flex className={styles.preview} vertical>
        <Flex align="center" className={styles.info}>
          <span className={styles.name}>{conversation.displayTitle}</span>
          <time className={styles.time} dateTime={activityAt.toISOString()}>
            {conversation.time}
          </time>
        </Flex>

        <span className={styles.lastMessage}>
          {conversation.lastMessage?.body ?? 'Нет сообщений'}
        </span>
      </Flex>
    </Link>
  );
};
