import styles from './ChatPage.module.css';

export const ChatEmptyState = () => {
  return (
    <section className={styles.emptyState}>
      <p className={styles.emptyStateText}>Выберите чат</p>
    </section>
  );
};
