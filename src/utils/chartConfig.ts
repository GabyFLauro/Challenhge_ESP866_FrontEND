import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

export type LineChartConfigOptions = {
  strokeWidth?: number;
  decimalPlaces?: number;
};

export const getSharedLineChartConfig = (opts: LineChartConfigOptions = {}): AbstractChartConfig => {
  const { strokeWidth = 3, decimalPlaces = 1 } = opts;
  return {
    backgroundColor: '#1C1C1E',
    backgroundGradientFrom: '#1C1C1E',
    backgroundGradientTo: '#1C1C1E',
    fillShadowGradientFrom: '#66fdf1',
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: '#66fdf1',
    fillShadowGradientToOpacity: 0.3,
    useShadowColorFromDataset: false,
    color: (opacity = 1) => `rgba(102, 253, 241, ${opacity})`,
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
      stroke: '#66fdf1',
      fill: '#66fdf1',
    },
  } as AbstractChartConfig;
};
