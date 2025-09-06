# Integração com Backend - Challenge Festo Twinovate

## 📋 Resumo das Mudanças

Este projeto foi migrado de dados mockados para integração completa com o backend Java Spring Boot. Todas as funcionalidades agora se conectam com a API real.

## 🔧 Configuração

### 1. URL da API
Edite o arquivo `src/config/api.ts` e altere a URL base:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://SEU_IP:8080', // Altere para o IP do seu backend
  // ...
};
```

### 2. Backend Necessário
Certifique-se de que o backend está rodando com os seguintes endpoints:

- `POST /usuarios/login` - Login
- `POST /usuarios` - Registro
- `GET /usuarios/me` - Usuário atual
- `GET /usuarios` - Listar usuários (admin)
- `GET /usuarios/medicos` - Listar médicos
- `PUT /usuarios/{id}/senha` - Alterar senha
- `PUT /usuarios/{id}` - Editar usuário
- `DELETE /usuarios/{id}` - Excluir usuário

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação
- Login com JWT
- Registro de novos usuários
- Logout
- Persistência de sessão

### ✅ Gerenciamento de Usuários (Admin)
- Listar todos os usuários da API
- Editar usuários (email e senha)
- Excluir usuários
- Alterar senhas de usuários
- Visualizar especialidades dos médicos

### ✅ Médicos
- Listar médicos da API
- Fallback para dados mockados se API indisponível
- Filtro por especialidade

### ✅ Configurações de Conta
- Alterar senha do usuário atual
- Editar informações pessoais

## 📁 Arquivos Modificados

### Novos Arquivos
- `src/config/api.ts` - Configuração da API
- `src/services/apiClient.ts` - Cliente HTTP
- `src/services/authApi.ts` - Serviço de autenticação com API
- `src/services/adminApi.ts` - Serviço de administração com API

### Arquivos Atualizados
- `src/services/auth.ts` - Migrado para usar authApi e adminApi
- `src/components/AppointmentForm.tsx` - Usa médicos da API
- `src/components/DoctorList.tsx` - Atualizado para tipo User
- `src/screens/UserManagementScreen.tsx` - Usa adminApiService
- `src/types/doctors.ts` - Marcado como deprecated

## 🔄 Migração de Dados

### ANTES (Mockados)
```typescript
const mockDoctors = [
  { id: '1', name: 'Dr. João', specialty: 'Cardiologia' },
  // ...
];
```

### DEPOIS (API Real)
```typescript
const doctors = await authApiService.getAllDoctors();
```

## 🛡️ Tratamento de Erros

O sistema inclui fallbacks robustos:

1. **API indisponível**: Usa dados mockados temporariamente
2. **Erro de rede**: Mostra mensagens amigáveis
3. **Token expirado**: Redireciona para login
4. **Dados inválidos**: Validação no frontend e backend

## 🧪 Testando a Integração

1. Inicie o backend Java
2. Configure a URL no `api.ts`
3. Teste login com usuários do backend
4. Verifique se médicos são carregados da API
5. Teste funcionalidades de admin

## 📱 Compatibilidade

- ✅ React Native
- ✅ AsyncStorage para persistência
- ✅ JWT para autenticação
- ✅ TypeScript para type safety

## 🔍 Debug

Para debugar problemas de integração:

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
