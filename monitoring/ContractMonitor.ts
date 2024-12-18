import { AlertConfig } from "../scripts/monitoring/AlertSystem";

export class ContractMonitor {
    constructor(config: {
        contractAddress: string;
        contractAbi: string[];
        discord: AlertConfig;
        rpcUrl: string;
        wsUrl?: string;
        chainId: number;
        retryAttempts?: number;
        retryDelay?: number;
    }) {
        // ... implementation
    }
} 