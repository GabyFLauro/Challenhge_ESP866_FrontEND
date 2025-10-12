import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';
import styled from 'styled-components/native';
import theme from '../styles/theme';

type Props = {
  visible: boolean;
  message?: string;
};

export const LoadingOverlay: React.FC<Props> = ({ visible, message }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) return null;

  return (
    <Animated.View style={[overlayStyles.overlay, { opacity: fadeAnim }]} testID="loading-overlay">
      <Animated.View style={[overlayStyles.content, { transform: [{ scale: scaleAnim }] }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {message ? <Text style={overlayStyles.message}>{message}</Text> : null}
      </Animated.View>
    </Animated.View>
  );
};

const overlayStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    padding: 24,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoadingOverlay;
