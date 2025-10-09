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
import LoadingOverlay from '../../components/LoadingOverlay';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<RegisterScreenProps['navigation']>();
    const { name, email, password, confirmPassword, loading, error, setName, setEmail, setPassword, setConfirmPassword, submit } = useRegister();

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

                {/* Tipo de usuário fixo como 'USER' — todos os usuários veem os mesmos sensores */}

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
            <LoadingOverlay visible={loading} message="Criando conta..." />
        </ScrollView>
    );
};

// STYLED COMPONENTS (kept minimal)

export default RegisterScreen;