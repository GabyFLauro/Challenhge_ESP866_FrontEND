import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import theme from '../styles/theme';

type Props = {
  visible: boolean;
  message?: string;
};

export const LoadingOverlay: React.FC<Props> = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <Overlay testID="loading-overlay">
      <Content>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {message ? <Message>{message}</Message> : null}
      </Content>
    </Overlay>
  );
};

const Overlay = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.55);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.View`
  padding: 20px;
  background-color: rgba(28,28,30,0.85);
  border-radius: 10px;
  align-items: center;
`;

const Message = styled.Text`
  color: ${theme.colors.white};
  margin-top: 10px;
`;

export default LoadingOverlay;
