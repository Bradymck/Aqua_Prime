import { getStyleService } from '@/services/styleService';
import type { StyleOptions } from '@/services/styleService';
import { useMemo } from 'react';

export function useStyleService(options?: StyleOptions) {
  const styleService = useMemo(() => getStyleService(), []);
  const styles = useMemo(
    () => styleService.generateStyle(options), 
    [styleService, options]
  );
  
  return { 
    styles, 
    styleService 
  };
} 