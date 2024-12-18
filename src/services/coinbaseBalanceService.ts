import { ethers } from 'ethers';

export class CoinbaseBalanceService {
  private static instance: CoinbaseBalanceService;
  private rpcEndpoint: string;

  private constructor() {
    this.rpcEndpoint = 'https://api.developer.coinbase.com/rpc/v1/base/AZBQa6jEwvLWpqN84j1cQmxRiY66c560';
  }

  static getInstance(): CoinbaseBalanceService {
    if (!CoinbaseBalanceService.instance) {
      CoinbaseBalanceService.instance = new CoinbaseBalanceService();
    }
    return CoinbaseBalanceService.instance;
  }

  async getBalances(address: string): Promise<{ tokens: any[] }> {
    try {
      const response = await fetch(this.rpcEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'cdp_listBalances',
          params: [{
            address,
            pageToken: '',
            pageSize: 100
          }]
        })
      });

      const data = await response.json();
      const tokens = this.formatBalances(data.result.balances);
      return { tokens };
    } catch (error) {
      console.error('Error fetching Coinbase balances:', error);
      return { tokens: [] };
    }
  }

  private formatBalances(balances: any[]) {
    return balances.map(balance => ({
      asset: balance.asset.id,
      type: balance.asset.type,
      value: ethers.formatUnits(balance.valueStr, balance.decimals),
      decimals: balance.decimals
    }));
  }
} 