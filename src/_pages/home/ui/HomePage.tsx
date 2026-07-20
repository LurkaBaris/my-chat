import { Card } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'

import { LogoutButton } from '@/features/logout/index.server'

import styles from './HomePage.module.css'

export const HomePage = () => {
  return (
    <main className={styles.page}>
      <Card className={styles.card} title="My Chat" variant="outlined">
        <Paragraph type="secondary">ТУТ БУДЕМ ОБЩАТЬСЯ В ОБЩЕМ</Paragraph>
        <LogoutButton />
      </Card>
    </main>
  )
}
