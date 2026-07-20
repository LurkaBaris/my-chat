'use client'

import Alert from 'antd/es/alert/Alert'
import type { AlertProps } from 'antd/es/alert/Alert'

type CustomAlertProps = Omit<AlertProps, 'message' | 'styles'>

export const CustomAlert = ({
  role = 'alert',
  showIcon = true,
  type = 'error',
  ...alertProps
}: CustomAlertProps) => {
  return (
    <Alert
      {...alertProps}
      role={role}
      showIcon={showIcon}
      styles={{
        description: {
          fontSize: 12,
          lineHeight: 1.4,
        },
        icon: {
          fontSize: 16,
          marginInlineEnd: 8,
          marginTop: 1,
        },
        root: {
          alignItems: 'flex-start',
          padding: '8px 10px',
        },
        title: {
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.35,
          marginBottom: 2,
        },
      }}
      type={type}
    />
  )
}
