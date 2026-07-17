import { Center, Paper, Stack, Text } from '@mantine/core'

import { LogoutButton } from '@/features/logout/index.server'

export const HomePage = () => {
  return (
    <Center component="main" mih="100dvh" bg="primary.0" p={{ base: 'sm', sm: 'xl' }}>
      <Paper w="100%" maw={560} p={{ base: 24, sm: 32 }} radius="lg" shadow="sm" withBorder>
        <Stack gap="lg">
          <Stack gap={6}>
            <Text c="primary.7" fz={12} fw={700} tt="uppercase" lts={1}>
              My Chat
            </Text>
          </Stack>

          <Text c="dimmed" fz={15} lh={1.65}>
            ТУТ БУДЕМ ОБЩАТЬСЯ В ОБЩЕМ
          </Text>

          <LogoutButton />
        </Stack>
      </Paper>
    </Center>
  )
}
