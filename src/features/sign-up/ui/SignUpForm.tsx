'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

import { registerUser } from '../actions/registerUser.action'
import { signUpSchema, type SignUpSchemaType } from '../model/signUpSchema'

export const SignUpForm = () => {
  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  })

  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
    clearErrors('root')

    const result = await registerUser(data)

    if (!result.success) {
      if (result.field === 'email') {
        setError('email', {
          type: 'server',
          message: result.message,
        })
      }

      setError('root.server', {
        type: 'server',
        message: result.message,
      })

      return
    }

    reset()
    notifications.show({
      title: 'Регистрация завершена',
      message: 'Вы успешно зарегистрировались',
      color: 'primary',
      withBorder: true,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={12}>
        {errors.root?.server?.message && (
          <Alert
            color="red"
            title="Ошибка регистрации"
            p="xs"
            radius="sm"
            role="alert"
            styles={{
              title: {
                color: 'var(--mantine-color-danger-7)',
                fontSize: 12,
                lineHeight: 1.25,
                fontWeight: 600,
              },
              message: {
                color: 'var(--mantine-color-danger-7)',
                fontSize: 12,
                lineHeight: 1.35,
              },
            }}
          >
            {errors.root.server.message}
          </Alert>
        )}

        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              size="xs"
              label="Имя"
              placeholder="Введите имя"
              autoComplete="name"
              error={fieldState.error?.message}
              withAsterisk
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              size="xs"
              type="email"
              label="Email"
              placeholder="example@mail.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              error={fieldState.error?.message}
              withAsterisk
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <PasswordInput
              {...field}
              size="xs"
              label="Пароль"
              placeholder="Введите пароль"
              autoComplete="new-password"
              error={fieldState.error?.message}
              withAsterisk
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <PasswordInput
              {...field}
              size="xs"
              label="Повторите пароль"
              placeholder="Введите пароль ещё раз"
              autoComplete="new-password"
              error={fieldState.error?.message}
              withAsterisk
            />
          )}
        />

        <Button type="submit" size="sm" fz={13} loading={isSubmitting} fullWidth>
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  )
}
