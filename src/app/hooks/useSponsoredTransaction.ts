import { useCallback } from 'react';
import { ethers } from 'ethers';
import { SponsorshipProvider } from '../lib/sponsorship/provider';

export function useSponsoredTransaction() {
  const sendTransaction = useCallback(async (
    to: string,
    data: string,
    value: string = '0'
  ) => {
    try {
      const sponsor = new SponsorshipProvider(
        process.env.NEXT_PUBLIC_RPC_URL!,
        process.env.NEXT_PUBLIC_SPONSOR_KEY!
      );

      const tx = await sponsor.sendTransaction({
        to,
        data,
        value
      });
      
      return await tx.wait();
    } catch (error) {
      console.error('Sponsored transaction failed:', error);
      throw error;
    }
  }, []);

  return { sendTransaction };
} 