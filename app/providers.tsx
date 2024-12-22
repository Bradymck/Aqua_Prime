"use client";

import { Toaster } from './components/ui/toaster'
import { WalletConnectProvider } from '../private/providers/WalletConnectProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletConnectProvider>
      {children}
      <Toaster />
    </WalletConnectProvider>
  )
}