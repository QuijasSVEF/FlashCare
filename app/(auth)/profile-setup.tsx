import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileSetupScreen() {
  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    location: '',
    emergency_phone: '',
  });
  const [loading, setLoading] = useState(false);

  const { updateProfile, user } = useAuth();

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Profile Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>
          Help others get to know you better
        </Text>

        <Input
          label="Bio"
          value={formData.bio}
          onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
          placeholder="Tell us about yourself..."
          multiline
          numberOfLines={4}
          style={styles.bioInput}
        />

        <Input
          label="Phone Number"
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          placeholder="Your phone number"
          keyboardType="phone-pad"
        />

        <Input
          label="Location"
          value={formData.location}
          onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
          placeholder="City, State"
        />

        <Input
          label="Emergency Contact"
          value={formData.emergency_phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, emergency_phone: text }))}
          placeholder="Emergency contact number"
          keyboardType="phone-pad"
        />

        <Button
          title={loading ? "Saving..." : "Complete Profile"}
          onPress={handleSaveProfile}
          disabled={loading}
          size="large"
          style={styles.saveButton}
        />

        <Button
          title="Skip for now"
          onPress={handleSkip}
          variant="outline"
          size="large"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginBottom: 16,
  },
});