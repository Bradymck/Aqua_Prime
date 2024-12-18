import { WalletConnectProvider } from './WalletConnectProvider'
import { PrivyProvider } from '@privy-io/react-auth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletConnectProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
          loginMethods: ['wallet', 'email'],
          appearance: {
            theme: 'dark',
            accentColor: '#FF69B4',
          },
        }}
      >
        {children}
      </PrivyProvider>
    </WalletConnectProvider>
  )
} 