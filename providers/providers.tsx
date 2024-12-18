'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { config, chains } from '@/app/config'
import { PublicClient, Config, WagmiProvider, WebSocketPublicClient } from 'wagmi'

interface ProvidersProps {
  children: ReactNode
  initialState?: Record<string, unknown>
}

export function Providers(props: ProvidersProps) {
  const [wagmiConfig] = useState(() => config as unknown as Config<PublicClient, WebSocketPublicClient>)
  const [queryClient] = useState(() => new QueryClient())
  
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
