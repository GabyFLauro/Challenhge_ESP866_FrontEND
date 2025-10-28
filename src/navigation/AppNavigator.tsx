import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { Suspense, lazy } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingProvider, useLoading } from '../contexts/LoadingContext';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';

// Eager-loaded screens (login/register should load immediately)
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Lazy-loaded heavy screens
const SensorsScreen = lazy(() => import('../screens/SensorsScreen').then(m => ({ default: m.SensorsScreen })));
const SensorDetailScreen = lazy(() => import('../screens/SensorDetailScreen').then(m => ({ default: m.SensorDetailScreen })));
const DashboardRealtime = lazy(() => import('../screens/DashboardRealtime'));
const MetricScreen = lazy(() => import('../screens/MetricScreen'));

// Fallback loading component for lazy-loaded screens
const ScreenLoadingFallback = () => (
  <View style={screenLoadingStyles.container}>
    <ActivityIndicator size="large" color="#0328d4" />
  </View>
);

const screenLoadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const LogoutScreen = () => {
  const { signOut } = useAuth();
  React.useEffect(() => {
    signOut();
  }, []);
  return <View />;
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#1C1C1E',
          width: 240,
        },
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFFFFF',
        drawerLabelStyle: {
          color: '#FFFFFF',
        },
        drawerActiveBackgroundColor: '#2C2C2E',
        drawerActiveTintColor: '#0328d4',
        drawerInactiveTintColor: '#8E8E93',
      }}
    >
      <Drawer.Screen
        name="Realtime"
        options={{
          title: 'Realtime',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <DashboardRealtime />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Pressure"
        initialParams={{ keyName: 'pressao02_hx710b', title: 'Pressão HX710B', unit: 'Pa' }}
        options={{
          title: 'Pressão (HX710B)',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <MetricScreen />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Temperature"
        initialParams={{ keyName: 'temperatura_ds18b20', title: 'Temperatura DS18B20', unit: '°C' }}
        options={{
          title: 'Temperatura',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="thermometer-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <MetricScreen />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="VibrationX"
        initialParams={{ keyName: 'vibracao_vib_x', title: 'Vibração X', unit: 'g' }}
        options={{
          title: 'Vibração X',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <MetricScreen />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="VibrationY"
        initialParams={{ keyName: 'vibracao_vib_y', title: 'Vibração Y', unit: 'g' }}
        options={{
          title: 'Vibração Y',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <MetricScreen />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="VibrationZ"
        initialParams={{ keyName: 'vibracao_vib_z', title: 'Vibração Z', unit: 'g' }}
        options={{
          title: 'Vibração Z',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <MetricScreen />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Velocity"
        initialParams={{ keyName: 'velocidade_m_s', title: 'Velocidade', unit: 'm/s' }}
        options={{
          title: 'Velocidade',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="navigate-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <MetricScreen />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="LimitSwitch"
        initialParams={{ keyName: 'chave_fim_de_curso', title: 'Chave Fim de Curso' }}
        options={{
          title: 'Chave Fim de Curso',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="toggle-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoadingFallback />}>
            <MetricScreen />
          </Suspense>
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          title: 'Sair',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color="#FF3B30" />
          ),
          drawerLabelStyle: {
            color: '#FF3B30',
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                {!user ? (
                    // Rotas públicas
                    <>
                        <Stack.Screen 
                            name="Login" 
                            component={LoginScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen 
                            name="Register" 
                            component={RegisterScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                    </>
                ) : (
                    // Rotas protegidas
                    <>
                        <Stack.Screen
                            name="DrawerNavigator"
                            component={DrawerNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="SensorDetail"
                            options={{ 
                                title: 'Detalhes do Sensor',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#1C1C1E',
                                },
                                headerTintColor: '#FFFFFF',
                            }}
                        >
                            {() => (
                                <Suspense fallback={<ScreenLoadingFallback />}>
                                    <SensorDetailScreen />
                                </Suspense>
                            )}
                        </Stack.Screen>
                        <Stack.Screen
                            name="Metric"
                            options={{ 
                                title: 'Métrica',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#1C1C1E',
                                },
                                headerTintColor: '#FFFFFF',
                            }}
                        >
                            {() => (
                                <Suspense fallback={<ScreenLoadingFallback />}>
                                    <MetricScreen />
                                </Suspense>
                            )}
                        </Stack.Screen>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;