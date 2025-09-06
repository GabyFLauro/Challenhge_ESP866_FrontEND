import { StyleSheet } from "react-native";
import theme from "react-native-elements/dist/config/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    color: '#8E8E93',
  },
  role: {
    color: '#007AFF',
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    padding: 24,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2C2C2E',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});
