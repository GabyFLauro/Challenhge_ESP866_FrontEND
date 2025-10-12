import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api';

let socket: Socket | null = null;

export function connectSocket(
  onMessage: (data: any) => void,
  onConnect?: () => void,
  onError?: (err: any) => void,
  onDisconnect?: () => void
) {
  if (socket && socket.connected) return socket;

  const base = API_CONFIG.BASE_URL;
  const url = base.replace(/\/$/, '');
  socket = io(url, { transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    onConnect && onConnect();
  });

  socket.on('connect_error', (err) => {
    onError && onError(err);
  });

  socket.on('error', (err) => {
    onError && onError(err);
  });

  socket.on('nova_leitura', (data: any) => {
    try {
      onMessage(data);
    } catch (e) {
      console.error('socket nova_leitura error', e);
    }
  });

  socket.on('disconnect', () => {
    console.warn('socket disconnected');
    onDisconnect && onDisconnect();
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
