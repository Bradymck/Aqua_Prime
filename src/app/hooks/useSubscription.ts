import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { ethers } from 'ethers';

export const useSubscription = (address: string) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [freeMintsRemaining, setFreeMintsRemaining] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const subscriptionContract = useContract(
    process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS!,
    ['function subscribe(uint256 duration)', 'function isSubscribed(address) view returns (bool)']
  );

  const subscribe = async (durationMonths: number) => {
    if (!subscriptionContract) return;
    setIsProcessing(true);
    try {
      const tx = await subscriptionContract.subscribe(durationMonths);
      await tx.wait();
      setIsSubscribed(true);
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const checkSubscription = async () => {
      if (!subscriptionContract || !address) return;
      try {
        const subscribed = await subscriptionContract.isSubscribed(address);
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, [address, subscriptionContract]);

  return {
    isSubscribed,
    freeMintsRemaining,
    subscribe,
    isProcessing
  };
}; 