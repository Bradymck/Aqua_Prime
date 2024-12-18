import { useBalances } from '../hooks/useBalances';
import React from 'react';

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
export function BalanceDisplay() {
  const { balances, loading, error } = useBalances();

  if (loading) return <div>Loading balances...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <img src="/moonstone-icon.png" alt="Moonstone" className="w-6 h-6" />
        <span>{balances.moonstone} MOON</span>
      </div>
      <div className="flex items-center gap-2">
        <img src="/sand-dollar-icon.png" alt="Sand Dollars" className="w-6 h-6" />
        <span>{balances.sandDollars} SD</span>
      </div>
      {balances.tokens?.map(token => (
        <div key={token.asset} className="flex items-center gap-2">
          <span>{token.value} {token.type}</span>
        </div>
      ))}
    </div>
  );
} 