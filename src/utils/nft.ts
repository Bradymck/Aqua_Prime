import { MoonstoneToken__factory } from '@/contracts';
import { ethers, Log } from 'ethers';
import { CONTRACT_ABIS } from '../app/config/contracts';

const MoonstoneTokenABI = CONTRACT_ABIS.MoonstoneToken;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export interface NFT {
  id: string;
  image: string;
  wear: number;
  mintDate: string;
  power: number;
  traits?: string[];
}
export const mintNFTs = async (count: number): Promise<NFT[]> => {
  if (typeof window === 'undefined') {
    throw new Error("This function can only be called in browser environments");
  }

  // Check for ethereum object and type it properly
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    throw new Error("Ethereum object not found, do you have MetaMask installed?");
  }

  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    console.error('Contract address:', CONTRACT_ADDRESS);
    throw new Error("Valid contract address is not set. Please check your .env.local file and ensure NEXT_PUBLIC_CONTRACT_ADDRESS is set correctly.");
  }

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const contract = MoonstoneToken__factory.connect(CONTRACT_ADDRESS, signer);

  try {
    // Estimate gas
    const gasEstimate = await contract.mint.estimateGas(await signer.getAddress(), ethers.ZeroHash, BigInt(count), '0x');
    console.log(`Estimated gas: ${gasEstimate.toString()}`);

    // Mint NFTs
    const tx = await contract.mint(await signer.getAddress(), ethers.ZeroHash, BigInt(count), '0x');
    const receipt = await tx.wait();
    // Listen for events (adjust event name as per your contract)
    const mintEvents = receipt?.logs?.filter((log: any) => contract.interface.parseLog(log)?.name === 'NFTMinted') ?? [];
    
    // Process logs to get actual NFT data
    const mintedNFTs: NFT[] = mintEvents.map((log: any) => {
      const parsedLog = contract.interface.parseLog(log);
      const { tokenId, uri } = parsedLog?.args as unknown as { tokenId: bigint; uri: string };
      // Fetch metadata from uri and process
      // This is a placeholder, replace with actual metadata fetching
      return {
        id: tokenId.toString(),
        image: `${uri}/image.png`,
        wear: Math.random(),
        mintDate: new Date().toISOString(),
        power: Math.floor(Math.random() * 100) + 1
      };
    });

    return mintedNFTs;
  } catch (error) {
    console.error('Error minting NFTs:', error);
    throw error;
  }
};
export const burnNFTs = async (nfts: string[]): Promise<number> => {
  if (typeof window === 'undefined') {
    throw new Error("This function can only be called in browser environments");
  }

  // Check for ethereum object and type it properly
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    throw new Error("Ethereum object not found, do you have MetaMask installed?");
  }

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const contract = MoonstoneToken__factory.connect(CONTRACT_ADDRESS!, signer);

  // Prepare the burn parameters
  const burnPromises = nfts.map(async (nftId) => {
    return contract.burn(await signer.getAddress(), nftId, 1);
  });

  // Execute all burn transactions
  const txs = await Promise.all(burnPromises);

  // Wait for all transactions to be mined
  await Promise.all(txs.map((tx: { wait: () => any; }) => tx.wait()));

  // Return the amount of moonstone received (this is a placeholder, adjust based on your contract logic)
  return nfts.length * 10;
};
export const formatEther = (value: bigint): string => {
  return ethers.formatEther(value);
};

export const parseEther = (value: string): bigint => {
  return ethers.parseEther(value);
};
export const mintARI = async (account: string, tokenURI: string): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new Error("This function can only be called in browser environments");
  }

  // Check for ethereum object and type it properly
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    throw new Error("Ethereum object not found, do you have MetaMask installed?");
  }

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS!, MoonstoneTokenABI, signer);
  
  const tx = await contract.mint(account, ethers.id(tokenURI), BigInt(1), ethers.toUtf8Bytes(tokenURI));
  
  const receipt = await tx.wait();
  return receipt.transactionHash;
};

export const handleMint = async (event: Log) => {
  // ... rest of the function
};

