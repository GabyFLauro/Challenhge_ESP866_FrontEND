import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface ApiAppointment {
  id: number;
  pacienteId: number;
  medicoId: number;
  data: string; // ISO date-time string no backend
  descricao?: string;
  status: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA';
}

export interface CreateAppointmentDTO {
  pacienteId: string;
  medicoId: string;
  data: string; // ISO string
  descricao?: string;
}

export type UpdateAppointmentStatusDTO = {
  status: 'CONFIRMADA' | 'CANCELADA';
};

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // e.g. '2025-09-12'
  time: string; // e.g. '14:30'
  description: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

function mapApiToApp(a: ApiAppointment): Appointment {
  const d = new Date(a.data);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return {
    id: String(a.id),
    patientId: String(a.pacienteId),
    doctorId: String(a.medicoId),
    date: `${yyyy}-${mm}-${dd}`,
    time: `${hh}:${mi}`,
    description: a.descricao || '',
    status:
      a.status === 'CONFIRMADA'
        ? 'confirmed'
        : a.status === 'CANCELADA'
        ? 'cancelled'
        : 'pending',
  };
}

function toApiDate(date: string, time: string): string {
  // Assume date = 'YYYY-MM-DD' e time = 'HH:mm'
  return `${date}T${time}:00.000Z`;
}

export const appointmentsService = {
  async list(): Promise<Appointment[]> {
    const items = await apiClient.get<ApiAppointment[]>(API_ENDPOINTS.APPOINTMENTS);
    return items.map(mapApiToApp);
  },

  async listByDoctor(doctorId: string): Promise<Appointment[]> {
    const items = await apiClient.get<ApiAppointment[]>(`${API_ENDPOINTS.APPOINTMENTS}?medicoId=${encodeURIComponent(doctorId)}`);
    return items.map(mapApiToApp);
  },

  async listByPatient(patientId: string): Promise<Appointment[]> {
    const items = await apiClient.get<ApiAppointment[]>(`${API_ENDPOINTS.APPOINTMENTS}?pacienteId=${encodeURIComponent(patientId)}`);
    return items.map(mapApiToApp);
  },

  async create(payload: { patientId: string; doctorId: string; date: string; time: string; description?: string }): Promise<Appointment> {
    const body: CreateAppointmentDTO = {
      pacienteId: payload.patientId,
      medicoId: payload.doctorId,
      data: toApiDate(payload.date, payload.time),
      descricao: payload.description,
    } as any;
    const created = await apiClient.post<ApiAppointment>(API_ENDPOINTS.APPOINTMENTS, body as unknown as Record<string, unknown>);
    return mapApiToApp(created);
  },

  async updateStatus(id: string, status: 'confirmed' | 'cancelled'): Promise<void> {
    const body: UpdateAppointmentStatusDTO = { status: status === 'confirmed' ? 'CONFIRMADA' : 'CANCELADA' };
    await apiClient.put(`${API_ENDPOINTS.APPOINTMENT_BY_ID(id)}`, body);
  },
};


