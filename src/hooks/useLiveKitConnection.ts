import { useEffect, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';

export function useLiveKitConnection() {
  const [room, setRoom] = useState<Room | null>(null);
  
  useEffect(() => {
    // LiveKit connection logic here
    return () => {
      room?.disconnect();
    };
  }, []);

  return { room };
}
