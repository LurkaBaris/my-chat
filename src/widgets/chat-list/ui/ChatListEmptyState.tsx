import { MessagesSquare } from 'lucide-react';

import styles from './ChatListWidget.module.css';

export const ChatListEmptyState = () => {
  return (
    <section aria-labelledby="empty-chat-list-title" className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <div aria-hidden className={styles.emptyStateIcon}>
          <MessagesSquare size={25} strokeWidth={1.8} />
        </div>
        <h2 className={styles.emptyStateTitle} id="empty-chat-list-title">
          У вас пока нет чатов
        </h2>
        <p className={styles.emptyStateText}>
          Нажмите «Начать новый чат» и найдите пользователя по email
        </p>
      </div>
    </section>
  );
};
