import { Anchor, Center, Paper, Stack, Text, Title } from '@mantine/core'

import { SignUpForm } from '@/features/sign-up'

export const RegisterPage = () => {
  return (
    <Center component="main" mih="100dvh" bg="primary.0" p={{ base: 'sm', sm: 'xl' }}>
      <Paper w="100%" maw={380} p={24} radius="lg" shadow="sm" withBorder>
        <Stack gap={2} mb="md">
          <Title order={1} c="primary.9" fz={22} lh={1.25} fw={700}>
            Регистрация
          </Title>
          <Text c="dimmed" fz={13} lh={1.45}>
            Создайте аккаунт, чтобы начать общение
          </Text>
        </Stack>

        <SignUpForm />

        <Text ta="center" c="dimmed" fz={13} mt="md">
          Уже есть аккаунт?{' '}
          <Anchor href="/login" fz={13} fw={500}>
            Войти
          </Anchor>
        </Text>
      </Paper>
    </Center>
  )
}
