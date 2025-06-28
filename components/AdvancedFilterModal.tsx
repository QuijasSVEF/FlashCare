import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch 
} from 'react-native';
import { X, Filter, MapPin, DollarSign, Clock, Star, Award } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Colors } from '../constants/Colors';

interface AdvancedFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  userRole: 'family' | 'caregiver';
}

export function AdvancedFilterModal({ 
  visible, 
  onClose, 
  onApplyFilters, 
  userRole 
}: AdvancedFilterModalProps) {
  const [filters, setFilters] = useState({
    location: '',
    radius: '10',
    minRate: '',
    maxRate: '',
    minHours: '',
    maxHours: '',
    minRating: '',
    experience: '',
    availability: [] as string[],
    skills: [] as string[],
    certifications: [] as string[],
    backgroundCheck: false,
    instantBook: false,
    languages: [] as string[],
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      radius: '10',
      minRate: '',
      maxRate: '',
      minHours: '',
      maxHours: '',
      minRating: '',
      experience: '',
      availability: [],
      skills: [],
      certifications: [],
      backgroundCheck: false,
      instantBook: false,
      languages: [],
    });
  };

  const experienceOptions = [
    { label: 'Any Experience', value: '' },
    { label: '1+ Years', value: '1' },
    { label: '3+ Years', value: '3' },
    { label: '5+ Years', value: '5' },
    { label: '10+ Years', value: '10' },
  ];

  const ratingOptions = [
    { label: 'Any Rating', value: '' },
    { label: '4+ Stars', value: '4' },
    { label: '4.5+ Stars', value: '4.5' },
    { label: '4.8+ Stars', value: '4.8' },
  ];

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
    'Dementia Care',
    'Physical Therapy',
  ];

  const certificationOptions = [
    'CPR Certified',
    'First Aid',
    'CNA',
    'HHA',
    'Nursing License',
    'Background Check',
    'Drug Test',
    'References',
  ];

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Mornings',
    'Afternoons',
    'Evenings',
    'Overnight',
    'Live-in',
    'Emergency',
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Advanced Filters</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Location & Distance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Distance</Text>
            <Input
              value={filters.location}
              onChangeText={(text) => setFilters(prev => ({ ...prev, location: text }))}
              placeholder="City, State or ZIP code"
            />
            <View style={styles.row}>
              <Text style={styles.inputLabel}>Search Radius</Text>
              <View style={styles.radiusOptions}>
                {['5', '10', '25', '50'].map((radius) => (
                  <TouchableOpacity
                    key={radius}
                    style={[
                      styles.radiusButton,
                      filters.radius === radius && styles.radiusButtonSelected,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, radius }))}
                  >
                    <Text style={[
                      styles.radiusText,
                      filters.radius === radius && styles.radiusTextSelected,
                    ]}>
                      {radius} mi
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Rate & Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate & Hours</Text>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  value={filters.minRate}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, minRate: text }))}
                  placeholder="Min $/hour"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  value={filters.maxRate}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, maxRate: text }))}
                  placeholder="Max $/hour"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  value={filters.minHours}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, minHours: text }))}
                  placeholder="Min hours/week"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  value={filters.maxHours}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, maxHours: text }))}
                  placeholder="Max hours/week"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {userRole === 'family' && (
            <>
              {/* Rating & Experience */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rating & Experience</Text>
                <Text style={styles.subsectionTitle}>Minimum Rating</Text>
                <View style={styles.optionsGrid}>
                  {ratingOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        filters.minRating === option.value && styles.optionButtonSelected,
                      ]}
                      onPress={() => setFilters(prev => ({ ...prev, minRating: option.value }))}
                    >
                      <Text style={[
                        styles.optionText,
                        filters.minRating === option.value && styles.optionTextSelected,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.subsectionTitle}>Experience Level</Text>
                <View style={styles.optionsGrid}>
                  {experienceOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        filters.experience === option.value && styles.optionButtonSelected,
                      ]}
                      onPress={() => setFilters(prev => ({ ...prev, experience: option.value }))}
                    >
                      <Text style={[
                        styles.optionText,
                        filters.experience === option.value && styles.optionTextSelected,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Skills & Specialties */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills & Specialties</Text>
                <View style={styles.skillsGrid}>
                  {skillOptions.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={[
                        styles.skillButton,
                        filters.skills.includes(skill) && styles.skillButtonSelected,
                      ]}
                      onPress={() => toggleArrayItem(
                        filters.skills, 
                        skill, 
                        (skills) => setFilters(prev => ({ ...prev, skills }))
                      )}
                    >
                      <Text style={[
                        styles.skillText,
                        filters.skills.includes(skill) && styles.skillTextSelected,
                      ]}>
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Certifications */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications & Credentials</Text>
                <View style={styles.skillsGrid}>
                  {certificationOptions.map((cert) => (
                    <TouchableOpacity
                      key={cert}
                      style={[
                        styles.skillButton,
                        filters.certifications.includes(cert) && styles.skillButtonSelected,
                      ]}
                      onPress={() => toggleArrayItem(
                        filters.certifications, 
                        cert, 
                        (certifications) => setFilters(prev => ({ ...prev, certifications }))
                      )}
                    >
                      <Text style={[
                        styles.skillText,
                        filters.certifications.includes(cert) && styles.skillTextSelected,
                      ]}>
                        {cert}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Availability */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Availability</Text>
                <View style={styles.skillsGrid}>
                  {availabilityOptions.map((availability) => (
                    <TouchableOpacity
                      key={availability}
                      style={[
                        styles.skillButton,
                        filters.availability.includes(availability) && styles.skillButtonSelected,
                      ]}
                      onPress={() => toggleArrayItem(
                        filters.availability, 
                        availability, 
                        (availability) => setFilters(prev => ({ ...prev, availability }))
                      )}
                    >
                      <Text style={[
                        styles.skillText,
                        filters.availability.includes(availability) && styles.skillTextSelected,
                      ]}>
                        {availability}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Languages */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.skillsGrid}>
                  {languageOptions.map((language) => (
                    <TouchableOpacity
                      key={language}
                      style={[
                        styles.skillButton,
                        filters.languages.includes(language) && styles.skillButtonSelected,
                      ]}
                      onPress={() => toggleArrayItem(
                        filters.languages, 
                        language, 
                        (languages) => setFilters(prev => ({ ...prev, languages }))
                      )}
                    >
                      <Text style={[
                        styles.skillText,
                        filters.languages.includes(language) && styles.skillTextSelected,
                      ]}>
                        {language}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Special Requirements */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Special Requirements</Text>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Background Check Required</Text>
                  <Switch
                    value={filters.backgroundCheck}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, backgroundCheck: value }))}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Instant Booking Available</Text>
                  <Switch
                    value={filters.instantBook}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, instantBook: value }))}
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Clear All"
            onPress={handleClearFilters}
            variant="outline"
            style={styles.clearButton}
          />
          <Button
            title="Apply Filters"
            onPress={handleApplyFilters}
            style={styles.applyButton}
          />
        </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  row: {
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
    marginRight: 8,
  },
  radiusOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  radiusButtonSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF2FF',
  },
  radiusText: {
    fontSize: 14,
    color: '#6B7280',
  },
  radiusTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
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
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  skillButtonSelected: {
    borderColor: '#059669',
    backgroundColor: '#D1FAE5',
  },
  skillText: {
    fontSize: 12,
    color: '#6B7280',
  },
  skillTextSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  clearButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});