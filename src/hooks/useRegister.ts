import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { isNonEmpty, isValidEmail, isMinLength, validatePasswordMatch } from '../utils/validation';

type UserType = 'USER' | 'ADMIN';

export function useRegister() {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Always create users as 'USER' for this app (all users see same sensors)
  const userType: UserType = 'USER';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    isNonEmpty(name) &&
    isValidEmail(email) &&
    isMinLength(password, 6) &&
    validatePasswordMatch(password, confirmPassword);

  const submit = useCallback(async () => {
    if (!canSubmit) {
      setError('Preencha os campos corretamente. Senha mínima de 6 e confirmação igual.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password, userType: 'USER' });
      // @ts-expect-error typed in app routes
      navigation.navigate('Login');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [canSubmit, name, email, password, userType, register, navigation, confirmPassword]);

  return {
    name,
    email,
    password,
    confirmPassword,
  // userType removed: always 'USER'
    loading,
    error,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
  // setUserType removed
    canSubmit,
    submit,
  };
}


