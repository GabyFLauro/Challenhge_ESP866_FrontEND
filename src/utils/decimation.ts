/**
 * Decimation utilities for chart data optimization
 * Reduces large datasets to smaller ones while preserving data shape
 */

export interface DataPoint {
  value: number;
  label?: string;
  timestamp?: string | number;
}

/**
 * Decimates an array of numbers using average-binning
 * Reduces array from N points to targetSize by averaging bins
 * 
 * @param data - Array of numeric values
 * @param targetSize - Desired output size (default: 100)
 * @returns Decimated array
 */
export function decimateAverage(data: number[], targetSize: number = 100): number[] {
  if (!data || data.length === 0) return [];
  if (data.length <= targetSize) return data; // No decimation needed

  const binSize = data.length / targetSize;
  const decimated: number[] = [];

  for (let i = 0; i < targetSize; i++) {
    const start = Math.floor(i * binSize);
    const end = Math.floor((i + 1) * binSize);
    const bin = data.slice(start, end);
    
    // Calculate average of bin
    const avg = bin.reduce((sum, val) => sum + val, 0) / bin.length;
    decimated.push(avg);
  }

  return decimated;
}

/**
 * Decimates paired arrays (values + labels) using average-binning
 * Preserves label alignment with decimated values
 * 
 * @param values - Array of numeric values
 * @param labels - Array of label strings (same length as values)
 * @param targetSize - Desired output size (default: 100)
 * @returns Object with decimated values and labels
 */
export function decimateWithLabels(
  values: number[],
  labels: string[],
  targetSize: number = 100
): { values: number[]; labels: string[] } {
  if (!values || values.length === 0) return { values: [], labels: [] };
  if (values.length <= targetSize) return { values, labels };

  const binSize = values.length / targetSize;
  const decimatedValues: number[] = [];
  const decimatedLabels: string[] = [];

  for (let i = 0; i < targetSize; i++) {
    const start = Math.floor(i * binSize);
    const end = Math.floor((i + 1) * binSize);
    const valueBin = values.slice(start, end);
    
    // Average values in bin
    const avg = valueBin.reduce((sum, val) => sum + val, 0) / valueBin.length;
    decimatedValues.push(avg);
    
    // Use middle label from bin (or first if bin size is 1)
    const middleIndex = Math.floor((start + end) / 2);
    decimatedLabels.push(labels[middleIndex] || labels[start] || '');
  }

  return { values: decimatedValues, labels: decimatedLabels };
}

/**
 * Decimates using LTTB (Largest Triangle Three Buckets) algorithm
 * Preserves visual shape better than average-binning for spiky data
 * 
 * @param data - Array of numeric values
 * @param targetSize - Desired output size (default: 100)
 * @returns Decimated array with indices preserved
 */
export function decimateLTTB(data: number[], targetSize: number = 100): number[] {
  if (!data || data.length === 0) return [];
  if (data.length <= targetSize) return data;

  const bucketSize = (data.length - 2) / (targetSize - 2);
  const decimated: number[] = [];
  
  // Always keep first point
  decimated.push(data[0]);

  let a = 0; // Previous selected point
  
  for (let i = 0; i < targetSize - 2; i++) {
    // Calculate average point of next bucket (for area calculation)
    const avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    const avgRangeEnd2 = Math.min(avgRangeEnd, data.length);
    
    let avgX = 0;
    let avgY = 0;
    let avgRangeLength = avgRangeEnd2 - avgRangeStart;
    
    for (let j = avgRangeStart; j < avgRangeEnd2; j++) {
      avgX += j;
      avgY += data[j];
    }
    avgX /= avgRangeLength;
    avgY /= avgRangeLength;

    // Get current bucket range
    const rangeStart = Math.floor(i * bucketSize) + 1;
    const rangeEnd = Math.floor((i + 1) * bucketSize) + 1;

    // Point with largest triangle area
    let maxArea = -1;
    let maxAreaPoint = rangeStart;

    for (let j = rangeStart; j < rangeEnd; j++) {
      // Calculate triangle area
      const area = Math.abs(
        (a - avgX) * (data[j] - data[a]) -
        (a - j) * (avgY - data[a])
      ) * 0.5;

      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = j;
      }
    }

    decimated.push(data[maxAreaPoint]);
    a = maxAreaPoint;
  }

  // Always keep last point
  decimated.push(data[data.length - 1]);

  return decimated;
}

/**
 * Smart decimation that chooses algorithm based on data characteristics
 * 
 * @param values - Array of numeric values
 * @param labels - Optional array of labels
 * @param targetSize - Desired output size (default: 100)
 * @param algorithm - 'auto' | 'average' | 'lttb'
 * @returns Decimated data
 */
export function decimateSmart(
  values: number[],
  labels?: string[],
  targetSize: number = 100,
  algorithm: 'auto' | 'average' | 'lttb' = 'auto'
): { values: number[]; labels: string[] } {
  if (!values || values.length === 0) return { values: [], labels: labels || [] };
  if (values.length <= targetSize) return { values, labels: labels || [] };

  // Auto-select algorithm based on data variance
  let selectedAlgorithm = algorithm;
  if (algorithm === 'auto') {
    // Calculate coefficient of variation to detect spiky data
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / Math.abs(mean);
    
    // Use LTTB for spiky data (high variance), average for smooth data
    selectedAlgorithm = cv > 0.3 ? 'lttb' : 'average';
  }

  // Apply selected algorithm
  if (selectedAlgorithm === 'lttb') {
    const decimatedValues = decimateLTTB(values, targetSize);
    // For LTTB, we need to map labels proportionally
    const decimatedLabels: string[] = [];
    if (labels && labels.length > 0) {
      const ratio = values.length / decimatedValues.length;
      for (let i = 0; i < decimatedValues.length; i++) {
        const originalIndex = Math.round(i * ratio);
        decimatedLabels.push(labels[originalIndex] || '');
      }
    }
    return { values: decimatedValues, labels: decimatedLabels };
  } else {
    // Average-binning
    if (labels && labels.length > 0) {
      return decimateWithLabels(values, labels, targetSize);
    } else {
      return { values: decimateAverage(values, targetSize), labels: [] };
    }
  }
}

export default {
  decimateAverage,
  decimateWithLabels,
  decimateLTTB,
  decimateSmart,
};
