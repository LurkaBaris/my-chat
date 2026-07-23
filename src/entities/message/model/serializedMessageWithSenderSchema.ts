import { z } from 'zod'

import type { SerializedMessageWithSender } from './types'

export const serializedMessageWithSenderSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  body: z.string(),
  createdAt: z.iso.datetime(),
  sender: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
  }),
}) satisfies z.ZodType<SerializedMessageWithSender>
