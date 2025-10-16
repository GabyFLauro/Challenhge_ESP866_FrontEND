# Guia de Customização de Cores e Textos

Este guia explica como customizar as cores de fundo e cores de texto das diferentes seções nas telas de sensores.

## 🎯 IMPORTANTE - Arquivo Centralizado

**Todas as cores agora estão em um único arquivo centralizado:**

📁 **`src/config/themeColors.ts`**

Este é o **ÚNICO LUGAR** onde você deve alterar as cores. As mudanças serão aplicadas automaticamente em todas as telas após reload do app.

## 🚀 Como Alterar as Cores (Passo a Passo)

1. Abra o arquivo: **`src/config/themeColors.ts`**
2. Encontre a seção da tela que deseja customizar:
   - `SENSOR_DETAIL_COLORS` e `SENSOR_DETAIL_TEXT_COLORS` - Tela de detalhes do sensor
   - `SENSORS_LIST_COLORS` e `SENSORS_LIST_TEXT_COLORS` - Tela de lista de sensores
   - `METRIC_SCREEN_COLORS` e `METRIC_SCREEN_TEXT_COLORS` - Tela de métricas
3. Altere os valores hexadecimais das cores
4. **Salve o arquivo** (Cmd+S ou Ctrl+S)
5. **Recarregue o app**:
   - **Android**: Pressione `R` duas vezes ou Cmd+M > Reload
   - **iOS**: Cmd+R no simulador ou shake device > Reload
   - **Expo**: Pressione `r` no terminal

## 📍 Localização dos Arquivos

### Arquivo de Configuração (EDITE AQUI)
- **`src/config/themeColors.ts`** - 🎨 **Arquivo centralizado de cores** (EDITE ESTE!)

### Arquivos de Estilos (Não edite, apenas importam as cores)
- `src/screens/SensorDetailScreen/styles.ts` - Importa cores do themeColors.ts
- `src/screens/SensorsScreen/styles.ts` - Importa cores do themeColors.ts
- `src/screens/MetricScreen/styles.ts` - Importa cores do themeColors.ts

## 🎨 Como Customizar as Cores

### 📝 Estrutura do Arquivo `themeColors.ts`

O arquivo está organizado em seções por tela. Cada tela tem dois objetos:
- Um para **cores de fundo** (sufixo `_COLORS`)
- Um para **cores de texto** (sufixo `_TEXT_COLORS`)

### 1. Tela de Detalhes do Sensor (SensorDetailScreen)

Abra o arquivo `src/config/themeColors.ts` e encontre:

#### 🖼️ Cores de Fundo
```typescript
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#000000',              // Fundo da tela
  sensorInfoBackground: '#1C1C1E',       // Box de informações
  currentValueBackground: '#1C1C1E',     // Box "Valor Atual"
  chartBackground: '#1C1C1E',            // Box do gráfico
  historyBackground: '#1C1C1E',          // Box de histórico
  noDataBackground: '#1C1C1E',           // Box quando não há dados
};
```

#### ✍️ Cores de Texto
```typescript
export const SENSOR_DETAIL_TEXT_COLORS = {
  titleText: '#FFFFFF',                  // Título do sensor
  statusLabelText: '#FFFFFF',            // Label "Status:"
  infoLabelText: '#8E8E93',             // Labels (Localização, Tipo, etc)
  infoValueText: '#FFFFFF',             // Valores das informações
  currentValueLabelText: '#FFFFFF',      // Label "Valor Atual:"
  chartTitleText: '#FFFFFF',             // Título do gráfico
  historyTitleText: '#FFFFFF',           // Título do histórico
  historyItemText: '#FFFFFF',            // Itens do histórico
  noDataText: '#8E8E93',                // Texto "Sem dados"
  noDataSubtext: '#AEAEB2',             // Subtexto explicativo
};
```

### 2. Tela de Lista de Sensores (SensorsScreen)

No mesmo arquivo `src/config/themeColors.ts`:

#### 🖼️ Cores de Fundo
```typescript
export const SENSORS_LIST_COLORS = {
  appBackground: '#000000',                      // Fundo da tela
  sensorCardBackground: '#1C1C1E',               // Cards de sensores
  investigationResultBackground: '#1C1C1E',      // Resultados de investigação
};
```

#### ✍️ Cores de Texto
```typescript
export const SENSORS_LIST_TEXT_COLORS = {
  titleText: '#FFFFFF',                  // Título principal
  backendStatusText: '#8E8E93',          // Status do backend
  sensorNameText: '#FFFFFF',             // Nome do sensor
  sensorLocationText: '#FF9500',         // Localização
  sensorDescriptionText: '#AEAEB2',      // Descrição
  currentValueText: '#34C759',           // Valor atual
  lastUpdateText: '#8E8E93',            // Última atualização
  statusText: '#FFFFFF',                 // Status
  investigateButtonText: '#FFFFFF',      // Botão de investigação
  investigationResultText: '#FFFFFF',    // Resultado da investigação
};
```

### 3. Tela de Métricas (MetricScreen)

No mesmo arquivo `src/config/themeColors.ts`:

#### 🖼️ Cores de Fundo
```typescript
export const METRIC_SCREEN_COLORS = {
  appBackground: '#0C0C0E',              // Fundo da tela
  cardBackground: '#1C1C1E',             // Cards de métricas
  actionButtonBackground: '#2C2C2E',     // Botões de ação
};
```

#### ✍️ Cores de Texto
```typescript
export const METRIC_SCREEN_TEXT_COLORS = {
  titleText: '#FFFFFF',                  // Título
  subtitleText: '#8E8E93',              // Subtítulo
  labelText: '#8E8E93',                 // Labels dos cards
  valueText: '#FFFFFF',                 // Valores
  timestampText: '#8E8E93',             // Timestamp
  actionButtonText: '#FFFFFF',           // Texto dos botões
};
```

## 💡 Exemplos de Customização

Copie e cole no arquivo `src/config/themeColors.ts`:

### Exemplo 1: Fundo preto com boxes em tons de azul escuro e texto azul claro

```typescript
// CORES DE FUNDO
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#000000',           // Preto puro
  sensorInfoBackground: '#0A1F44',    // Azul escuro
  currentValueBackground: '#0D2B5C',  // Azul médio escuro
  chartBackground: '#0A1F44',         // Azul escuro
  historyBackground: '#0D2B5C',       // Azul médio escuro
  noDataBackground: '#0A1F44',
};

// CORES DE TEXTO
export const SENSOR_DETAIL_TEXT_COLORS = {
  titleText: '#7EC8E3',               // Azul claro
  statusLabelText: '#7EC8E3',
  infoLabelText: '#5A9FB8',           // Azul médio
  infoValueText: '#FFFFFF',
  currentValueLabelText: '#7EC8E3',
  chartTitleText: '#7EC8E3',
  historyTitleText: '#7EC8E3',
  historyItemText: '#FFFFFF',
  noDataText: '#5A9FB8',
  noDataSubtext: '#7EC8E3',
};
```

### Exemplo 2: Tema cinza com variações e texto colorido

```typescript
// CORES DE FUNDO
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#000000',           // Preto
  sensorInfoBackground: '#1A1A1A',    // Cinza muito escuro
  currentValueBackground: '#2D2D2D',  // Cinza escuro
  chartBackground: '#1A1A1A',         // Cinza muito escuro
  historyBackground: '#2D2D2D',       // Cinza escuro
  noDataBackground: '#1A1A1A',
};

// CORES DE TEXTO
export const SENSOR_DETAIL_TEXT_COLORS = {
  titleText: '#FFD700',               // Dourado
  statusLabelText: '#FFFFFF',
  infoLabelText: '#A9A9A9',           // Cinza médio
  infoValueText: '#00FF00',           // Verde limão
  currentValueLabelText: '#FFFFFF',
  chartTitleText: '#87CEEB',          // Azul céu
  historyTitleText: '#FFA500',        // Laranja
  historyItemText: '#FFFFFF',
  noDataText: '#A9A9A9',
  noDataSubtext: '#808080',
};
```

### Exemplo 3: Tema Matrix (Verde e Preto)

```typescript
// CORES DE FUNDO
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#000000',           // Preto
  sensorInfoBackground: '#001100',    // Preto esverdeado
  currentValueBackground: '#002200',  // Verde muito escuro
  chartBackground: '#001100',
  historyBackground: '#002200',
  noDataBackground: '#001100',
};

// CORES DE TEXTO
export const SENSOR_DETAIL_TEXT_COLORS = {
  titleText: '#00FF00',               // Verde neon
  statusLabelText: '#00FF00',
  infoLabelText: '#00AA00',           // Verde médio
  infoValueText: '#00FF00',           // Verde neon
  currentValueLabelText: '#00FF00',
  chartTitleText: '#00FF00',
  historyTitleText: '#00FF00',
  historyItemText: '#00DD00',         // Verde brilhante
  noDataText: '#00AA00',
  noDataSubtext: '#008800',
};
```

## 🎯 Dicas

1. **Use códigos hexadecimais**: Formato `#RRGGBB` ou `#RGB`
2. **Mantenha contraste adequado**: 
   - Textos claros em fundos escuros (ex: `#FFFFFF` em `#000000`)
   - Textos escuros em fundos claros (ex: `#000000` em `#FFFFFF`)
3. **Teste em diferentes dispositivos**: Algumas cores podem aparecer diferentes em telas diferentes
4. **Use ferramentas de contraste**: Sites como [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) ajudam a garantir legibilidade
5. **Salve o arquivo**: Após fazer as alterações, **SEMPRE salve** o arquivo (Cmd+S / Ctrl+S)
6. **Recarregue o app**: Após salvar:
   - Expo: Pressione `r` no terminal
   - Android: Pressione `R` duas vezes ou abra o menu (Cmd+M / Shake) > Reload
   - iOS: Cmd+R ou Shake > Reload
7. **Mantenha consistência**: Use cores similares para elementos relacionados
8. **Evite cache**: Se as cores não mudarem, force reload pressionando Cmd+Shift+R (iOS) ou limpando o cache

## ⚡ Solução de Problemas

### As cores não mudam após reload?

1. **Verifique se salvou o arquivo**: Certifique-se que o arquivo `themeColors.ts` está salvo
2. **Force reload completo**:
   - Feche o app completamente
   - No terminal, pressione `Ctrl+C` para parar o servidor
   - Execute `npm start` novamente
   - Abra o app novamente
3. **Limpe o cache**:
   ```bash
   # Expo
   expo start -c
   
   # React Native CLI
   npm start -- --reset-cache
   ```
4. **Verifique erros**: Olhe o terminal para ver se há erros de sintaxe no arquivo

### Erro de importação?

Certifique-se que o caminho da importação está correto nos arquivos de estilos:
```typescript
import { SENSOR_DETAIL_COLORS, SENSOR_DETAIL_TEXT_COLORS } from '../../config/themeColors';
```

## 🔧 Restaurar Cores Padrão

Se quiser voltar às cores originais, abra `src/config/themeColors.ts` e use:

### SensorDetailScreen
```typescript
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#000000',
  sensorInfoBackground: '#1C1C1E',
  currentValueBackground: '#1C1C1E',
  chartBackground: '#1C1C1E',
  historyBackground: '#1C1C1E',
  noDataBackground: '#1C1C1E',
};

export const SENSOR_DETAIL_TEXT_COLORS = {
  titleText: '#FFFFFF',
  statusLabelText: '#FFFFFF',
  infoLabelText: '#8E8E93',
  infoValueText: '#FFFFFF',
  currentValueLabelText: '#FFFFFF',
  chartTitleText: '#FFFFFF',
  historyTitleText: '#FFFFFF',
  historyItemText: '#FFFFFF',
  noDataText: '#8E8E93',
  noDataSubtext: '#AEAEB2',
};
```

### SensorsScreen
```typescript
export const SENSORS_LIST_COLORS = {
    appBackground: '#000000',
    sensorCardBackground: '#1C1C1E',
    investigationResultBackground: '#1C1C1E',
};

export const SENSORS_LIST_TEXT_COLORS = {
    titleText: '#FFFFFF',
    backendStatusText: '#8E8E93',
    sensorNameText: '#FFFFFF',
    sensorLocationText: '#FF9500',
    sensorDescriptionText: '#AEAEB2',
    currentValueText: '#34C759',
    lastUpdateText: '#8E8E93',
    statusText: '#FFFFFF',
    investigateButtonText: '#FFFFFF',
    investigationResultText: '#FFFFFF',
};
```

### MetricScreen
```typescript
export const METRIC_SCREEN_COLORS = {
  appBackground: '#0C0C0E',
  cardBackground: '#1C1C1E',
  actionButtonBackground: '#2C2C2E',
};

export const METRIC_SCREEN_TEXT_COLORS = {
  titleText: '#FFFFFF',
  subtitleText: '#8E8E93',
  labelText: '#8E8E93',
  valueText: '#FFFFFF',
  timestampText: '#8E8E93',
  actionButtonText: '#FFFFFF',
};
```

## 📱 Visualização das Seções

Na tela **SensorDetailScreen**, as seções aparecem nesta ordem de cima para baixo:

1. Logo (sem fundo personalizável)
2. Título do sensor (usa `appBackground` e `titleText`)
3. **Informações do Sensor** → `sensorInfoBackground` + `infoLabelText`, `infoValueText`
4. Status do sensor (usa `appBackground` e `statusLabelText`)
5. **Valor Atual** → `currentValueBackground` + `currentValueLabelText`
6. **Gráfico por Tempo** → `chartBackground` + `chartTitleText`
7. **Histórico** → `historyBackground` + `historyTitleText`, `historyItemText`
8. Botões (cores fixas)

---

**Última atualização**: 16 de outubro de 2025
