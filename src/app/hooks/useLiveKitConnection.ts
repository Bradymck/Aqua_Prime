import { useState, useCallback, useRef } from 'react';
import { Room } from 'livekit-client';

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000; // 5 seconds

export function useLiveKitConnection(address: string | undefined) {
  const [token, setToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<Room | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const initializeAudioContext = useCallback(() => {
    if (room) {
      room.startAudio().catch(console.error);
    }
  }, [room]);

  const connect = useCallback(async () => {
    if (!address) return;
    setIsConnecting(true);
    setError(null);
    try {
      console.log(`Attempting to connect with address: ${address}`);
      console.log('LiveKit URL:', process.env.NEXT_PUBLIC_LIVEKIT_URL);
      const response = await fetch(`/api/get-livekit-token?room=aquaprime&username=${encodeURIComponent(address)}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`Failed to fetch token: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Received token:', data.token);
      console.log('Token payload:', JSON.parse(atob(data.token.split('.')[1])));
      setToken(data.token);

      const newRoom = new Room();
      if (!process.env.NEXT_PUBLIC_LIVEKIT_URL) {
        throw new Error('LiveKit URL is not configured');
      }
      console.log('Connecting to room with URL:', process.env.NEXT_PUBLIC_LIVEKIT_URL);
      await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, data.token, {
        autoSubscribe: true,
      });
      console.log('Connected to room:', newRoom.name);
      setRoom(newRoom);
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    } catch (err) {
      console.error("Error connecting to room:", err);
      if (err instanceof Error) {
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        if (err.message.includes('invalid token')) {
          console.error("Token validation failed. Check API key and secret configuration.");
        }
      }
      setError(`Failed to connect: ${err instanceof Error ? err.message : String(err)}`);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [address]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting...');
    if (room) {
      room.disconnect();
    }
    setToken('');
    setIsConnected(false);
    setRoom(null);
  }, [room]);

  const reconnect = useCallback(async () => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      setError('Max reconnection attempts reached. Please try again later.');
      return;
    }
    reconnectAttemptsRef.current += 1;
    console.log(`Reconnection attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`);
    if (isConnected) {
      disconnect();
    }
    await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY));
    await connect();
  }, [connect, disconnect, isConnected]);

  return { token, isConnecting, error, isConnected, connect, disconnect, reconnect, initializeAudioContext };
}
