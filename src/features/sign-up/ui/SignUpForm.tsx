'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { App, Button, Form } from 'antd'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { CustomAlert } from '@/shared/ui/alert'
import { CustomInput, CustomPasswordInput } from '@/shared/ui/input'

import { registerUser } from '../actions/registerUser.action'
import { signUpSchema, type SignUpSchemaType } from '../model/signUpSchema'

import styles from './SignUpForm.module.css'

export const SignUpForm = () => {
  const { notification } = App.useApp()
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

        return
      }

      setError('root.server', {
        type: 'server',
        message: result.message,
      })

      return
    }

    reset()
    notification.success({
      description: 'Вы успешно зарегистрировались',
      title: 'Регистрация завершена',
    })
  }

  return (
    <Form layout="vertical" noValidate onFinish={() => void handleSubmit(onSubmit)()}>
      {errors.root?.server?.message && (
        <Form.Item>
          <CustomAlert description={errors.root.server.message} title="Ошибка регистрации" />
        </Form.Item>
      )}

      <CustomInput
        control={control}
        autoComplete="name"
        id="register-name"
        label="Имя"
        name="name"
        placeholder="Введите имя"
        required
      />

      <CustomInput
        control={control}
        autoCapitalize="none"
        autoComplete="email"
        id="register-email"
        label="Email"
        name="email"
        placeholder="example@mail.com"
        required
        spellCheck={false}
        type="email"
      />

      <CustomPasswordInput
        control={control}
        autoComplete="new-password"
        id="register-password"
        label="Пароль"
        name="password"
        placeholder="Введите пароль"
        required
      />

      <CustomPasswordInput
        control={control}
        autoComplete="new-password"
        id="register-confirm-password"
        label="Повторите пароль"
        name="confirmPassword"
        placeholder="Введите пароль ещё раз"
        required
      />

      <div className={styles.submit}>
        <Button block htmlType="submit" loading={isSubmitting} type="primary">
          Зарегистрироваться
        </Button>
      </div>
    </Form>
  )
}
