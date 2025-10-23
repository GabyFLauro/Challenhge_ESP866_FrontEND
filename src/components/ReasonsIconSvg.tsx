import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

const ReasonsIconSvg: React.FC<Props> = ({ size = 24, color = '#d1d1d6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Raios da engrenagem */}
    <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    
    {/* Círculo central */}
    <Circle cx="12" cy="12" r="3" />
    
    {/* Círculo externo */}
    <Path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" />
  </Svg>
);

export default ReasonsIconSvg;
