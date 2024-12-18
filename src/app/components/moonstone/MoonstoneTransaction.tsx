import React, { useState } from 'react';
import { useConfig } from '../ConfigProvider';
import { useSponsoredTransaction } from '../../hooks/useSponsoredTransaction';
import { ethers } from 'ethers';

interface MoonstoneTransactionProps {
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  onComplete?: (success: boolean) => void;
}

export const MoonstoneTransaction: React.FC<MoonstoneTransactionProps> = ({
  amount,
  type,
  reason,
  onComplete
}) => {
  const { gameState, updateGameState } = useConfig();
  const { sendTransaction } = useSponsoredTransaction();
  const [isProcessing, setIsProcessing] = useState(false);
  const [glitchText, setGlitchText] = useState<string>('');

  const processTransaction = async () => {
    setIsProcessing(true);
    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_MOONSTONE_CONTRACT!,
        ['function transfer(address,uint256)'],
        new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!)
      );

      const transaction = await contract.transfer.populateTransaction(
        type === 'earn' ? gameState.address : process.env.NEXT_PUBLIC_TREASURY_ADDRESS!,
        ethers.parseEther(amount.toString())
      );

      const receipt = await sendTransaction(
        transaction.to,
        transaction.data,
        transaction.value?.toString()
      );

      if (!receipt) {
        throw new Error('Transaction failed - no receipt');
      }

      // Update local state after transaction success
      const newBalance = type === 'earn' 
        ? gameState.moonstoneBalance + amount
        : gameState.moonstoneBalance - amount;

      updateGameState({ moonstoneBalance: newBalance });
      onComplete?.(true);

      // Create glitch effect for higher narrative layers
      if (gameState.narrativeLayer >= 2 && receipt.hash) {
        setGlitchText(`Pattern detected: ${receipt.hash.slice(2, 10)}`);
        setTimeout(() => setGlitchText(''), 1000);
      }
    } catch (error) {
      console.error('Transaction error:', error);
      onComplete?.(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="moonstone-transaction">
      <div className="transaction-details">
        <span className="amount">
          {type === 'earn' ? '+' : '-'}{amount} 🌙
        </span>
        <span className="reason">{reason}</span>
      </div>
      {glitchText && (
        <div className="glitch-overlay">{glitchText}</div>
      )}
      <button 
        onClick={processTransaction}
        disabled={isProcessing}
        className={`transaction-button ${type}`}
      >
        {isProcessing ? 'Processing...' : 'Confirm'}
      </button>
      <style jsx>{`
        .moonstone-transaction {
          position: relative;
          padding: 1rem;
          border-radius: 0.5rem;
          background: #1f2937;
          color: white;
        }
        .transaction-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .amount {
          font-size: 1.25rem;
          font-weight: bold;
        }
        .glitch-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 0.5rem;
          background: rgba(99, 102, 241, 0.2);
          font-family: monospace;
          animation: glitch 0.3s infinite;
        }
        .transaction-button {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: all 0.3s ease;
        }
        .transaction-button.earn {
          background: #10B981;
        }
        .transaction-button.spend {
          background: #EF4444;
        }
        @keyframes glitch {
          0% { transform: translate(0) }
          25% { transform: translate(-2px, 2px) }
          50% { transform: translate(2px, -2px) }
          75% { transform: translate(-2px, -2px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
}; 