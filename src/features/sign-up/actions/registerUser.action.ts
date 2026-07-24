'use server';

import { Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';

import { prisma } from '@/shared/db/index.server';

import { signUpSchema } from '../model/signUpSchema';

type RegisterUserResult = { success: true } | { success: false; message: string; field?: 'email' };

const emailTakenResult: RegisterUserResult = {
  success: false,
  message: 'Этот email уже занят',
  field: 'email',
};

export async function registerUser(input: unknown): Promise<RegisterUserResult> {
  const result = signUpSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? 'Некорректные данные',
    };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return emailTakenResult;
    }

    const passwordHash = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: { id: true },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return emailTakenResult;
    }

    return {
      success: false,
      message: 'Не удалось зарегистрироваться. Попробуйте ещё раз',
    };
  }
}
