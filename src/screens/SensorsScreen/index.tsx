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
import { sensorsService, SensorDTO } from '../../services/sensors';
import { backendTestService } from '../../services/backendTest';
import { backendInvestigationService } from '../../services/backendInvestigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sensors'>;

export const SensorsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<string>('Verificando...');
    const [investigationResult, setInvestigationResult] = useState<string>('');

    const investigateBackend = async () => {
        try {
            console.log('🔍 Iniciando investigação do backend...');
            setInvestigationResult('Investigando estrutura do backend...');
            
            const result = await backendInvestigationService.runFullInvestigation();
            
            setInvestigationResult(result.summary);
            console.log('✅ Investigação concluída:', result.summary);
            
        } catch (error) {
            const errorMsg = `Erro na investigação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
            setInvestigationResult(errorMsg);
            console.error('❌ Erro na investigação:', error);
        }
    };

    const mapSensors = (items: SensorDTO[]): Sensor[] => {
        const now = new Date().toLocaleString();
        return items.map(s => ({
            id: s.id,
            name: s.model ? `${s.name} (${s.model})` : s.name,
            model: s.model,
            type: s.type,
            location: s.location,
            description: s.description,
            unit: s.unit,
            currentValue: s.currentValue,
            minValue: s.minValue,
            maxValue: s.maxValue,
            isActive: s.isActive,
            status: s.isActive === false ? 'error' : 
                   s.currentValue && s.maxValue && s.currentValue > s.maxValue * 0.9 ? 'warning' : 'ok',
            lastUpdate: s.lastReading?.timestamp ? new Date(s.lastReading.timestamp).toLocaleString() : now
        }));
    };

    const load = async () => {
        setLoading(true);
        setError(null);
        setBackendStatus('Verificando...');
        
        try {
            // Testar conectividade com backend
            const testResult = await backendTestService.runFullTest();
            
            if (testResult.connection.isConnected) {
                setBackendStatus('✅ Backend Conectado');
            } else {
                setBackendStatus('⚠️ Backend Offline');
            }
            
            // Carregar sensores
            const sensors = await sensorsService.list();
            setSensors(mapSensors(sensors));
            
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Falha ao buscar sensores');
            setBackendStatus('❌ Erro de Conexão');
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
            // Testar conectividade com backend
            const testResult = await backendTestService.runFullTest();
            
            if (testResult.connection.isConnected) {
                setBackendStatus('✅ Backend Conectado');
            } else {
                setBackendStatus('⚠️ Backend Offline');
            }
            
            // Carregar sensores
            const sensors = await sensorsService.list();
            setSensors(mapSensors(sensors));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Falha ao atualizar');
            setBackendStatus('❌ Erro de Conexão');
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
                <Text style={styles.backendStatus}>{backendStatus}</Text>
            </View>
            
            <TouchableOpacity style={styles.investigateButton} onPress={investigateBackend}>
                <Text style={styles.investigateButtonText}>🔍 Investigar Backend</Text>
            </TouchableOpacity>
            
            {investigationResult && (
                <View style={styles.investigationResult}>
                    <Text style={styles.investigationResultText}>{investigationResult}</Text>
                </View>
            )}
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