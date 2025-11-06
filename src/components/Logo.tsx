import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

type LogoProps = {
  size?: number; // diameter of the circular container
  style?: ViewStyle; // overrides for outer container
  circleStyle?: ViewStyle; // overrides for circle container
};

export const Logo: React.FC<LogoProps> = ({ size = 75, style, circleStyle }) => {
  const logoInnerRatio = 62.5 / 75; // original inner logo size ratio
  const innerSize = size * logoInnerRatio;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.circleContainer, { width: size, height: size, borderRadius: size / 2 }, circleStyle]}>
        <Image
          source={require('../../assets/logo.png')}
          style={[styles.logo, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  circleContainer: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0328d4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 62.5,
    height: 62.5,
    borderRadius: 31.25,
  },
}); 