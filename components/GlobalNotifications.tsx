import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NotificationBanner } from './NotificationBanner';
import { useNotifications } from '../contexts/NotificationContext';

export function GlobalNotifications() {
  const { notifications, hideNotification } = useNotifications();

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <NotificationBanner
          key={notification.id}
          visible={notification.visible}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onDismiss={() => hideNotification(notification.id)}
          autoHide={true}
          duration={notification.duration}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
});