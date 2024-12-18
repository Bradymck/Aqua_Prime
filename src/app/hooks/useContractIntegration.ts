import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../config/contracts';
import { useState } from 'react';

export function useContractIntegration() {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const moonstoneContract = useContract({
    address: CONTRACT_ADDRESSES.MOONSTONE_TOKEN,
    abi: CONTRACT_ABIS.MoonstoneToken,
    signerOrProvider: signer || provider,
  });

  const nftContract = useContract({
    address: CONTRACT_ADDRESSES.AQUAPRIME_NFT,
    abi: CONTRACT_ABIS.AquaPrimeNFT,
    signerOrProvider: signer || provider,
  });

  const [selectedNFTId, setSelectedNFTId] = useState<number | null>(null);

  const actions = {
    async mint(metadata: string) {
      if (!nftContract || !moonstoneContract) throw new Error("Contracts not initialized");
      
      // First approve NFT contract to spend Moonstone tokens
      const mintPrice = await nftContract.calculateMintPrice(0);
      await moonstoneContract.approve(CONTRACT_ADDRESSES.AQUAPRIME_NFT, mintPrice);
      
      // Then mint NFT
      const tx = await nftContract.mintCompanion(metadata);
      await tx.wait();
      return tx;
    },

    async burn(tokenId: number) {
      if (!nftContract) throw new Error("Contract not initialized");
      const tx = await nftContract.burnCompanion(tokenId);
      await tx.wait();
      return tx;
    },

    setSelectedNFTId,
  };

  return {
    state: {
      isConnected,
      address,
      selectedNFTId,
    },
    actions,
    loading: false,
  };
} 