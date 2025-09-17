import { useCallback, useEffect, useState } from 'react';
import { adminApiService, AdminUser } from '../services/adminApi';

export function useUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await adminApiService.getAllUsers();
      setUsers(all);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEditModal = (user: AdminUser) => {
    setEditUserId(user.id);
    setEditEmail(user.email);
    setEditPassword('');
    setEditModalVisible(true);
  };

  const saveEdit = useCallback(async () => {
    if (!editUserId) return;
    const data: any = { email: editEmail };
    if (editPassword && editPassword.trim() !== '') {
      data.senha = editPassword;
    }
    await adminApiService.editUser(editUserId, data);
    setEditModalVisible(false);
    setEditUserId(null);
    setEditEmail('');
    setEditPassword('');
    await load();
  }, [editUserId, editEmail, editPassword, load]);

  const openPasswordModal = (user: AdminUser) => {
    setPasswordUserId(user.id);
    setNewPassword('');
    setPasswordModalVisible(true);
  };

  const changePassword = useCallback(async () => {
    if (!passwordUserId || !newPassword.trim()) return;
    await adminApiService.changeUserPassword({ userId: passwordUserId, newPassword });
    setPasswordModalVisible(false);
    setPasswordUserId(null);
    setNewPassword('');
  }, [passwordUserId, newPassword]);

  const removeUser = useCallback(async (userId: string) => {
    await adminApiService.deleteUser(userId);
    await load();
  }, [load]);

  return {
    users,
    loading,
    editModalVisible,
    editUserId,
    editEmail,
    editPassword,
    passwordModalVisible,
    passwordUserId,
    newPassword,
    setEditModalVisible,
    setEditEmail,
    setEditPassword,
    setPasswordModalVisible,
    setNewPassword,
    openEditModal,
    saveEdit,
    openPasswordModal,
    changePassword,
    removeUser,
  };
}


