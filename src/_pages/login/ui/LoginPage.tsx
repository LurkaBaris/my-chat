import { Center, Paper, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'

import { LoginForm } from '@/features/login'

export const LoginPage = () => {
  return (
    <Center component="main" mih="100dvh" bg="primary.0" p={{ base: 'sm', sm: 'xl' }}>
      <Paper w="100%" maw={380} p={24} radius="lg" shadow="sm" withBorder>
        <Stack gap={2} mb="md">
          <Title order={1} c="primary.9" fz={22} lh={1.25} fw={700}>
            Вход
          </Title>
          <Text c="dimmed" fz={13} lh={1.45}>
            Войдите в аккаунт, чтобы продолжить общение
          </Text>
        </Stack>

        <LoginForm />

        <Text ta="center" c="dimmed" fz={13} mt="md">
          Нет аккаунта?{' '}
          <Link href="/register" style={{ color: 'var(--mantine-color-anchor)', fontWeight: 500 }}>
            Зарегистрироваться
          </Link>
        </Text>
      </Paper>
    </Center>
  )
}
