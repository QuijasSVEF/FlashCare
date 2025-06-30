import React, { createContext, useContext, useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  visible: boolean;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string, duration?: number) => string;
  hideNotification: (id: string) => void;
  showSuccess: (title: string, message: string, duration?: number) => string;
  showError: (title: string, message: string, duration?: number) => string;
  showInfo: (title: string, message: string, duration?: number) => string;
  showWarning: (title: string, message: string, duration?: number) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message: string,
    duration: number = 4000
  ) => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      type,
      title,
      message,
      visible: true,
      duration,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration
    setTimeout(() => {
      hideNotification(id);
    }, duration);

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

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return showNotification('success', title, message, duration);
  }, [showNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    return showNotification('error', title, message, duration);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return showNotification('info', title, message, duration);
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    return showNotification('warning', title, message, duration);
  }, [showNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      hideNotification,
      showSuccess,
      showError,
      showInfo,
      showWarning,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}