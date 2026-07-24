import styles from './ChatLoading.module.css';

export const ChatLoading = () => {
  return (
    <section
      aria-busy="true"
      aria-labelledby="conversation-loading-title"
      className={styles.chatPanel}
    >
      <h2 className={styles.visuallyHidden} id="conversation-loading-title">
        Загружаем беседу
      </h2>

      <header aria-hidden className={styles.chatHeader}>
        <div className={styles.avatar} />
        <div className={styles.title} />
      </header>

      <div aria-hidden className={styles.messagesArea}>
        <div className={styles.message} />
        <div className={`${styles.message} ${styles.messageShort} ${styles.messageOwn}`} />
        <div className={`${styles.message} ${styles.messageShort}`} />
      </div>

      <div aria-hidden className={styles.composerArea}>
        <div className={styles.composer} />
        <div className={styles.sendButton} />
      </div>
    </section>
  );
};
