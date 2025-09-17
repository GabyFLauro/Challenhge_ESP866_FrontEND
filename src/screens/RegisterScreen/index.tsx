import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import styled from 'styled-components/native';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';
import { RootStackParamList } from '../../types/navigation';
import { Logo } from '../../components/Logo';
import { styles } from './styles';
import { useRegister } from '../../hooks/useRegister';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<RegisterScreenProps['navigation']>();
    const { name, email, password, confirmPassword, userType, loading, error, setName, setEmail, setPassword, setConfirmPassword, setUserType, submit } = useRegister();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <Logo />
                <Text h3 style={styles.title}>Cadastro</Text>

                <Input
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                    containerStyle={styles.input}
                    inputStyle={styles.inputText}
                    placeholderTextColor="#8E8E93"
                />

                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    containerStyle={styles.input}
                    inputStyle={styles.inputText}
                    placeholderTextColor="#8E8E93"
                />

                <Input
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    containerStyle={styles.input}
                    inputStyle={styles.inputText}
                    placeholderTextColor="#8E8E93"
                />

                <Input
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    containerStyle={styles.input}
                    inputStyle={styles.inputText}
                    placeholderTextColor="#8E8E93"
                />

                <Text style={styles.userTypeLabel}>Tipo de Usuário:</Text>
                <UserTypeContainer>
                    <UserTypeButton
                        selected={userType === 'USER'}
                        onPress={() => setUserType('USER')}
                    >
                        <UserTypeText selected={userType === 'USER'}>
                            Usuário
                        </UserTypeText>
                    </UserTypeButton>
                    <UserTypeButton
                        selected={userType === 'ADMIN'}
                        onPress={() => setUserType('ADMIN')}
                    >
                        <UserTypeText selected={userType === 'ADMIN'}>
                            Administrador
                        </UserTypeText>
                    </UserTypeButton>
                </UserTypeContainer>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Button
                    title="Cadastrar"
                    onPress={submit}
                    loading={loading}
                    containerStyle={styles.button}
                />

                <Button
                    title="Voltar"
                    onPress={() => navigation.navigate('Login')}
                    containerStyle={styles.backButton}
                    buttonStyle={styles.backButtonStyle}
                />
            </View>
        </ScrollView>
    );
};

// STYLED COMPONENTS

const UserTypeContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 20px;
  background-color: #2C2C2E;
  border-radius: 8px;
  padding: 4px;
`;

const UserTypeButton = styled(TouchableOpacity)<{ selected: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  background-color: ${(props: { selected: boolean }) => 
    props.selected ? theme.colors.primary : 'transparent'};
  align-items: center;
`;

const UserTypeText = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props: { selected: boolean }) => 
    props.selected ? theme.colors.white : theme.colors.text};
`;

export default RegisterScreen;