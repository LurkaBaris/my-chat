'use client';

import type { ConversationDetails } from '@/entities/conversation';
import {
  ChatMessageItem,
  parseMessageWithSender,
  type MessageWithSender,
} from '@/entities/message';
import { MessageComposer } from '@/features/send-message';
import { App, Avatar, Button, Flex } from 'antd';
import { ArrowDown } from 'lucide-react';
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
  const { notification } = App.useApp();
  const [liveMessages, setLiveMessages] = useState(messages);
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
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

      return [...currentMessages, message];
    });
  }, []);

  const showMessageError = useCallback(() => {
    notification.error({
      title: 'Не удалось обновить чат',
      description: 'Не удалось обработать новое сообщение. Обновите страницу.',
      key: 'realtime-message-error',
      placement: 'topRight',
    });
  }, [notification]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/${conversation.id}/stream`);

    eventSource.onmessage = (event) => {
      const message = parseMessageWithSender(event.data);

      if (!message) {
        showMessageError();
        return;
      }

      addMessage(message);
    };

    return () => {
      eventSource.close();
    };
  }, [addMessage, conversation.id, showMessageError]);

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
          <span className={styles.chatStatus}>Онлайн</span>
        </Flex>
      </header>

      <div className={styles.messagesArea}>
        <div className={styles.messages} onScroll={handleMessagesScroll} ref={messagesRef}>
          {liveMessages.map((message) => (
            <ChatMessageItem currentUserId={currentUserId} key={message.id} message={message} />
          ))}
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
