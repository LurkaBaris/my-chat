import Link from 'next/link'

import { LoginForm } from '@/features/login'
import { CustomCard } from '@/shared/ui/card'

import styles from './AuthPage.module.css'

export const LoginPage = () => {
  return (
    <main className={styles.page}>
      <CustomCard
        description="Войдите в аккаунт, чтобы продолжить общение"
        footer={
          <>
            Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
          </>
        }
        title="Вход"
      >
        <LoginForm />
      </CustomCard>
    </main>
  )
}
