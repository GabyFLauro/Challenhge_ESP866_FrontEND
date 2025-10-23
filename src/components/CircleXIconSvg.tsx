import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = { 
  size?: number; 
  color?: string;
};

export const CircleXIconSvg: React.FC<Props> = ({ size = 24, color = '#d1d1d6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z"
      fill={color}
    />
  </Svg>
);

export default CircleXIconSvg;
