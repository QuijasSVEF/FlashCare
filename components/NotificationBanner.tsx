import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { X, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

interface NotificationBannerProps {
  visible: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

export function NotificationBanner({
  visible,
  type,
  title,
  message,
  onDismiss,
  autoHide = true,
  duration = 4000,
}: NotificationBannerProps) {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      if (autoHide) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="#059669" />;
      case 'error':
        return <AlertCircle size={20} color="#DC2626" />;
      case 'warning':
        return <AlertCircle size={20} color="#D97706" />;
      case 'info':
      default:
        return <Info size={20} color="#2563EB" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.primary[100];
      case 'error':
        return '#FEE2E2'; // Light red
      case 'warning':
        return '#FEF3C7'; // Light yellow
      case 'info':
      default:
        return '#DBEAFE'; // Light blue
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return Colors.primary[500];
      case 'error':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      case 'info':
      default:
        return Colors.info;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderLeftColor: getBorderColor(),
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <X size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});