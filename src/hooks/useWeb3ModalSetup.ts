import { useEffect, useState } from 'react';
import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { arbitrum, mainnet } from 'wagmi/chains';
import { ThemeMode } from '@web3modal/ui';

interface Web3ModalInstance {
  open: () => Promise<void>;
  close: () => Promise<void>;
}

declare global {
  interface Window {
    web3modal?: Web3ModalInstance;
  }
}

export function useWeb3ModalSetup() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
    if (!projectId) return;

    const metadata = {
      name: 'Platypus Passions',
      description: 'Web3 Dating App',
      url: 'https://platypus-passions.com',
      icons: ['https://avatars.githubusercontent.com/u/37784886']
    };

    const config = defaultWagmiConfig({ 
      chains: [mainnet, arbitrum], 
      projectId, 
      metadata,
      ssr: true
    });

    createWeb3Modal({ 
      wagmiConfig: config, 
      projectId, 
      defaultChain: mainnet,
      themeMode: 'dark' as ThemeMode,
      themeVariables: {
        '--w3m-accent': '#FF69B4',
        '--w3m-color-fg-1': '#FF69B4',
        '--w3m-color-fg-2': '#FF69B4',
        '--w3m-color-fg-3': '#FF69B4',
        '--w3m-font-family': 'inherit',
        '--w3m-overlay-background-color': 'rgba(0, 0, 0, 0.7)'
      }
    });

    setIsReady(true);
  }, []);

  const web3Modal = useWeb3Modal();
  
  return { 
    isReady, 
    web3Modal: typeof window !== 'undefined' ? window.web3modal : undefined 
  };
}
