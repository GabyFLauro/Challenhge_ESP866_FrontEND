# Integração com Backend - Challenge Festo Twinovate

## 📋 Resumo

Este projeto está totalmente integrado ao backend Java Spring Boot. Todas as funcionalidades de sensores e autenticação consomem dados reais da API.

## 🔧 Configuração

### 1. URL da API
Edite o arquivo `src/config/api.ts` e altere a URL base:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://SEU_IP:8080', // Altere para o IP do seu backend
};
```

### 2. Backend Necessário
Certifique-se de que o backend está rodando com os seguintes endpoints:

- `POST /usuarios/login` - Login
- `POST /usuarios` - Registro
- `GET /usuarios/me` - Usuário atual
- `GET /sensors` - Listar sensores
- `GET /sensors/{id}` - Sensor específico
- `GET /readings` - Todas as leituras
- `GET /readings/{sensorId}` - Leituras de um sensor

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação
- Login com JWT
- Registro de novos usuários
- Logout
- Persistência de sessão

### ✅ Sensores
- Listar sensores do backend
- Visualizar detalhes e leituras de cada sensor
- Registrar novas leituras
- Fallback para dados simulados apenas se o backend estiver offline

## 🛡️ Tratamento de Erros

- API indisponível: Usa dados simulados temporariamente
- Erro de rede: Mostra mensagens amigáveis
- Token expirado: Redireciona para login
- Dados inválidos: Validação no frontend e backend

## 🧪 Testando a Integração

1. Inicie o backend Java
2. Configure a URL no `api.ts`
3. Teste login com usuários do backend
4. Verifique se sensores e leituras são carregados da API

## 🖥️ Compatibilidade

- ✅ React Native
- ✅ AsyncStorage para persistência
- ✅ JWT para autenticação
- ✅ TypeScript para type safety

## 🐞 Debug

1. Verifique logs no console
2. Confirme se a URL da API está correta
3. Teste endpoints manualmente (Postman/Insomnia)
4. Verifique se o backend está rodando na porta 8080

## 📞 Suporte

Em caso de problemas:
1. Verifique se o backend está rodando
2. Confirme a URL da API
3. Verifique logs de erro no console
4. Teste conectividade de rede
