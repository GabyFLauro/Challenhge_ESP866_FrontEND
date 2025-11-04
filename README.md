# Sprint 01 - Advanced Programming & Mobile Dev - 3ECA_FIAP_2025 - Twinovate_Challenge_Festo

# Sprint 02 - Advanced Programming & Mobile Dev - 3ECA_FIAP_2025 - Twinovate_Challenge_Festo

# Sprint 03 - Advanced Programming & Mobile Dev - 3ECA_FIAP_2025 - Twinovate_Challenge_Festo

# Sprint 04 - Advanced Programming & Mobile Dev - 3ECA_FIAP_2025 - Twinovate_Challenge_Festo

Luana Alves de Santana RM: 98546  

Kauhe Serpa Do Val RM: 552027  

Gabriella Francisco de Lauro RM: 99280  

Luis Felipe Machareth Bannwart RM: 99879  

Caio Yudi Ozaki Godinho RM: 552505

---

## Como este frontend funciona

Resumo curto: este projeto é um cliente React Native (Expo) escrito em TypeScript que consome uma API REST e usa WebSockets para atualizações em tempo real dos sensores.

Arquitetura e fluxo principais:
- src/config/api.ts: configuração da URL base do backend (API REST).
- src/services: cliente HTTP (`apiClient.ts`) e módulos por domínio (`sensors.ts`, `readings.ts`, `authApi.ts`) que encapsulam chamadas ao backend.
- src/contexts: providers React para gerenciar estado global (autenticação, loading, UI e dados em tempo real) — usados por toda a app.
- src/hooks: hooks customizados (por exemplo `useSensors`, `useSensorDetail`, `useSensorStream`) que orquestram chamadas de API, formatação de dados e assinatura em WebSocket/STOMP.
- src/navigation: configuração das rotas/stack do app (`AppNavigator.tsx`).
- src/screens: telas da aplicação (Login, Registro, Lista de Sensores, Detalhe do Sensor, Métricas, Dashboard Realtime). Cada tela consome hooks/contexts e renderiza componentes em `src/components`.
- src/components: componentes reutilizáveis (botões, inputs, gráficos, LoadingOverlay, Toasts).

Dados em tempo real:
- O projeto usa `socket.io-client` e `@stomp/stompjs`/`sockjs-client` (existem implementações para WebSocket/STOMP e fallback) para receber leituras em tempo real e atualizar gráficos/telas.
- Quando o backend estiver indisponível, alguns serviços oferecem fallback para dados simulados/local (veja `services/backendTest.ts` / `services/backendInvestigation.ts`).

Autenticação:
- Fluxo padrão: tela de login chama `authApi` para obter token/credenciais. O token é persistido (AsyncStorage) e usado pelo `apiClient` em headers Authorization.

Critérios de sucesso (o que aqui considero funcionando):
- Autenticação e persistência de sessão.
- Listagem e paginação básica de sensores.
- Tela de detalhe mostrando leituras históricas e gráfico.
- Gráficos que atualizam com eventos em tempo real quando o WebSocket está ativo.

Principais arquivos para inspeção rápida:
- `src/config/api.ts` — base URL
- `src/services/apiClient.ts` — configuração do Axios/fetch com interceptors
- `src/contexts/AuthContext.tsx` — login/logout e persistência
- `src/hooks/useSensorStream.ts` — lógica de conexão em tempo real
- `src/screens/SensorsScreen/index.tsx` — listagem de sensores

---

## Como fazer este frontend funcionar (instruções rápidas)

Requisitos prévios:
- Node.js LTS instalado (v18+ recomendado).npm/yarn
- Expo CLI (recomendado) ou usar `npx expo` sem instalar globalmente
- Backend disponível (ver nota abaixo). Se não houver backend, o app tenta usar dados simulados conforme alguns serviços do projeto.

Passos para rodar localmente (macOS, zsh):

1) Abrir terminal na pasta do projeto

```zsh
cd /Users/gabri/Downloads/APP/Challenhge_ESP866_FrontEND
npm install
```

2) Verificar/ajustar a URL do backend

Abra `src/config/api.ts` e confirme o `BASE_URL`. Para desenvolvimento local com backend Spring Boot rodando na máquina deixe `http://localhost:8080`. Em emulador Android use `http://10.0.2.2:8080`.

3) Iniciar o backend (opcional se estiver usando dados simulados)

Se você tem o backend separado, rode-o conforme instruções do repositório do backend. Por padrão ele escuta em `http://localhost:8080`.

4) Iniciar o frontend

```zsh
npm run start
# ou
npx expo start
```

Isso abrirá o Metro/Expo Devtools. Você pode:
- pressionar `i` para abrir no iOS Simulator (macOS)
- pressionar `a` para abrir no Android Emulator
- pressionar `w` para abrir no navegador (Web)
- usar o app Expo Go em dispositivo físico e escanear o QR code

5) Testar login e navegação

- Use a tela de login e registre/login com uma conta de teste (ou crie uma via tela de registro). Verifique as rotas: lista de sensores -> detalhe do sensor -> dashboard.

Problemas comuns e soluções rápidas:
- Erro CORS / 401: verifique `src/config/api.ts` e as configurações de CORS no backend; confirme que o token é enviado (ver `apiClient.ts`).
- WebSocket não conecta: confirme a URL e se o backend expõe um endpoint de WebSocket/STOMP; ver `services/socketio.ts` e `services/ws.ts`.
- Dependências nativas ao rodar em emulador: execute `npx expo prebuild` ou siga instruções do Expo para plataformas específicas.

Scripts úteis (conforme `package.json`):
- `npm run start` — inicia o Expo Devtools
- `npm run android` — inicia o Expo e abre no Android
- `npm run ios` — inicia o Expo e abre no iOS
- `npm run web` — inicia a versão web

-- Para abrir o a tela do google com o app, para ocultar o barra do google
 /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --app=http://localhost:8081 

-- Para abrir o a tela do google com o collab, para ocultar o barra do google 
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --app=https://colab.research.google.com/drive/1MLkSr8UYJf8SakAIG9MDwJK1qV3L4t7V

