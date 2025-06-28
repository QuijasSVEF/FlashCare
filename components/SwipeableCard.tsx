import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  Image,
  Platform,
  PanResponder,
  Animated
} from 'react-native';
import { Heart, X, Star, MapPin, Clock } from 'lucide-react-native';
import { Card } from './ui/Card';

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
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderGrant: () => {
        translateX.setOffset(translateX._value);
        translateY.setOffset(translateY._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy);
        
        const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
        setIsSwipingLeft(swipeDirection === 'left' && Math.abs(gestureState.dx) > 50);
        setIsSwipingRight(swipeDirection === 'right' && Math.abs(gestureState.dx) > 50);
      },
      onPanResponderRelease: (evt, gestureState) => {
        translateX.flattenOffset();
        translateY.flattenOffset();
        
        const shouldSwipeLeft = gestureState.dx < -SWIPE_THRESHOLD || gestureState.vx < -0.5;
        const shouldSwipeRight = gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.5;

        if (shouldSwipeLeft) {
          Animated.timing(translateX, {
            toValue: -screenWidth,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onSwipeLeft();
            resetCard();
          });
        } else if (shouldSwipeRight) {
          Animated.timing(translateX, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onSwipeRight();
            resetCard();
          });
        } else {
          // Snap back to center
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }

        setIsSwipingLeft(false);
        setIsSwipingRight(false);
      },
    })
  ).current;

  const resetCard = () => {
    translateX.setValue(0);
    translateY.setValue(0);
  };

  const rotateInterpolate = translateX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const renderCaregiverCard = () => (
    <View style={styles.cardContent}>
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: data.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
          }}
          style={styles.profileImage}
        />
        <View style={styles.ratingBadge}>
          <Star size={16} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>4.8</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.name}>{data.name}</Text>
        <View style={styles.location}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.locationText}>{data.location || 'San Francisco, CA'}</Text>
        </View>
        
        <Text style={styles.bio} numberOfLines={3}>
          {data.bio || 'Experienced caregiver with 5+ years helping families. Specializing in senior care and disability support.'}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Clock size={16} color="#6B7280" />
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
        <Text style={styles.jobTitle}>{data.title}</Text>
        <View style={styles.familyInfo}>
          <Image
            source={{ 
              uri: data.family?.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
            }}
            style={styles.familyAvatar}
          />
          <Text style={styles.familyName}>{data.family?.name || 'Family Member'}</Text>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={4}>
        {data.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>{data.hours_per_week} hrs/week</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.detailText}>{data.location}</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.weeklyEarnings}>
          <Text style={styles.weeklyEarningsText}>
            ${(data.hours_per_week * data.rate_hour).toFixed(2)}/week
          </Text>
        </View>
        <Text style={styles.rateText}>${data.rate_hour}/hr</Text>
      </View>
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Card style={[
        styles.card,
        isSwipingLeft && styles.swipingLeft,
        isSwipingRight && styles.swipingRight,
      ]}>
        {userRole === 'family' ? renderCaregiverCard() : renderJobCard()}
      </Card>

      {/* Swipe Indicators */}
      {isSwipingLeft && (
        <View style={[styles.swipeIndicator, styles.passIndicator]}>
          <X size={32} color="#FFFFFF" />
        </View>
      )}
      {isSwipingRight && (
        <View style={[styles.swipeIndicator, styles.likeIndicator]}>
          <Heart size={32} color="#FFFFFF" />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 40,
    alignSelf: 'center',
  },
  card: {
    height: 500,
    borderRadius: 20,
    overflow: 'hidden',
  },
  swipingLeft: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  swipingRight: {
    borderColor: '#059669',
    borderWidth: 2,
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -10,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  infoSection: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
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
    color: '#6B7280',
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
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
  jobHeader: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  familyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  jobDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
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
    backgroundColor: '#EF4444',
  },
  likeIndicator: {
    right: 20,
    backgroundColor: '#059669',
  },
});