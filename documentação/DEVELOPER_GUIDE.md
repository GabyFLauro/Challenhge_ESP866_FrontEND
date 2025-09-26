# Developer Guide

## Índice
- Visão Geral
- Arquitetura (Clean Code + SOLID)
- Fluxo de Dados e Serviços
- Hooks por Funcionalidade
- Telas e Responsabilidades
- Integração com Backend
- Sensores e Leituras
- Validações e Utilitários
- Setup e Execução
- Troubleshooting
- Referências

## Visão Geral
Este guia unifica e resume toda a documentação técnica do projeto, cobrindo arquitetura, integrações, hooks e melhores práticas aplicadas.

## Arquitetura (Clean Code + SOLID)
- SRP: arquivos com responsabilidade única (telas, hooks, utils, serviços)
- OCP: regras extensíveis em utils/hooks sem alterar telas
- LSP/ISP: contratos simples e específicos nos hooks/componentes
- DIP: telas dependem de hooks/utilitários em vez de detalhes de API

Estrutura principal:
- Hooks: `src/hooks/*`
- Utils: `src/utils/*`
- Serviços: `src/services/*`
- Telas: `src/screens/*`

## Fluxo de Dados e Serviços
- `src/services/apiClient.ts`: cliente HTTP com timeout, headers e teste de saúde
- `src/services/sensors.ts`: leitura de sensores com normalização
- `src/services/readings.ts`: leituras por sensor e criação com normalização
- `src/services/backendTest.ts` e `backendInvestigation.ts`: diagnóstico e investigação

## Hooks por Funcionalidade
- Sensores
  - `useSensors`: lista sensores, status do backend, refresh, investigação
  - `useSensorDetail`: sensor+leituras, status derivado, gráfico, ordenação
- Autenticação
  - `useLogin`: estado/validação e submit de login
  - `useRegister`: estado/validação e submit de cadastro

## Telas e Responsabilidades
- Sensores: `SensorsScreen`, `SensorDetailScreen` usam apenas hooks e renderizam UI
- Autenticação: `LoginScreen`, `RegisterScreen` consomem hooks dedicados

## Integração com Backend
- Configuração em `src/config/api.ts` (Android emulador adapta localhost → 10.0.2.2)
- Endpoints esperados: `/sensors`, `/sensors/{id}`, `/readings`, `/readings/{sensorId}`, `/usuarios/login`, `/usuarios`, `/usuarios/me`
- Teste de saúde: `apiClient.testConnection()` (GET `/health`)

## Sensores e Leituras
- Normalização de campos no serviço para robustez a variações (ex.: `nome/modelo/tipo/unidade/valorAtual`, `sensor_id/valor/dataHora`)
- Utilitários: `src/utils/sensors.ts` para status, datasets do gráfico, ordenação e mapeamento DTO→View

## Validações e Utilitários
- `src/utils/validation.ts`: email, senha mínima, comparação e mensagens
- Preferir validações no hook; telas apenas exibem mensagens

## Setup e Execução
- Instale dependências: `npm install`
- Inicie: `npx expo start` (tecle `w` para Web)
- Ajuste `API_CONFIG.BASE_URL` conforme seu backend

## Troubleshooting
- Backend Offline: verifique `/health`, firewall/porta e BASE_URL
- Dados divergentes: confira normalização em serviços e logs das telas de sensores
- Sem gráfico: são necessárias pelo menos 2 leituras

## Referências
- Backend do desafio: `https://vscode.dev/github/GabyFLauro/Challenge_Festo_Twinovate_Backend/blob/main`
- Docs específicas:
  - `REAL_BACKEND_INTEGRATION.md`
  - `SENSOR_BACKEND_INTEGRATION.md`


