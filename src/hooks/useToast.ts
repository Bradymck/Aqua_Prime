import { toast, ToastProps } from '@/components/ui/toast';

export const useToast = () => {
  const showToast = (props: ToastProps) => {
    toast(props);
  };

  return {
    toast: showToast,
    success: (message: string, duration?: number) => 
      showToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => 
      showToast({ message, type: 'error', duration }),
    warning: (message: string, duration?: number) => 
      showToast({ message, type: 'warning', duration }),
    info: (message: string, duration?: number) => 
      showToast({ message, type: 'info', duration }),
  };
}; 