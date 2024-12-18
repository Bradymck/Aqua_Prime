import { useEffect, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { useMoonstoneBalance } from './useMoonstoneBalance';

export const useCallSystem = (nftId: string) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const { balance: moonstoneBalance, deductMoonstone } = useMoonstoneBalance();

  const CALL_COST_PER_MINUTE = 1; // 1 moonstone per minute

  const startCall = async () => {
    if (moonstoneBalance < CALL_COST_PER_MINUTE) {
      throw new Error('Insufficient moonstone balance');
    }

    try {
      // Get token from backend
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        body: JSON.stringify({ nftId })
      });
      const { token } = await response.json();

      // Connect to room
      const newRoom = new Room();
      await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
      setRoom(newRoom);
      setIsCallActive(true);

      // Start moonstone deduction timer
      const deductInterval = setInterval(() => {
        deductMoonstone(CALL_COST_PER_MINUTE);
      }, 60000); // Every minute

      return () => {
        clearInterval(deductInterval);
        newRoom.disconnect();
      };
    } catch (error) {
      console.error('Call error:', error);
      throw error;
    }
  };

  const endCall = () => {
    room?.disconnect();
    setIsCallActive(false);
    setRoom(null);
  };

  return {
    isCallActive,
    startCall,
    endCall,
    room
  };
}; 