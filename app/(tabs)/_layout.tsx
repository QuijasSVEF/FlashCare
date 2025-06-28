import { Tabs } from 'expo-router';
import { Heart, MessageCircle, User, Plus, Briefcase, Settings, ChartBar as BarChart3, Search } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { user } = useAuth();
  
  const isFamily = user?.role === 'family';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: Colors.gray[200],
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 12,
          height: Platform.OS === 'ios' ? 88 : 72,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: 12,
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
          title: isFamily ? 'Find Care' : 'Find Jobs',
          tabBarIcon: ({ size, color, focused }) => (
            isFamily ? (
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
            )
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
            title: 'Analytics',
            tabBarIcon: ({ size, color, focused }) => (
              <BarChart3 
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
          title: 'Settings',
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
        name="matches"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
      
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