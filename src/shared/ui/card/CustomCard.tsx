import { Card } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import type { ReactNode } from 'react';

import styles from './CustomCard.module.css';

interface CustomCardProps {
  children?: ReactNode;
  description: ReactNode;
  footer: ReactNode;
  title: ReactNode;
}

export const CustomCard = ({ children, description, footer, title }: CustomCardProps) => {
  return (
    <Card
      className={styles.card}
      styles={{
        body: {
          padding: '6px 24px 24px',
        },
        header: {
          borderBottom: 0,
          minHeight: 0,
          padding: '24px 24px 8px',
        },
        title: {
          lineHeight: 1.25,
          padding: 0,
          textAlign: 'center',
        },
      }}
      title={title}
      variant="outlined"
    >
      <Paragraph className={styles.description} type="secondary">
        {description}
      </Paragraph>

      {children}

      <Paragraph className={styles.footer} type="secondary">
        {footer}
      </Paragraph>
    </Card>
  );
};
