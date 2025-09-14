/**
 * Configuração da API
 */
export const API_CONFIG = {
  // URL base da API - Backend real do Challenge Festo Twinovate
  BASE_URL: 'http://localhost:8080', // Altere para o IP do seu backend quando necessário
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 10000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Autenticação
  LOGIN: '/usuarios/login',
  REGISTER: '/usuarios',
  CURRENT_USER: '/usuarios/me',
  
  // Usuários
  USERS: '/usuarios',
  USER_BY_ID: (id: string) => `/usuarios/${id}`,
  USER_PASSWORD: (id: string) => `/usuarios/${id}/senha`,
  
  // Médicos
  DOCTORS: '/usuarios/medicos',
  DOCTORS_BY_SPECIALTY: (specialty: string) => `/usuarios/medicos?especialidade=${encodeURIComponent(specialty)}`,
  
  // Consultas (se existirem no backend)
  APPOINTMENTS: '/consultas',
  APPOINTMENT_BY_ID: (id: string) => `/consultas/${id}`,
  
  // Sensores
  SENSORS: '/sensors',
  SENSOR_BY_ID: (id: string) => `/sensors/${id}`,
  
  // Leituras de sensores
  READINGS: '/readings',
  READINGS_BY_SENSOR: (sensorId: string) => `/readings/${sensorId}`,
};
