# Separação de Configurações de Gráficos

## Visão Geral

As configurações de gráficos foram separadas para permitir customizações independentes para cada tela/componente, mantendo todas as configurações atuais.

## Estrutura Anterior

Antes, havia apenas uma função compartilhada:
- `getSharedLineChartConfig(opts)` - configuração genérica para todos os gráficos

## Nova Estrutura

### Arquivo: `src/utils/chartConfig.ts`

Agora temos **4 funções de configuração**:

#### 1. `getSharedLineChartConfig(opts)` ⚠️ MANTIDA PARA COMPATIBILIDADE
- **Propósito**: Configuração base compartilhada (caso necessário para novos componentes)
- **Parâmetros**: 
  - `strokeWidth` (padrão: 3)
  - `decimalPlaces` (padrão: 1)
- **Usado em**: Disponível mas não mais utilizado diretamente

#### 2. `getChartPanelConfig()` 🆕
- **Propósito**: Configuração específica para o componente ChartPanel
- **Usado em**: `src/components/ChartPanel.tsx`
- **Características**:
  - strokeWidth: 3
  - decimalPlaces: 1
  - Cor principal: #66fcf1 (cyan)
  - Background: #1C1C1E (dark)

#### 3. `getMetricScreenChartConfig()` 🆕
- **Propósito**: Configuração específica para a tela MetricScreen
- **Usado em**: `src/screens/MetricScreen/index.tsx`
- **Características**:
  - strokeWidth: 3
  - decimalPlaces: 1
  - Cor principal: #66fcf1 (cyan)
  - Background: #1C1C1E (dark)

#### 4. `getSensorDetailChartConfig(fontSize)` 🆕
- **Propósito**: Configuração específica para a tela SensorDetailScreen
- **Usado em**: `src/screens/SensorDetailScreen/index.tsx`
- **Parâmetros**: 
  - `fontSize`: número para ajuste responsivo das labels
- **Características**:
  - strokeWidth: 3
  - decimalPlaces: 1
  - Cor principal: #66fcf1 (cyan)
  - Background: #1C1C1E (dark)
  - Suporte a ajuste responsivo de fontes

## Configurações Mantidas

Todas as configurações visuais atuais foram preservadas:

```typescript
{
  backgroundColor: '#1C1C1E',
  backgroundGradientFrom: '#1C1C1E',
  backgroundGradientTo: '#1C1C1E',
  fillShadowGradientFrom: '#66fcf1',
  fillShadowGradientFromOpacity: 1,
  fillShadowGradientTo: '#66fcf1',
  fillShadowGradientToOpacity: 0.2,
  color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 3,
  decimalPlaces: 1,
  propsForBackgroundLines: {
    strokeWidth: 1,
    strokeDasharray: '',
  },
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#66fcf1',
    fill: '#66fcf1',
  },
}
```

## Como Customizar Um Gráfico Específico

### Exemplo 1: Alterar cor do gráfico do ChartPanel

```typescript
// Em src/utils/chartConfig.ts
export const getChartPanelConfig = (): any => {
  return {
    // ... outras configurações
    fillShadowGradientFrom: '#FF6B6B', // Nova cor: vermelho
    fillShadowGradientTo: '#FF6B6B',
    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#FF6B6B',
      fill: '#FF6B6B',
    },
  };
};
```

### Exemplo 2: Alterar espessura da linha no MetricScreen

```typescript
// Em src/utils/chartConfig.ts
export const getMetricScreenChartConfig = (): any => {
  return {
    // ... outras configurações
    strokeWidth: 5, // Aumentar de 3 para 5
  };
};
```

### Exemplo 3: Alterar o tamanho dos pontos no SensorDetailScreen

```typescript
// Em src/utils/chartConfig.ts
export const getSensorDetailChartConfig = (fontSize: number): any => {
  return {
    // ... outras configurações
    propsForDots: {
      r: '8', // Aumentar de 5 para 8
      strokeWidth: '3',
      stroke: '#66fcf1',
      fill: '#66fcf1',
    },
  };
};
```

## Arquivos Modificados

### 1. `src/utils/chartConfig.ts`
- ✅ Mantida função `getSharedLineChartConfig()` para compatibilidade
- ✅ Adicionada função `getChartPanelConfig()`
- ✅ Adicionada função `getMetricScreenChartConfig()`
- ✅ Adicionada função `getSensorDetailChartConfig(fontSize)`

### 2. `src/components/ChartPanel.tsx`
- ✅ Importação alterada: `getSharedLineChartConfig` → `getChartPanelConfig`
- ✅ Uso do gráfico alterado: `getSharedLineChartConfig({ strokeWidth: 3 })` → `getChartPanelConfig()`

### 3. `src/screens/MetricScreen/index.tsx`
- ✅ Importação alterada: `getSharedLineChartConfig` → `getMetricScreenChartConfig`
- ✅ Uso do gráfico alterado: `getSharedLineChartConfig({ strokeWidth: 3, decimalPlaces: 1 })` → `getMetricScreenChartConfig()`

### 4. `src/screens/SensorDetailScreen/index.tsx`
- ✅ Importação alterada: `getSharedLineChartConfig` → `getSensorDetailChartConfig`
- ✅ Removida função local `getLineChartConfig`
- ✅ Uso do gráfico alterado: `getLineChartConfig(chartFontSize)` → `getSensorDetailChartConfig(chartFontSize)`

## Benefícios

1. **Isolamento**: Cada tela/componente tem sua própria configuração
2. **Manutenibilidade**: Mudanças em um gráfico não afetam os outros
3. **Clareza**: Fica claro onde cada configuração é usada
4. **Flexibilidade**: Permite customizações específicas por contexto
5. **Sem regressões**: Todas as configurações atuais foram mantidas

## Testes Recomendados

Após as mudanças, verifique:

1. ✅ ChartPanel (Dashboard Realtime) - Gráficos de tempo real por métrica
2. ✅ MetricScreen - Gráfico por tempo com histórico
3. ✅ SensorDetailScreen - Dois gráficos com dados de leitura

Todos devem manter a aparência e comportamento atuais.

## Próximos Passos

Agora você pode:
- Alterar cores de um gráfico específico sem afetar os outros
- Ajustar espessuras de linha individualmente
- Modificar tamanhos de pontos por tela
- Personalizar labels e estilos de forma independente
