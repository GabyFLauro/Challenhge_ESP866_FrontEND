export type AlertLevel = 'normal' | 'alerta' | 'falha';

export interface AlertResult {
  level: AlertLevel;
  label: string;          // Normal | Alerta | Falha
  statusText: string;     // Funcionamento normal/baixo/com falha
  explanation?: string;   // Texto curto explicando a leitura
  reasons?: string[];     // Possíveis causas
  solutions?: string[];   // Ações recomendadas
}

// Classificação de pressão (Pa)
export function classifyPressure(value: number): AlertResult {
  // 4.5 a 3 -> normal | 2.9 a 1 -> alerta | 0.99 a 0 -> falha
  if (value >= 3 && value <= 4.5) {
    return {
      level: 'normal',
      label: 'Normal',
      statusText: 'Funcionamento normal',
      explanation: 'Pressão dentro da faixa recomendada para o atuador pneumático.',
      reasons: ['Sistema operando conforme especificações'],
      solutions: ['Manter cronograma de manutenção preventiva']
    };
  }
  if ((value >= 1 && value <= 2.9)) {
    return {
      level: 'alerta',
      label: 'Alerta',
      statusText: 'Funcionamento baixo',
      explanation: 'Pressão abaixo do ideal. Pode indicar início de degradação ou pequenas perdas.',
      reasons: [
        'Vazamentos internos no atuador ou válvulas',
        'Regulador de pressão mal ajustado',
        'Obstrução parcial na linha de ar',
        'Filtro de ar saturado ou entupido',
        'Desgaste das vedações internas'
      ],
      solutions: [
        'Inspecionar vedações e substituir se necessário',
        'Ajustar ou calibrar o regulador de pressão',
        'Verificar e limpar filtros de ar',
        'Testar linha de ar para vazamentos',
        'Verificar se válvulas direcionais estão funcionando corretamente'
      ]
    };
  }
  if (value >= 0 && value <= 0.99) {
    return {
      level: 'falha',
      label: 'Falha',
      statusText: 'Funcionamento com falha',
      explanation: 'Pressão muito baixa. O atuador pode não estar desenvolvendo força suficiente.',
      reasons: [
        'Falha completa do compressor ou sistema de ar',
        'Ruptura de mangueira ou conexão principal',
        'Válvula direcional travada ou danificada',
        'Regulador de pressão com defeito',
        'Vazamento massivo nas vedações'
      ],
      solutions: [
        'Verificar funcionamento do compressor',
        'Inspecionar todas as conexões e mangueiras',
        'Substituir válvulas direcionais defeituosas',
        'Trocar regulador de pressão',
        'Parar operação e realizar manutenção corretiva imediata'
      ]
    };
  }
  // Fora das faixas mapeadas: trate acima de 4.5 como normal com observação
  return {
    level: 'normal',
    label: 'Normal',
    statusText: 'Funcionamento normal',
    explanation: 'Pressão fora das faixas de referência informadas; considerar calibração de limites.'
  };
}

// Classificação de temperatura (°C)
export function classifyTemperature(value: number): AlertResult {
  // Normal: -20 a 80; Alerta: -39 a -20 OU 80 a 99; Falha: < -40 OU 100 a 150
  if (value >= -20 && value <= 80) {
    return {
      level: 'normal',
      label: 'Normal',
      statusText: 'Funcionamento normal',
      explanation: 'Temperatura dentro da faixa ideal de operação.',
      reasons: ['Condições ambientais adequadas para o atuador'],
      solutions: ['Manter monitoramento regular da temperatura ambiente']
    };
  }
  if ((value >= -39 && value < -20) || (value > 80 && value <= 99)) {
    const isLowTemp = value < -20;
    return {
      level: 'alerta',
      label: 'Alerta',
      statusText: 'Funcionamento em limite',
      explanation: 'Temperatura em zona de risco. Pode acelerar desgaste de vedações e lubrificantes.',
      reasons: isLowTemp ? [
        'Vedações ficam rígidas e menos flexíveis',
        'Aumento do atrito e desgaste interno',
        'Risco de congelamento da umidade no ar comprimido',
        'Possível bloqueio de solenoides por condensação'
      ] : [
        'Aceleração do desgaste das vedações NBR',
        'Amolecimento e inchaço das vedações',
        'Perda de viscosidade da lubrificação interna',
        'Evaporação acelerada de lubrificantes'
      ],
      solutions: isLowTemp ? [
        'Instalar aquecimento ambiente ou isolamento térmico',
        'Verificar e drenar umidade do sistema de ar',
        'Considerar vedações específicas para baixa temperatura',
        'Monitorar funcionamento de válvulas solenoides'
      ] : [
        'Instalar ventilação ou resfriamento do ambiente',
        'Verificar se há fontes de calor próximas ao atuador',
        'Considerar vedações resistentes a alta temperatura',
        'Reavaliar lubrificação para alta temperatura'
      ]
    };
  }
  if (value < -40 || (value >= 100 && value <= 150)) {
    const isLowTemp = value < -40;
    return {
      level: 'falha',
      label: 'Falha',
      statusText: 'Funcionamento com falha',
      explanation: 'Temperatura extrema. Risco de congelamento ou falha de vedações/lubrificação.',
      reasons: isLowTemp ? [
        'Congelamento total da válvula ou linha de ar',
        'Perda completa de função por bloqueio',
        'Vedações totalmente rígidas e rachadas'
      ] : [
        'Falha total das vedações por derretimento/deformação',
        'Vazamento massivo de ar por falha de vedação',
        'Danos em componentes plásticos e bobinas solenoides',
        'Perda total de lubrificação'
      ],
      solutions: isLowTemp ? [
        'Parar operação imediatamente',
        'Aquecer gradualmente o sistema antes de religar',
        'Instalar sistema de aquecimento permanente',
        'Substituir vedações por material adequado para baixa temperatura'
      ] : [
        'Parar operação imediatamente para evitar danos',
        'Resfriar o sistema e investigar fonte de calor',
        'Substituir todas as vedações e verificar componentes plásticos',
        'Instalar proteção térmica ou relocar o atuador'
      ]
    };
  }
  return {
    level: 'alerta',
    label: 'Alerta',
    statusText: 'Funcionamento em limite',
  };
}

// Classificação de vibração (mm/s)
export function classifyVibration(value: number): AlertResult {
  // Normal: 0 a 2.7; Alerta: 2.8 a 7.1; Falha: > 7.1
  if (value >= 0 && value <= 2.7) {
    return {
      level: 'normal',
      label: 'Normal',
      statusText: 'Funcionamento normal',
      explanation: 'Nível de vibração aceitável para operação contínua (ISO 10816 Zona A/B).',
      reasons: [
        'Atuador bem balanceado e alinhado',
        'Ausência de folgas excessivas',
        'Acoplamento correto com a carga'
      ],
      solutions: [
        'Manter cronograma de manutenção preventiva',
        'Continuar monitoramento regular'
      ]
    };
  }
  if (value >= 2.8 && value <= 7.1) {
    return {
      level: 'alerta',
      label: 'Alerta',
      statusText: 'Funcionamento baixo',
      explanation: 'Vibração elevada (ISO 10816 Zona C). Insatisfatório para operação contínua.',
      reasons: [
        'Folgas mecânicas (picos em 2x, 3x, 4x RPM)',
        'Desalinhamento entre atuador e carga',
        'Desgaste avançado de componentes internos',
        'Desbalanceamento do conjunto rotativo',
        'Início de deterioração de mancais ou buchas'
      ],
      solutions: [
        'Verificar e eliminar folgas nos parafusos de fixação',
        'Realinhar o conjunto atuador-carga com relógio comparador',
        'Balancear componentes rotativos',
        'Inspecionar e substituir buchas/mancais desgastados',
        'Programar manutenção corretiva em breve'
      ]
    };
  }
  if (value > 7.1) {
    return {
      level: 'falha',
      label: 'Falha',
      statusText: 'Funcionamento com falha',
      explanation: 'Vibração severa (ISO 10816 Zona D). Risco de falha catastrófica.',
      reasons: [
        'Danos estruturais significativos no atuador',
        'Folga extrema em componentes críticos',
        'Risco iminente de quebra de componentes',
        'Desalinhamento severo ou base rachada',
        'Falha avançada de mancais/acoplamentos'
      ],
      solutions: [
        'PARAR OPERAÇÃO IMEDIATAMENTE',
        'Realizar inspeção completa antes de religar',
        'Substituir componentes danificados',
        'Verificar integridade da base de montagem',
        'Considerar substituição do atuador se danos forem extensos'
      ]
    };
  }
  return {
    level: 'alerta',
    label: 'Alerta',
    statusText: 'Funcionamento em limite',
  };
}

export type Axis = 'x' | 'y' | 'z';

export function vibrationDiagnostics(ax: Axis, value: number): { reasons: string[]; solutions: string[] } {
  // Descrições por eixo
  if (ax === 'z') {
    return {
      reasons: [
        'Desalinhamento entre o atuador e a válvula/máquina (vibração axial alta).',
      ],
      solutions: [
        'Verificar alinhamento do eixo com relógio comparador ou laser.',
        'Reapertar acoplamentos e parafusos do suporte do atuador.',
      ],
    };
  }
  if (ax === 'x' || ax === 'y') {
    return {
      reasons: [
        'Desbalanceamento do atuador (componentes rotativos).',
        'Folgas/frouxidão na base de fixação ou parafusos da carcaça.',
      ],
      solutions: [
        'Balancear o conjunto rotativo e verificar acoplamentos.',
        'Inspecionar e reapertar a base, substituindo buchas/vedações se necessário.',
      ],
    };
  }
  // Todos os eixos (fallback)
  return {
    reasons: [
      'Ressonância estrutural (amplificação por frequências naturais).',
      'Falha na base de montagem (rachaduras ou soltura).',
    ],
    solutions: [
      'Instalar amortecedores/isoladores e reforçar a estrutura.',
      'Reparar ou substituir a base de montagem.',
    ],
  };
}

export function classifyMetric(keyName: string, value: number): AlertResult {
  switch (keyName) {
    case 'pressao02_hx710b':
      return classifyPressure(value);
    case 'temperatura_ds18b20':
      return classifyTemperature(value);
    case 'vibracao_vib_x':
    case 'vibracao_vib_y':
    case 'vibracao_vib_z':
      return classifyVibration(value);
    default:
      return { level: 'normal', label: 'Normal', statusText: 'Sem classificação específica' };
  }
}
