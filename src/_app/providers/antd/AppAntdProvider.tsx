'use client'

import { App, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import type { PropsWithChildren } from 'react'

import { antdTheme } from './theme'

export const AppAntdProvider = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider componentSize="middle" locale={ruRU} theme={antdTheme}>
      <App notification={{ duration: 4, maxCount: 3, placement: 'topRight' }}>{children}</App>
    </ConfigProvider>
  )
}
