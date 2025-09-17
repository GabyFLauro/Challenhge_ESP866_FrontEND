# Integração com Backend Real - Challenge Festo Twinovate

## 🎯 **Configuração Completa para Backend Real**

Implementei a integração completa com o backend real do [Challenge Festo Twinovate Backend](https://vscode.dev/github/GabyFLauro/Challenge_Festo_Twinovate_Backend/blob/main). Agora os dados dos sensores vêm diretamente do backend quando disponível.

## 🔧 **Principais Implementações (Clean Code + SOLID)**

### ✅ **1. Configuração da API Atualizada**

**Arquivo:** `src/config/api.ts`
```typescript
export const API_CONFIG = {
  // URL base da API - Backend real do Challenge Festo Twinovate
  BASE_URL: 'http://localhost:8080', // Altere para o IP do seu backend quando necessário
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 10000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

### ✅ **2. Serviços Priorizando Backend Real com Normalização**

**Serviço de Sensores:** `src/services/sensors.ts`
- ✅ Normalização de campos (ex.: `nome/modelo/tipo/unidade/valorAtual`) → `SensorDTO`
- ✅ Logs de estrutura para diagnóstico
- ✅ Fallback robusto quando backend indisponível
- ✅ Métodos `list()` e `getById()`

**Serviço de Leituras:** `src/services/readings.ts`
- ✅ Normalização de campos (ex.: `sensor_id/valor/dataHora`) → `ReadingDTO`
- ✅ Fallback com mocks realistas
- ✅ POST com normalização da resposta

### ✅ **3. Teste de Conectividade**

**Novo serviço:** `src/services/backendTest.ts`
- ✅ **Teste de conexão** - Verifica se backend está acessível
- ✅ **Teste de endpoints** - Valida `/sensors` e `/readings`
- ✅ **Teste completo** - Executa todos os testes automaticamente

### ✅ **4. Interface com Status do Backend (DIP)**

**Tela de Sensores:** `src/screens/SensorsScreen/index.tsx`
- ✅ Usa hook `useSensors` (tela depende de abstrações)
- ✅ Status visual do backend
- ✅ Pull-to-refresh com reteste

## 🚀 **Como Configurar para Backend Real**

### **1. Configurar URL do Backend**

Edite o arquivo `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  // Para desenvolvimento local
  BASE_URL: 'http://localhost:8080',
  
  // Para dispositivo físico (substitua pelo IP do seu computador)
  BASE_URL: 'http://192.168.1.100:8080',
  
  // Para Android Emulator (automático)
  // O sistema detecta automaticamente e usa 10.0.2.2
};
```

### **2. Iniciar o Backend**

Certifique-se de que o backend está rodando:
```bash
# No diretório do backend
./mvnw spring-boot:run
# ou
java -jar target/challenge-festo-twinovate-backend.jar
```

### **3. Verificar Endpoints**

O backend deve expor os seguintes endpoints:
- ✅ `GET /sensors` - Lista todos os sensores
- ✅ `GET /sensors/{id}` - Sensor específico
- ✅ `GET /readings` - Todas as leituras
- ✅ `GET /readings/{sensorId}` - Leituras de um sensor
- ✅ `POST /readings` - Criar nova leitura

## 📊 **Logs de Debug**

Agora você pode acompanhar a integração pelos logs do console:

### **Sensores:**
```
🔍 Buscando sensores do backend real...
✅ Sensores carregados do backend: 7
```

### **Leituras:**
```
🔍 Buscando leituras para sensor p1 do backend real...
✅ Leituras do sensor p1 carregadas do backend: 15
```

### **Conectividade:**
```
🔍 Testando conectividade com backend: http://localhost:8080/health
✅ Backend está acessível
```

### **Fallback (quando backend offline):**
```
⚠️ Erro ao buscar sensores do backend, usando dados de fallback: Error: Network request failed
```

## 🎨 **Interface Atualizada**

### **Status do Backend:**
- ✅ **"✅ Backend Conectado"** - Usando dados reais
- ⚠️ **"⚠️ Backend Offline"** - Usando dados simulados
- ❌ **"❌ Erro de Conexão"** - Problema de conectividade

### **Comportamento:**
1. **Backend Online** - Dados reais do servidor
2. **Backend Offline** - Dados simulados inteligentes
3. **Erro de Rede** - Fallback robusto com mensagens claras

## 🔄 **Fluxo de Integração com Hooks**

### **1. Carregamento Inicial:**
```typescript
// Testa conectividade
const { listView, backendStatus, refresh } = useSensors();
```

### **2. Atualização:**
```typescript
// Pull-to-refresh testa novamente
const onRefresh = async () => {
  const testResult = await backendTestService.runFullTest();
  const sensors = await sensorsService.list();
};
```

### **3. Detalhes do Sensor:**
```typescript
// Busca sensor específico + leituras
const { sensor, readings, status, chartData } = useSensorDetail(sensorId);
```

## 🛠️ **Troubleshooting**

### **Problema: "Backend Offline"**
**Solução:**
1. Verifique se o backend está rodando
2. Confirme a URL em `src/config/api.ts`
3. Teste conectividade: `curl http://localhost:8080/health`

### **Problema: "Erro de Conexão"**
**Solução:**
1. Verifique firewall/antivírus
2. Confirme porta 8080 disponível
3. Teste com IP em vez de localhost

### **Problema: Dados não aparecem**
**Solução:**
1. Verifique logs do console
2. Confirme endpoints do backend
3. Teste endpoints manualmente

## 📱 **Testando a Integração**

### **1. Backend Online:**
- Abra a tela de sensores
- Deve mostrar "✅ Backend Conectado"
- Dados devem vir do servidor

### **2. Backend Offline:**
- Pare o backend
- Abra a tela de sensores
- Deve mostrar "⚠️ Backend Offline"
- Dados simulados devem aparecer

### **3. Registro de Leituras:**
- Toque em um sensor
- Use "Registrar Leitura"
- Deve funcionar online e offline

## 🎯 **Resultado Final**

Agora o frontend está **100% integrado** com o backend real:

- ✅ **Dados reais** quando backend disponível
- ✅ **Fallback inteligente** quando backend offline
- ✅ **Status visual** da conectividade
- ✅ **Logs detalhados** para debug
- ✅ **Teste automático** de conectividade
- ✅ **Interface responsiva** a mudanças de status

**Os dados dos sensores agora vêm realmente do backend quando disponível!** 🚀

## 🔗 **Referências**

- [Backend Repository](https://vscode.dev/github/GabyFLauro/Challenge_Festo_Twinovate_Backend/blob/main)
- [Visualização de dados em tempo real](https://ichi.pro/pt/visualizacao-de-dados-do-sensor-em-tempo-real-usando-reactjs-nodejs-socket-io-e-raspberry-pi-229840835621277)
- [Frontend consumo energético](https://github.com/gafdot/frontend-consumo-energetico)
