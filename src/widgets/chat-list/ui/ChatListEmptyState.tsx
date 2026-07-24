import styles from './ChatListWidget.module.css'

export const ChatListEmptyState = () => {
  return (
    <section className={styles.emptyState}>
      <p className={styles.emptyStateText}>Начните диалог по email</p>
    </section>
  )
}
