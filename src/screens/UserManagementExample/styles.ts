import { ViewStyle } from "react-native";
import theme from "react-native-elements/dist/config/theme";

export const styles = {
  scrollView: {
    flex: 1,
  } as ViewStyle,
  userManagement: {
    flex: 1,
  } as ViewStyle,
  logoutButton: {
    backgroundColor: theme.colors.error,
    borderRadius: 8,
    paddingVertical: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as 'bold',
  },
};