# Correção dos Gráficos na Tela de Detalhes do Sensor

## Problema Identificado

Os gráficos na **SensorDetailScreen** não estavam sendo preenchidos para os seguintes sensores:
- ❌ `t1` (temperatura_ds18b20)
- ❌ `vx` (vibracao_vib_x)
- ❌ `vy` (vibracao_vib_y)
- ❌ `vz` (vibracao_vib_z)
- ❌ `vel` (velocidade_m_s)
- ❌ `l1` (chave_fim_de_curso)

Apenas o sensor `p2` (pressao02_hx710b) funcionava corretamente.

## Causa Raiz

O código estava tentando extrair valores dos readings usando uma lista hardcoded de propriedades:

```typescript
// CÓDIGO ANTIGO (PROBLEMÁTICO)
data: realtimeBuffer.map(d => 
  Number(
    d.value ?? 
    d.pressao02_hx710b ?? 
    d.temperatura_ds18b20 ?? 
    d.vibracao_vib_x ?? 
    d.vibracao_vib_y ?? 
    d.vibracao_vib_z ?? 
    0
  )
)
```

### Problemas com essa abordagem:

1. **Mapeamento incompleto**: Não incluía todas as variações possíveis de nomes de propriedades
2. **Falta de flexibilidade**: Não considerava diferentes formatos de dados vindos do WebSocket
3. **Não usava o sensorId**: Não aproveitava o contexto do sensor atual para buscar a propriedade correta
4. **Propriedades ausentes**: Faltavam mapeamentos para `velocidade_m_s` e outras variações

## Solução Implementada

Criada uma função **`getValueFromReading(reading, sensorId)`** que:

1. ✅ **Usa o sensorId como contexto** para determinar quais propriedades buscar
2. ✅ **Mapeia múltiplas variações** de nomes de propriedades por sensor
3. ✅ **Tenta lowercase** como fallback para maior compatibilidade
4. ✅ **Retorna 0 como padrão** se nenhuma propriedade for encontrada

### Código da Solução

```typescript
const getValueFromReading = (reading: any, sensorId: string): number => {
  // Primeiro tenta a propriedade 'value' (caso comum)
  if (reading.value !== undefined && reading.value !== null) {
    return Number(reading.value);
  }
  
  // Mapear sensorId para a propriedade correta no objeto
  const sensorKeyMap: Record<string, string[]> = {
    'p1': ['pressao01_xgzp701db1r', 'pressao', 'value'],
    'p2': ['pressao02_hx710b', 'pressao', 'value'],
    't1': ['temperatura_ds18b20', 'temperatura', 'temp', 'value'],
    'vx': ['vibracao_vib_x', 'vibracaoX', 'vibracao_x', 'vib_x', 'value'],
    'vy': ['vibracao_vib_y', 'vibracaoY', 'vibracao_y', 'vib_y', 'value'],
    'vz': ['vibracao_vib_z', 'vibracaoZ', 'vibracao_z', 'vib_z', 'value'],
    'vel': ['velocidade_m_s', 'velocidade', 'value'],
    'l1': ['chave_fim_de_curso', 'ativo', 'limit_switch', 'value'],
  };

  const possibleKeys = sensorKeyMap[sensorId] || ['value'];
  
  for (const key of possibleKeys) {
    if (reading[key] !== undefined && reading[key] !== null) {
      return Number(reading[key]);
    }
    // Tentar também em lowercase
    const lowerKey = key.toLowerCase();
    if (reading[lowerKey] !== undefined && reading[lowerKey] !== null) {
      return Number(reading[lowerKey]);
    }
  }
  
  return 0;
};
```

### Aplicação no Gráfico

```typescript
// CÓDIGO NOVO (CORRIGIDO)
<LineChart
  data={{ 
    labels: realtimeBuffer.map((_, i) => `${i+1}`), 
    datasets: [{ 
      data: realtimeBuffer.map(d => getValueFromReading(d, sensorId))
    }] 
  }}
  // ... resto das props
/>
```

### Aplicação no Valor Atual

```typescript
// ANTES
{realtimeLast ? 
  (Number(realtimeLast.value ?? realtimeLast.pressao02_hx710b ?? realtimeLast.temperatura_ds18b20).toFixed(2)) 
  : (readings[0].value.toFixed(2))}

// DEPOIS
{realtimeLast ? 
  getValueFromReading(realtimeLast, sensorId).toFixed(2) 
  : (readings[0]?.value?.toFixed(2) || '—')}
```

## Mapeamento de Propriedades por Sensor

| sensorId | Propriedades Tentadas (em ordem) |
|----------|----------------------------------|
| `p1` | pressao01_xgzp701db1r, pressao, value |
| `p2` | pressao02_hx710b, pressao, value |
| `t1` | temperatura_ds18b20, temperatura, temp, value |
| `vx` | vibracao_vib_x, vibracaoX, vibracao_x, vib_x, value |
| `vy` | vibracao_vib_y, vibracaoY, vibracao_y, vib_y, value |
| `vz` | vibracao_vib_z, vibracaoZ, vibracao_z, vib_z, value |
| `vel` | velocidade_m_s, velocidade, value |
| `l1` | chave_fim_de_curso, ativo, limit_switch, value |

## Benefícios da Solução

1. ✅ **Robustez**: Funciona com diferentes formatos de dados vindos do backend/WebSocket
2. ✅ **Manutenibilidade**: Fácil adicionar novos sensores ou variações de nomes
3. ✅ **Compatibilidade**: Tenta múltiplas variações incluindo lowercase
4. ✅ **Clareza**: Código mais legível e autodocumentado
5. ✅ **Reutilização**: Mesma função usada tanto no gráfico quanto no valor atual

## Arquivos Modificados

### `src/screens/SensorDetailScreen/index.tsx`

1. ✅ Adicionada função `getValueFromReading(reading, sensorId)`
2. ✅ Atualizado mapeamento de dados do gráfico realtime
3. ✅ Atualizado display do valor atual

## Testes Recomendados

Após esta correção, teste os seguintes sensores:

- [ ] `t1` - Temperatura DS18B20
- [ ] `vx` - Vibração Eixo X
- [ ] `vy` - Vibração Eixo Y
- [ ] `vz` - Vibração Eixo Z
- [ ] `vel` - Velocidade
- [ ] `l1` - Chave Fim de Curso
- [ ] `p1` - Pressão XGZP701DB1R
- [ ] `p2` - Pressão HX710B (já funcionava, garantir que continua)

Verificar:
1. Gráfico de linha é preenchido com dados em tempo real
2. Valor atual é exibido corretamente
3. Não há erros no console

## Formato de Dados Esperado

A função é compatível com múltiplos formatos de readings:

### Formato 1: Propriedade específica
```json
{
  "temperatura_ds18b20": 25.5,
  "data_hora": "2025-10-25T10:30:00Z"
}
```

### Formato 2: Propriedade genérica
```json
{
  "value": 25.5,
  "sensorId": "t1",
  "timestamp": "2025-10-25T10:30:00Z"
}
```

### Formato 3: Propriedade simplificada
```json
{
  "temperatura": 25.5,
  "dataHora": "2025-10-25T10:30:00Z"
}
```

Todos os formatos acima funcionarão corretamente! 🎉
