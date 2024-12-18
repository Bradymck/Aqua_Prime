import React, { useState } from 'react';
import { useConfig } from '../ConfigProvider';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import Image from 'next/image';

interface AIMatch {
  tokenId: number;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastActive: number;
  personality: string;
  matchPercentage: number;
  isOnline: boolean;
}

export const AIMatchesList: React.FC = () => {
  const { gameState } = useConfig();
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const { address } = useAccount();
  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);

  React.useEffect(() => {
    if (!address) return;

    const fetchTokens = async () => {
      try {
        const tokens = await readContract({
          address: process.env.NEXT_PUBLIC_AQUAPRIME_NFT_CONTRACT as `0x${string}`,
          abi: ['function tokensOfOwner(address) view returns (uint256[])'],
          functionName: 'tokensOfOwner',
          args: [address]
        });
        setOwnedTokens(tokens as number[]);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, [address]);

  const getIsOnline = (tokenId: number) => {
    return Math.random() > 0.5;
  };

  return (
    <div className="matches-list">
      {ownedTokens?.map((tokenId: number) => (
        <div 
          key={tokenId}
          className={`match-card ${selectedMatch === tokenId ? 'selected' : ''}`}
          onClick={() => setSelectedMatch(tokenId)}
        >
          <div className="match-avatar">
            <Image
              src={`/api/companion/${tokenId}/avatar`}
              alt="AI Match Avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className={`online-status ${getIsOnline(tokenId) ? 'online' : 'offline'}`} />
          </div>

          <div className="match-info">
            <div className="match-header">
              <h3 className="match-name">ARI #{tokenId}</h3>
              {gameState.narrativeLayer >= 2 && (
                <span className="match-percentage">
                  {Math.floor(Math.random() * 20 + 80)}% match
                </span>
              )}
            </div>
            <p className="last-message">
              {gameState.narrativeLayer >= 3 ? (
                <span className="glitch-text">01010000 01101100</span>
              ) : (
                "Hey there! Want to roleplay? 🎲"
              )}
            </p>
          </div>

          <style jsx>{`
            .matches-list {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              padding: 1rem;
            }

            .match-card {
              display: flex;
              align-items: center;
              gap: 1rem;
              padding: 0.75rem;
              border-radius: 0.5rem;
              background: white;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .match-card:hover {
              background: #f3f4f6;
            }

            .match-card.selected {
              background: #f0f7ff;
              border-left: 3px solid #6366f1;
            }

            .match-avatar {
              position: relative;
            }

            .online-status {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              border: 2px solid white;
            }

            .online-status.online {
              background: #10B981;
            }

            .online-status.offline {
              background: #6B7280;
            }

            .match-info {
              flex: 1;
            }

            .match-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .match-name {
              font-weight: 600;
              color: #1F2937;
            }

            .match-percentage {
              font-size: 0.875rem;
              color: #6366f1;
            }

            .last-message {
              font-size: 0.875rem;
              color: #6B7280;
              margin-top: 0.25rem;
            }

            .glitch-text {
              font-family: monospace;
              color: #6366f1;
              animation: glitch 0.3s infinite;
            }

            @keyframes glitch {
              0% { opacity: 1; }
              50% { opacity: 0.8; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}; 