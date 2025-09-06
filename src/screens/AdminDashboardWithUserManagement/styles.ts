import { ViewStyle } from "react-native";
import theme from "react-native-elements/dist/config/theme";

export const styles = {
    scrollContent: {
        padding: 20,
    },
    logoutButton: {
        marginBottom: 20,
        width: '100%',
    },
    logoutButtonStyle: {
        backgroundColor: theme.colors.error,
        paddingVertical: 12,
    },
    userManagement: {
        flex: 1,
    } as ViewStyle,
};