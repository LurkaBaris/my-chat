import { AppAntdProvider } from '@/_app/providers/antd'
import '@/_app/styles/globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import 'antd/dist/reset.css'
import type { Metadata } from 'next'
import 'normalize.css'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Главная | My Chat',
  description: 'Здесь будут все ваши чаты',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <AppAntdProvider>{children}</AppAntdProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
