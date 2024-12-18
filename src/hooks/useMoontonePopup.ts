import { useCallback } from 'react';
import { toast } from "@/app/hooks/use-toast";

export const useMoonstonePopup = () => {
  const showToast = useCallback((message: string) => {
    toast({
      title: "Notification",
      description: message,
    });
  }, []);

  // ... rest of the hook implementation

  return { showToast };
};
