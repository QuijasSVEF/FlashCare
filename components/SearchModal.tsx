import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { X, Search, MapPin, DollarSign, Clock } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Colors } from '../constants/Colors';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (filters: any) => void;
  userRole: 'family' | 'caregiver';
}

export function SearchModal({ 
  visible, 
  onClose, 
  onSearch, 
  userRole 
}: SearchModalProps) {
  const [filters, setFilters] = useState({
    location: '',
    minRate: '',
    maxRate: '',
    minHours: '',
    maxHours: '',
    experience: '',
    skills: [] as string[],
  });

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      minRate: '',
      maxRate: '',
      minHours: '',
      maxHours: '',
      experience: '',
      skills: [],
    });
  };

  const experienceOptions = [
    { label: 'Any Experience', value: '' },
    { label: '1+ Years', value: '1' },
    { label: '3+ Years', value: '3' },
    { label: '5+ Years', value: '5' },
    { label: '10+ Years', value: '10' },
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
  ];

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Search {userRole === 'family' ? 'Caregivers' : 'Jobs'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Input
              value={filters.location}
              onChangeText={(text) => setFilters(prev => ({ ...prev, location: text }))}
              placeholder="City, State or ZIP code"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hourly Rate</Text>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  value={filters.minRate}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, minRate: text }))}
                  placeholder="Min $"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  value={filters.maxRate}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, maxRate: text }))}
                  placeholder="Max $"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hours per Week</Text>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  value={filters.minHours}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, minHours: text }))}
                  placeholder="Min hours"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  value={filters.maxHours}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, maxHours: text }))}
                  placeholder="Max hours"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {userRole === 'family' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience Level</Text>
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
                      onPress={() => toggleSkill(skill)}
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
            title="Search"
            onPress={handleSearch}
            style={styles.searchButton}
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
  searchButton: {
    flex: 1,
  },
});