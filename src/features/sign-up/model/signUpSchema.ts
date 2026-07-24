import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Имя должно содержать минимум 2 символа')
      .max(50, 'Имя должно содержать максимум 50 символов'),
    email: z.string().trim().toLowerCase().pipe(z.email('Некорректный email')),
    password: z
      .string()
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .refine(
        (password) => new TextEncoder().encode(password).length <= 72,
        'Пароль должен занимать максимум 72 байта',
      )
      .regex(/\p{Lu}/u, 'Добавьте хотя бы одну заглавную букву')
      .regex(/\d/, 'Добавьте хотя бы одну цифру')
      .regex(/[\p{P}\p{S}]/u, 'Добавьте хотя бы один специальный символ'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Пароли не совпадают',
      });
    }
  });

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
