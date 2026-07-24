import type { Prisma } from '@prisma/client';
import { z } from 'zod';

type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        id: true;
        email: true;
        name: true;
      };
    };
  };
}>;

export const messageWithSenderSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  body: z.string(),
  createdAt: z.coerce.date(),
  sender: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
  }),
}) satisfies z.ZodType<MessageWithSender>;
