import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

export function useAdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'users'>('appointments');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
    if (!storedAppointments) return;
    const all: Appointment[] = JSON.parse(storedAppointments);
    const updated = all.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a));
    await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updated));
    await load();
  }, [load]);

  return {
    appointments,
    users,
    loading,
    activeTab,
    setActiveTab,
    load,
    updateAppointmentStatus,
  };
}


