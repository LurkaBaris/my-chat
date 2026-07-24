'use client';

import type { ConversationDetails } from '@/entities/conversation';
import {
  ChatMessageItem,
  parseMessageWithSender,
  type MessageWithSender,
} from '@/entities/message';
import { MessageComposer } from '@/features/send-message';
import { useAppNotification } from '@/shared/ui';
import { Avatar, Button, Flex } from 'antd';
import { ArrowDown, MessageCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ChatMessagesWidget.module.css';

const BOTTOM_THRESHOLD = 80;

interface ChatMessagesWidgetProps {
  conversation: ConversationDetails;
  currentUserId: string;
  messages: MessageWithSender[];
}

export const ChatMessagesWidget = ({
  conversation,
  currentUserId,
  messages,
}: ChatMessagesWidgetProps) => {
  const messagesRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const isInitialScrollRef = useRef(true);
  const showNotification = useAppNotification();
  const [liveMessages, setLiveMessages] = useState(messages);
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
  const initialLastMessageId = messages[messages.length - 1]?.id;
  const latestMessageId = liveMessages[liveMessages.length - 1]?.id;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const messagesContainer = messagesRef.current;

    if (!messagesContainer) return;

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior,
    });
  }, []);

  const handleMessagesScroll = () => {
    const messagesContainer = messagesRef.current;

    if (!messagesContainer) return;

    const distanceToBottom =
      messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight;
    const isNearBottom = distanceToBottom <= BOTTOM_THRESHOLD;

    isNearBottomRef.current = isNearBottom;

    if (isNearBottom) {
      setIsScrollButtonVisible(false);
    }
  };

  const handleScrollToBottom = () => {
    isNearBottomRef.current = true;
    setIsScrollButtonVisible(false);
    scrollToBottom();
  };

  const addMessage = useCallback((message: MessageWithSender) => {
    setLiveMessages((currentMessages) => {
      const messageAlreadyExists = currentMessages.some(
        (currentMessage) => currentMessage.id === message.id,
      );

      if (messageAlreadyExists) {
        return currentMessages;
      }

      return [...currentMessages, message].sort((firstMessage, secondMessage) => {
        return (
          firstMessage.createdAt.getTime() - secondMessage.createdAt.getTime() ||
          firstMessage.id.localeCompare(secondMessage.id)
        );
      });
    });
  }, []);

  useEffect(() => {
    const streamUrl = `/api/chat/${conversation.id}/stream`;
    const eventSourceUrl = initialLastMessageId
      ? `${streamUrl}?lastMessageId=${encodeURIComponent(initialLastMessageId)}`
      : streamUrl;
    const eventSource = new EventSource(eventSourceUrl);
    let isCheckingAccess = false;
    let isClosed = false;

    eventSource.onmessage = (event) => {
      const message = parseMessageWithSender(event.data);

      if (!message) {
        showNotification({
          type: 'error',
          title: 'Не удалось обновить чат',
          description: 'Не удалось обработать новое сообщение. Обновите страницу.',
          key: 'realtime-message-error',
        });
        return;
      }

      addMessage(message);
    };

    eventSource.onerror = async () => {
      if (isCheckingAccess || isClosed) return;

      isCheckingAccess = true;

      try {
        const response = await fetch(`${streamUrl}?check=access`, {
          cache: 'no-store',
        });

        if (isClosed || (response.status !== 401 && response.status !== 403)) return;

        eventSource.close();
        isClosed = true;

        showNotification({
          type: 'error',
          title: 'Соединение с чатом закрыто',
          description:
            response.status === 401
              ? 'Сессия истекла. Войдите в аккаунт снова'
              : 'У вас больше нет доступа к этой беседе',
          key: 'chat-stream-access-error',
        });
      } catch {
        showNotification({
          type: 'warning',
          title: 'Нет соединения с сервером',
          description: 'Новые сообщения появятся после восстановления соединения',
          key: 'chat-stream-connection-warning',
        });
      } finally {
        isCheckingAccess = false;
      }
    };

    return () => {
      isClosed = true;
      eventSource.close();
    };
  }, [addMessage, conversation.id, initialLastMessageId, showNotification]);

  useEffect(() => {
    if (!latestMessageId) return;

    if (!isNearBottomRef.current) {
      setIsScrollButtonVisible(true);
      return;
    }

    scrollToBottom(isInitialScrollRef.current ? 'auto' : 'smooth');

    isInitialScrollRef.current = false;
    setIsScrollButtonVisible(false);
  }, [latestMessageId, scrollToBottom]);

  return (
    <section className={styles.chatPanel}>
      <header className={styles.chatHeader}>
        <Avatar className={styles.avatar}>{conversation.displayTitle[0]}</Avatar>

        <Flex className={styles.chatInfo} vertical>
          <h2 className={styles.chatTitle} id="active-chat-title">
            {conversation.displayTitle}
          </h2>
          {/* TODO: добавить статус онлайн после реализации presence. */}
        </Flex>
      </header>

      <div className={styles.messagesArea}>
        <div
          aria-live="polite"
          aria-relevant="additions"
          className={styles.messages}
          onScroll={handleMessagesScroll}
          ref={messagesRef}
          role="log"
        >
          {liveMessages.length === 0 ? (
            <div className={styles.emptyMessages}>
              <div aria-hidden className={styles.emptyMessagesIcon}>
                <MessageCircle size={25} strokeWidth={1.8} />
              </div>
              <h3 className={styles.emptyMessagesTitle}>Напишите первое сообщение</h3>
              <p className={styles.emptyMessagesText}>
                Начните беседу — ваше сообщение появится здесь.
              </p>
            </div>
          ) : (
            liveMessages.map((message) => (
              <ChatMessageItem currentUserId={currentUserId} key={message.id} message={message} />
            ))
          )}
        </div>

        {isScrollButtonVisible && (
          <div className={styles.scrollToBottomControl}>
            <Button
              color="orange"
              icon={<ArrowDown size={20} strokeWidth={2} />}
              onClick={handleScrollToBottom}
              shape="circle"
              variant="solid"
            />
          </div>
        )}
      </div>

      <MessageComposer conversationId={conversation.id} onMessageSent={addMessage} />
    </section>
  );
};
