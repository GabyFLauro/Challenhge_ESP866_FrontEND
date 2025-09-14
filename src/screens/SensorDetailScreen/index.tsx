import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Logo } from '../../components/Logo';
import { LineChart } from 'react-native-chart-kit'; // Importação apenas do LineChart
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { readingsService, ReadingDTO } from '../../services/readings';
import { sensorsService, SensorDTO } from '../../services/sensors';

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

  const [readings, setReadings] = useState<ReadingDTO[]>([]);
  const [sensor, setSensor] = useState<SensorDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const status: Status = useMemo(() => {
    if (readings.length === 0) return 'ok';
    
    // Ordenar leituras por timestamp (mais recente primeiro)
    const sortedReadings = [...readings].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const last = sortedReadings[0];
    
    if (!last) return 'ok';
    
    // Lógica de status baseada no tipo de sensor e valores
    if (sensor) {
      const { minValue, maxValue, type } = sensor;
      
      if (type === 'limit_switch') {
        return last.value === 1 ? 'ok' : 'warning';
      }
      
      if (minValue !== undefined && maxValue !== undefined) {
        const range = maxValue - minValue;
        const warningThreshold = maxValue - (range * 0.1); // 90% da faixa máxima
        const errorThreshold = maxValue - (range * 0.05); // 95% da faixa máxima
        
        if (last.value >= errorThreshold) return 'error';
        if (last.value >= warningThreshold) return 'warning';
        return 'ok';
      }
    }
    
    // Fallback para lógica antiga
    return last.value >= 80 ? 'error' : last.value >= 60 ? 'warning' : 'ok';
  }, [readings, sensor]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🔍 Carregando dados para sensor: ${sensorId}`);
      
      // Buscar dados do sensor e leituras em paralelo
      const [sensorData, readingsData] = await Promise.all([
        sensorsService.getById(sensorId),
        readingsService.listBySensor(sensorId)
      ]);
      
      console.log(`📊 Sensor carregado:`, sensorData);
      console.log(`📈 Leituras carregadas: ${readingsData.length} leituras`);
      
      setSensor(sensorData);
      setReadings(readingsData);
      
      if (readingsData.length === 0) {
        console.log('⚠️ Nenhuma leitura encontrada para este sensor');
      }
    } catch (e) {
      console.error('❌ Erro ao carregar dados do sensor:', e);
      setError(e instanceof Error ? e.message : 'Falha ao buscar dados do sensor');
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

  // Ordenar leituras por timestamp para o gráfico
  const sortedReadings = [...readings].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Limitar a 8 pontos para melhor legibilidade do gráfico
  const chartReadings = sortedReadings.slice(-8);
  
  const chartData = {
    labels: chartReadings.map((data, index) => {
      const date = new Date(data.timestamp);
      // Mostrar apenas algumas horas para evitar sobreposição
      if (chartReadings.length <= 4) {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      } else {
        // Para mais pontos, mostrar apenas minutos
        return `${date.getMinutes().toString().padStart(2, '0')}`;
      }
    }),
    datasets: [
      {
        data: chartReadings.map(data => data.value),
        color: (opacity = 1) => rgba(0, 122, 255, opacity),
        strokeWidth: 2,
      },
    ],
  };

  // Garantir que o gráfico tenha pelo menos 2 pontos para ser exibido
  const hasEnoughDataForChart = chartReadings.length >= 2;

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

