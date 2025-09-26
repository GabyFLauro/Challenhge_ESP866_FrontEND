# Sprint 01 - Advanced Programming & Mobile Dev - 3ECA_FIAP_2025 - Twinovate_Challenge_Festo

# Sprint 02 - Advanced Programming & Mobile Dev - 3ECA_FIAP_2025 - Twinovate_Challenge_Festo

# Sprint 03 - Advanced Programming & Mobile Dev - 3ECA_FIAP_2025 - Twinovate_Challenge_Festo

Luana Alves de Santana RM: 98546  
Kauhe Serpa Do Val RM: 552027  
Gabriella Francisco de Lauro RM: 99280  
Luis Felipe Machareth Bannwart RM: 99879  
Caio Yudi Ozaki Godinho RM: 552505

---

## Como rodar o projeto (Frontend + Backend)

### 1. Clonar os repositórios

Clone este repositório (frontend) e o repositório do backend Java Spring Boot:

```
// Frontend (este projeto)
git clone <url-deste-repo>

// Backend (exemplo)
git clone https://github.com/GabyFLauro/Challenge_Festo_Twinovate_Backend.git
```

### 2. Instalar dependências do frontend

Abra o terminal na pasta do frontend e execute:

```
npm install
```

### 3. Instalar dependências do backend

Abra outro terminal na pasta do backend e siga as instruções do README do backend para instalar as dependências (geralmente Maven ou Gradle):

```
// Exemplo com Maven
mvn clean install

// Exemplo com Gradle
gradlew build
```

### 4. Rodar o backend

No terminal do backend, execute:

```
// Maven
mvn spring-boot:run

// ou Gradle
gradlew bootRun
```

O backend deve rodar por padrão em `http://localhost:8080`.

### 5. Configurar a URL do backend no frontend

No arquivo `src/config/api.ts` do frontend, ajuste a linha:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080', // ou o IP da sua máquina/backend
};
```

Se estiver usando emulador Android, use `10.0.2.2` no lugar de `localhost`.

### 6. Rodar o frontend

No terminal do frontend, execute:

```
npx expo start
```

- Pressione `w` para rodar no navegador (Web)
- Ou use a interface do Expo para rodar em dispositivo físico/emulador

---

## Funcionalidades
- Autenticação de usuários (login, registro, sessão)
- Listagem de sensores industriais
- Visualização de detalhes e leituras de sensores
- Registro de novas leituras
- Fallback para dados simulados apenas se o backend estiver offline

---

## Estrutura do Projeto
- Frontend: React Native + Expo + TypeScript
- Backend: Java Spring Boot (ver repositório separado)

---

## Documentação complementar
- Guia para devs: `DEVELOPER_GUIDE.md`
- Integração backend: `REAL_BACKEND_INTEGRATION.md`
- Sensores + leituras: `SENSOR_BACKEND_INTEGRATION.md`

---

## Observações
- Certifique-se de que o backend está rodando antes de iniciar o frontend.
- Para dúvidas sobre endpoints e estrutura do backend, consulte o README do backend.
- Para dúvidas sobre sensores e autenticação, consulte os arquivos de documentação deste projeto.

