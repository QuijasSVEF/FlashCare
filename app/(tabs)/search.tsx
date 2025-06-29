import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button'; 
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

export default function SignInScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); 
  const [errors, setErrors] = useState<Record<string, string>>({});

  const routerInstance = useRouter();
  const { signIn, user } = useAuth();
  
  // If user is already signed in, redirect to tabs
  useEffect(() => {
      const result = await signIn(formData.email, formData.password);
      console.log('Signin successful, result:', !!result);
      
      // Small delay to ensure auth state is properly set
      setTimeout(() => {
        console.log('Navigating to tabs after signin');
        routerInstance.replace('/(tabs)');
      }, 100);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      console.log('Attempting signin with:', formData.email);
      const result = await signIn(formData.email, formData.password);
      console.log('Signin request sent successfully');
      // Navigation will be handled by the root layout based on auth state
    } catch (error: any) {
      console.error('Signin error:', error);
      let errorMessage = 'Failed to sign in';
const { width } = Dimensions.get('window');
      } else if (error.message?.includes('too_many_requests')) {
interface AnalyticsData {
  totalMatches: number;
  activeJobs: number;
  completedJobs: number;
  averageRating: number;
  totalEarnings: number;
  responseRate: number;
  profileViews: number;
  weeklyStats: Array<{ day: string; matches: number; earnings: number }>;
}

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = Colors.primary[500],
    suffix = '' 
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    color?: string;
    suffix?: string;
  }) => (
    <Card style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        {change && (
          <View style={[styles.changeIndicator, { backgroundColor: Colors.success + '15' }]}>
            <Text style={[styles.changeText, { color: Colors.success }]}>
              {change}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}{suffix}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Card>
  );

  const WeeklyChart = () => (
    <Card style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Weekly Performance</Text>
        <View style={styles.timeframeSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.timeframeButton,
                timeframe === period && styles.timeframeButtonActive
              ]}
              onPress={() => setTimeframe(period)}
            >
              <Text style={[
                styles.timeframeText,
                timeframe === period && styles.timeframeTextActive
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.chart}>
        <View style={styles.chartBars}>
          {analytics.weeklyStats.map((stat, index) => {
            const maxEarnings = Math.max(...analytics.weeklyStats.map(s => s.earnings));
            const height = (stat.earnings / maxEarnings) * 120;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: height || 4,
                        backgroundColor: Colors.primary[500]
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{stat.day}</Text>
                <Text style={styles.barValue}>${stat.earnings}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );

  if (user?.role !== 'caregiver') {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Analytics"
          subtitle="Performance insights and metrics"
        />
        <View style={styles.errorContainer}>
          <BarChart3 size={64} color={Colors.gray[300]} />
          <Text style={styles.errorTitle}>Analytics Not Available</Text>
          <Text style={styles.errorText}>
            Analytics dashboard is only available for caregivers. 
            Family members can view their activity in the Profile section.
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Analytics"
          subtitle="Performance insights and metrics"
        />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <BarChart3 size={48} color={Colors.primary[500]} />
          </View>
          <Text style={styles.loadingText}>Loading your analytics...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppHeader
        title="Analytics Dashboard"
        subtitle="Track your caregiving performance"
      />

      <View style={styles.content}>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <StatCard
            title="Total Matches"
            value={analytics.totalMatches}
            change="+12%"
            icon={Users}
            color={Colors.primary[500]}
          />
          
          <StatCard
            title="Active Jobs"
            value={analytics.activeJobs}
            change="+5%"
            icon={Calendar}
            color={Colors.secondary[500]}
          />
          
          <StatCard
            title="Avg Rating"
            value={analytics.averageRating.toFixed(1)}
            icon={Star}
            color={Colors.warning}
          />
          
          <StatCard
            title="Total Earnings"
            value={`$${analytics.totalEarnings.toLocaleString()}`}
            change="+18%"
            icon={DollarSign}
            color={Colors.success}
          />
        </View>

        {/* Weekly Performance Chart */}
        <WeeklyChart />

        {/* Performance Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Performance Insights</Text>
          
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: Colors.success + '15' }]}>
                <TrendingUp size={16} color={Colors.success} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Response Rate</Text>
                <Text style={styles.insightValue}>{analytics.responseRate}%</Text>
                <Text style={styles.insightDescription}>
                  You respond to messages 15% faster than average
                </Text>
              </View>
            </View>
            
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: Colors.primary[500] + '15' }]}>
                <Users size={16} color={Colors.primary[500]} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Profile Views</Text>
                <Text style={styles.insightValue}>{analytics.profileViews}</Text>
                <Text style={styles.insightDescription}>
                  Your profile was viewed 23 times this week
                </Text>
              </View>
            </View>
            
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: Colors.warning + '15' }]}>
                <Award size={16} color={Colors.warning} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Completed Jobs</Text>
                <Text style={styles.insightValue}>{analytics.completedJobs}</Text>
                <Text style={styles.insightDescription}>
                  You've successfully completed {analytics.completedJobs} care sessions
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          
          <View style={styles.actionsList}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.primary[50] }]}>
                <TrendingUp size={20} color={Colors.primary[500]} />
              </View>
              <Text style={styles.actionText}>View Detailed Report</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.secondary[50] }]}>
                <Users size={20} color={Colors.secondary[500]} />
              </View>
              <Text style={styles.actionText}>Optimize Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.success + '15' }]}>
                <DollarSign size={20} color={Colors.success} />
              </View>
              <Text style={styles.actionText}>Earnings History</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
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
    color: Colors.text.primary,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  chartCard: {
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 2,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeframeButtonActive: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeframeText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  timeframeTextActive: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  chart: {
    height: 160,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  barValue: {
    fontSize: 10,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  insightsCard: {
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  actionsCard: {
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  actionsList: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
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
    marginRight: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary[500],
    marginLeft: 8,
  },
  boltBadge: {
    position: 'absolute',
    right: -60,
    width: 30,
    height: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
  },
  signInButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  signUpLink: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
  demoSection: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  demoButton: {
    minWidth: 100,
  },
});