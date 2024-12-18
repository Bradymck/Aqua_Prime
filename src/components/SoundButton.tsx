import React, { useCallback, useEffect, useRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

export function SoundButton({ onClick, volume = 0.1, ...props }: ButtonProps & { volume?: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/audio/click.wav');
    audioRef.current.volume = Math.max(0, Math.min(1, volume));
  }, [volume]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    audioRef.current?.play().catch(error => console.error('Error playing sound:', error));
    onClick?.(event);
  }, [onClick]);

  return <Button {...props} onClick={handleClick} />;
}