import { useEffect, useRef } from 'react'
import { stopFireSound } from '../app/utils/audio'

export const BurnEffect = ({ isActive, flameCount, size = 40, isMoonstone = false }: { isActive: boolean; flameCount: number; size?: number; isMoonstone?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFire = () => {
      // ... (existing drawFire code)
    };

    const animate = () => {
      drawFire();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isActive) {
      animate();
    } else {
      stopFireSound();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopFireSound();
    };
  }, [isActive, flameCount, size, isMoonstone]);

  // ... (rest of the component)
};