import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch 
} from 'react-native';
import { Filter, MapPin, DollarSign, Clock, Star, Award } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface AdvancedSearchFiltersProps {
  onApplyFilters: (filters: any) => void;
  userRole: 'family' | 'caregiver';
  initialFilters?: any;
}

export function AdvancedSearchFilters({ 
  onApplyFilters, 
  userRole, 
  initialFilters = {} 
}: AdvancedSearchFiltersProps) {
  const [filters, setFilters] = useState({
    location: '',
    radius: 10,
    minRate: '',
    maxRate: '',
    minHours: '',
    maxHours: '',
    minRating: '',
    experience: '',
    skills: [] as string[],
    availability: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    backgroundCheck: false,
    instantBook: false,
    ...initialFilters
  });

  const skillOptions = [
    'Senior Care', 'Child Care', 'Disability Support', 'Medical Care',
    'Companionship', 'Housekeeping', 'Meal Preparation', 'Transportation',
    'Pet Care', 'Overnight Care', 'Dementia Care', 'Physical Therapy'
  ];

  const availabilityOptions = [
    'Weekdays', 'Weekends', 'Mornings', 'Afternoons', 
    'Evenings', 'Overnight', 'Live-in', 'Emergency'
  ];

  const certificationOptions = [
    'CPR Certified', 'First Aid', 'CNA', 'HHA', 
    'Nursing License', 'Background Check', 'Drug Test', 'References'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 
    'Italian', 'Portuguese', 'Chinese', 'Japanese'
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleApply = () => {
    // Clean up empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length === 0) return acc;
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    onApplyFilters(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      radius: 10,
      minRate: '',
      maxRate: '',
      minHours: '',
      maxHours: '',
      minRating: '',
      experience: '',
      skills: [],
      availability: [],
      certifications: [],
      languages: [],
      backgroundCheck: false,
      instantBook: false,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Location & Distance */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={20} color="#2563EB" />
          <Text style={styles.sectionTitle}>Location & Distance</Text>
        </View>
        
        <Input
          value={filters.location}
          onChangeText={(text) => setFilters(prev => ({ ...prev, location: text }))}
          placeholder="City, State or ZIP code"
        />
        
        <Text style={styles.inputLabel}>Search Radius: {filters.radius} miles</Text>
        <View style={styles.radiusSlider}>
          {[5, 10, 25, 50, 100].map((radius) => (
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
                {radius}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Rate & Hours */}
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <DollarSign size={20} color="#2563EB" />
          <Text style={styles.sectionTitle}>Rate & Hours</Text>
        </View>
        
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
      </Card>

      {userRole === 'family' && (
        <>
          {/* Skills & Specialties */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>Skills & Specialties</Text>
            </View>
            
            <View style={styles.tagsContainer}>
              {skillOptions.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.tag,
                    filters.skills.includes(skill) && styles.tagSelected,
                  ]}
                  onPress={() => toggleArrayItem(
                    filters.skills, 
                    skill, 
                    (skills) => setFilters(prev => ({ ...prev, skills }))
                  )}
                >
                  <Text style={[
                    styles.tagText,
                    filters.skills.includes(skill) && styles.tagTextSelected,
                  ]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Certifications */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>Certifications</Text>
            </View>
            
            <View style={styles.tagsContainer}>
              {certificationOptions.map((cert) => (
                <TouchableOpacity
                  key={cert}
                  style={[
                    styles.tag,
                    filters.certifications.includes(cert) && styles.tagSelected,
                  ]}
                  onPress={() => toggleArrayItem(
                    filters.certifications, 
                    cert, 
                    (certifications) => setFilters(prev => ({ ...prev, certifications }))
                  )}
                >
                  <Text style={[
                    styles.tagText,
                    filters.certifications.includes(cert) && styles.tagTextSelected,
                  ]}>
                    {cert}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Availability */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>Availability</Text>
            </View>
            
            <View style={styles.tagsContainer}>
              {availabilityOptions.map((availability) => (
                <TouchableOpacity
                  key={availability}
                  style={[
                    styles.tag,
                    filters.availability.includes(availability) && styles.tagSelected,
                  ]}
                  onPress={() => toggleArrayItem(
                    filters.availability, 
                    availability, 
                    (availability) => setFilters(prev => ({ ...prev, availability }))
                  )}
                >
                  <Text style={[
                    styles.tagText,
                    filters.availability.includes(availability) && styles.tagTextSelected,
                  ]}>
                    {availability}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Special Requirements */}
          <Card style={styles.section}>
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
          </Card>
        </>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Reset Filters"
          onPress={handleReset}
          variant="outline"
          style={styles.resetButton}
        />
        <Button
          title="Apply Filters"
          onPress={handleApply}
          style={styles.applyButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  radiusSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tagSelected: {
    borderColor: '#059669',
    backgroundColor: '#D1FAE5',
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  tagTextSelected: {
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
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});