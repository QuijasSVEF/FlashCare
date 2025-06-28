import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';

interface TypingIndicatorProps {
  visible: boolean;
  userName?: string;
}

export function TypingIndicator({ visible, userName = 'Someone' }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const animateDots = () => {
        const createAnimation = (dot: Animated.Value, delay: number) => {
          return Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]);
        };

        Animated.loop(
          Animated.parallel([
            createAnimation(dot1, 0),
            createAnimation(dot2, 200),
            createAnimation(dot3, 400),
          ])
        ).start();
      };

      animateDots();
    } else {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }
  }, [visible, dot1, dot2, dot3]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{userName} is typing</Text>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot1,
                transform: [
                  {
                    scale: dot1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot2,
                transform: [
                  {
                    scale: dot2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot3,
                transform: [
                  {
                    scale: dot3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  }, 
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  text: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginRight: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 3, 
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gray[400],
  },
});