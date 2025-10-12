import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { SensorsScreen } from '../screens/SensorsScreen';
import { SensorDetailScreen } from '../screens/SensorDetailScreen';
import DashboardRealtime from '../screens/DashboardRealtime';
import MetricScreen from '../screens/MetricScreen';

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
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#8E8E93',
      }}
    >
      <Drawer.Screen
        name="Realtime"
        component={DashboardRealtime}
        options={{
          title: 'Realtime',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Pressure"
        component={MetricScreen}
        initialParams={{ keyName: 'pressao02_hx710b', title: 'Pressão HX710B', unit: 'Pa' }}
        options={{
          title: 'Pressão (HX710B)',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Temperature"
        component={MetricScreen}
        initialParams={{ keyName: 'temperatura_ds18b20', title: 'Temperatura DS18B20', unit: '°C' }}
        options={{
          title: 'Temperatura',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="thermometer-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="VibrationX"
        component={MetricScreen}
        initialParams={{ keyName: 'vibracao_vib_x', title: 'Vibração X', unit: 'g' }}
        options={{
          title: 'Vibração X',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="VibrationY"
        component={MetricScreen}
        initialParams={{ keyName: 'vibracao_vib_y', title: 'Vibração Y', unit: 'g' }}
        options={{
          title: 'Vibração Y',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="VibrationZ"
        component={MetricScreen}
        initialParams={{ keyName: 'vibracao_vib_z', title: 'Vibração Z', unit: 'g' }}
        options={{
          title: 'Vibração Z',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Velocity"
        component={MetricScreen}
        initialParams={{ keyName: 'velocidade_m_s', title: 'Velocidade', unit: 'm/s' }}
        options={{
          title: 'Velocidade',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="navigate-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="LimitSwitch"
        component={MetricScreen}
        initialParams={{ keyName: 'chave_fim_de_curso', title: 'Chave Fim de Curso' }}
        options={{
          title: 'Chave Fim de Curso',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="toggle-outline" size={size} color={color} />
          ),
        }}
      />

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
                            component={SensorDetailScreen}
                            options={{ 
                                title: 'Detalhes do Sensor',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#1C1C1E',
                                },
                                headerTintColor: '#FFFFFF',
                            }}
                        />
            <Stack.Screen
              name="Metric"
              component={MetricScreen}
              options={{ 
                title: 'Métrica',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#1C1C1E',
                },
                headerTintColor: '#FFFFFF',
              }}
            />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};