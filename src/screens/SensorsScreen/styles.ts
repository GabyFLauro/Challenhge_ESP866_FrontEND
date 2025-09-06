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
    lastUpdate: {
        fontSize: 14,
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