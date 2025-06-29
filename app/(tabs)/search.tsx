import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Search, Filter, MapPin, DollarSign, Clock, Star, Award, Users, TrendingUp } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppHeader } from '../../components/AppHeader';
import { CaregiverProfileCard } from '../../components/CaregiverProfileCard';
import { JobCard } from '../../components/JobCard';
import { AdvancedSearchFilters } from '../../components/AdvancedSearchFilters';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../lib/database';
import { Colors } from '../../constants/Colors';

export default function SearchScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [searchType, setSearchType] = useState<'all' | 'caregivers' | 'jobs'>('all');

  useEffect(() => {
    if (user?.role === 'family') {
      setSearchType('caregivers');
      loadCaregivers();
    } else {
      setSearchType('jobs');
      loadJobs();
    }
  }, [user?.role]);

  const loadCaregivers = async () => {
    try {
      setLoading(true);
      const caregivers = await databaseService.searchCaregivers(activeFilters);
      setResults(caregivers);
    } catch (error) {
      console.error('Error loading caregivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobs = await databaseService.searchJobPosts(activeFilters);
      setResults(jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const searchFilters = {
        ...activeFilters,
        query: searchQuery,
      };

      if (user?.role === 'family') {
        const caregivers = await databaseService.searchCaregivers(searchFilters);
        setResults(caregivers);
      } else {
        const jobs = await databaseService.searchJobPosts(searchFilters);
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
    setShowFilters(false);
    
    // Reload results with new filters
    if (user?.role === 'family') {
      loadCaregivers();
    } else {
      loadJobs();
    }
  };

  const renderSearchResult = ({ item }: { item: any }) => {
    if (user?.role === 'family') {
      return (
        <CaregiverProfileCard
          caregiver={item}
          onMessage={() => console.log('Message caregiver')}
          onViewProfile={() => console.log('View profile')}
        />
      );
    } else {
      return <JobCard job={item} />;
    }
  };

  const getActiveFiltersCount = () => {
    return Object.keys(activeFilters).filter(key => {
      const value = activeFilters[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }).length;
  };

  if (showFilters) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Advanced Search"
          rightComponent={
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.doneButton}>Done</Text>
            </TouchableOpacity>
          }
        />
        <AdvancedSearchFilters
          onApplyFilters={handleApplyFilters}
          userRole={user?.role || 'family'}
          initialFilters={activeFilters}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title={user?.role === 'family' ? 'Find Caregivers' : 'Find Jobs'}
        subtitle="Advanced search and filtering"
      />

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={user?.role === 'family' ? 'Search caregivers...' : 'Search jobs...'}
            style={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Search size={20} color={Colors.text.inverse} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={getActiveFiltersCount() > 0 ? Colors.text.inverse : Colors.primary[500]} />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFilters}>
        <TouchableOpacity style={styles.quickFilter}>
          <MapPin size={16} color={Colors.primary[500]} />
          <Text style={styles.quickFilterText}>Nearby</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickFilter}>
          <Star size={16} color={Colors.warning} />
          <Text style={styles.quickFilterText}>Top Rated</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickFilter}>
          <Clock size={16} color={Colors.secondary[500]} />
          <Text style={styles.quickFilterText}>Available Now</Text>
        </TouchableOpacity>
        
        {user?.role === 'family' && (
          <TouchableOpacity style={styles.quickFilter}>
            <Award size={16} color={Colors.success} />
            <Text style={styles.quickFilterText}>Certified</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {results.length} {user?.role === 'family' ? 'caregivers' : 'jobs'} found
          </Text>
          
          <TouchableOpacity style={styles.sortButton}>
            <TrendingUp size={16} color={Colors.text.secondary} />
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Search size={64} color={Colors.gray[300]} />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting your search criteria or filters
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  doneButton: {
    fontSize: 16,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  searchButton: {
    backgroundColor: Colors.primary[500],
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  filterButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: Colors.text.inverse,
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickFilters: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  quickFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  quickFilterText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  resultsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
  },
  sortText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  resultsList: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});