import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { X, Star, MapPin, Phone, Award, Shield, Calendar, Clock, DollarSign, Users, Heart, MessageCircle } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ReviewModal } from './ReviewModal';
import { databaseService } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';

interface DetailedProfileModalProps {
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

export function DetailedProfileModal({ 
  visible, 
  onClose, 
  user, 
  onStartConversation 
}: DetailedProfileModalProps) {
  const { user: currentUser } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userRating, setUserRating] = useState({ average: 0, count: 0 });
  const [userJobs, setUserJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible && user.id) {
      loadUserData();
    }
  }, [visible, user.id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load rating
      const rating = await databaseService.getUserRating(user.id);
      setUserRating(rating);

      // Load jobs if family
      if (user.role === 'family') {
        const jobs = await databaseService.getUserJobPosts(user.id);
        setUserJobs(jobs);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const memberSince = new Date(user.created_at).getFullYear();
  
  // Mock data for demo - in production, fetch from database
  const mockCaregiverData = {
    experience: '5+ years',
    hourlyRate: 25,
    skills: ['Senior Care', 'CPR Certified', 'First Aid', 'Companionship', 'Meal Preparation', 'Transportation'],
    certifications: ['CPR Certified', 'First Aid', 'Background Check', 'References'],
    languages: ['English', 'Spanish'],
    availability: ['Weekdays', 'Weekends', 'Mornings', 'Afternoons'],
    specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management'],
    education: 'Certified Nursing Assistant (CNA)',
    emergencyContact: '+1 (555) 911-0000'
  };

  const mockFamilyData = {
    familySize: 4,
    careNeeds: ['Senior Care', 'Daily Activities', 'Medication Management', 'Companionship'],
    preferredSchedule: 'Weekdays 9AM-5PM',
    specialRequirements: ['CPR Certified', 'Experience with dementia'],
    emergencyContact: '+1 (555) 911-0000'
  };

  const renderCaregiverProfile = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ 
            uri: user.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>Professional Caregiver</Text>
          
          <View style={styles.rating}>
            <Star size={18} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.ratingText}>
              {userRating.average > 0 ? userRating.average.toFixed(1) : '4.8'}
            </Text>
            <Text style={styles.ratingCount}>
              ({userRating.count > 0 ? userRating.count : '127'} reviews)
            </Text>
          </View>
          
          <View style={styles.location}>
            <MapPin size={16} color={Colors.text.secondary} />
            <Text style={styles.locationText}>{user.location || 'San Francisco, CA'}</Text>
          </View>
        </View>
        
        <View style={styles.rateContainer}>
          <Text style={styles.rateText}>${mockCaregiverData.hourlyRate}/hr</Text>
        </View>
      </View>

      {/* Bio */}
      {user.bio && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </Card>
      )}

      {/* Experience & Education */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Experience & Education</Text>
        <View style={styles.experienceItem}>
          <Clock size={16} color={Colors.primary[500]} />
          <Text style={styles.experienceText}>{mockCaregiverData.experience} of caregiving experience</Text>
        </View>
        <View style={styles.experienceItem}>
          <Award size={16} color={Colors.secondary[500]} />
          <Text style={styles.experienceText}>{mockCaregiverData.education}</Text>
        </View>
      </Card>

      {/* Skills & Specialties */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Skills & Specialties</Text>
        <View style={styles.skillsGrid}>
          {mockCaregiverData.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Certifications */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications & Credentials</Text>
        <View style={styles.certificationsGrid}>
          {mockCaregiverData.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationBadge}>
              <Shield size={14} color={Colors.success} />
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Availability */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <View style={styles.availabilityGrid}>
          {mockCaregiverData.availability.map((time, index) => (
            <View key={index} style={styles.availabilityTag}>
              <Calendar size={14} color={Colors.accent[500]} />
              <Text style={styles.availabilityText}>{time}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Languages */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <Text style={styles.languagesText}>
          {mockCaregiverData.languages.join(', ')}
        </Text>
      </Card>

      {/* Contact Information */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactItem}>
          <Phone size={16} color={Colors.text.secondary} />
          <Text style={styles.contactText}>{user.phone || '+1 (555) 123-4567'}</Text>
        </View>
        <View style={styles.contactItem}>
          <Phone size={16} color={Colors.error} />
          <Text style={styles.contactText}>Emergency: {mockCaregiverData.emergencyContact}</Text>
        </View>
      </Card>

      {/* Member Since */}
      <Card style={styles.section}>
        <View style={styles.memberInfo}>
          <Shield size={20} color={Colors.success} />
          <Text style={styles.memberText}>Verified member since {memberSince}</Text>
        </View>
      </Card>
    </ScrollView>
  );

  const renderFamilyProfile = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ 
            uri: user.avatar_url || 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>Family Member</Text>
          
          <View style={styles.location}>
            <MapPin size={16} color={Colors.text.secondary} />
            <Text style={styles.locationText}>{user.location || 'San Francisco, CA'}</Text>
          </View>
          
          <View style={styles.familyStats}>
            <Users size={16} color={Colors.primary[500]} />
            <Text style={styles.familyStatsText}>Family of {mockFamilyData.familySize}</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      {user.bio && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About Our Family</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </Card>
      )}

      {/* Active Job Posts */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Current Job Postings</Text>
        {userJobs.length > 0 ? (
          userJobs.map((job, index) => (
            <View key={index} style={styles.jobItem}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobDescription} numberOfLines={2}>
                {job.description}
              </Text>
              <View style={styles.jobDetails}>
                <View style={styles.jobDetail}>
                  <Clock size={14} color={Colors.text.secondary} />
                  <Text style={styles.jobDetailText}>{job.hours_per_week} hrs/week</Text>
                </View>
                <View style={styles.jobDetail}>
                  <DollarSign size={14} color={Colors.text.secondary} />
                  <Text style={styles.jobDetailText}>${job.rate_hour}/hr</Text>
                </View>
              </View>
              <View style={styles.weeklyTotal}>
                <Text style={styles.weeklyTotalText}>
                  ${(job.hours_per_week * job.rate_hour).toFixed(2)}/week
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noJobsText}>No active job postings</Text>
        )}
      </Card>

      {/* Care Needs */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Care Needs</Text>
        <View style={styles.needsGrid}>
          {mockFamilyData.careNeeds.map((need, index) => (
            <View key={index} style={styles.needTag}>
              <Heart size={12} color={Colors.secondary[500]} />
              <Text style={styles.needText}>{need}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Preferred Schedule */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Preferred Schedule</Text>
        <View style={styles.scheduleItem}>
          <Calendar size={16} color={Colors.accent[500]} />
          <Text style={styles.scheduleText}>{mockFamilyData.preferredSchedule}</Text>
        </View>
      </Card>

      {/* Special Requirements */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Special Requirements</Text>
        <View style={styles.requirementsGrid}>
          {mockFamilyData.specialRequirements.map((req, index) => (
            <View key={index} style={styles.requirementTag}>
              <Shield size={12} color={Colors.warning} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Contact Information */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactItem}>
          <Phone size={16} color={Colors.text.secondary} />
          <Text style={styles.contactText}>{user.phone || '+1 (555) 987-6543'}</Text>
        </View>
        <View style={styles.contactItem}>
          <Phone size={16} color={Colors.error} />
          <Text style={styles.contactText}>Emergency: {mockFamilyData.emergencyContact}</Text>
        </View>
      </Card>

      {/* Member Since */}
      <Card style={styles.section}>
        <View style={styles.memberInfo}>
          <Shield size={20} color={Colors.success} />
          <Text style={styles.memberText}>Verified member since {memberSince}</Text>
        </View>
      </Card>
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {user.role === 'caregiver' ? 'Caregiver Profile' : 'Family Profile'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {user.role === 'caregiver' ? renderCaregiverProfile() : renderFamilyProfile()}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="View Reviews"
            onPress={() => setShowReviewModal(true)}
            variant="outline"
            style={styles.reviewButton}
          />
          
          {onStartConversation && currentUser?.id !== user.id && (
            <Button
              title="Start Conversation"
              onPress={onStartConversation}
              style={styles.conversationButton}
            />
          )}
        </View>

        <ReviewModal
          visible={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          revieweeId={user.id}
          revieweeName={user.name}
          onReviewSubmitted={() => {
            loadUserData();
            setShowReviewModal(false);
          }}
        />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  familyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyStatsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  rateContainer: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  certificationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  certificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
    marginLeft: 4,
  },
  availabilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availabilityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent[200],
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent[600],
    marginLeft: 4,
  },
  languagesText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberText: {
    fontSize: 16,
    color: Colors.success,
    marginLeft: 8,
    fontWeight: '600',
  },
  jobItem: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  weeklyTotal: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  weeklyTotalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  noJobsText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  needsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  needTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary[200],
  },
  needText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary[600],
    marginLeft: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  requirementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  requirementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  requirementText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    gap: 12,
  },
  reviewButton: {
    flex: 1,
  },
  conversationButton: {
    flex: 1,
  },
});