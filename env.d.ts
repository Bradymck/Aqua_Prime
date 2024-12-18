declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_NETWORK_ENV: 'development' | 'production';
      NEXT_PUBLIC_CONTRACT_ADDRESS: string;
      NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS: string;
      NFT_STORAGE_KEY: string;
      OPENAI_API_KEY: string;
      LIVEKIT_API_KEY: string;
      LIVEKIT_API_SECRET: string;
    }
  }
}

export {} 