import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { X, Star, MapPin, Phone, Award, Shield } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    phone?: string;
    role: 'family' | 'caregiver';
    created_at: string;
  };
  onStartConversation?: () => void;
}

export function ProfileModal({ 
  visible, 
  onClose, 
  user, 
  onStartConversation 
}: ProfileModalProps) {
  const memberSince = new Date(user.created_at).getFullYear();
  
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image
                source={{ 
                  uri: user.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
                }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.role}>
                  {user.role === 'caregiver' ? 'Professional Caregiver' : 'Family Member'}
                </Text>
                
                {user.role === 'caregiver' && (
                  <View style={styles.rating}>
                    <Star size={16} color="#F59E0B" />
                    <Text style={styles.ratingText}>4.8</Text>
                    <Text style={styles.ratingCount}>(127 reviews)</Text>
                  </View>
                )}
              </View>
            </View>

            {user.bio && (
              <Text style={styles.bio}>{user.bio}</Text>
            )}

            <View style={styles.details}>
              {user.location && (
                <View style={styles.detailItem}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{user.location}</Text>
                </View>
              )}
              
              <View style={styles.detailItem}>
                <Shield size={16} color="#059669" />
                <Text style={styles.detailText}>Member since {memberSince}</Text>
              </View>
              
              {user.role === 'caregiver' && (
                <View style={styles.detailItem}>
                  <Award size={16} color="#2563EB" />
                  <Text style={styles.detailText}>Background checked</Text>
                </View>
              )}
            </View>
          </Card>

          {user.role === 'caregiver' && (
            <Card style={styles.skillsCard}>
              <Text style={styles.sectionTitle}>Skills & Experience</Text>
              <View style={styles.skillsGrid}>
                <View style={styles.skillItem}>
                  <Text style={styles.skillText}>Senior Care</Text>
                </View>
                <View style={styles.skillItem}>
                  <Text style={styles.skillText}>CPR Certified</Text>
                </View>
                <View style={styles.skillItem}>
                  <Text style={styles.skillText}>First Aid</Text>
                </View>
                <View style={styles.skillItem}>
                  <Text style={styles.skillText}>5+ Years Experience</Text>
                </View>
              </View>
            </Card>
          )}

          {onStartConversation && (
            <View style={styles.actions}>
              <Button
                title="Start Conversation"
                onPress={onStartConversation}
                size="large"
                style={styles.conversationButton}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  details: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  skillsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  actions: {
    paddingBottom: 40,
  },
  conversationButton: {
    width: '100%',
  },
});