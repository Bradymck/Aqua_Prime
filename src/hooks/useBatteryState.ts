// hooks/useBatteryState.ts
import { useState, useCallback } from 'react';

export const useBatteryState = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isNFTPoweredDown, setIsNFTPoweredDown] = useState(false);

  const handleBatteryDrain = useCallback((amount: number) => {
    setBatteryLevel(prev => {
      const newLevel = Math.max(0, prev - amount);
      if (newLevel === 0 && !isNFTPoweredDown) {
        setIsNFTPoweredDown(true);
      }
      return newLevel;
    });
  }, [isNFTPoweredDown]);

  return {
    batteryLevel,
    isNFTPoweredDown,
    handleBatteryDrain,
    setBatteryLevel,
    setIsNFTPoweredDown
  };
};