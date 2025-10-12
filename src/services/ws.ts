import SockJS from 'sockjs-client';
import { Client, IMessage, Frame } from '@stomp/stompjs';
import { Platform } from 'react-native';
import { API_CONFIG } from '../config/api';

export type SensorMessage = any;

let singletonClient: Client | null = null;

export function connectStomp(onMessage: (msg: SensorMessage) => void, onStatus?: (status: string) => void) {
  let base = API_CONFIG.BASE_URL;
  if (Platform.OS === 'android' && base.includes('localhost')) {
    base = base.replace('localhost', '10.0.2.2');
  }
  // SockJS usa HTTP(S) endpoint; apenas concatene o caminho
  const wsUrl = (global as any).__TEST_WS_URL__ || `${base.replace(/\/$/, '')}${API_CONFIG.WS_ENDPOINT}`;
  console.log('[STOMP] Conectando em', wsUrl);

  if (singletonClient && singletonClient.active) {
    console.log('STOMP: cliente já ativo, retornando instância existente');
    return singletonClient;
  }

  const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 2000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: (frame: Frame) => {
      console.log('STOMP conectado', frame.headers);
      onStatus && onStatus('connected');
      client.subscribe('/topic/sensores', (message: IMessage) => {
        try {
          if (!message.body) return;
          const payload = JSON.parse(message.body);
          onMessage(payload);
        } catch (e) {
          console.error('Erro ao parsear mensagem STOMP:', e);
        }
      });
    },
    onStompError: (frame: any) => {
      console.error('STOMP error', frame.headers, frame.body);
      onStatus && onStatus('error');
    },
    onWebSocketClose: () => {
      console.warn('STOMP websocket fechado, reconectando...');
      onStatus && onStatus('reconnecting');
    },
    onWebSocketError: (evt: any) => {
      console.error('STOMP websocket erro', evt);
      onStatus && onStatus('error');
    },
  });

  singletonClient = client;
  client.activate();
  return client;
}

export function disconnectStomp() {
  if (singletonClient) {
    try {
      singletonClient.deactivate();
    } catch {}
    singletonClient = null;
  }
}
