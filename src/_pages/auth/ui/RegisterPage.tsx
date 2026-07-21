import Link from 'next/link'

import { SignUpForm } from '@/features/sign-up'
import { CustomCard } from '@/shared/ui/card'

import styles from './AuthPage.module.css'

export const RegisterPage = () => {
  return (
    <main className={styles.page}>
      <CustomCard
        description="Создайте аккаунт, чтобы начать общение"
        footer={
          <>
            Уже есть аккаунт? <Link href="/login">Войти</Link>
          </>
        }
        title="Регистрация"
      >
        <SignUpForm />
      </CustomCard>
    </main>
  )
}
