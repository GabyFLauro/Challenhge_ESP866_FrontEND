import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { Sensor } from './interfaces/sensor';
import { useSensors } from '../../hooks/useSensors';
import LoadingOverlay from '../../components/LoadingOverlay';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sensors'>;

export const SensorsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { listView: sensors, loading, refreshing, error, refresh } = useSensors();

    const getStatusColor = (status: Sensor['status']) => {
        switch (status) {
            case 'ok':
                return '#007AFF'; // Azul
            case 'warning':
                return '#FFC107'; // Amarelo
            case 'error':
                return '#FF3B30'; // Vermelho
            default:
                return '#8E8E93'; // Cinza
        }
    };

    const getStatusIcon = (status: Sensor['status']) => {
        switch (status) {
            case 'ok':
                return 'checkmark-circle';
            case 'warning':
                return 'warning';
            case 'error':
                return 'alert-circle';
            default:
                return 'help-circle';
        }
    };

    return (
        <View style={styles.container}>
            <Logo />
            <View style={styles.header}>
                <Text h4 style={styles.title}>Sensores Disponíveis</Text>
            </View>
            
            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
                {error && (
                    <Text style={{ color: '#FF3B30', marginBottom: 8 }}>{error}</Text>
                )}
                {sensors.map((sensor) => {
                    let statusLabel = 'CRÍTICO';
                    if (sensor.status === 'ok') statusLabel = 'NORMAL';
                    else if (sensor.status === 'warning') statusLabel = 'ALERTA';
                    return (
                        <TouchableOpacity
                            key={sensor.id}
                            style={styles.sensorCard}
                            onPress={() => navigation.navigate('SensorDetail', { sensorId: sensor.id })}
                        >
                            <View style={styles.sensorInfo}>
                                <Text style={styles.sensorName}>{sensor.name}</Text>
                                {sensor.location && (
                                    <Text style={styles.sensorLocation}>📍 {sensor.location}</Text>
                                )}
                                {sensor.description && (
                                    <Text style={styles.sensorDescription}>{sensor.description}</Text>
                                )}
                                {sensor.currentValue !== undefined && (
                                    <Text style={styles.currentValue}>
                                        Valor atual: {sensor.currentValue.toFixed(2)} {sensor.unit || ''}
                                    </Text>
                                )}
                                <Text style={styles.lastUpdate}>Última atualização: {sensor.lastUpdate}</Text>
                            </View>
                            <View style={styles.statusContainer}>
                                <Ionicons 
                                    name={getStatusIcon(sensor.status)} 
                                    size={24} 
                                    color={getStatusColor(sensor.status)} 
                                />
                                <Text style={[styles.status, { color: getStatusColor(sensor.status) }]}> 
                                    {statusLabel}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <LoadingOverlay visible={loading} message="Carregando sensores..." />
        </View>
    );
};