
export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    date: string;
    time: string;
    specialty: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}