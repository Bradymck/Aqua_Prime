import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export function getAlchemyProvider() {
  return createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)
  });
} 