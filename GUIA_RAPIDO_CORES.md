# 🎨 GUIA RÁPIDO - Como Mudar as Cores do App

## 📍 ONDE MUDAR AS CORES?

**UM ÚNICO ARQUIVO:**
```
📁 src/config/themeColors.ts
```

⚠️ **NUNCA edite os arquivos styles.ts das telas!** Eles apenas importam as cores.

---

## 🚀 PASSO A PASSO (4 passos simples)

### 1️⃣ Abra o arquivo
```
src/config/themeColors.ts
```

### 2️⃣ Encontre a seção que deseja mudar

#### 🖥️ Tela de Detalhes do Sensor
```typescript
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#000000',              // ← Mude aqui para mudar fundo da tela
  currentValueBackground: '#ffffff8f',   // ← Mude aqui para mudar box "Valor Atual"
  chartBackground: '#1C1C1E',            // ← Mude aqui para mudar box do gráfico
  // ... mais opções dentro do arquivo
}

export const SENSOR_DETAIL_TEXT_COLORS = {
  titleText: '#FFFFFF',                  // ← Mude aqui para mudar cor do título
  chartTitleText: '#FFFFFF',             // ← Mude aqui para mudar texto do gráfico
  // ... mais opções dentro do arquivo
}
```

#### 📋 Tela de Lista de Sensores
```typescript
export const SENSORS_LIST_COLORS = {
  appBackground: '#000000',              // ← Fundo da tela
  sensorCardBackground: '#1C1C1E',       // ← Fundo dos cards
}

export const SENSORS_LIST_TEXT_COLORS = {
  titleText: '#FFFFFF',                  // ← Cor do título
  sensorNameText: '#FFFFFF',             // ← Cor do nome do sensor
}
```

### 3️⃣ Mude o valor da cor
```typescript
// ANTES:
currentValueBackground: '#ffffff8f',

// DEPOIS (exemplo: vermelho semi-transparente):
currentValueBackground: '#FF000080',
```

### 4️⃣ Salve e recarregue o app

**Salvar:**
- Mac: `Cmd + S`
- Windows/Linux: `Ctrl + S`

**Recarregar o app:**
- **Expo**: Pressione `r` no terminal
- **Android**: Pressione `R` duas vezes OU abra o menu (Cmd+M / Shake) > Reload
- **iOS**: Cmd+R OU Shake device > Reload

---

## 🎨 FORMATOS DE COR

```typescript
'#FF0000'    // Vermelho puro
'#00FF00'    // Verde puro
'#0000FF'    // Azul puro
'#000000'    // Preto
'#FFFFFF'    // Branco
'#FF000080'  // Vermelho 50% transparente (últimos 2 dígitos = transparência)
'#00FF0040'  // Verde 25% transparente
```

💡 **Use um color picker:** https://htmlcolorcodes.com/color-picker/

---

## 📊 MAPA VISUAL - O QUE CADA COR CONTROLA

### Tela de Detalhes do Sensor (SensorDetailScreen)

```
┌─────────────────────────────────────────┐
│  🖼️ appBackground                       │
│  ┌───────────────────────────────────┐  │
│  │ 📌 titleText                      │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ 📋 sensorInfoBackground           │  │
│  │  🏷️ infoLabelText | infoValueText│  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ 📊 currentValueBackground         │  │
│  │  ✍️ currentValueLabelText         │  │
│  │  45.67 (cor dinâmica)             │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ 📈 chartBackground                │  │
│  │  ✍️ chartTitleText                │  │
│  │  [Gráfico aqui]                   │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ 📜 historyBackground              │  │
│  │  ✍️ historyTitleText              │  │
│  │  ✍️ historyItemText (itens)       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Tela de Lista de Sensores (SensorsScreen)

```
┌─────────────────────────────────────────┐
│  🖼️ appBackground                       │
│  📌 titleText                            │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ 📇 sensorCardBackground           │  │
│  │  ✍️ sensorNameText                │  │
│  │  ✍️ sensorLocationText            │  │
│  │  ✍️ currentValueText               │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ 📇 sensorCardBackground           │  │
│  │  (outro card)                     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### ❌ As cores não mudaram após reload

**Solução 1 - Force Reload:**
```bash
# Pare o servidor
Ctrl + C

# Limpe o cache e reinicie
npm start -- --reset-cache
```

**Solução 2 - Incremente a versão:**
```typescript
// No arquivo themeColors.ts, mude:
export const THEME_VERSION = '1.0.1';
// Para:
export const THEME_VERSION = '1.0.2';
```

**Solução 3 - Feche e reabra o app completamente**

### ❌ Erro "Cannot find module"

Verifique se o caminho da importação está correto:
```typescript
import { SENSOR_DETAIL_COLORS } from '../../config/themeColors';
```

---

## 💡 EXEMPLOS PRONTOS PARA USAR

### Tema Escuro Profundo
```typescript
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#000000',
  currentValueBackground: '#1A1A1A',
  chartBackground: '#0D0D0D',
  historyBackground: '#1A1A1A',
}
```

### Tema Azul Oceano
```typescript
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#001F3F',
  currentValueBackground: '#0A2540',
  chartBackground: '#0D2B4A',
  historyBackground: '#0A2540',
}
```

### Tema Matrix (Verde)
```typescript
export const SENSOR_DETAIL_COLORS = {
  appBackground: '#000000',
  currentValueBackground: '#001100',
  chartBackground: '#002200',
  historyBackground: '#001100',
}

export const SENSOR_DETAIL_TEXT_COLORS = {
  titleText: '#00FF00',
  chartTitleText: '#00FF00',
  historyTitleText: '#00FF00',
}
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para mais detalhes, veja:
```
📄 documentação/CUSTOMIZACAO_CORES.md
```

---

**Última atualização:** 16 de outubro de 2025
