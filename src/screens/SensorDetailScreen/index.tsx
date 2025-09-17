import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Logo } from '../../components/Logo';
import { LineChart } from 'react-native-chart-kit'; // Importação apenas do LineChart
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { readingsService } from '../../services/readings';
import { useSensorDetail } from '../../hooks/useSensorDetail';

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
    fontSize: Math.max(10, fontSize - 2), // Reduzir tamanho da fonte
  },
  // Configurações para evitar sobreposição
  propsForVerticalLabels: {
    fontSize: Math.max(8, fontSize - 4),
    rotation: 0,
  },
  propsForHorizontalLabels: {
    fontSize: Math.max(8, fontSize - 4),
  },
});

export const SensorDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sensorId } = route.params as { sensorId: string };
  const { width: screenWidth } = useWindowDimensions();
  const { width: chartWidth, height: chartHeight, fontSize: chartFontSize } = getChartDimensions(screenWidth);
  const { sensor, readings, loading, error, status, chartData, sortedReadings, hasEnoughDataForChart, load } = useSensorDetail(sensorId);
  const [posting, setPosting] = React.useState<boolean>(false);

  const handleUpdate = () => { load(); };

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

  // chartData, sortedReadings e hasEnoughDataForChart vêm do hook

  const getSensorDisplayName = (): string => {
    if (sensor) {
      return sensor.model ? `${sensor.name} (${sensor.model})` : sensor.name;
    }
    
    // Fallback para casos onde o sensor ainda não foi carregado
    switch (sensorId) {
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
      <Text style={styles.title}>{getSensorDisplayName()}</Text>

      {/* Informações do sensor */}
      {sensor && (
        <View style={styles.sensorInfoContainer}>
          {sensor.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Localização:</Text>
              <Text style={styles.infoValue}>{sensor.location}</Text>
            </View>
          )}
          {sensor.description && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📝 Descrição:</Text>
              <Text style={styles.infoValue}>{sensor.description}</Text>
            </View>
          )}
          {sensor.type && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🔧 Tipo:</Text>
              <Text style={styles.infoValue}>{sensor.type}</Text>
            </View>
          )}
          {sensor.unit && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📊 Unidade:</Text>
              <Text style={styles.infoValue}>{sensor.unit}</Text>
            </View>
          )}
          {sensor.minValue !== undefined && sensor.maxValue !== undefined && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📈 Faixa:</Text>
              <Text style={styles.infoValue}>
                {sensor.minValue} - {sensor.maxValue} {sensor.unit || ''}
              </Text>
            </View>
          )}
        </View>
      )}

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
        ) : hasEnoughDataForChart ? (
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
            segments={3}
            fromZero={false}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
            {sortedReadings.length === 0 
                ? 'Nenhuma leitura disponível' 
                : 'Dados insuficientes para o gráfico (mín. 2 leituras)'}
            </Text>
            <Text style={styles.noDataSubtext}>
              Use o botão "Registrar Leitura" para adicionar dados
            </Text>
          </View>
        )}
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Histórico ({sortedReadings.length} leituras)</Text>
        {sortedReadings.length > 0 ? (
          sortedReadings.map((data, index) => (
            <View key={data.id || index} style={styles.historyItem}>
              <Text style={styles.historyText}>{new Date(data.timestamp).toLocaleString()}</Text>
              <Text style={styles.historyText}>
                {data.value.toFixed(2)} {sensor?.unit || ''}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Nenhuma leitura registrada</Text>
            <Text style={styles.noDataSubtext}>
              Use o botão "Registrar Leitura" para adicionar dados
            </Text>
          </View>
        )}
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

