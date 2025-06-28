import { Tabs } from 'expo-router';
import { Chrome as Home, MessageCircle, User, Search, Users, Plus, Briefcase, Heart, Settings } from 'lucide-react-native';
import { TouchableOpacity, Alert, Platform } from 'react-native';
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
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 12,
          height: Platform.OS === 'ios' ? 88 : 72,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: 8,
          marginHorizontal: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}>
      
      {/* Home/Browse - Different for each role */}
      <Tabs.Screen
        name="index"
        options={{
          title: isFamily ? 'Find Care' : 'Browse',
          tabBarIcon: ({ size, color, focused }) => (
            {isFamily ? (
              <Heart 
                size={focused ? size + 2 : size} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2}
                fill={focused ? color : 'transparent'}
              />
            ) : (
              <Search 
                size={focused ? size + 2 : size} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2}
              />
            )}
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
              tabBarIcon: ({ size, color, focused }) => (
                <Plus 
                  size={focused ? size + 2 : size} 
                  color={color}
                  strokeWidth={focused ? 2.5 : 2}
                />
              ),
            }}
          />
          
          <Tabs.Screen
            name="my-jobs"
            options={{
              title: 'My Jobs',
              tabBarIcon: ({ size, color, focused }) => (
                <Briefcase 
                  size={focused ? size + 2 : size} 
                  color={color}
                  strokeWidth={focused ? 2.5 : 2}
                />
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
            tabBarIcon: ({ size, color, focused }) => (
              <Search 
                size={focused ? size + 2 : size} 
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
      )}
      
      {/* Shared tabs */}
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ size, color, focused }) => (
            <Users 
              size={focused ? size + 2 : size} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ size, color, focused }) => (
            <MessageCircle 
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <Settings 
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
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