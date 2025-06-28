import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Platform } from 'react-native';
import { Phone } from 'lucide-react-native';

interface EmergencyButtonProps {
  phoneNumber?: string;
}

export function EmergencyButton({ phoneNumber }: EmergencyButtonProps) {
  const handleEmergencyCall = () => {
    const number = phoneNumber || '911';
    const url = Platform.OS === 'ios' ? `tel:${number}` : `tel:${number}`;
    
    Linking.openURL(url).catch((err) => {
      console.error('Error making emergency call:', err);
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleEmergencyCall}>
      <Phone size={16} color="#FFFFFF" strokeWidth={2.5} />
      <Text style={styles.text}>Emergency</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 100,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
});