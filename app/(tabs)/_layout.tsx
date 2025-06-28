import { Tabs } from 'expo-router';
import { Chrome as Home, MessageCircle, Calendar, User, Search, Users, Plus, Briefcase, LogOut } from 'lucide-react-native';
import { TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function TabLayout() {
  const { user, signOut } = useAuth();
  
  const isFamily = user?.role === 'family';

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            try {
              console.log('Starting sign out from tabs...');
              await signOut();
              console.log('Sign out completed, navigating to welcome...');
              router.replace('/(auth)/welcome');
            } catch (error) {
              console.error('Sign out error in tabs:', error);
              // Force navigation even if there's an error
              router.replace('/(auth)/welcome');
            }
          }
        },
      ]
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB', // Primary blue from logo
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      
      {/* Home/Browse - Different for each role */}
      <Tabs.Screen
        name="index"
        options={{
          title: isFamily ? 'Find Care' : 'Browse Jobs',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      
      {/* Family-specific tabs */}
      {isFamily && (
        <>
          <Tabs.Screen
            name="create-job"
            options={{
              title: 'Post Job',
              tabBarIcon: ({ size, color }) => (
                <Plus size={size} color={color} />
              ),
            }}
          />
          
          <Tabs.Screen
            name="my-jobs"
            options={{
              title: 'My Jobs',
              tabBarIcon: ({ size, color }) => (
                <Briefcase size={size} color={color} />
              ),
            }}
          />
        </>
      )}
      
      {/* Caregiver-specific tabs */}
      {!isFamily && (
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ size, color }) => (
              <Search size={size} color={color} />
            ),
          }}
        />
      )}
      
      {/* Shared tabs */}
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      {/* Hidden tabs that shouldn't show in navigation */}
      <Tabs.Screen
        name="schedule"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
      
      <Tabs.Screen
        name="billing"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
      
      <Tabs.Screen
        name="edit-job"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
      
      <Tabs.Screen
        name="job-applicants"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
    </Tabs>
  );
}