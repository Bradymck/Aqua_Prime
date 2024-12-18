import { ethers } from 'ethers';

// Contract Events
export interface ContractEvent {
  blockNumber: number;
  transactionHash: string;
  timestamp: number;
}

export interface GuardianEvent extends ContractEvent {
  actionId: string;
  executor: string;
}

export interface SubscriptionEvent extends ContractEvent {
  user: string;
  tier: number;
  duration: number;
}

export interface LiquidityEvent extends ContractEvent {
  ethAmount: bigint;
  tokenAmount: bigint;
  provider: string;
}

// Contract States
export interface ContractState {
  isActive: boolean;
  guardian: string;
  balance: bigint;
  totalSubscriptions: bigint;
}

// Provider Configuration
export interface ProviderConfig {
  rpcUrl: string;
  wsUrl: string;
  chainId: number;
  retryAttempts: number;
  retryDelay: number;
} 