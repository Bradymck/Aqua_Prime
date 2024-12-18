import { MoonstoneTokenABI } from '../../contracts/abi/Moonstone';
import { AquaPrimeNFTABI } from '../../contracts/abi/AquaPrimeNFT';

// Base Sepolia Testnet Addresses
export const CONTRACT_ADDRESSES = {
  MOONSTONE_TOKEN: '0xe03AedE0336c739f90311FE0b08ed03E3690E49a', // Base Sepolia Moonstone
  AQUAPRIME_NFT: '', // Need the deployed NFT contract address from addresses.json
};

export const CONTRACT_ABIS = {
  MoonstoneToken: MoonstoneTokenABI,
  AquaPrimeNFT: AquaPrimeNFTABI,
} as const; 