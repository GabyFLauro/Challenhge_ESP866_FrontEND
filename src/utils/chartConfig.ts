import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

export type LineChartConfigOptions = {
  strokeWidth?: number;
  decimalPlaces?: number;
};

// ============================================
// CONFIGURAÇÃO BASE COMPARTILHADA
// ============================================
export const getSharedLineChartConfig = (opts: LineChartConfigOptions = {}): any => {
  const { strokeWidth = 3, decimalPlaces = 1 } = opts;
  return {
    backgroundColor: '#1C1C1E',
    backgroundGradientFrom: '#1C1C1E',
    backgroundGradientTo: '#1C1C1E',
    fillShadowGradientFrom: '#66fcf1',
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: '#66fcf1',
    fillShadowGradientToOpacity: 0.2,
    color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth,
    decimalPlaces,
    propsForBackgroundLines: {
      strokeWidth: 1,
      strokeDasharray: '',
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#66fcf1',
      fill: '#66fcf1',
    },
  };
};

// ============================================
// CONFIGURAÇÕES ESPECÍFICAS POR TELA
// ============================================

/**
 * Configuração para o ChartPanel (Dashboard Realtime)
 * Usado em: src/components/ChartPanel.tsx
 */
export const getChartPanelConfig = (): any => {
  return {
    backgroundColor: '#1C1C1E',
    backgroundGradientFrom: '#1C1C1E',
    backgroundGradientTo: '#1C1C1E',
    // Forçar preenchimento em cyan
    fillShadowGradient: '#66fcf1',
    fillShadowGradientFrom: '#66fcf1',
  fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: '#66fcf1',
  fillShadowGradientToOpacity: 0.35,
  useShadowColorFromDataset: true,
    color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 3,
    decimalPlaces: 1,
    propsForBackgroundLines: {
      strokeWidth: 1,
      strokeDasharray: '',
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#66fcf1',
      fill: '#66fcf1',
    },
  };
};

/**
 * Configuração para a MetricScreen
 * Usado em: src/screens/MetricScreen/index.tsx
 * SEMPRE usa gradiente com a cor #66fcf1 (cyan) independente da métrica
 */
export const getMetricScreenChartConfig = (): any => {
  return {
    backgroundColor: '#1C1C1E',
    backgroundGradientFrom: '#1C1C1E',
    backgroundGradientTo: '#1C1C1E',
    // Gradiente SEMPRE em cyan #66fcf1 para todas as métricas
    fillShadowGradient: '#66fcf1',
    fillShadowGradientFrom: '#66fcf1',
  fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: '#66fcf1',
  fillShadowGradientToOpacity: 0.35,
  // Forçar uso do gradiente definido acima (evita depender do dataset)
  useShadowColorFromDataset: false,
    // Cor da linha SEMPRE em cyan
    color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 3,
    decimalPlaces: 1,
    propsForBackgroundLines: {
      strokeWidth: 1,
      strokeDasharray: '',
    },
    // Pontos SEMPRE em cyan
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#66fcf1',
      fill: '#66fcf1',
    },
  };
};

/**
 * Configuração para a SensorDetailScreen
 * Usado em: src/screens/SensorDetailScreen/index.tsx
 * Aceita fontSize para ajustes responsivos
 */
export const getSensorDetailChartConfig = (fontSize: number): any => {
  return {
    backgroundColor: '#1C1C1E',
    backgroundGradientFrom: '#1C1C1E',
    backgroundGradientTo: '#1C1C1E',
    // Configurações de gradiente mais explícitas para garantir visibilidade
    fillShadowGradient: '#66fcf1',
    fillShadowGradientFrom: '#66fcf1',
    fillShadowGradientFromOpacity: 0.8, // Aumentar opacidade inicial
    fillShadowGradientTo: '#66fcf1',
    fillShadowGradientToOpacity: 0.1, // Diminuir opacidade final para mais contraste
    // Forçar uso do gradiente declarado (não buscar cor do dataset)
    useShadowColorFromDataset: false,
    color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 3,
    decimalPlaces: 1,
    propsForBackgroundLines: {
      strokeWidth: 1,
      strokeDasharray: '',
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#66fcf1',
      fill: '#66fcf1',
    },
    style: { borderRadius: 1 },
    propsForLabels: { fontSize: Math.max(10, fontSize - 2) },
    propsForVerticalLabels: { fontSize: Math.max(8, fontSize - 4), rotation: 0 },
    propsForHorizontalLabels: { fontSize: Math.max(8, fontSize - 4) },
  };
};
