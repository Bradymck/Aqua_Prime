import { useState, useEffect } from 'react';

export const useWalletConnection = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkConnection = async () => {
      try {
        if (mounted) {
          // Default to false on each check
          setIsConnected(false);

          // If there's an Ethereum provider, check for any accounts
          if (typeof window !== 'undefined' && (window as any).ethereum) {
            const accounts = await (window as any).ethereum.request({
              method: 'eth_accounts',
            });
            if (accounts && accounts.length > 0) {
              setIsConnected(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    checkConnection();

    return () => {
      mounted = false;
    };
  }, []);

  return { isConnected };
};