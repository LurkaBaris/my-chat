import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { PropsWithChildren } from 'react'

import { theme } from './theme'

export const AppMantineProvider = ({ children }: PropsWithChildren) => {
  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <Notifications position="top-right" autoClose={4000} containerWidth={340} limit={3} />
      {children}
    </MantineProvider>
  )
}
