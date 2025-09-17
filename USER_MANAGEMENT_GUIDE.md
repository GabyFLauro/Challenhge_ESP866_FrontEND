# Guia Completo do Componente UserManagement

## 📋 **Especificação Implementada (com hook useUserManagement)**

### ✅ **Estados do Hook**
```typescript
const { users, loading, editModalVisible, editUserId, editEmail, editPassword, passwordModalVisible, passwordUserId, newPassword } = useUserManagement();
```

### ✅ **Funções Principais (expostas pelo hook)**
```typescript
const { openEditModal, saveEdit, openPasswordModal, changePassword, removeUser } = useUserManagement();
```

### ✅ **Layout Otimizado (Conforme Especificado)**

#### **UserContainer: Cards com sombra e espaçamento adequado**
```typescript
const UserContainer = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid ${theme.colors.border};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;
```

#### **UserRole: Badge colorido indicando tipo de usuário**
```typescript
const UserRole = styled.Text<StyledProps>`
  font-size: 12px;
  font-weight: bold;
  color: ${(props: StyledProps) => getRoleColor(props.role)};
  text-transform: uppercase;
  background-color: ${(props: StyledProps) => getRoleColor(props.role) + '20'};
  padding: 4px 8px;
  border-radius: 12px;
  align-self: flex-start;
`;
```

#### **PasswordContainer: Seção separada para alteração de senha**
```typescript
const PasswordContainer = styled.View`
  margin-top: 16px;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;
```

#### **Responsivo: Layout se adapta ao conteúdo**
- ✅ Flexbox para layout responsivo
- ✅ Styled-components com tema consistente
- ✅ Adaptação automática ao tamanho da tela

## 🔗 **Integração com Backend Java Spring Boot**

### ✅ **Endpoints Utilizados**
```typescript
// GET /usuarios - Listar todos os usuários
const usersData = await adminApiService.getAllUsers();

// PUT /usuarios/{id}/senha - Alterar senha
await adminApiService.changeUserPassword({
  userId: userId,
  newPassword: newPassword.trim()
});
```

### ✅ **Mapeamento de Dados Backend → Frontend**
```typescript
// Backend (Java Spring Boot)
{
  id: 123,
  nome: "Dr. João Silva",
  email: "joao@email.com",
  tipoUsuario: "MEDICO",
  especialidade: "Cardiologia"
}

// Frontend (React Native)
{
  id: "123",
  name: "Dr. João Silva",
  email: "joao@email.com",
  role: "doctor",
  specialty: "Cardiologia"
}
```

## 🚀 **Como Usar o Componente**

### **1. Importação**
```typescript
import UserManagement from '../components/UserManagement';
```

### **2. Uso Básico**
```typescript
const MyScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <UserManagement style={{ flex: 1 }} />
    </View>
  );
};
```

### **3. Uso em Tela Completa**
```typescript
import React from 'react';
import { ScrollView } from 'react-native';
import UserManagement from '../components/UserManagement';

const AdminScreen = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <UserManagement />
    </ScrollView>
  );
};
```

## 🎨 **Funcionalidades Visuais**

### ✅ **Estados Visuais**
- **Loading**: Indicador de carregamento com texto
- **Lista de Usuários**: Cards organizados com informações
- **Edição de Senha**: Formulário inline com validação
- **Feedback**: Alertas de sucesso/erro

### ✅ **Cores por Tipo de Usuário**
- **Admin**: Vermelho (`theme.colors.error`)
- **Médico**: Azul (`theme.colors.primary`)
- **Paciente**: Verde (`theme.colors.success`)

### ✅ **Validações**
- **Senha**: Mínimo 6 caracteres
- **Campos Obrigatórios**: Validação antes do envio
- **Feedback Visual**: Mensagens claras de erro/sucesso

## 🔧 **Configuração Necessária**

### **1. Backend Java Spring Boot**
Certifique-se de que o backend está rodando com:
- ✅ `UsuarioController` implementado
- ✅ Endpoint `PUT /usuarios/{id}/senha` funcionando
- ✅ JWT Authentication configurado
- ✅ CORS configurado para React Native

### **2. Frontend React Native**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://SEU_IP:8080', // Altere para o IP do seu backend
};
```

## 📱 **Exemplo de Tela Completa**

```typescript
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import styled from 'styled-components/native';
import UserManagement from '../components/UserManagement';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

const AdminDashboardScreen = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <Header>
        <Title>Painel Administrativo</Title>
        <Button
          title="Sair"
          onPress={signOut}
          buttonStyle={{ backgroundColor: theme.colors.error }}
        />
      </Header>
      
      <ScrollView style={{ flex: 1 }}>
        <UserManagement />
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export default AdminDashboardScreen;
```

## 🎯 **Status: IMPLEMENTAÇÃO COMPLETA**

### ✅ **Conformidade com Especificação**
- ✅ **Estados**: Todos implementados conforme especificado
- ✅ **Funções**: Todas implementadas conforme especificado
- ✅ **Layout**: Otimizado conforme especificado
- ✅ **Responsivo**: Layout se adapta ao conteúdo

### ✅ **Integração com Backend**
- ✅ **API**: Comunicação completa com Java Spring Boot
- ✅ **Endpoints**: Todos os endpoints necessários implementados
- ✅ **Mapeamento**: Conversão correta de dados
- ✅ **Tratamento de Erros**: Robusto e amigável

### ✅ **Funcionalidades**
- ✅ **Carregamento**: Usuários da API real
- ✅ **Alteração de Senha**: Com validação
- ✅ **UI/UX**: Interface moderna e responsiva
- ✅ **Feedback**: Mensagens claras para o usuário

O componente está **100% funcional** e integrado com o backend [Challenge_Festo_Twinovate_Backend](https://github.com/GabyFLauro/Challenge_Festo_Twinovate_Backend.git)! 🎉
