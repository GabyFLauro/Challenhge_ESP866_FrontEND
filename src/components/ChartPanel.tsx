import React, { useMemo } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getChartPanelConfig } from '../utils/chartConfig';
import { LABELS as SENSOR_LABELS, parseReadingValue } from '../utils/sensors';
import { decimateSmart } from '../utils/decimation';

type ChartPanelProps = {
  buffer?: any[]; // array of messages (optional when staticData is provided)
  keyName: string; // property name to extract numeric values
  maxPoints?: number;
  height?: number;
  showAxisLabels?: boolean; // whether to show X/Y axis labels (defaults to true)
  disableGradient?: boolean; // when true, remove fill shadow/gradient
  chartWidth?: number; // optional explicit width for the chart
  // optional: provide static/time-series data instead of using buffer
  staticData?: { labels: string[]; values: Array<number | null> };
  // optional chartConfig override (if not provided, getChartPanelConfig() is used)
  chartConfig?: any;
  showLabel?: boolean; // whether to display the small title/label above the chart
  enableDecimation?: boolean; // whether to decimate large datasets (default: true)
  decimationThreshold?: number; // decimate if points > threshold (default: 150)
  decimationTarget?: number; // target number of points after decimation (default: 100)
};

// Move styles outside component to avoid recreation on every render
const styles = StyleSheet.create({
  cardStyle: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  labelTextStyle: {
    color: '#FFFFFF',
    marginBottom: 6,
    fontWeight: '600',
  },
  noDataText: {
    color: '#8E8E93',
  },
});

const ChartPanelComponent: React.FC<ChartPanelProps> = ({ 
  buffer, 
  keyName, 
  maxPoints = 40, 
  height = 160, 
  showAxisLabels = true, 
  disableGradient = false, 
  chartWidth, 
  staticData, 
  chartConfig, 
  showLabel = true,
  enableDecimation = true,
  decimationThreshold = 150,
  decimationTarget = 100
}) => {
  const LABELS = SENSOR_LABELS;

  const data = useMemo(() => {
    // If staticData provided, align labels with valid numeric values (filter out null/NaN)
    if (staticData) {
      const labels: string[] = [];
      const values: number[] = [];
      for (let i = 0; i < (staticData.values || []).length; i++) {
        const v = staticData.values[i];
        if (v !== null && v !== undefined && !isNaN(Number(v))) {
          labels.push(staticData.labels?.[i] ?? `${labels.length + 1}`);
          values.push(Number(v));
        }
      }
      return { labels, values };
    }

    if (!buffer || buffer.length === 0) return { labels: [], values: [] };

    const vals: number[] = [];
    const times: string[] = [];
    // iterate from oldest to newest
    for (let i = Math.max(0, buffer.length - maxPoints); i < buffer.length; i++) {
      const item = buffer[i];
      // try centralized parser first (supports many shapes), then fallback to direct property
      let parsed = parseReadingValue(item, keyName as string);
      if (parsed === null || parsed === undefined || isNaN(Number(parsed))) {
        const direct = item && (item[keyName] ?? item[keyName.toLowerCase()]);
        if (direct !== undefined && direct !== null && !isNaN(Number(direct))) parsed = Number(direct);
      }
      if (parsed !== null && parsed !== undefined && !isNaN(Number(parsed))) {
        vals.push(Number(parsed));
        // try to extract a timestamp-like field and format it
        const rawTs = item.timestamp ?? item.time ?? item.dataHora ?? item.data_hora ?? item.ultimoHorario ?? item.ultimo_horario;
        let label = '';
        try {
          if (rawTs) {
            const d = new Date(rawTs);
            if (!isNaN(d.getTime())) {
              label = d.toLocaleTimeString();
            }
          }
        } catch (e) {
          label = '';
        }
        times.push(label || `${vals.length}`);
      }
    }

    // if we have fewer labels than values (edge cases), fill with indices
    while (times.length < vals.length) times.unshift('');
    return { labels: times, values: vals };
  }, [buffer, keyName, maxPoints, staticData]);

  // Apply decimation if enabled and data exceeds threshold
  const decimatedData = useMemo(() => {
    if (!enableDecimation || data.values.length <= decimationThreshold) {
      return data;
    }
    
    if (__DEV__) {
      console.debug(`[ChartPanel][${keyName}] Decimating ${data.values.length} points → ${decimationTarget}`);
    }
    
    return decimateSmart(data.values, data.labels, decimationTarget);
  }, [data, enableDecimation, decimationThreshold, decimationTarget, keyName]);

  // diagnostics: compute simple stats to help debug missing gradient issues
  const stats = React.useMemo(() => {
    const vals = decimatedData.values || [];
    const n = vals.length;
    const min = n > 0 ? Math.min(...vals) : undefined;
    const max = n > 0 ? Math.max(...vals) : undefined;
    const equal = n > 0 ? min === max : false;
    return { n, min, max, equal, preview: vals.slice(0, 6) };
  }, [decimatedData]);

  // Emit diagnostic log so developer can see in Metro/console why gradient may be invisible
  // Only log in development mode to avoid production overhead
  React.useEffect(() => {
    if (!__DEV__) return;
    // Avoid noisy logs when no data
    if (!stats || stats.n === 0) {
      console.debug(`[ChartPanel][${keyName}] no data (${stats?.n || 0} points)`);
      return;
    }
    const wasDecimated = data.values.length !== decimatedData.values.length;
    console.debug(
      `[ChartPanel][${keyName}] points=${stats.n}${wasDecimated ? ` (from ${data.values.length})` : ''} min=${stats.min} max=${stats.max} equal=${stats.equal}`,
      stats.preview
    );
  }, [keyName, stats, disableGradient, chartConfig, data.values.length, decimatedData.values.length]);

  if (!decimatedData.values || decimatedData.values.length === 0) {
    return (
      <View style={styles.cardStyle}>
        {showLabel && <Text style={styles.labelTextStyle}>{LABELS[keyName] || keyName}</Text>}
        <Text style={styles.noDataText}>Aguardando dados...</Text>
      </View>
    );
  }

  const screenWidth = chartWidth ?? (Dimensions.get('window').width - 64);

  return (
    <View style={styles.cardStyle}>
      {showLabel && <Text style={styles.labelTextStyle}>{LABELS[keyName] || keyName}</Text>}
      <LineChart
        data={{ labels: decimatedData.labels, datasets: [{ data: decimatedData.values, color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`, strokeWidth: 3 }] }}
        width={screenWidth}
        height={height}
        chartConfig={chartConfig ?? getChartPanelConfig()}
        bezier
        withShadow={!disableGradient}
        withDots={true}
        withInnerLines={false}
        withOuterLines={false}
        // controlar a exibição de labels via prop
        withHorizontalLabels={!!showAxisLabels}
        withVerticalLabels={!!showAxisLabels}
        segments={3}
        fromZero={false}
        style={{ borderRadius: 8 }}
      />
    </View>
  );
};

// Memoize component to prevent unnecessary re-renders
export const ChartPanel = React.memo(ChartPanelComponent);

export default ChartPanel;
