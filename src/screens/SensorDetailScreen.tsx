import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Logo } from '../components/Logo';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

// Mock data for sensor values
const generateMockData = (status: 'ok' | 'warning' | 'error') => {
  const baseValue = status === 'ok' ? 50 : status === 'warning' ? 75 : 90;
  return Array.from({ length: 8 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 60000).toLocaleTimeString(),
    value: baseValue + (Math.random() * 10 - 5),
  }));
};

// Configurações do gráfico de linha
const lineChartConfig = {
  backgroundColor: '#1C1C1E',
  backgroundGradientFrom: '#1C1C1E',
  backgroundGradientTo: '#1C1C1E',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#007AFF',
  },
  propsForLabels: {
    fontSize: 10,
  },
};

// Configurações do gráfico de barras
const barChartConfig = {
  backgroundColor: '#1C1C1E',
  backgroundGradientFrom: '#1C1C1E',
  backgroundGradientTo: '#1C1C1E',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  barPercentage: 0.4,
  propsForLabels: {
    fontSize: 10,
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
  },
};

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 32;
const chartHeight = 180;

export const SensorDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { sensorId } = route.params as { sensorId: string };

  // Determine sensor status based on ID
  const getSensorStatus = (id: string): 'ok' | 'warning' | 'error' => {
    switch (id) {
      case '2': // Encoder Linear
        return 'error';
      case '3': // Sensor de Pressão
        return 'warning';
      case '7': // Sensor de Vibração
        return 'error';
      default:
        return 'ok';
    }
  };

  const status = getSensorStatus(sensorId);
  const [sensorData, setSensorData] = useState(generateMockData(status));

  const handleUpdate = () => {
    setSensorData(generateMockData(status));
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

  // Preparar dados para os gráficos
  const chartData = {
    labels: sensorData.map(data => data.timestamp.split(':').slice(0, 2).join(':')),
    datasets: [
      {
        data: sensorData.map(data => data.value),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: sensorData.map(data => data.timestamp.split(':').slice(0, 2).join(':')),
    datasets: [
      {
        data: sensorData.map(data => Number(data.value.toFixed(1))),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Logo />
      <Text style={styles.title}>{sensorId}</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <View style={styles.statusValueContainer}>
          <Ionicons 
            name={getStatusIcon(status)} 
            size={24} 
            color={getStatusColor(status)} 
            style={styles.statusIcon}
          />
          <Text style={[styles.statusValue, { color: getStatusColor(status) }]}>
            {getStatusText(status)}
          </Text>
        </View>
      </View>

      <View style={styles.currentValueContainer}>
        <Text style={styles.currentValueLabel}>Valor Atual:</Text>
        <Text style={[styles.currentValue, { color: getStatusColor(status) }]}>
          {sensorData[0].value.toFixed(2)}
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Linha</Text>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={lineChartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withDots={true}
          segments={4}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Gráfico de Barras</Text>
        <BarChart
          data={barChartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={barChartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
          segments={4}
          fromZero
          verticalLabelRotation={-15}
        />
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Histórico</Text>
        {sensorData.map((data, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyText}>{data.timestamp}</Text>
            <Text style={styles.historyText}>{data.value.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Atualizar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 18,
    marginRight: 8,
    color: '#FFFFFF',
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentValueContainer: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  currentValueLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  currentValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historyContainer: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  historyText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 