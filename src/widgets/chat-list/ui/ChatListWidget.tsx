'use client';

import {
  ConversationListItem,
  formatConversationTime,
  parseChatListEvent,
  type ConversationPreview,
} from '@/entities/conversation';
import { useAppNotification } from '@/shared/ui';
import { Flex } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { ChatListEmptyState } from './ChatListEmptyState';
import styles from './ChatListWidget.module.css';

interface ChatListWidgetProps {
  children: ReactNode;
  conversations: ConversationPreview[];
}

export const ChatListWidget = ({ children, conversations }: ChatListWidgetProps) => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const showNotification = useAppNotification();
  const [liveConversations, setLiveConversations] = useState(conversations);
  const latestConversation = conversations[0];
  const initialCursor =
    (latestConversation?.lastMessage?.createdAt ?? latestConversation?.createdAt)?.getTime() ?? 0;

  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/stream?since=${initialCursor}`);

    eventSource.onmessage = (event) => {
      const chatListEvent = parseChatListEvent(event.data);

      if (!chatListEvent) {
        showNotification({
          type: 'error',
          title: 'Не удалось обновить список чатов',
          description: 'Не удалось обработать новое событие. Обновите страницу.',
          key: 'realtime-chat-list-error',
        });
        return;
      }

      setLiveConversations((currentConversations) => {
        if (chatListEvent.type === 'conversation.created') {
          const currentConversation = currentConversations.find(
            (conversation) => conversation.id === chatListEvent.conversation.id,
          );
          const currentActivityAt =
            currentConversation?.lastMessage?.createdAt ?? currentConversation?.createdAt;
          const nextActivityAt =
            chatListEvent.conversation.lastMessage?.createdAt ??
            chatListEvent.conversation.createdAt;

          if (currentActivityAt && currentActivityAt > nextActivityAt) {
            return currentConversations;
          }

          return [
            chatListEvent.conversation,
            ...currentConversations.filter(
              (conversation) => conversation.id !== chatListEvent.conversation.id,
            ),
          ];
        }

        const conversation = currentConversations.find(
          (conversation) => conversation.id === chatListEvent.message.conversationId,
        );

        if (!conversation || conversation.lastMessage?.id === chatListEvent.message.id) {
          return currentConversations;
        }

        if (
          conversation.lastMessage &&
          conversation.lastMessage.createdAt > chatListEvent.message.createdAt
        ) {
          return currentConversations;
        }

        return [
          {
            ...conversation,
            lastMessage: chatListEvent.message,
            time: formatConversationTime(chatListEvent.message.createdAt),
          },
          ...currentConversations.filter(
            (currentConversation) => currentConversation.id !== conversation.id,
          ),
        ];
      });
    };

    let isCheckingAccess = false;
    let isClosed = false;

    eventSource.onerror = async () => {
      if (isCheckingAccess || isClosed) return;

      isCheckingAccess = true;

      try {
        const response = await fetch('/api/chat/stream?check=access', {
          cache: 'no-store',
        });

        if (isClosed || (response.status !== 401 && response.status !== 403)) return;

        eventSource.close();
        isClosed = true;

        showNotification({
          type: 'error',
          title: 'Обновление списка чатов остановлено',
          description: 'Сессия истекла. Войдите в аккаунт снова.',
          key: 'chat-list-stream-access-error',
        });
      } catch {
        showNotification({
          type: 'warning',
          title: 'Нет соединения с сервером',
          description: 'Список чатов обновится после восстановления соединения.',
          key: 'chat-list-stream-connection-warning',
        });
      } finally {
        isCheckingAccess = false;
      }
    };

    return () => {
      isClosed = true;
      eventSource.close();
    };
  }, [initialCursor, showNotification]);

  return (
    <aside className={styles.sidebar} id="chat-list-panel">
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <p className={styles.subtitle}>Последние диалоги</p>
      </header>

      <nav className={styles.content}>
        {liveConversations.length === 0 ? (
          <ChatListEmptyState />
        ) : (
          <Flex className={styles.chatList} vertical>
            {liveConversations.map((conversation) => {
              return (
                <ConversationListItem
                  conversation={conversation}
                  isActive={conversation.id === conversationId}
                  key={conversation.id}
                />
              );
            })}
          </Flex>
        )}
      </nav>

      <footer className={styles.actions}>{children}</footer>
    </aside>
  );
};
