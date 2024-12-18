import { ethers } from "ethers";

interface ProviderConfig {
  rpcUrl: string;
  wsUrl: string;
  chainId: number;
  retryAttempts: number;
  retryDelay: number;
}

export class ProviderService {
  [x: string]: any;
  private httpProvider: ethers.JsonRpcProvider;
  private wsProvider: ethers.WebSocketProvider;
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.httpProvider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wsProvider = new ethers.WebSocketProvider(config.wsUrl);
  }

  getHttpProvider(): ethers.JsonRpcProvider {
    return this.httpProvider;
  }

  async ensureConnection(): Promise<void> {
    await this.httpProvider.getNetwork();
  }
}
