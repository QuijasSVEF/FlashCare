import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { databaseService } from '../../lib/database';

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
      if (user?.id) {
        await updateProfile(formData);
      } else {
        // If no user, try to get current user and create profile
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          await databaseService.updateUser(authUser.id, formData);
        } else {
          throw new Error('No authenticated user found');
        }
      }
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
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Heart size={24} color="#2563EB" />
          <Text style={styles.logo}>FlashCare</Text>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/refs/heads/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png' }}
            style={styles.boltBadge}
            resizeMode="contain"
          />
        </View>
      </View>
      
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginLeft: 8,
  },
  boltBadge: {
    position: 'absolute',
    right: -60,
    width: 30,
    height: 30,
  },
  content: {
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