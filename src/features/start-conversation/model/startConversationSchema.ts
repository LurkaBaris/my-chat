import { z } from 'zod'

export const startConversationSchema = z.object({
  email: z.email('Введите корректный email').toLowerCase(),
})

export type StartConversationSchemaType = z.infer<typeof startConversationSchema>
