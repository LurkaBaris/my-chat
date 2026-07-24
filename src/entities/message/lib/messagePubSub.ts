import 'server-only';

import type { MessageWithSender } from '../model/types';

type MessageSubscriber = (message: MessageWithSender) => void;

const globalForMessagePubSub = globalThis as unknown & {
  messageChannels?: Map<string, Set<MessageSubscriber>>;
};

const messageChannels =
  globalForMessagePubSub.messageChannels ?? new Map<string, Set<MessageSubscriber>>();

globalForMessagePubSub.messageChannels = messageChannels;

export const subscribeToConversation = (conversationId: string, subscriber: MessageSubscriber) => {
  let subscribers = messageChannels.get(conversationId);

  if (!subscribers) {
    subscribers = new Set<MessageSubscriber>();
    messageChannels.set(conversationId, subscribers);
  }

  subscribers.add(subscriber);

  return () => {
    const currentSubscribers = messageChannels.get(conversationId);

    if (!currentSubscribers) return;

    currentSubscribers.delete(subscriber);

    if (currentSubscribers.size === 0) {
      messageChannels.delete(conversationId);
    }
  };
};

export const publishToConversation = (conversationId: string, message: MessageWithSender) => {
  const subscribers = messageChannels.get(conversationId);

  if (!subscribers) return;

  for (const subscriber of [...subscribers]) {
    try {
      subscriber(message);
    } catch {
      subscribers.delete(subscriber);
    }
  }

  if (subscribers.size === 0) {
    messageChannels.delete(conversationId);
  }
};
