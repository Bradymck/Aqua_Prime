import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { BalanceService } from '../services/balanceService';

interface Token {
  asset: string;
  value: number;
  type: string;
}

interface Balances {
  moonstone: string;
  sandDollars: number;
  tokens?: Token[];
}

export function useBalances() {
  const { user, ready } = usePrivy();
  const [balances, setBalances] = useState<Balances>({
    moonstone: '0',
    sandDollars: 0,
    tokens: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalances() {
      if (!ready || !user?.wallet?.address) return;

      try {
        setLoading(true);
        const balanceService = BalanceService.getInstance();
        const userBalances = await balanceService.getBalances(user.wallet.address);
        setBalances(userBalances);
        setError(null);
      } catch (err) {
        console.error('Error fetching balances:', err);
        setError('Failed to fetch balances');
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
  }, [user?.wallet?.address, ready]);

  return { balances, loading, error };
} 