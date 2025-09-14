export interface Sensor {
    id: string;
    name: string;
    model?: string;
    type?: string;
    location?: string;
    description?: string;
    unit?: string;
    status: 'ok' | 'warning' | 'error';
    lastUpdate: string;
    currentValue?: number;
    minValue?: number;
    maxValue?: number;
    isActive?: boolean;
}