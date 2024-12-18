import { ethers } from 'ethers';

export function getAlchemyProvider() {
  return new ethers.JsonRpcProvider(
    `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
  );
}

export function getWebSocketProvider() {
  return new ethers.WebSocketProvider(
    `wss://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
  );
} 