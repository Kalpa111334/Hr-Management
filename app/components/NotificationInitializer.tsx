import { notificationService } from '@/services/NotificationService';
import { message } from 'antd';
import { useEffect } from 'react';

export const NotificationInitializer: React.FC = () => {
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        if (!('serviceWorker' in navigator)) {
          console.warn('Service Worker is not supported in this browser');
          return;
        }

        const registration = await navigator.serviceWorker.register('/sw.js');
        await notificationService.initialize(registration);
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
        message.error('Failed to initialize notifications. Some features may not work properly.');
      }
    };

    initializeNotifications();
  }, []);

  return null;
}; 