import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { isNonEmpty, isValidEmail, toUserMessage } from '../utils/validation';

export function useLogin() {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = isNonEmpty(email) && isValidEmail(email) && isNonEmpty(password);

  const submit = useCallback(async () => {
    if (!canSubmit) {
      setError('Preencha email válido e senha.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn({ email, password });
      // @ts-expect-error typed in app routes
      navigation.navigate('Sensors');
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }, [email, password, canSubmit, signIn, navigation]);

  return {
    email,
    password,
    setEmail,
    setPassword,
    loading,
    error,
    canSubmit,
    submit,
  };
}


