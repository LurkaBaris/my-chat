import { messageWithSenderSchema } from '@/entities/message';
import { z } from 'zod';

import type { ChatListEvent, ConversationPreview } from './types';

const conversationPreviewSchema = z.object({
  id: z.string(),
  type: z.enum(['DIRECT', 'GROUP']),
  title: z.string().nullable(),
  createdAt: z.coerce.date(),
  displayTitle: z.string(),
  lastMessage: messageWithSenderSchema.nullable(),
  time: z.string(),
}) satisfies z.ZodType<ConversationPreview>;

export const chatListEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('message.created'),
    message: messageWithSenderSchema,
  }),
  z.object({
    type: z.literal('conversation.created'),
    conversation: conversationPreviewSchema,
  }),
]) satisfies z.ZodType<ChatListEvent>;
