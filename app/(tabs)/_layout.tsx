import { Tabs } from 'expo-router';
import { Chrome as Home, MessageCircle, Calendar, User, Search, Users, Plus, Briefcase } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();
  
  // Don't render tabs if user is not loaded yet
  if (!user) {
    return null;
  }
  
  const isFamily = user.role === 'family';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: isFamily ? 'Find Care' : 'Browse Jobs',
          tabBarIcon: ({ size, color }) => (
            isFamily ? <Search size={size} color={color} /> : <Search size={size} color={color} />
          ),
        }}
      />
      
      {isFamily && (
        <Tabs.Screen
          name="create-job"
          options={{
            title: 'Post Job',
            tabBarIcon: ({ size, color }) => (
              <Plus size={size} color={color} />
            ),
          }}
        />
      )}
      
      {isFamily && (
        <Tabs.Screen
          name="my-jobs"
          options={{
            title: 'My Jobs',
            tabBarIcon: ({ size, color }) => (
              <Briefcase size={size} color={color} />
            ),
          }}
        />
      )}
      
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}