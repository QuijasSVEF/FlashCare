import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, MapPin, MessageCircle, User } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProfileModal } from '../../components/ProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../lib/database';

export default function JobApplicantsScreen() {
  const { jobId, jobTitle } = useLocalSearchParams<{ jobId: string; jobTitle: string }>();
  const { user } = useAuth();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadApplicants();
    }
  }, [jobId]);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      const jobApplicants = await databaseService.getJobPostApplicants(jobId);
      setApplicants(jobApplicants);
    } catch (error) {
      console.error('Error loading applicants:', error);
      Alert.alert('Error', 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = (applicant: any) => {
    // Check if there's already a match
    // For now, show a message that they need to match first
    Alert.alert(
      'Start Conversation',
      `To message ${applicant.caregiver.name}, you need to like them back from the main browsing screen to create a match.`,
      [{ text: 'OK' }]
    );
  };

  const handleViewProfile = (applicant: any) => {
    setSelectedProfile(applicant.caregiver);
    setShowProfileModal(true);
  };

  const renderApplicant = ({ item }: { item: any }) => {
    const caregiver = item.caregiver;
    
    return (
      <Card style={styles.applicantCard}>
        <View style={styles.applicantHeader}>
          <Image
            source={{ 
              uri: caregiver.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
            }}
            style={styles.avatar}
          />
          
          <View style={styles.applicantInfo}>
            <Text style={styles.applicantName}>{caregiver.name}</Text>
            
            <View style={styles.rating}>
              <Star size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.ratingCount}>(127 reviews)</Text>
            </View>
            
            {caregiver.location && (
              <View style={styles.location}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.locationText}>{caregiver.location}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => handleStartConversation(item)}
          >
            <MessageCircle size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {caregiver.bio && (
          <Text style={styles.applicantBio} numberOfLines={3}>
            {caregiver.bio}
          </Text>
        )}

        <View style={styles.applicantFooter}>
          <Text style={styles.appliedDate}>
            Applied {new Date(item.created_at).toLocaleDateString()}
          </Text>
          
          <Button
            title="View Profile"
            onPress={() => handleViewProfile(item)}
            variant="outline"
            size="small"
          />
        </View>
      </Card>
    );
  };

  if (user?.role !== 'family') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorText}>
            Only family members can view job applicants.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Applicants</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {jobTitle || 'Job Posting'}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading applicants...</Text>
        </View>
      ) : (
        <FlatList
          data={applicants}
          renderItem={renderApplicant}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.applicantsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <User size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No applicants yet</Text>
              <Text style={styles.emptyText}>
                Caregivers who are interested in this position will appear here. 
                Make sure your job posting is detailed and attractive to get more applicants.
              </Text>
            </View>
          }
        />
      )}

      {selectedProfile && (
        <ProfileModal
          visible={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProfile(null);
          }}
          user={selectedProfile}
          onStartConversation={() => {
            setShowProfileModal(false);
            handleStartConversation({ caregiver: selectedProfile });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  applicantsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  applicantCard: {
    marginBottom: 0,
  },
  applicantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  messageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  applicantBio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  applicantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});