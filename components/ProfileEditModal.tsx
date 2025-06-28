import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal,
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { X, Camera, Save } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '../contexts/AuthContext'; 
import { Colors } from '../constants/Colors';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ProfileEditModal({ 
  visible, 
  onClose, 
  onSave 
}: ProfileEditModalProps) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    emergency_phone: user?.emergency_phone || '',
    location: user?.location || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully!');
      onSave();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const skillOptions = [
    'Senior Care',
    'Child Care', 
    'Disability Support',
    'Medical Care',
    'Companionship',
    'Housekeeping',
    'Meal Preparation',
    'Transportation',
    'Pet Care',
    'Overnight Care',
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Camera size={32} color="#6B7280" />
              </View>
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter your full name"
            />

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
              label="Emergency Contact"
              value={formData.emergency_phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, emergency_phone: text }))}
              placeholder="Emergency contact number"
              keyboardType="phone-pad"
            />

            <Input
              label="Location"
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              placeholder="City, State"
            />
          </View>

          {user?.role === 'caregiver' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Specialties</Text>
              <Text style={styles.sectionSubtitle}>
                Select the areas where you have experience
              </Text>
              <View style={styles.skillsGrid}>
                {skillOptions.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.skillButton,
                      // TODO: Add skill selection state
                      false && styles.skillButtonSelected,
                    ]}
                    onPress={() => {
                      // TODO: Implement skill selection
                      console.log('Selected skill:', skill);
                    }}
                  >
                    <Text style={[
                      styles.skillText,
                      false && styles.skillTextSelected,
                    ]}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title={loading ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={loading}
            style={styles.saveButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, 
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  changePhotoText: {
    fontSize: 16,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: Colors.gray[200],
    backgroundColor: Colors.background,
  },
  skillButtonSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[100],
  },
  skillText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  skillTextSelected: {
    color: Colors.primary[600],
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});