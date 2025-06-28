import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Search, Filter, MapPin, Star, Clock, DollarSign } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { SearchModal } from '../../components/SearchModal';
import { AdvancedFilterModal } from '../../components/AdvancedFilterModal';
import { CaregiverProfileCard } from '../../components/CaregiverProfileCard';
import { EmergencyButton } from '../../components/EmergencyButton';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../lib/database';

export default function SearchScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      loadDefaultResults();
    }
  }, [searchQuery, activeFilters]);

  const loadDefaultResults = async () => {
    try {
      setLoading(true);
      if (user?.role === 'family') {
        const caregivers = await databaseService.searchCaregivers({
          location: user.location,
          ...activeFilters
        });
        setResults(caregivers);
      } else {
        const jobs = await databaseService.searchJobPosts({
          location: user?.location,
          ...activeFilters
        });
        setResults(jobs);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      if (user?.role === 'family') {
        const caregivers = await databaseService.searchCaregivers({
          location: searchQuery,
          ...activeFilters
        });
        setResults(caregivers);
      } else {
        const jobs = await databaseService.searchJobPosts({
          location: searchQuery,
          ...activeFilters
        });
        setResults(jobs);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
  };

  const renderCaregiverItem = ({ item }: { item: any }) => (
    <CaregiverProfileCard 
      caregiver={item}
      onMessage={() => console.log('Message caregiver:', item.id)}
      onViewProfile={() => console.log('View profile:', item.id)}
    />
  );

  const renderJobItem = ({ item }: { item: any }) => {
    const weeklyEarnings = item.hours_per_week * item.rate_hour;
    
    return (
      <Card style={styles.resultCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={styles.familyInfo}>
            <Image
              source={{ 
                uri: item.family?.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
              }}
              style={styles.familyAvatar}
            />
            <Text style={styles.familyName}>{item.family?.name}</Text>
          </View>
        </View>

        <Text style={styles.jobDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.jobDetails}>
          <View style={styles.jobDetail}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.jobDetailText}>{item.location}</Text>
          </View>
          <View style={styles.jobDetail}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.jobDetailText}>{item.hours_per_week} hrs/week</Text>
          </View>
          <View style={styles.jobDetail}>
            <DollarSign size={14} color="#6B7280" />
            <Text style={styles.jobDetailText}>${item.rate_hour}/hr</Text>
          </View>
        </View>

        <View style={styles.jobFooter}>
          <View style={styles.weeklyEarnings}>
            <Text style={styles.weeklyEarningsText}>
              ${weeklyEarnings.toFixed(2)}/week
            </Text>
          </View>
          <Text style={styles.postedTime}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={`Search ${user?.role === 'family' ? 'Caregivers' : 'Jobs'}`}
        subtitle={`Find the perfect ${user?.role === 'family' ? 'caregiver' : 'opportunity'} for you`}
        emergencyPhone={user?.emergency_phone}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search by location...`}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowAdvancedFilters(true)}
        >
          <Filter size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {Object.keys(activeFilters).length > 0 && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersText}>
            {Object.keys(activeFilters).length} filter(s) applied
          </Text>
          <TouchableOpacity onPress={() => setActiveFilters({})}>
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={results}
        renderItem={user?.role === 'family' ? renderCaregiverItem : renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Search size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {loading ? 'Searching...' : 'No results found'}
            </Text>
            <Text style={styles.emptyText}>
              {loading 
                ? 'Finding the best matches for you...'
                : 'Try adjusting your search criteria or filters'
              }
            </Text>
          </View>
        }
      />

      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleApplyFilters}
        userRole={user?.role || 'family'}
      />

      <AdvancedFilterModal
        visible={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApplyFilters={handleApplyFilters}
        userRole={user?.role || 'family'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 48,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  activeFiltersText: {
    fontSize: 14,
    color: '#6B7280',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  resultCard: {
    marginBottom: 0,
  },
  resultHeader: {
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
  resultInfo: {
    flex: 1,
  },
  resultName: {
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
  rateContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  resultBio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  jobHeader: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  familyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  familyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  jobDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyEarnings: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weeklyEarningsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  postedTime: {
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
});