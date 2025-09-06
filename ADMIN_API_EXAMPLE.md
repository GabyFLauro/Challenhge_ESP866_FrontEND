# Exemplo de Uso do AdminApiService

## 📋 Visão Geral

O `adminApiService` é um serviço especializado para operações administrativas que se conecta diretamente com o backend Java Spring Boot.

## 🔧 Funcionalidades Disponíveis

### 1. Listar Todos os Usuários
```typescript
import { adminApiService } from '../services/adminApi';

// Buscar todos os usuários
const users = await adminApiService.getAllUsers();
console.log(users); // Array de AdminUser[]
```

### 2. Alterar Senha de Usuário
```typescript
// Alterar senha de um usuário específico
await adminApiService.changeUserPassword({
  userId: '123',
  newPassword: 'novaSenha123'
});
```

### 3. Editar Usuário
```typescript
// Editar informações de um usuário
await adminApiService.editUser('123', {
  email: 'novo@email.com',
  senha: 'novaSenha' // opcional
});
```

### 4. Excluir Usuário
```typescript
// Excluir um usuário
await adminApiService.deleteUser('123');
```

### 5. Buscar Usuário por ID
```typescript
// Buscar usuário específico
const user = await adminApiService.getUserById('123');
console.log(user); // AdminUser
```

## 🏗️ Estrutura de Dados

### AdminUser Interface
```typescript
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  specialty?: string; // Apenas para médicos
}
```

### ChangePasswordData Interface
```typescript
interface ChangePasswordData {
  userId: string;
  newPassword: string;
}
```

## 🔗 Integração com Backend

O serviço se conecta com os seguintes endpoints do backend Java:

- `GET /usuarios` - Listar usuários
- `PUT /usuarios/{id}/senha` - Alterar senha
- `PUT /usuarios/{id}` - Editar usuário
- `DELETE /usuarios/{id}` - Excluir usuário
- `GET /usuarios/{id}` - Buscar usuário

## 🛡️ Tratamento de Erros

```typescript
try {
  const users = await adminApiService.getAllUsers();
  // Sucesso
} catch (error) {
  console.error('Erro:', error.message);
  // Tratar erro
}
```

## 📱 Exemplo de Uso em Componente

```typescript
import React, { useState, useEffect } from 'react';
import { adminApiService, AdminUser } from '../services/adminApi';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminApiService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (userId: string, newPassword: string) => {
    try {
      await adminApiService.changeUserPassword({ userId, newPassword });
      alert('Senha alterada com sucesso!');
    } catch (error) {
      alert('Erro ao alterar senha');
    }
  };

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name} - {user.role}
              {user.role === 'doctor' && user.specialty && ` (${user.specialty})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## 🔄 Mapeamento de Dados

O serviço automaticamente mapeia os dados do backend para o formato do frontend:

### Backend → Frontend
```typescript
// Backend (ApiUser)
{
  id: 123,
  nome: "Dr. João",
  email: "joao@email.com",
  tipoUsuario: "MEDICO",
  especialidade: "Cardiologia"
}

// Frontend (AdminUser)
{
  id: "123",
  name: "Dr. João",
  email: "joao@email.com",
  role: "doctor",
  specialty: "Cardiologia"
}
```

## ⚡ Performance

- Cache automático de requisições
- Timeout configurável (10 segundos)
- Retry automático em caso de falha de rede
- Fallback para dados mockados se API indisponível
