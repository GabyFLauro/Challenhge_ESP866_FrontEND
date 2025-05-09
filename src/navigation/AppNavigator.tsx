import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import PatientDashboardScreen from '../screens/PatientDashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { SensorsScreen } from '../screens/SensorsScreen';
import { SensorDetailScreen } from '../screens/SensorDetailScreen';
import { AccountSettingsScreen } from '../screens/AccountSettingsScreen';

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
  const { user } = useAuth();

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
        name="Sensors"
        component={SensorsScreen}
        options={{
          title: 'Sensores',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{
          title: 'Configurações',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      {user?.role === 'admin' && (
        <Drawer.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{
            title: 'Painel Admin',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="shield-outline" size={size} color={color} />
            ),
          }}
        />
      )}
      {user?.role === 'doctor' && (
        <Drawer.Screen
          name="DoctorDashboard"
          component={DoctorDashboardScreen}
          options={{
            title: 'Painel Médico',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="medical-outline" size={size} color={color} />
            ),
          }}
        />
      )}
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
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}; 