"use client"

import { useAccount } from 'wagmi';
import { readContract, writeContract } from '@wagmi/core';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../app/config/contracts';
import { useState, useEffect } from 'react';
import { config } from '../app/config/wagmi';
import { parseEther } from 'viem';
import type { GameState } from '@/services/contractStateService';

export function useContractIntegration() {
  const { address, isConnected } = useAccount();
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedNFTId, setSelectedNFTId] = useState<number | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setIsInitialized(true);
    } else {
      setIsInitialized(false);
    }
  }, [isConnected, address]);

  const actions = {
    async connect() {
      // Connection is handled by Privy/WalletConnect
      return true;
    },

    async handleGameStateTransition(currentState: GameState): Promise<GameState> {
      if (!isInitialized) {
        return 'wallet-connection';
      }

      switch (currentState) {
        case 'app-check':
          return 'age-check';
        case 'age-check':
          return 'wallet-connection';
        case 'wallet-connection':
          return isInitialized ? 'disclaimer' : 'wallet-connection';
        case 'disclaimer':
          return 'welcome';
        case 'welcome':
          return 'choose-type';
        case 'choose-type':
          return 'loading';
        case 'loading':
          return 'dating-app';
        default:
          return currentState;
      }
    },

    async claimMoonstones() {
      if (!isInitialized) throw new Error("Contracts not initialized");
      
      const tx = await writeContract(config, {
        address: `0x${CONTRACT_ADDRESSES.MOONSTONE_TOKEN.replace('0x', '')}` as `0x${string}`,
        abi: CONTRACT_ABIS.MoonstoneToken,
        functionName: 'claimReward',
        args: [],
      });

      return tx;
    },

    async mint(metadata: string) {
      if (!isInitialized) throw new Error("Contracts not initialized");
      
      try {
        // Calculate mint price
        const mintPrice = await readContract(config, {
          address: `0x${CONTRACT_ADDRESSES.AQUAPRIME_NFT.replace('0x', '')}` as `0x${string}`,
          abi: CONTRACT_ABIS.AquaPrimeNFT,
          functionName: 'calculateMintPrice',
          args: [BigInt(0)],
        });

        // Approve spending
        await writeContract(config, {
          address: `0x${CONTRACT_ADDRESSES.MOONSTONE_TOKEN.replace('0x', '')}` as `0x${string}`,
          abi: CONTRACT_ABIS.MoonstoneToken,
          functionName: 'approve',
          args: [
            `0x${CONTRACT_ADDRESSES.AQUAPRIME_NFT.replace('0x', '')}` as `0x${string}`,
            mintPrice
          ],
        });

        // Mint NFT
        const tx = await writeContract(config, {
          address: `0x${CONTRACT_ADDRESSES.AQUAPRIME_NFT.replace('0x', '')}` as `0x${string}`,
          abi: CONTRACT_ABIS.AquaPrimeNFT,
          functionName: 'mintCompanion',
          args: [metadata],
        });

        return tx;
      } catch (error) {
        console.error("Mint error:", error);
        throw error;
      }
    },

    async burn(tokenId: number) {
      if (!isInitialized) throw new Error("Contracts not initialized");
      
      const tx = await writeContract(config, {
        address: `0x${CONTRACT_ADDRESSES.AQUAPRIME_NFT.replace('0x', '')}` as `0x${string}`,
        abi: CONTRACT_ABIS.AquaPrimeNFT,
        functionName: 'burnCompanion',
        args: [BigInt(tokenId)],
      });

      return tx;
    },

    setSelectedNFTId,
  };

  return {
    state: {
      isConnected: isInitialized,
      address: address || null,
      selectedNFTId,
    },
    actions,
    loading: !isInitialized,
  };
}
