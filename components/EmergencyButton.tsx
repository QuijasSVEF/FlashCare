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
      <Phone size={20} color="#FFFFFF" />
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});