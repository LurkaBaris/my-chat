'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { credentialsSchema, type CredentialsSchemaType } from '@/shared/lib';
import { CustomAlert } from '@/shared/ui/alert';
import { CustomInput, CustomPasswordInput } from '@/shared/ui/input';

import styles from './LoginForm.module.css';

export const LoginForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsSchemaType>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit: SubmitHandler<CredentialsSchemaType> = async (data) => {
    clearErrors('root');

    try {
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (!result.ok || result.error) {
        setError('root.server', {
          type: 'server',
          message: 'Неверный email или пароль',
        });

        return;
      }

      router.refresh();
      router.replace('/chat');
    } catch {
      setError('root.server', {
        type: 'server',
        message: 'Не удалось войти. Попробуйте ещё раз',
      });
    }
  };

  return (
    <Form layout="vertical" noValidate onFinish={() => void handleSubmit(onSubmit)()}>
      {errors.root?.server?.message && (
        <Form.Item>
          <CustomAlert description={errors.root.server.message} title="Ошибка входа" />
        </Form.Item>
      )}

      <CustomInput
        control={control}
        id="login-email"
        autoCapitalize="none"
        autoComplete="email"
        label="Email"
        name="email"
        placeholder="example@mail.com"
        required
        spellCheck={false}
        type="email"
      />

      <CustomPasswordInput
        control={control}
        id="login-password"
        autoComplete="current-password"
        label="Пароль"
        name="password"
        placeholder="Введите пароль"
        required
      />

      <div className={styles.submit}>
        <Button block htmlType="submit" loading={isSubmitting} type="primary">
          Войти
        </Button>
      </div>
    </Form>
  );
};
