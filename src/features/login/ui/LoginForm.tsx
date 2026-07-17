'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

import { credentialsSchema, type CredentialsSchemaType } from '@/shared/lib'

export const LoginForm = () => {
  const router = useRouter()
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
  })

  const onSubmit: SubmitHandler<CredentialsSchemaType> = async (data) => {
    clearErrors('root')

    try {
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (!result.ok || result.error) {
        setError('root.server', {
          type: 'server',
          message: 'Неверный email или пароль',
        })

        return
      }

      router.replace('/')
    } catch {
      setError('root.server', {
        type: 'server',
        message: 'Не удалось войти. Попробуйте ещё раз',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={12}>
        {errors.root?.server?.message && (
          <Alert
            color="danger"
            p="xs"
            radius="sm"
            role="alert"
            styles={{
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
              autoComplete="current-password"
              error={fieldState.error?.message}
              withAsterisk
            />
          )}
        />

        <Button type="submit" size="sm" fz={13} loading={isSubmitting} fullWidth>
          Войти
        </Button>
      </Stack>
    </form>
  )
}
