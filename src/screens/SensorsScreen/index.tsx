import React, { useEffect, useState } from 'react';
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
import { readingsService, ReadingDTO } from '../../services/readings';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sensors'>;

export const SensorsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const groupBySensor = (readings: ReadingDTO[]): Sensor[] => {
        const map = new Map<string, ReadingDTO[]>();
        readings.forEach(r => {
            if (!map.has(r.sensorId)) map.set(r.sensorId, []);
            map.get(r.sensorId)!.push(r);
        });
        return Array.from(map.entries()).map(([sensorId, rs]) => {
            const last = rs.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))[0];
            return {
                id: sensorId,
                name: `Sensor ${sensorId}`,
                status: last && last.value >= 80 ? 'error' : last && last.value >= 60 ? 'warning' : 'ok',
                lastUpdate: last ? new Date(last.timestamp).toLocaleString() : '-',
            } as Sensor;
        });
    };

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const readings = await readingsService.list();
            setSensors(groupBySensor(readings));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Falha ao buscar sensores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const readings = await readingsService.list();
            setSensors(groupBySensor(readings));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Falha ao atualizar');
        } finally {
            setRefreshing(false);
        }
    };

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
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {error && (
                    <Text style={{ color: '#FF3B30', marginBottom: 8 }}>{error}</Text>
                )}
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
            )}
        </View>
    );
};