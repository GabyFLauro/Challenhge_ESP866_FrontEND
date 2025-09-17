import { useCallback, useState } from 'react';
import { appointmentsService, Appointment } from '../services/appointments';

export function useDoctorDashboard(doctorId: string | undefined) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!doctorId) return;
      const all = await appointmentsService.listByDoctor(doctorId);
      setAppointments(all);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  const updateStatus = useCallback(async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    await appointmentsService.updateStatus(appointmentId, newStatus);
    await load();
  }, [load]);

  return {
    appointments,
    loading,
    load,
    updateStatus,
  };
}


