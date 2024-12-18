import { useState, useEffect } from 'react';

export function useBatteryDrain(isMicActive: boolean, isNFTPoweredDown: boolean) {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [sandDollarBalance, setSandDollarBalance] = useState(0);
  const [sandDollarRate, setSandDollarRate] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMicActive && !isNFTPoweredDown) {
      const totalSandDollarsToEarn = 2000;
      const drainRate = 1; // 1% per second
      const totalDrainTime = 100; // seconds
      const sandDollarIncreaseRate = totalSandDollarsToEarn / totalDrainTime;

      setSandDollarRate(sandDollarIncreaseRate);

      interval = setInterval(() => {
        setBatteryLevel((prev) => {
          const newLevel = Math.max(0, prev - drainRate);
          return newLevel;
        });

        setSandDollarBalance((prev) => prev + sandDollarIncreaseRate);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMicActive, isNFTPoweredDown]);

  return { batteryLevel, sandDollarBalance, sandDollarRate };
}