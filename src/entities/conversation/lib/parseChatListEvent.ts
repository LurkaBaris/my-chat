import { chatListEventSchema } from '../model/chatListEventSchema';
import type { ChatListEvent } from '../model/types';

export const parseChatListEvent = (data: string): ChatListEvent | null => {
  try {
    return chatListEventSchema.parse(JSON.parse(data));
  } catch {
    return null;
  }
};
