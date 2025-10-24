import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getSharedLineChartConfig } from '../utils/chartConfig';

type ChartPanelProps = {
  buffer: any[]; // array of messages
  keyName: string; // property name to extract numeric values
  maxPoints?: number;
  height?: number;
};

export const ChartPanel: React.FC<ChartPanelProps> = ({ buffer, keyName, maxPoints = 40, height = 160 }) => {
  const LABELS: Record<string, string> = {
    pressao02_hx710b: 'Pressão HX710B',
    temperatura_ds18b20: 'Temperatura DS18B20',
    vibracao_vib_x: 'Vibração X',
    vibracao_vib_y: 'Vibração Y',
    vibracao_vib_z: 'Vibração Z',
    velocidade_m_s: 'Velocidade',
    chave_fim_de_curso: 'Chave Fim de Curso',
  };

  const data = useMemo(() => {
    if (!buffer || buffer.length === 0) return { labels: [], values: [] };

    const vals: number[] = [];
    // iterate from oldest to newest
    for (let i = Math.max(0, buffer.length - maxPoints); i < buffer.length; i++) {
      const item = buffer[i];
      const v = item && (item[keyName] ?? item[keyName.toLowerCase()] );
      if (v !== undefined && v !== null && !isNaN(Number(v))) {
        vals.push(Number(v));
      }
    }

    const labels = vals.map((_, i) => `${i + 1}`);
    return { labels, values: vals };
  }, [buffer, keyName, maxPoints]);

  const cardStyle = { backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12, marginBottom: 12 } as const;
  const labelTextStyle = { color: '#FFFFFF', marginBottom: 6, fontWeight: '600' } as const;

  if (!data.values || data.values.length === 0) {
    return (
      <View style={cardStyle}>
        <Text style={labelTextStyle}>{LABELS[keyName] || keyName}</Text>
        <Text style={{ color: '#8E8E93' }}>Aguardando dados...</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - 24;

  return (
    <View style={cardStyle}>
      <Text style={labelTextStyle}>{LABELS[keyName] || keyName}</Text>
      <LineChart
        data={{ labels: data.labels, datasets: [{ data: data.values }] }}
        width={screenWidth}
        height={height}
        withDots={true}
        withShadow={true}
        withInnerLines={false}
        withOuterLines={false}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        chartConfig={getSharedLineChartConfig({ strokeWidth: 2 })}
        bezier
        style={{ borderRadius: 8 }}
      />
    </View>
  );
};

export default ChartPanel;
