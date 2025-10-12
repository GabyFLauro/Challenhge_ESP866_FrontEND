import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native';

interface FeedbackIndicatorProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible: boolean;
  duration?: number;
  onHide?: () => void;
}

export const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({
  type,
  message,
  visible,
  duration = 3000,
  onHide
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Slide in and fade in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, slideAnim, duration, onHide]);

  if (!visible) return null;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#34C759', icon: '✅' };
      case 'error':
        return { backgroundColor: '#FF3B30', icon: '❌' };
      case 'warning':
        return { backgroundColor: '#FF9F0A', icon: '⚠️' };
      case 'info':
      default:
        return { backgroundColor: '#007AFF', icon: 'ℹ️' };
    }
  };

  const style = getStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: style.backgroundColor },
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.icon}>{style.icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FeedbackIndicator;