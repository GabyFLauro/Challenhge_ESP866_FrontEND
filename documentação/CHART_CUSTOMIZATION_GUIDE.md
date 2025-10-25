# Guia Rápido: Como Modificar um Gráfico Específico

## 🎯 Localização das Configurações

Todas as configurações estão em: **`src/utils/chartConfig.ts`**

```
src/utils/chartConfig.ts
├── getSharedLineChartConfig()      ← Configuração base (não usada diretamente)
├── getChartPanelConfig()           ← Para ChartPanel (Dashboard Realtime)
├── getMetricScreenChartConfig()    ← Para MetricScreen (Detalhes de Métrica)
└── getSensorDetailChartConfig()    ← Para SensorDetailScreen (Detalhes do Sensor)
```

---

## 📊 Mapeamento: Tela → Função de Configuração

| Tela/Componente | Arquivo | Função de Configuração |
|-----------------|---------|------------------------|
| **ChartPanel** (Painéis no Dashboard) | `src/components/ChartPanel.tsx` | `getChartPanelConfig()` |
| **MetricScreen** (Gráfico de métrica individual) | `src/screens/MetricScreen/index.tsx` | `getMetricScreenChartConfig()` |
| **SensorDetailScreen** (Detalhes do sensor) | `src/screens/SensorDetailScreen/index.tsx` | `getSensorDetailChartConfig(fontSize)` |

---

## 🎨 Propriedades Customizáveis

### Cores

```typescript
{
  // Cor da linha e preenchimento
  fillShadowGradientFrom: '#66fcf1',       // Cor inicial do gradiente
  fillShadowGradientTo: '#66fcf1',         // Cor final do gradiente
  fillShadowGradientFromOpacity: 1,        // Opacidade inicial (0-1)
  fillShadowGradientToOpacity: 0.2,        // Opacidade final (0-1)
  
  // Cor da linha principal
  color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
  
  // Cor das labels/texto
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  
  // Cor de fundo
  backgroundColor: '#1C1C1E',
  backgroundGradientFrom: '#1C1C1E',
  backgroundGradientTo: '#1C1C1E',
}
```

### Linha e Pontos

```typescript
{
  // Espessura da linha
  strokeWidth: 3,
  
  // Casas decimais nos valores
  decimalPlaces: 1,
  
  // Configuração dos pontos
  propsForDots: {
    r: '5',              // Raio do ponto
    strokeWidth: '2',    // Espessura da borda
    stroke: '#66fcf1',   // Cor da borda
    fill: '#66fcf1',     // Cor de preenchimento
  },
}
```

### Linhas de Grade

```typescript
{
  // Linhas de fundo
  propsForBackgroundLines: {
    strokeWidth: 1,
    strokeDasharray: '',  // '' = linha sólida, '5,5' = linha tracejada
  },
}
```

---

## 📝 Exemplos Práticos

### Exemplo 1: Mudar Cor do ChartPanel para Azul

**Arquivo**: `src/utils/chartConfig.ts`

**Antes**:
```typescript
export const getChartPanelConfig = (): any => {
  return {
    fillShadowGradientFrom: '#66fcf1',
    fillShadowGradientTo: '#66fcf1',
    color: (opacity = 1) => `rgba(102, 252, 241, ${opacity})`,
    // ...
  };
};
```

**Depois**:
```typescript
export const getChartPanelConfig = (): any => {
  return {
    fillShadowGradientFrom: '#007AFF',  // Azul
    fillShadowGradientTo: '#007AFF',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    // ...
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#007AFF',
      fill: '#007AFF',
    },
  };
};
```

### Exemplo 2: Linha Mais Grossa na MetricScreen

**Arquivo**: `src/utils/chartConfig.ts`

**Antes**:
```typescript
export const getMetricScreenChartConfig = (): any => {
  return {
    strokeWidth: 3,
    // ...
  };
};
```

**Depois**:
```typescript
export const getMetricScreenChartConfig = (): any => {
  return {
    strokeWidth: 6,  // Linha mais grossa
    // ...
  };
};
```

### Exemplo 3: Pontos Maiores no SensorDetailScreen

**Arquivo**: `src/utils/chartConfig.ts`

**Antes**:
```typescript
export const getSensorDetailChartConfig = (fontSize: number): any => {
  return {
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#66fcf1',
      fill: '#66fcf1',
    },
    // ...
  };
};
```

**Depois**:
```typescript
export const getSensorDetailChartConfig = (fontSize: number): any => {
  return {
    propsForDots: {
      r: '10',         // Pontos maiores (dobro do tamanho)
      strokeWidth: '3',
      stroke: '#66fcf1',
      fill: '#66fcf1',
    },
    // ...
  };
};
```

### Exemplo 4: Gradiente de Verde para Amarelo

**Arquivo**: `src/utils/chartConfig.ts`

```typescript
export const getChartPanelConfig = (): any => {
  return {
    fillShadowGradientFrom: '#34C759',      // Verde
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: '#FFD60A',        // Amarelo
    fillShadowGradientToOpacity: 0.3,
    color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
    // ...
  };
};
```

---

## 🎨 Paleta de Cores Sugeridas

### Cores Atuais do App
- **Cyan Principal**: `#66fcf1` - RGB(102, 252, 241)
- **Background Dark**: `#1C1C1E` - RGB(28, 28, 30)
- **Texto White**: `#FFFFFF` - RGB(255, 255, 255)

### Cores iOS System
- **Azul**: `#007AFF` - RGB(0, 122, 255)
- **Verde**: `#34C759` - RGB(52, 199, 89)
- **Amarelo**: `#FFD60A` - RGB(255, 214, 10)
- **Laranja**: `#FF9F0A` - RGB(255, 159, 10)
- **Vermelho**: `#FF3B30` - RGB(255, 59, 48)
- **Rosa**: `#FF375F` - RGB(255, 55, 95)
- **Roxo**: `#BF5AF2` - RGB(191, 90, 242)

---

## ⚠️ Importante

1. **Sempre edite apenas uma função por vez** para garantir que as mudanças sejam isoladas
2. **Mantenha a estrutura do objeto** - não remova propriedades, apenas modifique valores
3. **Teste após cada mudança** para verificar o resultado visual
4. **Use valores RGB consistentes** - se mudar `fillShadowGradientFrom`, mude também `color()` e `propsForDots.stroke`

---

## 🔄 Fluxo de Trabalho Recomendado

1. Identifique qual tela você quer modificar
2. Abra `src/utils/chartConfig.ts`
3. Encontre a função de configuração correspondente
4. Modifique as propriedades desejadas
5. Salve o arquivo
6. Teste a tela no app
7. Ajuste conforme necessário

---

## ✅ Checklist de Mudança de Cor

Quando mudar a cor de um gráfico, atualize:
- [ ] `fillShadowGradientFrom`
- [ ] `fillShadowGradientTo`
- [ ] `color: (opacity) => ...`
- [ ] `propsForDots.stroke`
- [ ] `propsForDots.fill`

Isso garante que linha, pontos e gradiente fiquem consistentes!
