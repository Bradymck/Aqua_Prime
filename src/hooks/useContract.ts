import { useMemo, useState, useEffect } from 'react';
import { useAccount, getWalletClient, type GetWalletClientResult } from 'wagmi';
import { getContract, type GetContractReturnType } from 'viem';
import { getPublicClient } from 'wagmi';

export function useContract<T extends GetContractReturnType = GetContractReturnType>({
  address,
  abi,
  walletClient = false,
}: {
  address: string;
  abi: any;
  walletClient?: boolean;
}) {
  const publicClient = getPublicClient();
  const { address: accountAddress, isConnected } = useAccount();

  const [resolvedWalletClient, setResolvedWalletClient] = useState<GetWalletClientResult | null>(null);

  useEffect(() => {
    if (walletClient && isConnected) {
      getWalletClient().then(setResolvedWalletClient);
    }
  }, [walletClient, isConnected]);

  return useMemo(() => {
    if (!address || !abi) return null;
    const client = walletClient ? resolvedWalletClient : publicClient;
    if (!client) return null;

    return getContract({
      address: address as `0x${string}`,
      abi,
      publicClient: client,
    }) as unknown as T;
  }, [address, abi, walletClient, resolvedWalletClient, publicClient]);
}
