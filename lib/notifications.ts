import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async initialize() {
    if (Platform.OS === 'web') {
      console.log('Push notifications not available on web');
      return null;
    }

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });

      console.log('Push token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  },

  async registerPushToken(userId: string, token: string) {
    try {
      // Store push token in database
      const { error } = await supabase
        .from('user_push_tokens')
        .upsert({
          user_id: userId,
          push_token: token,
          platform: Platform.OS,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error registering push token:', error);
    }
  },

  async sendLocalNotification(title: string, body: string, data?: any) {
    if (Platform.OS === 'web') {
      // Use browser notifications on web
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, data });
      }
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Show immediately
    });
  },

  async scheduleNotification(title: string, body: string, trigger: Date, data?: any) {
    if (Platform.OS === 'web') {
      console.log('Scheduled notifications not available on web');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: {
        date: trigger,
      },
    });
  },

  async cancelAllNotifications() {
    if (Platform.OS === 'web') return;
    
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // Notification types for the app
  async notifyNewMatch(matchedUserName: string) {
    await this.sendLocalNotification(
      '🎉 New Match!',
      `You matched with ${matchedUserName}! Start chatting now.`,
      { type: 'match' }
    );
  },

  async notifyNewMessage(senderName: string, message: string) {
    await this.sendLocalNotification(
      `💬 ${senderName}`,
      message,
      { type: 'message' }
    );
  },

  async notifyScheduleUpdate(type: 'confirmed' | 'cancelled', otherUserName: string) {
    const title = type === 'confirmed' ? '✅ Schedule Confirmed' : '❌ Schedule Cancelled';
    const body = `Your care session with ${otherUserName} has been ${type}.`;
    
    await this.sendLocalNotification(title, body, { type: 'schedule' });
  },

  async notifyJobApplication(jobTitle: string, applicantName: string) {
    await this.sendLocalNotification(
      '👋 New Application',
      `${applicantName} applied for your "${jobTitle}" position.`,
      { type: 'job_application' }
    );
  }
};