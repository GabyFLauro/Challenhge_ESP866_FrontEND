import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Logo } from '../../components/Logo';
import { LineChart } from 'react-native-chart-kit'; // Importação apenas do LineChart
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { readingsService, ReadingDTO } from '../../services/readings';

// Função auxiliar para cores RGBA
const rgba = (r: number, g: number, b: number, a: number) => `rgba(${r},${g},${b},${a})`;

type Status = 'ok' | 'warning' | 'error';

// Calcular tamanho responsivo do gráfico
const getChartDimensions = (screenWidth: number) => {
  const width = screenWidth - 50; // Diminuir o tamanho do gráfico (antes estava com padding horizontal de 32px, agora 64px)
  const height = width * 0.75; // Reduzir altura do gráfico para 50% da largura
  const fontSize = Math.max(8, Math.floor(width / 40));
  return { width, height, fontSize };
};

const getLineChartConfig = (fontSize: number) => ({
  backgroundColor: '#1C1C1E',
  backgroundGradientFrom: '#1C1C1E',
  backgroundGradientTo: '#1C1C1E',
  decimalPlaces: 1,
  color: (opacity = 1) => rgba(0, 122, 255, opacity),
  labelColor: (opacity = 1) => rgba(255, 255, 255, opacity),
  style: {
    borderRadius: 1,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#007AFF',
  },
  propsForLabels: {
    fontSize,
  },
});

export const SensorDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sensorId } = route.params as { sensorId: string };
  const { width: screenWidth } = useWindowDimensions();
  const { width: chartWidth, height: chartHeight, fontSize: chartFontSize } = getChartDimensions(screenWidth);

  const [readings, setReadings] = useState<ReadingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const status: Status = useMemo(() => {
    if (readings.length === 0) return 'ok';
    const last = [...readings].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))[0];
    if (!last) return 'ok';
    return last.value >= 80 ? 'error' : last.value >= 60 ? 'warning' : 'ok';
  }, [readings]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await readingsService.listBySensor(sensorId);
      setReadings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao buscar histórico');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [sensorId]);

  const handleUpdate = () => {
    load();
  };

  const randomInRange = (min: number, max: number, decimals = 2) => {
    const n = Math.random() * (max - min) + min;
    const factor = Math.pow(10, decimals);
    return Math.round(n * factor) / factor;
  };

  const getMockValueForSensor = (id: string): number => {
    switch (id) {
      // Pressão em bar (ou unidade equivalente) – faixas coerentes
      case 'p1': // XGZP701DB1R
        return randomInRange(2.0, 8.0, 2);
      case 'p2': // HX710B
        return randomInRange(1.0, 6.0, 2);
      // Temperatura em °C
      case 't1': // DS18B20
        return randomInRange(18.0, 35.0, 1);
      // Chave fim de curso (0/1)
      case 'l1':
        return Math.random() < 0.5 ? 0 : 1;
      // Vibração em m/s² aproximado
      case 'vx':
        return randomInRange(0.0, 15.0, 2);
      case 'vy':
        return randomInRange(0.0, 15.0, 2);
      case 'vz':
        return randomInRange(0.0, 15.0, 2);
      default:
        return randomInRange(0.0, 100.0, 2);
    }
  };

  const getStatusColor = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return '#007AFF';
      case 'warning':
        return '#FFC107';
      case 'error':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
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

  const getStatusText = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return 'NORMAL';
      case 'warning':
        return 'ALERTA';
      case 'error':
        return 'CRÍTICO';
      default:
        return 'DESCONHECIDO';
    }
  };

  const chartData = {
    labels: readings.map(data => new Date(data.timestamp).toLocaleTimeString().split(':').slice(0, 2).join(':')),
    datasets: [
      {
        data: readings.map(data => data.value),
        color: (opacity = 1) => rgba(0, 122, 255, opacity),
        strokeWidth: 2,
      },
    ],
  };

  const getSensorName = (id: string): string => {
    switch (id) {
      case 'p1':
        return 'Pressão 01 (XGZP701DB1R)';
      case 'p2':
        return 'Pressão 02 (HX710B)';
      case 't1':
        return 'Temperatura (DS18B20)';
      case 'l1':
        return 'Chave fim de curso';
      case 'vx':
        return 'Vibração X';
      case 'vy':
        return 'Vibração Y';
      case 'vz':
        return 'Vibração Z';
      default:
        return 'Sensor Desconhecido';
    }
  };  

  return (
    <ScrollView style={styles.container}>
      <Logo />
      <Text style={styles.title}>{getSensorName(sensorId)}</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <View style={styles.statusValueContainer}>
          <Ionicons
            name={getStatusIcon(status)}
            size={24}
            color={getStatusColor(status)}
            style={styles.statusIcon}
          />
          <Text style={[styles.statusValue, { color: getStatusColor(status) }]}>{getStatusText(status)}</Text>
        </View>
      </View>

      {!!readings.length && (
        <View style={styles.currentValueContainer}>
          <Text style={styles.currentValueLabel}>Valor Atual:</Text>
          <Text style={[styles.currentValue, { color: getStatusColor(status) }]}>
            {readings[0].value.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Linha</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <LineChart
            data={chartData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={getLineChartConfig(chartFontSize)}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            segments={4}
          />
        )}
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Histórico</Text>
        {readings.map((data, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyText}>{new Date(data.timestamp).toLocaleString()}</Text>
            <Text style={styles.historyText}>{data.value.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Atualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.updateButton, { backgroundColor: '#34C759' }]}
        onPress={async () => {
          setPosting(true);
          try {
            const mock = {
              sensorId,
              value: getMockValueForSensor(sensorId),
            };
            await readingsService.create(mock);
            Alert.alert('Sucesso', 'Leitura registrada');
            load();
          } catch (e) {
            Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao registrar leitura');
          } finally {
            setPosting(false);
          }
        }}
        disabled={posting}
      >
        <Text style={styles.updateButtonText}>{posting ? 'Enviando...' : 'Registrar Leitura'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

