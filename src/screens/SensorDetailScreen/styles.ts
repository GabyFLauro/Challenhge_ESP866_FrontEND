
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  sensorInfoContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  noDataContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#AEAEB2',
    textAlign: 'center',
    fontStyle: 'italic',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
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