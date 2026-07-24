import { z } from 'zod';

export const MESSAGE_MAX_LENGTH = 4000;

export const sendMessageSchema = z.object({
  conversationId: z.string().trim().min(1, 'Некорректная беседа'),
  body: z
    .string()
    .trim()
    .min(1, 'Введите сообщение')
    .max(MESSAGE_MAX_LENGTH, `Сообщение не должно превышать ${MESSAGE_MAX_LENGTH} символов`),
});

export type SendMessageSchemaType = z.infer<typeof sendMessageSchema>;
