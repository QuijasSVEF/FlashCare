import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { X, MapPin, DollarSign, Clock, Star } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Colors } from '../constants/Colors';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  userRole: 'family' | 'caregiver';
}

export function FilterModal({ 
  visible, 
  onClose, 
  onApplyFilters, 
  userRole 
}: FilterModalProps) {
  const [filters, setFilters] = useState({
    location: '',
    minRate: '',
    maxRate: '',
    minHours: '',
    maxHours: '',
    minRating: '',
    experience: '',
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      minRate: '',
      maxRate: '',
      minHours: '',
      maxHours: '',
      minRating: '',
      experience: '',
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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter {userRole === 'family' ? 'Caregivers' : 'Jobs'}</Text>
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
                <Text style={styles.sectionTitle}>Minimum Rating</Text>
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
              </View>

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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
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
    borderColor: Colors.gray[200],
    backgroundColor: Colors.background,
  },
  optionButtonSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  optionTextSelected: {
    color: Colors.primary[500],
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
  clearButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});