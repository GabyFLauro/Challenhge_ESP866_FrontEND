import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import styled from 'styled-components/native';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';
import { RootStackParamList } from '../../types/navigation';
import { Logo } from '../../components/Logo';
import { styles } from './styles';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC = () => {
    const { signIn } = useAuth();
    const navigation = useNavigation<LoginScreenProps['navigation']>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await signIn({ email, password });
            navigation.navigate('Sensors');
        } catch (error) {
            setError('Email ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <View style={styles.formContainer}>
                <Logo />
                <Text h3 style={styles.title}>Login</Text>

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

                {error ? <ErrorText>{error}</ErrorText> : null}

                <Button
                    title="Entrar"
                    onPress={handleLogin}
                    loading={loading}
                    containerStyle={styles.button}
                />

                <Button
                    title="Cadastre-se"
                    onPress={() => navigation.navigate('Register')}
                    containerStyle={styles.registerButton}
                    buttonStyle={styles.registerButtonStyle}
                />
            </View>

            <View style={styles.credentialsContainer}>
                <Text style={styles.hint}>
                    Use as credenciais de exemplo:
                </Text>
                <Text style={styles.credentials}>
                    Admin: admin@example.com / 123456{'\n'}
                    Usuário comum: fabio@email.com / 123456
                </Text>
            </View>
        </Container>
    );
};

const Container = styled.View`
  flex: 1;
  background-color: #000000;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default LoginScreen; 