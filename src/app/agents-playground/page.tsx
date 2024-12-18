'use client'

import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useLiveKitConnection } from '@/hooks/useLiveKitConnection';

const AgentsPlayground = dynamic(() => import('@/components/agents-playground'), {
  ssr: false,
});

export default function AgentsPlaygroundPage() {
  const { address } = useAccount();
  const { token } = useLiveKitConnection(address);
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!wsUrl) {
    return <div>LiveKit URL not configured</div>;
  }

  if (!token) {
    return <div>Loading...</div>;
  }

  return <AgentsPlayground token={token} serverUrl={wsUrl} />;
} 