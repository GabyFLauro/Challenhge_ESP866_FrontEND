import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { UIProvider } from './src/contexts/UIContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SensorRealtimeProvider } from './src/contexts/SensorRealtimeContext';
import theme from './src/styles/theme';
import { THEME_VERSION } from './src/config/themeColors';

export default function App() {
  // Log da versão do tema para debug (garante que está recarregando)
  console.log(`🎨 Theme Version: ${THEME_VERSION}`);
  
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <UIProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={theme.colors.primary}
          />
          <SensorRealtimeProvider>
            <AppNavigator />
          </SensorRealtimeProvider>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
