import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    color: '#8E8E93',
  },
  actionButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  label: {
    color: '#8E8E93',
    marginBottom: 8,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
  },
  timestamp: {
    marginTop: 6,
    color: '#8E8E93',
  },
});
