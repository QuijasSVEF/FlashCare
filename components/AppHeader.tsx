import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { LogOut, Menu, Phone } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
}

export function AppHeader({ 
  title, 
  subtitle, 
  rightComponent 
}: AppHeaderProps) {
  const { signOut } = useAuth();

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
              console.log('Header: Starting sign out...');
              const success = await signOut();
              
              if (success) {
                console.log('Header: Sign out successful, navigating...');
                router.replace('/(auth)/welcome');
              }
            } catch (error) {
              console.error('Header: Sign out error:', error);
              router.replace('/(auth)/welcome');
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo Row */}
      <View style={styles.logoRow}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo (2).png')}
            style={styles.flashCareLogo}
            resizeMode="contain"
          />
          <View style={styles.logoAccent} />
        </View>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/refs/heads/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png' }}
          style={styles.boltBadge}
          resizeMode="contain"
        />
      </View>
      
      {/* Header Content */}
      <View style={styles.headerContent}>
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'flex-start',
    marginLeft: 4,
  },
  flashCareLogo: {
    width: 150,
    height: 45,
  },
  logoAccent: {
    position: 'absolute',
    bottom: -2,
    left: 10,
    right: 10,
    height: 4,
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  boltBadge: {
    width: 40,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[700],
    marginBottom: 4,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
});