import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Button } from 'react-native-elements';
import styled from 'styled-components/native';
import Header from '../../components/Header';
import UserManagement from '../../components/UserManagement';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';
import { styles } from './styles';

const AdminDashboardWithUserManagement: React.FC = () => {
    const { signOut } = useAuth();

    return (
        <Container>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Title>Painel Administrativo</Title>
                
                <Button
                    title="Sair"
                    onPress={signOut}
                    containerStyle={styles.logoutButton as ViewStyle}
                    buttonStyle={styles.logoutButtonStyle}
                />

                <UserManagement style={styles.userManagement} />
            </ScrollView>
        </Container>
    );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

export default AdminDashboardWithUserManagement;
