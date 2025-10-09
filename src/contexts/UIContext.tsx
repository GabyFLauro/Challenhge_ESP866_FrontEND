import React, { createContext, useCallback, useContext, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error' | 'info';

type UIContextType = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  loading: boolean;
  message?: string;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
  toastVisible: boolean;
  toastMessage?: string;
  toastType?: ToastType;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | undefined>(undefined);
  const [toastType, setToastType] = useState<ToastType | undefined>(undefined);

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg);
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
    setMessage(undefined);
  }, []);

  const showToast = useCallback((msg: string, type: ToastType = 'info', duration = 3000) => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
    if (duration > 0) {
      setTimeout(() => setToastVisible(false), duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
    setToastMessage(undefined);
    setToastType(undefined);
  }, []);

  return (
    <UIContext.Provider value={{ showLoading, hideLoading, loading, message, showToast, hideToast, toastVisible, toastMessage, toastType }}>
      {children}
      <LoadingOverlay visible={loading} message={message} />
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />
    </UIContext.Provider>
  );
};

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}

export default UIContext;
