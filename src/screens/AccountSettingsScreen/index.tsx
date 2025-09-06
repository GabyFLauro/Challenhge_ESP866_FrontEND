import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import { Logo } from '../../components/Logo';
import { styles } from './styles';

export const AccountSettingsScreen = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getAccountTypeText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'festo':
        return 'Festo';
      case 'client':
        return 'Empresa Cliente';
      default:
        return role;
    }
  };

  const handleUpdateEmail = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implementar atualização de email
      Alert.alert('Sucesso', 'Email atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await authService.updateCurrentUserPassword(currentPassword, newPassword);
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível atualizar a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações da Conta</Text>
        <Logo />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <Text style={styles.userInfo}>Nome: {user?.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alterar Email</Text>
        <Input
          placeholder="Novo Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          containerStyle={styles.input}
          inputStyle={styles.inputText}
          placeholderTextColor="#8E8E93"
        />
        <Button
          title="Atualizar Email"
          onPress={handleUpdateEmail}
          loading={loading}
          containerStyle={styles.button}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alterar Senha</Text>
        <Input
          placeholder="Senha Atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          containerStyle={styles.input}
          inputStyle={styles.inputText}
          placeholderTextColor="#8E8E93"
        />
        <Input
          placeholder="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          containerStyle={styles.input}
          inputStyle={styles.inputText}
          placeholderTextColor="#8E8E93"
        />
        <Input
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          containerStyle={styles.input}
          inputStyle={styles.inputText}
          placeholderTextColor="#8E8E93"
        />
        <Button
          title="Atualizar Senha"
          onPress={handleUpdatePassword}
          loading={loading}
          containerStyle={styles.button}
        />
      </View>
    </ScrollView>
  );
};
