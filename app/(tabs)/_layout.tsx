import { Tabs } from 'expo-router';
import { Chrome as Home, MessageCircle, Calendar, User, Search, Users, Plus, Briefcase, LogOut } from 'lucide-react-native';
import { TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user, signOut } = useAuth();
  
  const isFamily = user?.role === 'family';

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const LogoutButton = () => (
    <TouchableOpacity
      onPress={handleSignOut}
      style={{
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
        marginRight: 8,
      }}
    >
      <LogOut size={20} color="#DC2626" />
    </TouchableOpacity>
  );

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