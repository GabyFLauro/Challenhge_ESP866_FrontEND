import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Button } from 'react-native-elements';
import styled from 'styled-components/native';
import UserManagement from '../components/UserManagement';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

/**
 * Exemplo de tela que demonstra o uso do componente UserManagement
 * Integrado com o backend Java Spring Boot
 */
const UserManagementExample: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <Header>
        <Title>Gerenciamento de Usuários</Title>
        <Subtitle>Integração com Backend Java Spring Boot</Subtitle>
      </Header>
      
      <ScrollView style={styles.scrollView}>
        <UserManagement style={styles.userManagement} />
      </ScrollView>

      <Footer>
        <Button
          title="Sair do Sistema"
          onPress={signOut}
          buttonStyle={styles.logoutButton}
          titleStyle={styles.logoutButtonText}
        />
      </Footer>
    </Container>
  );
};

const styles = {
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
    fontWeight: 'bold',
  },
};

// STYLED COMPONENTS

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Header = styled.View`
  background-color: ${theme.colors.white};
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${theme.colors.secondary};
`;

const Footer = styled.View`
  background-color: ${theme.colors.white};
  padding: 16px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

export default UserManagementExample;
