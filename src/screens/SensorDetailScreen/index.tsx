import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator, Alert, FlatList } from 'react-native';
import AlertRedIcon from '../../components/AlertRedIcon';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Logo } from '../../components/Logo';
import ChartPanel from '../../components/ChartPanel';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { readingsService } from '../../services/readings';
import { useSensorDetail } from '../../hooks/useSensorDetail';
import { useSensorRealtime } from '../../contexts/SensorRealtimeContext';
import LoadingOverlay from '../../components/LoadingOverlay';
import { classifyMetric } from '../../utils/alerts';
import { getSensorDetailChartConfig } from '../../utils/chartConfig';
import { parseReadingValue, extractReadingTimestamp } from '../../utils/sensors';

// Função auxiliar para cores RGBA
const rgba = (r: number, g: number, b: number, a: number) => `rgba(${r},${g},${b},${a})`;

type Status = 'ok' | 'warning' | 'error';

// Calcular tamanho responsivo do gráfico
const getChartDimensions = (screenWidth: number) => {
  const width = screenWidth - 50;
  const height = Math.round(width * 0.75);
  const fontSize = Math.max(8, Math.floor(width / 40));
  return { width, height, fontSize };
};

export const SensorDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sensorId } = route.params as { sensorId: string };
  const { width: screenWidth } = useWindowDimensions();
  const { width: chartWidth, height: chartHeight, fontSize: chartFontSize } = getChartDimensions(screenWidth);
  const { sensor, readings, loading, error, status, chartData, sortedReadings, hasEnoughDataForChart, load, loadMore, hasMore } = useSensorDetail(sensorId);
  const realtime = useSensorRealtime();

  // try get realtime buffer for this sensor
  const realtimeBuffer = realtime ? realtime.getBuffer(sensorId) : [];
  const realtimeLast = realtime ? realtime.getLast(sensorId) : null;
  const realtimeLabels = React.useMemo(() => {
    if (!realtimeBuffer || realtimeBuffer.length === 0) return [] as string[];
    return realtimeBuffer.map((item, idx) => {
      const iso = extractReadingTimestamp(item);
      try {
        if (iso) {
          const d = new Date(iso);
          if (!isNaN(d.getTime())) return d.toLocaleTimeString();
        }
      } catch (e) {
        // ignore
      }
      return `${idx + 1}`;
    });
  }, [realtimeBuffer]);

  const isTempOrVib = ['t1','vx','vy','vz'].includes(sensorId);
  const isPressure = ['p1','p2'].includes(sensorId);
  const [posting, setPosting] = React.useState<boolean>(false);
  const [historyCollapsed, setHistoryCollapsed] = React.useState<boolean>(true);

  const currentReadingValue = React.useMemo(() => {
    if (realtimeLast) {
      return parseReadingValue(realtimeLast, sensorId);
    }
    return readings[0]?.value ?? null;
  }, [realtimeLast, readings, sensorId]);

  // Render item for FlatList (memoized to avoid recreation)
  const renderHistoryItem = React.useCallback(({ item, index }: { item: any; index: number }) => (
    <View key={item.id || index} style={styles.historyItem}>
      <Text style={styles.historyText}>{new Date(item.timestamp).toLocaleString()}</Text>
      <Text style={styles.historyText}>{item.value.toFixed(2)} {sensor?.unit || ''}</Text>
    </View>
  ), [sensor?.unit]);

  const keyExtractor = React.useCallback((item: any, index: number) => item.id?.toString() || `history-${index}`, []);

  // Use centralized parseReadingValue from utils for robust parsing of different message shapes

  const handleUpdate = () => { load(); };

  const handleRegisterReading = React.useCallback(async () => {
    setPosting(true);
    try {
      const mock = { sensorId, value: getMockValueForSensor(sensorId) };
      await readingsService.create(mock);
      Alert.alert('Sucesso', 'Leitura registrada');
      load();
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao registrar leitura');
    } finally {
      setPosting(false);
    }
  }, [sensorId, load]);

  const randomInRange = (min: number, max: number, decimals = 2) => {
    const n = Math.random() * (max - min) + min;
    const factor = Math.pow(10, decimals);
    return Math.round(n * factor) / factor;
  };

  const getMockValueForSensor = (id: string): number => {
    switch (id) {
      case 'p1': return randomInRange(2.0, 8.0, 2);
      case 'p2': return randomInRange(1.0, 6.0, 2);
      case 't1': return randomInRange(18.0, 35.0, 1);
      case 'l1': return Math.random() < 0.5 ? 0 : 1;
      case 'vx': return randomInRange(0.0, 15.0, 2);
      case 'vy': return randomInRange(0.0, 15.0, 2);
      case 'vz': return randomInRange(0.0, 15.0, 2);
      default: return randomInRange(0.0, 100.0, 2);
    }
  };

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return '✅';
      case 'warning': return '⚠️';
      case 'error': return null;
      default: return '❓';
    }
  };

  const getStatusColor = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return '#0328d4';
      case 'warning': return '#FFC107';
      case 'error': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return 'NORMAL';
      case 'error': return 'FALHA';
      default: return 'DESCONHECIDO';
    }
  };

  const getSensorDisplayName = (): string => {
    if (sensor) return sensor.model ? `${sensor.name} (${sensor.model})` : sensor.name;
    switch (sensorId) {
      case 'p1': return 'Pressão 01 (XGZP701DB1R)';
      case 'p2': return 'Pressão 02 (HX710B)';
      case 't1': return 'Temperatura (DS18B20)';
      case 'l1': return 'Chave fim de curso';
      case 'vx': return 'Vibração X';
      case 'vy': return 'Vibração Y';
      case 'vz': return 'Vibração Z';
      default: return 'Sensor Desconhecido';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Logo />
  <Text style={styles.title}>{getSensorDisplayName()}</Text>

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
              <Text style={styles.infoValue}>{sensor.minValue} - {sensor.maxValue} {sensor.unit || ''}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <View style={styles.statusValueContainer}>
          {status === 'error' ? (
            <View style={{ marginRight: 10 }}><AlertRedIcon size={44} /></View>
          ) : (
            <Text style={[styles.statusValue, { color: getStatusColor(status), fontSize: 44, marginRight: 10 }]}>{getStatusIcon(status)}</Text>
          )}
          <Text style={[styles.statusValue, { color: getStatusColor(status) }]}>{getStatusText(status)}</Text>
        </View>
      </View>

      {(realtimeLast || readings.length) && (
        <View style={{ backgroundColor: '#D1D1D6', padding: 24, borderRadius: 12, marginBottom: 20, alignItems: 'center', justifyContent: 'center', width: '100%', alignSelf: 'center' }}>
          <Text style={{ fontSize: 20, marginBottom: 8, color: '#000', textAlign: 'center', fontWeight: '500' }}>Valor Atual:</Text>
          <Text style={{ fontSize: 44, fontWeight: 'bold', color: '#0328d4', textAlign: 'center' }}>{currentReadingValue !== null && currentReadingValue !== undefined ? Number(currentReadingValue).toFixed(2) : '—'}</Text>
        </View>
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Linha</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0328d4" />
        ) : (
          (realtimeBuffer && realtimeBuffer.length >= 2) ? (
            <ChartPanel
              staticData={{ labels: realtimeLabels, values: realtimeBuffer.map(d => parseReadingValue(d, sensorId)) }}
              keyName={sensorId}
              showLabel={false}
              maxPoints={realtimeBuffer.length}
              height={chartHeight}
              chartWidth={chartWidth}
              showAxisLabels={true}
              chartConfig={getSensorDetailChartConfig(chartFontSize)}
            />
          ) : hasEnoughDataForChart ? (
            <ChartPanel
              staticData={{ labels: chartData.labels, values: chartData.datasets[0].data }}
              keyName={sensorId}
              showLabel={false}
              maxPoints={chartData.datasets[0].data.length}
              height={chartHeight}
              chartWidth={chartWidth}
              showAxisLabels={true}
              chartConfig={getSensorDetailChartConfig(chartFontSize)}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>{sortedReadings.length === 0 ? 'Nenhuma leitura disponível' : 'Dados insuficientes para o gráfico (mín. 2 leituras)'}</Text>
              <Text style={styles.noDataSubtext}>Use o botão "Registrar Leitura" para adicionar dados</Text>
            </View>
          )
        )}
      </View>

      <View style={styles.historyContainer}>
        <TouchableOpacity onPress={() => setHistoryCollapsed(prev => !prev)} style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Histórico ({sortedReadings.length} leituras)</Text>
          <Ionicons name={historyCollapsed ? 'chevron-forward' : 'chevron-down'} size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {!historyCollapsed && (
          <>
            {sortedReadings.length > 0 ? (
              <FlatList
                data={sortedReadings}
                renderItem={renderHistoryItem}
                keyExtractor={keyExtractor}
                scrollEnabled={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>Nenhuma leitura registrada</Text>
                <Text style={styles.noDataSubtext}>Use o botão "Registrar Leitura" para adicionar dados</Text>
              </View>
            )}

            <TouchableOpacity style={[styles.updateButton, { marginTop: 12 }]} onPress={() => loadMore()}>
              <Text style={styles.updateButtonText}>Carregar mais</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Atualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.updateButton, { backgroundColor: '#34C759' }]} 
        onPress={handleRegisterReading} 
        disabled={posting}
      >
        <Text style={styles.updateButtonText}>{posting ? 'Enviando...' : 'Registrar Leitura'}</Text>
      </TouchableOpacity>
      <LoadingOverlay visible={loading || posting} message={posting ? 'Enviando leitura...' : 'Carregando dados...'} />
    </ScrollView>
  );
};

