import { z } from 'zod'

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Некорректный email')),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .refine(
      (password) => new TextEncoder().encode(password).length <= 72,
      'Пароль должен занимать максимум 72 байта',
    ),
})

export type CredentialsSchemaType = z.infer<typeof credentialsSchema>
