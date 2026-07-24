import styles from './ChatPage.module.css';

export const ChatEmptyState = () => {
  return (
    <section aria-labelledby="empty-chat-title" className={styles.emptyState}>
      <div className={styles.emptyStateContent}>
        <h1 className={styles.emptyStateTitle} id="empty-chat-title">
          Выберите беседу
        </h1>
        <p className={styles.emptyStateText}>Откройте чат слева или начните новый диалог</p>
      </div>
    </section>
  );
};
