import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export const Logo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
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