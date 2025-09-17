Sprint 01 - Advanced Programming & Mobile Dev - 3ECA_FIAP_2025 - Twinovate_Challenge_Festo


Luana Alves de Santana RM: 98546

Kauhe Serpa Do Val RM: 552027

Gabriella Francisco de Lauro RM: 99280

Luis Felipe Machareth Bannwart RM: 99879

Caio Yudi Ozaki Godinho RM: 552505

Como rodar
- Instalar dependências: `npm install`
- Iniciar app: `npx expo start` e teclar `w` para Web
- Para dispositivo/emulador, use a interface do Expo conforme seu ambiente

Configuração do backend
- Ajuste a URL base em `src/config/api.ts` (Android emulador troca automaticamente localhost→10.0.2.2)
- Endpoints esperados: `/sensors`, `/sensors/{id}`, `/readings`, `/readings/{sensorId}`, `/usuarios/*`

Arquitetura (Clean Code + SOLID)
- Telas focadas em UI; lógica de dados em hooks; transformações/validações em utils
- Hooks principais:
  - `src/hooks/useSensors.ts`, `src/hooks/useSensorDetail.ts`
  - `src/hooks/useLogin.ts`, `src/hooks/useRegister.ts`
  - `src/hooks/useUserManagement.ts`, `src/hooks/useAdminDashboard.ts`, `src/hooks/useDoctorDashboard.ts`
- Utils:
  - `src/utils/sensors.ts` (mapeamento DTO→View, status, gráfico)
  - `src/utils/validation.ts` (email, senha, mensagens)
- Serviços: `src/services/*` (API client, sensores, leituras, autenticação, admin)

Princípios aplicados
- SRP: responsabilidades únicas por arquivo (telas, hooks, utils, serviços)
- OCP: regras extensíveis nos utils/hooks sem alterar telas
- LSP/ISP: contratos simples nos hooks e componentes
- DIP: telas dependem de abstrações (hooks/utilitários), não de detalhes de API

Docs complementares
- Guia unificado para devs: `DEVELOPER_GUIDE.md`
- Integração backend: `REAL_BACKEND_INTEGRATION.md`
- Sensores + leituras: `SENSOR_BACKEND_INTEGRATION.md`
- Dashboard e usuários: `DASHBOARD_INTEGRATION_GUIDE.md`, `USER_MANAGEMENT_GUIDE.md`

