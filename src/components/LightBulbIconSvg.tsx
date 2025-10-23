import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type Props = { 
  size?: number; 
  color?: string;
};

export const LightBulbIconSvg: React.FC<Props> = ({ size = 24, color = '#d1d1d6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Raios de luz ao redor */}
    <Path d="M12 1V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M5.5 3.5L6.5 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M18.5 3.5L17.5 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M1 10H3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M21 10H23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M3.5 16.5L4.5 15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M20.5 16.5L19.5 15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Corpo da lâmpada */}
    <Path
      d="M12 5C8.68629 5 6 7.68629 6 11C6 12.8638 6.79435 14.5438 8.05025 15.7C8.63525 16.2475 9 17.0725 9 17.9375V18H15V17.9375C15 17.0725 15.3647 16.2475 15.9497 15.7C17.2057 14.5438 18 12.8638 18 11C18 7.68629 15.3137 5 12 5Z"
      fill={color}
    />
    
    {/* Base da lâmpada */}
    <Path d="M9 19H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M10 21H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M11 23H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Engrenagem dentro da lâmpada */}
    <Path
      d="M12 8.5L12.5 9.5L13.5 9.7L12.75 10.45L12.9 11.5L12 11L11.1 11.5L11.25 10.45L10.5 9.7L11.5 9.5L12 8.5Z"
      fill="white"
      opacity="0.9"
    />
    <Circle cx="12" cy="10.5" r="1.5" fill="white" opacity="0.7" />
  </Svg>
);

export default LightBulbIconSvg;
