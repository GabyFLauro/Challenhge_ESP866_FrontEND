import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import AlertRedIcon from '../../components/AlertRedIcon';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Logo } from '../../components/Logo';
import { LineChart } from 'react-native-chart-kit'; // Importação apenas do LineChart
import { getSensorDetailChartConfig } from '../../utils/chartConfig';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { readingsService } from '../../services/readings';
import { useSensorDetail } from '../../hooks/useSensorDetail';
import { useSensorRealtime } from '../../contexts/SensorRealtimeContext';
import LoadingOverlay from '../../components/LoadingOverlay';
import { classifyMetric } from '../../utils/alerts';

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
  const isTempOrVib = ['t1','vx','vy','vz'].includes(sensorId);
  const isPressure = ['p1','p2'].includes(sensorId);
  const [posting, setPosting] = React.useState<boolean>(false);
  const [historyCollapsed, setHistoryCollapsed] = React.useState<boolean>(true);

  // Função para extrair valor correto do reading baseado no sensorId
  const getValueFromReading = (reading: any, sensorId: string): number => {
    // Primeiro tenta a propriedade 'value' (caso comum)
    if (reading.value !== undefined && reading.value !== null) {
      return Number(reading.value);
    }
    
    // Mapear sensorId para a propriedade correta no objeto
    const sensorKeyMap: Record<string, string[]> = {
      'p1': ['pressao01_xgzp701db1r', 'pressao', 'value'],
      'p2': ['pressao02_hx710b', 'pressao', 'value'],
      't1': ['temperatura_ds18b20', 'temperatura', 'temp', 'value'],
      'vx': ['vibracao_vib_x', 'vibracaoX', 'vibracao_x', 'vib_x', 'value'],
      'vy': ['vibracao_vib_y', 'vibracaoY', 'vibracao_y', 'vib_y', 'value'],
      'vz': ['vibracao_vib_z', 'vibracaoZ', 'vibracao_z', 'vib_z', 'value'],
      'vel': ['velocidade_m_s', 'velocidade', 'value'],
      'l1': ['chave_fim_de_curso', 'ativo', 'limit_switch', 'value'],
    };

    const possibleKeys = sensorKeyMap[sensorId] || ['value'];
    
    for (const key of possibleKeys) {
      if (reading[key] !== undefined && reading[key] !== null) {
        return Number(reading[key]);
      }
      // Tentar também em lowercase
      const lowerKey = key.toLowerCase();
      if (reading[lowerKey] !== undefined && reading[lowerKey] !== null) {
        return Number(reading[lowerKey]);
      }
    }
    
    return 0;
  };

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
        return '#0328d4';
      case 'warning':
        return '#FFC107';
      case 'error':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  // Retorna emoji para ok/alerta; null para erro (usará o ícone SVG)
  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return null;
      default:
        return '❓';
    }
  };

  const getStatusText = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return 'NORMAL';
      case 'warning':
        return 'ALERTA';
      case 'error':
        return 'FALHA';
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
          {status === 'error' ? (
            <View style={{ marginRight: 10 }}>
              <AlertRedIcon size={44} />
            </View>
          ) : (
            <Text style={[styles.statusValue, { color: getStatusColor(status), fontSize: 44, marginRight: 10 }]}>{getStatusIcon(status)}</Text>
          )}
          <Text style={[styles.statusValue, { color: getStatusColor(status) }]}>{getStatusText(status)}</Text>
        </View>
      </View>

      {/* Valor atual: prioriza realtime se disponível */}
      {(
        realtimeLast || readings.length
      ) && (
        <View style={{
          backgroundColor: '#D1D1D6',
          padding: 24,
          borderRadius: 12,
          marginBottom: 20,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          alignSelf: 'center',
        }}>
          <Text style={{
            fontSize: 20,
            marginBottom: 8,
            color: '#000',
            textAlign: 'center',
            fontWeight: '500',
          }}>Valor Atual:</Text>
          <Text style={{
            fontSize: 44,
            fontWeight: 'bold',
            color: '#0328d4', // azul
            textAlign: 'center',
          }}>
            {realtimeLast ? getValueFromReading(realtimeLast, sensorId).toFixed(2) : (readings[0]?.value?.toFixed(2) || '—')}
          </Text>
        </View>
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Linha</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0328d4" />
        ) : (
          // se houver buffer realtime com pelo menos 2 pontos, desenha a partir dele
          (realtimeBuffer && realtimeBuffer.length >= 2) ? (
            <LineChart
              data={{ 
                labels: realtimeBuffer.map((_, i) => `${i+1}`), 
                datasets: [{ 
                  data: realtimeBuffer.map(d => getValueFromReading(d, sensorId)),
                  color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
                  strokeWidth: 3,
                }] 
              }}
              width={chartWidth}
              height={chartHeight}
              chartConfig={{
                ...getSensorDetailChartConfig(chartFontSize),
                // Reforça o preenchimento para temperatura, vibração e pressão
                ...((isTempOrVib || isPressure) ? { fillShadowGradientToOpacity: 0.8, fillShadowGradientFromOpacity: 1, useShadowColorFromDataset: false } : {}),
              }}
              bezier
              withShadow={true}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              withDots={true}
              segments={3}
              fromZero={isTempOrVib ? true : false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              style={styles.chart}
            />
          ) : hasEnoughDataForChart ? (
            <LineChart
              data={{
                ...chartData,
                datasets: chartData.datasets.map((dataset: any) => ({
                  ...dataset,
                  color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
                  strokeWidth: 3,
                }))
              }}
              width={chartWidth}
              height={chartHeight}
              chartConfig={{
                ...getSensorDetailChartConfig(chartFontSize),
                // Reforça o preenchimento para temperatura, vibração e pressão
                ...((isTempOrVib || isPressure) ? { fillShadowGradientToOpacity: 0.8, fillShadowGradientFromOpacity: 1, useShadowColorFromDataset: false } : {}),
              }}
              bezier
              withShadow={true}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              withDots={true}
              segments={3}
              fromZero={isTempOrVib ? true : false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              style={styles.chart}
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
          )
        )}
      </View>

      <View style={styles.historyContainer}>
        <TouchableOpacity
          onPress={() => setHistoryCollapsed(prev => !prev)}
          style={styles.historyHeader}
        >
          <Text style={styles.historyTitle}>Histórico ({sortedReadings.length} leituras)</Text>
          <Ionicons 
            name={historyCollapsed ? 'chevron-forward' : 'chevron-down'} 
            size={24} 
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {!historyCollapsed && (
          <>
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

            {/* botão para carregar próxima página */}
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
      <LoadingOverlay visible={loading || posting} message={posting ? 'Enviando leitura...' : 'Carregando dados...'} />
    </ScrollView>
  );
};

