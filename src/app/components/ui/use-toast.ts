import { createContext, useContext } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  return useContext(ToastContext);
};
