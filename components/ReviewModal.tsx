import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { X, Star } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { databaseService } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  revieweeId: string;
  revieweeName: string;
  onReviewSubmitted: () => void;
}

export function ReviewModal({ 
  visible, 
  onClose, 
  revieweeId, 
  revieweeName,
  onReviewSubmitted 
}: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to submit a review');
      return;
    }

    try {
      setLoading(true);
      await databaseService.createReview({
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        rating_int: rating,
        comment_text: comment.trim() || undefined,
      });

      Alert.alert('Success', 'Review submitted successfully!');
      onReviewSubmitted();
      onClose();
      
      // Reset form
      setRating(0);
      setComment('');
    } catch (error: any) {
      if (error.message?.includes('duplicate key')) {
        Alert.alert('Error', 'You have already reviewed this person');
      } else {
        Alert.alert('Error', 'Failed to submit review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Star
              size={32}
              color={star <= rating ? Colors.warning : Colors.gray[300]}
              fill={star <= rating ? Colors.warning : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Review {revieweeName}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            How was your experience with {revieweeName}?
          </Text>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Rating</Text>
            {renderStars()}
            <Text style={styles.ratingText}>
              {rating === 0 ? 'Tap to rate' : `${rating} star${rating !== 1 ? 's' : ''}`}
            </Text>
          </View>

          <Input
            label="Comments (Optional)"
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience..."
            multiline
            numberOfLines={4}
            style={styles.commentInput}
          />

          <Button
            title={loading ? "Submitting..." : "Submit Review"}
            onPress={handleSubmitReview}
            disabled={loading || rating === 0}
            size="large"
            style={styles.submitButton}
          />

          <Text style={styles.disclaimer}>
            Reviews are public and help build trust in our community. 
            Please be honest and constructive in your feedback.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  commentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});