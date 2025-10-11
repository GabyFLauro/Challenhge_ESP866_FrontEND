import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type ChartPanelProps = {
  buffer: any[]; // array of messages
  keyName: string; // property name to extract numeric values
  maxPoints?: number;
  height?: number;
};

export const ChartPanel: React.FC<ChartPanelProps> = ({ buffer, keyName, maxPoints = 40, height = 160 }) => {
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

  if (!data.values || data.values.length === 0) {
    return (
      <View style={{ padding: 12 }}>
        <Text>Nenhum dado para <Text style={{ fontWeight: 'bold' }}>{keyName}</Text></Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - 24;

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ marginBottom: 6 }}>{keyName}</Text>
      <LineChart
        data={{ labels: data.labels, datasets: [{ data: data.values }] }}
        width={screenWidth}
        height={height}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          strokeWidth: 2,
        }}
        bezier
        style={{ borderRadius: 8 }}
      />
    </View>
  );
};

export default ChartPanel;
