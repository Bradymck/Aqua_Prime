import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../app/config/contracts';

export function useContracts() {
  const { address } = useAccount();
  const publicClient = getPublicClient();

  const { data: moonstone } = useQuery({
    queryKey: ['moonstone', address],
    queryFn: async () => {
      if (!publicClient || !address) return null;
      
      const provider = new ethers.JsonRpcProvider(publicClient.transport.url);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.MOONSTONE_TOKEN,
        CONTRACT_ABIS.MoonstoneToken,
        provider
      );
      return contract;
    },
    enabled: !!address && !!publicClient
  });

  return {
    moonstone,
  };
}
