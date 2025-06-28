import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { EmergencyButton } from './EmergencyButton';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showEmergencyButton?: boolean;
  emergencyPhone?: string;
  rightComponent?: React.ReactNode;
}

export function AppHeader({ 
  title, 
  subtitle, 
  showEmergencyButton = true, 
  emergencyPhone,
  rightComponent 
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Logo Row */}
      <View style={styles.logoRow}>
        <Image
          source={require('../assets/images/logo (2).png')}
          style={styles.flashCareLogo}
          resizeMode="contain"
        />
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/refs/heads/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png' }}
          style={styles.boltBadge}
          resizeMode="contain"
        />
      </View>
      
      {/* Header Content */}
      <View style={styles.headerContent}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {rightComponent}
          {showEmergencyButton && (
            <EmergencyButton phoneNumber={emergencyPhone} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  flashCareLogo: {
    width: 120,
    height: 40,
  },
  boltBadge: {
    width: 40,
    height: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});