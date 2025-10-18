// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║           CONFIGURAÇÃO CENTRALIZADA DE CORES E TEXTOS DO APP                 ║
// ║                                                                              ║
// ║  📍 LOCALIZAÇÃO: src/config/themeColors.ts                                  ║
// ║                                                                              ║
// ║  🎨 COMO USAR:                                                              ║
// ║  1. Encontre a seção da tela que deseja customizar abaixo                  ║
// ║  2. Altere o valor hexadecimal da cor (ex: '#FF0000' para vermelho)        ║
// ║  3. Salve o arquivo (Cmd+S ou Ctrl+S)                                      ║
// ║  4. IMPORTANTE: Mude o número abaixo (THEME_VERSION)                       ║
// ║  5. Recarregue o app pressionando 'r' no terminal                          ║
// ║                                                                              ║
// ║  ⚠️  SE AS CORES NÃO MUDAREM:                                               ║
// ║  1. Pare o servidor (Ctrl+C no terminal)                                    ║
// ║  2. Execute: npm start -- --reset-cache                                     ║
// ║  3. Pressione 'r' para reload                                               ║
// ║                                                                              ║
// ║  💡 DICA: Use formato hexadecimal (#RRGGBB) ou com transparência (#RRGGBBAA)║
// ║  💡 Exemplo: '#FF0000' = vermelho, '#FF000080' = vermelho semi-transparente ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ⚠️  IMPORTANTE: MUDE ESTE NÚMERO TODA VEZ QUE ALTERAR CORES!
// Exemplo: 1.0.1 → 1.0.2 → 1.0.3 (isso força o app a recarregar)
export const THEME_VERSION = '1.0.3';

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                    TELA DE DETALHES DO SENSOR                                ║
// ║                    (SensorDetailScreen)                                      ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ────────────────────────────────────────────────────────────────────────────────
// 🎨 CORES DE FUNDO - SENSOR DETAIL SCREEN
// ────────────────────────────────────────────────────────────────────────────────
export const SENSOR_DETAIL_COLORS = {
  // 🖼️  FUNDO DA TELA PRINCIPAL
  // Cor do fundo geral da tela (área ao redor dos boxes)
  appBackground: '#000000',
  
  // 📋 BOX DE INFORMAÇÕES DO SENSOR
  // Box que exibe: Localização, Descrição, Tipo, Unidade, Faixa de valores
  sensorInfoBackground: '#1C1C1E',
  
  // 📊 BOX "VALOR ATUAL"
  // Box que mostra o valor atual da leitura do sensor
  currentValueBackground: '#a3a3adee',
  
  // 📈 BOX DO GRÁFICO
  // Box que contém o gráfico de linha com histórico
  chartBackground: '#1C1C1E',
  
  // 📜 BOX DO HISTÓRICO
  // Box que lista as últimas leituras com timestamps
  historyBackground: '#1C1C1E',
  
  // ⚠️  BOX SEM DADOS
  // Box exibido quando não há dados disponíveis
  noDataBackground: '#1C1C1E',
};

// ────────────────────────────────────────────────────────────────────────────────
// ✍️  CORES DE TEXTO - SENSOR DETAIL SCREEN
// ────────────────────────────────────────────────────────────────────────────────
export const SENSOR_DETAIL_TEXT_COLORS = {
  // 📌 TÍTULO DO SENSOR
  // Texto grande no topo (ex: "Pressão 01 (XGZP701DB1R)")
  titleText: '#FFFFFF',
  
  // 🏷️  LABEL "STATUS:"
  // Texto do label "Status:" antes do ícone de status
  statusLabelText: '#FFFFFF',
  
  // 📋 LABELS DAS INFORMAÇÕES (Box de informações)
  // Textos à esquerda: "📍 Localização:", "📝 Descrição:", "🔧 Tipo:", etc
  infoLabelText: '#8E8E93',
  
  // 📋 VALORES DAS INFORMAÇÕES (Box de informações)
  // Textos à direita: "Sala A", "Sensor de pressão", etc
  infoValueText: '#8E8E93',
  
  // 📊 LABEL "VALOR ATUAL:" (Box de valor atual)
  // Texto do label "Valor Atual:" dentro do box
  currentValueLabelText: '#000000',
  // NOTA: O valor numérico (ex: "45.67") tem cor dinâmica baseada no status:
  //       Verde (#007AFF) = Normal, Amarelo (#FFC107) = Alerta, Vermelho (#FF3B30) = Crítico
  
  // 📈 TÍTULO "GRÁFICO DE LINHA" (Box do gráfico)
  // Texto acima do gráfico
  chartTitleText: '#FFFFFF',
  
  // 📜 TÍTULO "HISTÓRICO" (Box do histórico)
  // Texto no topo do box de histórico
  historyTitleText: '#FFFFFF',
  
  // 📜 ITENS DO HISTÓRICO (Box do histórico)
  // Textos das linhas do histórico: data/hora e valores
  historyItemText: '#FFFFFF',
  
  // ⚠️  TEXTO "SEM DADOS" (Box sem dados)
  // Texto principal quando não há dados: "Nenhuma leitura disponível"
  noDataText: '#8E8E93',
  
  // ⚠️  SUBTEXTO "SEM DADOS" (Box sem dados)
  // Texto secundário: "Use o botão 'Registrar Leitura' para adicionar dados"
  noDataSubtext: '#AEAEB2',
};

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                    TELA DE LISTA DE SENSORES                                 ║
// ║                    (SensorsScreen)                                          ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ────────────────────────────────────────────────────────────────────────────────
// 🎨 CORES DE FUNDO - SENSORS LIST SCREEN
// ────────────────────────────────────────────────────────────────────────────────
export const SENSORS_LIST_COLORS = {
  // 🖼️  FUNDO DA TELA PRINCIPAL
  // Cor do fundo geral da tela de lista de sensores
  appBackground: '#000000',
  
  // 📇 CARDS DOS SENSORES
  // Cor de fundo de cada card individual de sensor na lista
  sensorCardBackground: '#1C1C1E',
  
  // 🔍 BOX DE INVESTIGAÇÃO
  // Cor de fundo do box de resultados de investigação (se usado)
  investigationResultBackground: '#1C1C1E',
};

// ────────────────────────────────────────────────────────────────────────────────
// ✍️  CORES DE TEXTO - SENSORS LIST SCREEN
// ────────────────────────────────────────────────────────────────────────────────
export const SENSORS_LIST_TEXT_COLORS = {
  // 📌 TÍTULO "SENSORES DISPONÍVEIS"
  // Texto do título principal no topo da tela
  titleText: '#FFFFFF',
  
  // 🔌 STATUS DO BACKEND
  // Texto pequeno que mostra status da conexão com backend
  backendStatusText: '#8E8E93',
  
  // 📇 NOME DO SENSOR (dentro do card)
  // Texto grande com nome do sensor: "Pressão 01", "Temperatura", etc
  sensorNameText: '#FFFFFF',
  
  // 📍 LOCALIZAÇÃO DO SENSOR (dentro do card)
  // Texto com ícone de localização: "📍 Sala A", "📍 Linha de produção"
  sensorLocationText: '#FF9500',
  
  // 📝 DESCRIÇÃO DO SENSOR (dentro do card)
  // Texto em itálico com descrição: "Sensor de pressão hidráulica"
  sensorDescriptionText: '#AEAEB2',
  
  // 📊 VALOR ATUAL (dentro do card)
  // Texto verde mostrando valor: "Valor atual: 45.67 bar"
  currentValueText: '#34C759',
  
  // 🕐 ÚLTIMA ATUALIZAÇÃO (dentro do card)
  // Texto pequeno: "Última atualização: 10:30:45"
  lastUpdateText: '#8E8E93',
  
  // 🏷️  STATUS DO SENSOR (dentro do card)
  // Texto do status: "NORMAL", "ALERTA", "CRÍTICO"
  // Cor base, pode ser sobrescrita dinamicamente
  statusText: '#FFFFFF',
  
  // 🔍 BOTÃO DE INVESTIGAÇÃO
  // Texto do botão de investigar backend
  investigateButtonText: '#FFFFFF',
  
  // 🔍 RESULTADO DE INVESTIGAÇÃO
  // Texto dos resultados técnicos de investigação
  investigationResultText: '#FFFFFF',
};

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                         TELA DE MÉTRICAS                                     ║
// ║                         (MetricScreen)                                       ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ────────────────────────────────────────────────────────────────────────────────
// 🎨 CORES DE FUNDO - METRIC SCREEN
// ────────────────────────────────────────────────────────────────────────────────
export const METRIC_SCREEN_COLORS = {
  // 🖼️  FUNDO DA TELA PRINCIPAL
  // Cor do fundo geral da tela de métricas
  appBackground: '#0C0C0E',
  
  // 📊 CARDS DE MÉTRICAS
  // Cor de fundo dos cards que exibem cada métrica
  cardBackground: '#D1D1D6',
  
  // 🔘 BOTÕES DE AÇÃO
  // Cor de fundo dos botões de ação
  actionButtonBackground: '#2C2C2E',
};

// ────────────────────────────────────────────────────────────────────────────────
// ✍️  CORES DE TEXTO - METRIC SCREEN
// ────────────────────────────────────────────────────────────────────────────────
export const METRIC_SCREEN_TEXT_COLORS = {
  // 📌 TÍTULO DA MÉTRICA
  // Texto do título principal de cada métrica
  titleText: '#FFFFFF',
  
  // 📝 SUBTÍTULO DA MÉTRICA
  // Texto secundário/descrição da métrica
  subtitleText: '#8E8E93',
  
  // 🏷️  LABEL DO CARD
  // Texto do label dentro do card: "Temperatura", "Pressão", etc
  labelText: '#000000',
  
  // 📊 VALOR DA MÉTRICA
  // Texto grande com o valor numérico da métrica
  valueText: '#000000',
  
  // 🕐 TIMESTAMP
  // Texto com data/hora da última atualização
  timestampText: '#3C3C3E',
  
  // 🔘 TEXTO DOS BOTÕES DE AÇÃO
  // Texto dentro dos botões de ação
  actionButtonText: '#FFFFFF',
};

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                              NOTAS IMPORTANTES                               ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
//
// 📝 COMO APLICAR AS MUDANÇAS:
//    1. Salve este arquivo após fazer as alterações
//    2. Incremente THEME_VERSION (ex: '1.0.1' → '1.0.2') para forçar reload
//    3. Recarregue o app:
//       - Expo: Pressione 'r' no terminal
//       - Android: Pressione 'R' duas vezes ou abra menu (Cmd+M) > Reload
//       - iOS: Cmd+R ou Shake device > Reload
//
// 💡 FORMATOS DE COR SUPORTADOS:
//    - Hexadecimal: #RRGGBB (ex: #FF0000 = vermelho)
//    - Com transparência: #RRGGBBAA (ex: #FF000080 = vermelho 50% transparente)
//    - Formato curto: #RGB (ex: #F00 = vermelho)
//
// 🎨 FERRAMENTAS ÚTEIS:
//    - Color Picker: https://htmlcolorcodes.com/color-picker/
//    - Contrast Checker: https://webaim.org/resources/contrastchecker/
//    - Material Design Colors: https://materialui.co/colors
//
// ⚠️  CUIDADO COM CACHE:
//    Se as cores não mudarem após reload:
//    1. Force reload: Cmd+Shift+R (iOS) ou limpe cache
//    2. Pare o servidor (Ctrl+C) e execute: npm start -- --reset-cache
//    3. Reinicie o app completamente
//
// ═══════════════════════════════════════════════════════════════════════════════
