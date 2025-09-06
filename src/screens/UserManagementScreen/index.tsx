import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Text, ListItem, Avatar, Icon, Button } from 'react-native-elements';
import { authService } from '../../services/auth';
import { adminApiService, AdminUser } from '../../services/adminApi';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';
import { styles } from './styles';

const UserManagementScreen: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const getRoleLabel = (role: string) => {
    if (role === 'admin') return 'Administrador';
    if (role === 'patient') return 'Usuário Comum';
    return role;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await adminApiService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      Alert.alert('Erro', 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    Alert.alert(
      'Excluir Usuário',
      'Tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminApiService.deleteUser(userId);
              fetchUsers();
              Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir usuário');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (user: AdminUser) => {
    setEditUserId(user.id);
    setEditEmail(user.email);
    setEditPassword('');
    setEditModalVisible(true);
  };

  const handleEditSave = async () => {
    if (!editUserId) return;
    try {
      const userData: any = {
        email: editEmail,
      };
      
      if (editPassword && editPassword.trim() !== '') {
        userData.senha = editPassword;
      }
      
      await adminApiService.editUser(editUserId, userData);
      setEditModalVisible(false);
      setEditUserId(null);
      setEditEmail('');
      setEditPassword('');
      fetchUsers();
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar usuário');
    }
  };

  const openPasswordModal = (user: AdminUser) => {
    setPasswordUserId(user.id);
    setNewPassword('');
    setPasswordModalVisible(true);
  };

  const handlePasswordChange = async () => {
    if (!passwordUserId || !newPassword.trim()) {
      Alert.alert('Erro', 'Nova senha é obrigatória');
      return;
    }

    try {
      await adminApiService.changeUserPassword({ 
        userId: passwordUserId, 
        newPassword: newPassword 
      });
      setPasswordModalVisible(false);
      setPasswordUserId(null);
      setNewPassword('');
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao alterar senha');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Usuários Cadastrados</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider containerStyle={styles.listItem}>
            <Avatar
              rounded
              source={item.image ? { uri: item.image } : undefined}
              title={item.name[0]}
              containerStyle={styles.avatar}
            />
            <ListItem.Content>
              <ListItem.Title style={styles.name}>{item.name}</ListItem.Title>
              <ListItem.Subtitle style={styles.email}>{item.email}</ListItem.Subtitle>
              <ListItem.Subtitle style={styles.role}>
                {getRoleLabel(item.role)}
                {item.role === 'doctor' && item.specialty && ` - ${item.specialty}`}
              </ListItem.Subtitle>
            </ListItem.Content>
            {item.id !== currentUser?.id && (
              <>
                <TouchableOpacity onPress={() => openEditModal(item)} style={{ marginRight: 10 }}>
                  <Icon name="edit" color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openPasswordModal(item)} style={{ marginRight: 10 }}>
                  <Icon name="lock" color="#FF9500" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Icon name="delete" color="#FF3B30" />
                </TouchableOpacity>
              </>
            )}
          </ListItem>
        )}
      />
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Novo Email"
              placeholderTextColor="#8E8E93"
              value={editEmail}
              onChangeText={setEditEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Nova Senha"
              placeholderTextColor="#8E8E93"
              value={editPassword}
              onChangeText={setEditPassword}
              secureTextEntry
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Button
                title="Cancelar"
                onPress={() => setEditModalVisible(false)}
                buttonStyle={{ backgroundColor: '#8E8E93', paddingHorizontal: 20 }}
              />
              <Button
                title="Salvar"
                onPress={handleEditSave}
                buttonStyle={{ backgroundColor: '#007AFF', paddingHorizontal: 20 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para alteração de senha */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Nova Senha"
              placeholderTextColor="#8E8E93"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Button
                title="Cancelar"
                onPress={() => setPasswordModalVisible(false)}
                buttonStyle={{ backgroundColor: '#8E8E93', paddingHorizontal: 20 }}
              />
              <Button
                title="Alterar"
                onPress={handlePasswordChange}
                buttonStyle={{ backgroundColor: '#FF9500', paddingHorizontal: 20 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserManagementScreen; 