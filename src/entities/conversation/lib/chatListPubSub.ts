import 'server-only';

import type { ChatListEvent } from '../model/types';

type ChatListSubscriber = (event: ChatListEvent) => void;
type UserChannels = Map<string, Set<ChatListSubscriber>>;

const globalForChatListPubSub = globalThis as typeof globalThis & {
  chatListUserChannels?: UserChannels;
};

const userChannels =
  globalForChatListPubSub.chatListUserChannels ?? new Map<string, Set<ChatListSubscriber>>();

globalForChatListPubSub.chatListUserChannels = userChannels;

export const subscribeToChatList = (userId: string, subscriber: ChatListSubscriber) => {
  let subscribers = userChannels.get(userId);

  if (!subscribers) {
    subscribers = new Set<ChatListSubscriber>();
    userChannels.set(userId, subscribers);
  }

  subscribers.add(subscriber);

  return () => {
    const currentSubscribers = userChannels.get(userId);

    if (!currentSubscribers) return;

    currentSubscribers.delete(subscriber);

    if (currentSubscribers.size === 0) {
      userChannels.delete(userId);
    }
  };
};

export const publishChatListEventToUsers = (userIds: string[], event: ChatListEvent) => {
  for (const userId of new Set(userIds)) {
    const subscribers = userChannels.get(userId);

    if (!subscribers) continue;

    for (const subscriber of [...subscribers]) {
      try {
        subscriber(event);
      } catch {
        subscribers.delete(subscriber);
      }
    }

    if (subscribers.size === 0) {
      userChannels.delete(userId);
    }
  }
};
