'use client';

import { App } from 'antd';
import { useCallback } from 'react';

interface AppNotification {
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  key: string;
}

export const useAppNotification = () => {
  const { notification } = App.useApp();

  return useCallback(
    ({ type, title, description, key }: AppNotification) => {
      notification[type]({
        title,
        description,
        key,
        placement: 'topRight',
      });
    },
    [notification],
  );
};
