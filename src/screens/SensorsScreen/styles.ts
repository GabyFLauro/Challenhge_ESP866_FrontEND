import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#FFFFFF',
        flex: 1,
    },
    backendStatus: {
        color: '#8E8E93',
        fontSize: 12,
        marginTop: 4,
    },
    investigateButton: {
        backgroundColor: '#FF9500',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    investigateButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    investigationResult: {
        backgroundColor: '#1C1C1E',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9500',
    },
    investigationResultText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'monospace',
        lineHeight: 16,
    },
    scrollView: {
        flex: 1,
    },
    sensorCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    sensorInfo: {
        flex: 1,
    },
    sensorName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    sensorLocation: {
        fontSize: 14,
        color: '#FF9500',
        marginBottom: 2,
    },
    sensorDescription: {
        fontSize: 13,
        color: '#AEAEB2',
        marginBottom: 4,
        fontStyle: 'italic',
    },
    currentValue: {
        fontSize: 15,
        color: '#34C759',
        fontWeight: '600',
        marginBottom: 4,
    },
    lastUpdate: {
        fontSize: 12,
        color: '#8E8E93',
    },
    statusContainer: {
        alignItems: 'center',
        marginLeft: 16,
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
}); 