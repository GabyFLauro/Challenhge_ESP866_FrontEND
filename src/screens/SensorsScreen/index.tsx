import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { Sensor } from './interfaces/sensor';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sensors'>;

export const SensorsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [sensors] = useState<Sensor[]>([
        { id: '1', name: 'Sensor de Proximidade Magnético', status: 'ok', lastUpdate: '2024-02-20 10:30' },
        { id: '2', name: 'Encoder Linear', status: 'error', lastUpdate: '2024-02-20 10:25' },
        { id: '3', name: 'Sensor de Pressão', status: 'warning', lastUpdate: '2024-02-20 10:20' },
        { id: '4', name: 'Fluxômetro de Ar', status: 'ok', lastUpdate: '2024-02-20 10:15' },
        { id: '5', name: 'Contador de Ciclos', status: 'ok', lastUpdate: '2024-02-20 10:10' },
        { id: '6', name: 'Sensor de Tempo', status: 'ok', lastUpdate: '2024-02-20 10:05' },
        { id: '7', name: 'Sensor de Vibração', status: 'error', lastUpdate: '2024-02-20 10:00' },
        { id: '8', name: 'Sensor de Temperatura', status: 'ok', lastUpdate: '2024-02-20 09:55' },
    ]);

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
            <ScrollView style={styles.scrollView}>
                {sensors.map((sensor) => (
                    <TouchableOpacity
                        key={sensor.id}
                        style={styles.sensorCard}
                        onPress={() => navigation.navigate('SensorDetail', { sensorId: sensor.id })}
                    >
                        <View style={styles.sensorInfo}>
                            <Text style={styles.sensorName}>{sensor.name}</Text>
                            <Text style={styles.lastUpdate}>Última atualização: {sensor.lastUpdate}</Text>
                        </View>
                        <View style={styles.statusContainer}>
                            <Ionicons 
                                name={getStatusIcon(sensor.status)} 
                                size={24} 
                                color={getStatusColor(sensor.status)} 
                            />
                            <Text style={[styles.status, { color: getStatusColor(sensor.status) }]}>
                                {sensor.status === 'ok' ? 'NORMAL' : 
                                 sensor.status === 'warning' ? 'ALERTA' : 'CRÍTICO'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};