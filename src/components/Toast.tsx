import React from 'react';
import styled from 'styled-components/native';
import theme from '../styles/theme';

type ToastProps = {
  visible: boolean;
  message?: string;
  type?: 'success' | 'error' | 'info';
};

export const Toast: React.FC<ToastProps> = ({ visible, message, type = 'info' }) => {
  if (!visible || !message) return null;

  return (
    <Container type={type} accessibilityLiveRegion="polite">
      <Text>{message}</Text>
    </Container>
  );
};

const Container = styled.View<{ type: 'success' | 'error' | 'info' }>`
  position: absolute;
  top: 40px;
  left: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  z-index: 1100;
  background-color: ${((props: { type: 'success' | 'error' | 'info' }) => props.type === 'success' ? '#34C759' : props.type === 'error' ? '#FF3B30' : '#1C1C1E')};
  box-shadow: 0px 6px 12px rgba(0,0,0,0.3);
`;

const Text = styled.Text`
  color: ${theme.colors.white};
  text-align: center;
  font-weight: 600;
`;

export default Toast;
