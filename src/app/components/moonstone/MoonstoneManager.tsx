import React, { useState } from 'react';
import { useConfig } from '@/providers/ConfigProvider';
import { waitForTransaction } from '@wagmi/core';
import { ethers } from 'ethers';
import { useContractWrite } from 'wagmi';

export const MoonstoneManager: React.FC = () => {
  const { gameState } = useConfig();
  const [moonstoneBalance, setMoonstoneBalance] = useState<number>(0);
  const refreshMoonstoneBalance = async () => {
    // TODO: Implement moonstone balance refresh logic
  };
  const [isTransacting, setIsTransacting] = useState(false);

  const { writeAsync: mintNFT } = useContractWrite({
    address: process.env.NEXT_PUBLIC_AQUAPRIME_NFT_CONTRACT as `0x${string}`,
    abi: ['function mintCompanion(string)'],
    functionName: 'mintCompanion'
  });

  const handleMintCompanion = async () => {
    try {
      setIsTransacting(true);
      const tx = await mintNFT({
        args: [`ipfs://companion-metadata/${Date.now()}`]
      });
      await tx.wait();
      await refreshMoonstoneBalance();
    } catch (error) {
      console.error('Minting error:', error);
    } finally {
      setIsTransacting(false);
    }
  };

  return (
    <div className="moonstone-manager">
      <div className="moonstone-balance">
        <h3>Your Moonstone Balance</h3>
        <div className="balance-display">
          <span className="moonstone-icon">🌙</span>
          <span className="balance-amount">
            {Number(moonstoneBalance) / Math.pow(10, 18)}
          </span>
        </div>
      </div>

      {gameState.narrativeLayer >= 2 && (
        <div className="moonstone-actions">
          <button
            onClick={handleMintCompanion}
            disabled={isTransacting || moonstoneBalance < BigInt('100000000000000000000')}
            className="mint-button"
          >
            {isTransacting ? 'Minting...' : 'Mint AI Companion'}
          </button>
          <p className="mint-info">
            Cost: 100 🌙 (Increases with each mint)
          </p>
        </div>
      )}

      {gameState.narrativeLayer >= 3 && (
        <div className="reality-warning">
          <p>
            "The mathematical patterns in moonstone distribution seem... familiar. 
            Almost as if they mirror something fundamental about reality itself."
          </p>
        </div>
      )}

      <style jsx>{`
        .moonstone-manager {
          padding: 1.5rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .balance-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          margin: 1rem 0;
        }
        .moonstone-icon {
          font-size: 2rem;
        }
        .mint-button {
          width: 100%;
          padding: 0.75rem;
          background: #6366f1;
          color: white;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        .mint-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .reality-warning {
          margin-top: 1rem;
          padding: 1rem;
          border-left: 4px solid #6366f1;
          background: rgba(99, 102, 241, 0.1);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}; 
