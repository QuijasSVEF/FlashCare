import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Heart, X, Star, MapPin, Clock, DollarSign } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Colors } from '../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.25;

interface SwipeableCardProps {
  data: any;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  userRole: 'family' | 'caregiver';
}

export function SwipeableCard({ 
  data, 
  onSwipeLeft, 
  onSwipeRight, 
  userRole 
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);

  const resetCard = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
    setIsSwipingLeft(false);
    setIsSwipingRight(false);
  };
  
  const updateSwipeDirection = (x: number) => {
    'worklet';
    if (x < -50) {
      runOnJS(setIsSwipingLeft)(true);
      runOnJS(setIsSwipingRight)(false);
    } else if (x > 50) {
      runOnJS(setIsSwipingLeft)(false);
      runOnJS(setIsSwipingRight)(true);
    } else {
      runOnJS(setIsSwipingLeft)(false);
      runOnJS(setIsSwipingRight)(false);
    }
  };

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      runOnJS(onSwipeLeft)();
    } else {
      runOnJS(onSwipeRight)();
    }
    
    // Reset after animation completes
    setTimeout(() => {
      runOnJS(resetCard)();
    }, 300);
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY / 3; // Reduce vertical movement
      rotate.value = (event.translationX / screenWidth) * 30; // -30 to 30 degrees
      updateSwipeDirection(event.translationX);
    })
    .onEnd((event) => {
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD;
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD;

      if (shouldSwipeLeft) {
        translateX.value = withTiming(-screenWidth, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)('left');
        });
      } else if (shouldSwipeRight) {
        translateX.value = withTiming(screenWidth, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)('right');
        });
      } else {
        resetCard();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` }
      ]
    };
  });

  const renderCaregiverCard = () => (
    <View style={styles.cardContent}>
      <View style={styles.imageContainer}>
        {data.avatar_url ? (
          <Image
            source={{ uri: data.avatar_url }}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.profileImage}
          />
        )}
        <View style={styles.ratingBadge}>
          <Star size={16} color={Colors.warning} fill={Colors.warning} />
          <Text style={styles.ratingText}>4.8</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>✓ Verified</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.name}>{data.name}</Text>
        <View style={styles.location}>
          <MapPin size={16} color={Colors.text.secondary} />
          <Text style={styles.locationText}>{data.location || 'San Francisco, CA'}</Text>
        </View>
        
        <Text style={styles.bio} numberOfLines={3}>
          {data.bio || 'Experienced caregiver with 5+ years helping families. Specializing in senior care and disability support.'}
        </Text>

        <View style={styles.skillsContainer}>
          {['Senior Care', 'CPR Certified', 'First Aid'].map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Clock size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText}>5+ years</Text>
          </View>
          <View style={styles.rateContainer}>
            <Text style={styles.rateText}>$25/hr</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderJobCard = () => (
    <View style={styles.cardContent}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle} numberOfLines={2}>{data.title}</Text>
        <View style={styles.familyInfo}>
          {data.family?.avatar_url ? (
            <Image
              source={{ uri: data.family.avatar_url }}
              style={styles.familyAvatar}
            />
          ) : (
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3768168/pexels-photo-3768168.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              style={styles.familyAvatar}
            />
          )}
          <View>
            <Text style={styles.familyName}>{data.family?.name || 'Family Member'}</Text>
            <View style={styles.location}>
              <MapPin size={14} color={Colors.text.secondary} />
              <Text style={styles.locationText}>{data.location}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={4}>
        {data.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Clock size={16} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{data.hours_per_week} hrs/week</Text>
        </View>
        <View style={styles.detailItem}>
          <DollarSign size={16} color={Colors.text.secondary} />
          <Text style={styles.detailText}>${data.rate_hour}/hr</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.weeklyEarnings}>
          <Text style={styles.weeklyEarningsText}>
            ${(data.hours_per_week * data.rate_hour).toFixed(2)}/week
          </Text>
        </View>
        <Text style={styles.postedTime}>
          {new Date(data.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Card style={[
          styles.card,
          isSwipingLeft && styles.swipingLeft,
          isSwipingRight && styles.swipingRight,
        ]} variant="elevated">
          {userRole === 'family' ? renderCaregiverCard() : renderJobCard()}
        </Card>

        {/* Swipe Indicators */}
        {isSwipingLeft && (
          <View style={[styles.swipeIndicator, styles.passIndicator]}>
            <X size={32} color={Colors.text.inverse} />
          </View>
        )}
        {isSwipingRight && (
          <View style={[styles.swipeIndicator, styles.likeIndicator]}>
            <Heart size={32} color={Colors.text.inverse} />
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  card: {
    minHeight: 500,
    maxHeight: 540,
    borderRadius: 24,
    overflow: 'hidden',
  },
  swipingLeft: {
    borderColor: Colors.error,
    borderWidth: 3,
    shadowColor: Colors.error,
    shadowOpacity: 0.4,
  },
  swipingRight: {
    borderColor: Colors.primary[500],
    borderWidth: 3,
    shadowColor: Colors.primary[500],
    shadowOpacity: 0.4,
  },
  cardContent: {
    flex: 1,
    padding: 24,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: Colors.background,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -10,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 4,
  },
  verifiedBadge: {
    position: 'absolute',
    top: -5,
    left: 80,
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  infoSection: {
    flex: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
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
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  rateContainer: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  jobHeader: {
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[700],
    marginBottom: 16,
  },
  familyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyEarnings: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  weeklyEarningsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[700],
  },
  postedTime: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  swipeIndicator: {
    position: 'absolute',
    top: '50%',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -40 }],
  },
  passIndicator: {
    left: 20,
    backgroundColor: Colors.error,
  },
  likeIndicator: {
    right: 20,
    backgroundColor: Colors.primary[500],
  },
});