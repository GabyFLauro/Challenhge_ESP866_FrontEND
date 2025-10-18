import React from 'react';
import Svg, { Path, Polygon, Rect, Circle } from 'react-native-svg';

type Props = { size?: number };

export const AlertRedIcon: React.FC<Props> = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    {/* Triângulo de fundo vermelho */}
    <Polygon points="32,4 2,58 62,58" fill="#ff0000" stroke="#ff0000" strokeWidth={2} />
    {/* Exclamação central preta */}
    <Rect x={29} y={18} width={6} height={22} fill="#000000" rx={2} ry={2} />
    <Circle cx={32} cy={46} r={3} fill="#000000" />
  </Svg>
);

export default AlertRedIcon;
