# Diagnóstico de Divergências - Backend vs Frontend

## 🎯 **Problema Identificado**

Os dados dos sensores no frontend estão divergentes dos dados reais da tabela de sensores do backend. Implementei ferramentas de diagnóstico para identificar e corrigir essas divergências.

## 🔧 **Ferramentas de Diagnóstico Implementadas**

### ✅ **1. Logs Detalhados de Debug**

**Arquivo:** `src/services/sensors.ts`

Agora o serviço de sensores inclui logs detalhados que mostram:
- ✅ **Estrutura completa** dos dados recebidos do backend
- ✅ **Comparação campo por campo** entre backend e frontend
- ✅ **Identificação de campos faltando** ou extras
- ✅ **Análise de tipos de dados** para cada campo

**Exemplo de log:**
```
📊 Estrutura dos dados do backend:
Sensor 1: {
  id: "sensor_001",
  nome: "Pressão Principal",  // ← Campo diferente do esperado
  modelo: "XGZP701DB1R",
  tipo: "PRESSAO",           // ← Tipo diferente do esperado
  localizacao: "Linha 1",   // ← Campo diferente do esperado
  ativo: true,              // ← Campo diferente do esperado
  valorMinimo: 0,           // ← Campo diferente do esperado
  valorMaximo: 10           // ← Campo diferente do esperado
}
```

### ✅ **2. Serviço de Investigação do Backend**

**Novo arquivo:** `src/services/backendInvestigation.ts`

Funcionalidades implementadas:
- ✅ **Análise automática** da estrutura do backend
- ✅ **Comparação com frontend** campo por campo
- ✅ **Teste de endpoints** alternativos
- ✅ **Geração de recomendações** para correção

### ✅ **3. Interface de Diagnóstico**

**Tela de Sensores:** `src/screens/SensorsScreen/index.tsx`

Novos elementos:
- ✅ **Botão "🔍 Investigar Backend"** - Executa análise completa
- ✅ **Resultado da investigação** - Mostra divergências encontradas
- ✅ **Status visual** - Indica se há problemas de sincronização

## 🚀 **Como Usar o Diagnóstico**

### **1. Executar Investigação:**

1. **Abra a tela de sensores**
2. **Toque em "🔍 Investigar Backend"**
3. **Aguarde a análise** (aparece "Investigando estrutura do backend...")
4. **Veja o resultado** na caixa de diagnóstico

### **2. Interpretar os Resultados:**

**Exemplo de resultado:**
```
📊 RESUMO DA INVESTIGAÇÃO:

Backend Fields: id, nome, modelo, tipo, localizacao, ativo, valorMinimo, valorMaximo
Frontend Expected: id, name, model, type, location, isActive, minValue, maxValue
Diferenças: name, model, type, location, isActive, minValue, maxValue

Endpoints Testados:
- /sensors: ✅
- /sensors/with-readings: ❌
- /health: ✅

Recomendações:
- Campos faltando no backend: name, model, type, location, isActive, minValue, maxValue
- Campos extras no backend: nome, modelo, tipo, localizacao, ativo, valorMinimo, valorMaximo
- Tipo diferente para campo 'ativo': backend=boolean, frontend=boolean
```

## 🔍 **Tipos de Divergências Identificadas**

### **1. Nomes de Campos Diferentes:**
```typescript
// Backend retorna:
{
  nome: "Pressão 01",        // ← "nome" em português
  localizacao: "Linha 1"     // ← "localizacao" em português
}

// Frontend espera:
{
  name: "Pressão 01",        // ← "name" em inglês
  location: "Linha 1"        // ← "location" em inglês
}
```

### **2. Tipos de Dados Diferentes:**
```typescript
// Backend retorna:
{
  tipo: "PRESSAO",           // ← String em maiúsculo
  ativo: 1                   // ← Number (1/0)
}

// Frontend espera:
{
  type: "pressure",          // ← String em minúsculo
  isActive: true             // ← Boolean
}
```

### **3. Estrutura de Dados Diferente:**
```typescript
// Backend retorna:
{
  ultimaLeitura: {
    valor: 5.2,
    dataHora: "2025-01-14T15:30:00Z"
  }
}

// Frontend espera:
{
  lastReading: {
    value: 5.2,
    timestamp: "2025-01-14T15:30:00Z"
  }
}
```

## 🛠️ **Como Corrigir as Divergências**

### **Opção 1: Atualizar Frontend (Recomendado)**

**1. Atualizar SensorDTO:**
```typescript
export interface SensorDTO {
  id: string;
  nome: string;              // ← Mudar de "name" para "nome"
  modelo?: string;           // ← Mudar de "model" para "modelo"
  tipo?: string;             // ← Manter "tipo"
  localizacao?: string;      // ← Mudar de "location" para "localizacao"
  descricao?: string;       // ← Mudar de "description" para "descricao"
  unidade?: string;         // ← Mudar de "unit" para "unidade"
  ativo?: boolean;          // ← Mudar de "isActive" para "ativo"
  valorMinimo?: number;    // ← Mudar de "minValue" para "valorMinimo"
  valorMaximo?: number;    // ← Mudar de "maxValue" para "valorMaximo"
  valorAtual?: number;     // ← Mudar de "currentValue" para "valorAtual"
  ultimaLeitura?: {        // ← Mudar de "lastReading" para "ultimaLeitura"
    valor: number;         // ← Mudar de "value" para "valor"
    dataHora: string;      // ← Mudar de "timestamp" para "dataHora"
  };
}
```

**2. Atualizar Mapeamento:**
```typescript
const mapSensors = (items: SensorDTO[]): Sensor[] => {
  return items.map(s => ({
    id: s.id,
    name: s.nome,                    // ← Mapear "nome" para "name"
    model: s.modelo,                // ← Mapear "modelo" para "model"
    type: s.tipo?.toLowerCase(),     // ← Converter para minúsculo
    location: s.localizacao,         // ← Mapear "localizacao" para "location"
    description: s.descricao,       // ← Mapear "descricao" para "description"
    unit: s.unidade,                // ← Mapear "unidade" para "unit"
    isActive: s.ativo,              // ← Mapear "ativo" para "isActive"
    minValue: s.valorMinimo,        // ← Mapear "valorMinimo" para "minValue"
    maxValue: s.valorMaximo,        // ← Mapear "valorMaximo" para "maxValue"
    currentValue: s.valorAtual,     // ← Mapear "valorAtual" para "currentValue"
    lastUpdate: s.ultimaLeitura?.dataHora ? 
      new Date(s.ultimaLeitura.dataHora).toLocaleString() : 
      new Date().toLocaleString()
  }));
};
```

### **Opção 2: Atualizar Backend**

Se você tem controle sobre o backend, pode atualizar os endpoints para retornar dados no formato esperado pelo frontend.

## 📊 **Monitoramento Contínuo**

### **Logs Automáticos:**
- ✅ **Carregamento de sensores** - Mostra estrutura recebida
- ✅ **Carregamento de sensor específico** - Mostra dados detalhados
- ✅ **Erros de mapeamento** - Identifica campos problemáticos

### **Investigações Manuais:**
- ✅ **Botão de investigação** - Análise completa sob demanda
- ✅ **Comparação de estruturas** - Identifica divergências
- ✅ **Recomendações automáticas** - Sugere correções

## 🎯 **Próximos Passos**

1. **Execute a investigação** usando o botão na tela de sensores
2. **Analise os resultados** para identificar divergências específicas
3. **Implemente as correções** baseadas nas recomendações
4. **Teste novamente** para confirmar a sincronização
5. **Monitore os logs** para garantir consistência contínua

## 🔗 **Referências**

- [Integração de APIs com Frontend](https://www.webnuz.com/article/2024-06-09/Como%20integrar%20sua%20API%20com%20seu%20frontend%3F)
- [Guia de Integração de Dados](https://www.escoladnc.com.br/blog/integrando-dados-de-apis-em-aplicacoes-frontend-guia-completo/)
- [Visualização de Dados em Tempo Real](https://ichi.pro/pt/visualizacao-de-dados-do-sensor-em-tempo-real-usando-reactjs-nodejs-socket-io-e-raspberry-pi-229840835621277)

**Agora você tem ferramentas completas para identificar e corrigir divergências entre backend e frontend!** 🎯
