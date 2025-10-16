# 🎨 COMO MUDAR AS CORES DO APP

## ⚡ PROCESSO RÁPIDO (4 PASSOS)

### 1️⃣ Abra o arquivo de cores
```
src/config/themeColors.ts
```

### 2️⃣ Mude a cor desejada
Procure pelo componente (tudo está comentado):
```typescript
export const SENSOR_DETAIL_COLORS = {
  // 📊 BOX "VALOR ATUAL"
  currentValueBackground: '#ffffff8f',  // ← MUDE AQUI!
}
```

### 3️⃣ IMPORTANTE: Mude a versão
```typescript
// No topo do arquivo, mude este número:
export const THEME_VERSION = '1.0.2';  // Era 1.0.1, agora 1.0.2
```

### 4️⃣ Reinicie o servidor
```bash
# No terminal, pare o servidor
Ctrl + C

# Reinicie com cache limpo
npm run reset-cache

# Ou use:
npm start -- --clear
```

---

## 🚨 CORES NÃO MUDARAM?

### SOLUÇÃO GARANTIDA:

```bash
# 1. Pare tudo
Ctrl + C

# 2. Execute isto:
npm run reset-cache

# 3. Quando o app abrir, pressione 'r' no terminal
```

**Se ainda não funcionar:** Veja o arquivo `SOLUCAO_CORES_NAO_MUDAM.md`

---

## 📍 ONDE ESTÁ CADA COR?

**TUDO está em UM ÚNICO arquivo:**
```
src/config/themeColors.ts
```

**39 cores disponíveis:**
- ✅ Fundos de cada box
- ✅ Cor de cada texto
- ✅ Todas independentes

---

## 🎯 EXEMPLO PRÁTICO

**Quero mudar o fundo do box "Valor Atual" para azul:**

1. Abra: `src/config/themeColors.ts`
2. Encontre:
```typescript
// 📊 BOX "VALOR ATUAL"
currentValueBackground: '#ffffff8f',
```
3. Mude para:
```typescript
currentValueBackground: '#0000FF',  // Azul
```
4. Mude a versão:
```typescript
export const THEME_VERSION = '1.0.3';  // Incrementou
```
5. Terminal:
```bash
Ctrl + C
npm run reset-cache
```

**Pronto!** ✅

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Guia Rápido:** `GUIA_RAPIDO_CORES.md`
- **Solução de Problemas:** `SOLUCAO_CORES_NAO_MUDAM.md`
- **Documentação Completa:** `SISTEMA_CORES_COMPLETO.md`

---

## 🆘 PROBLEMAS?

Se as cores não mudarem mesmo após seguir os passos:

1. **Leia:** `SOLUCAO_CORES_NAO_MUDAM.md`
2. **Tente:** Fechar o app completamente e reabrir
3. **Último recurso:** Desinstalar e reinstalar o app

---

## ✅ CHECKLIST

Antes de reiniciar, confirme:

- [ ] Mudei a cor em `src/config/themeColors.ts`
- [ ] Incrementei o `THEME_VERSION`
- [ ] Salvei o arquivo (`Cmd+S` / `Ctrl+S`)
- [ ] Executei `npm run reset-cache`
- [ ] Pressionei `r` no terminal

---

**Versão:** 1.0  
**Data:** 16 de outubro de 2025
