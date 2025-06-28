import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  visible: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message: string
  ) => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      type,
      title,
      message,
      visible: true,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      hideNotification(id);
    }, 4000);

    return id;
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, visible: false }
          : notification
      )
    );

    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    }, 300);
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    return showNotification('success', title, message);
  }, [showNotification]);

  const showError = useCallback((title: string, message: string) => {
    return showNotification('error', title, message);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    return showNotification('info', title, message);
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    return showNotification('warning', title, message);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}