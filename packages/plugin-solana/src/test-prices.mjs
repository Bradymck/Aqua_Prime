import { Connection, PublicKey } from '@solana/web3.js';

// Mock the cache manager
const cacheManager = {
    get: async () => null,
    set: async () => {},
};

// Mock the wallet provider
class WalletProvider {
    constructor(connection, publicKey) {
        this.connection = connection;
        this.publicKey = publicKey;
    }
}

// Simplified token provider that only includes price fetching
class TokenProvider {
    constructor(tokenAddress, walletProvider, cacheManager) {
        this.tokenAddress = tokenAddress;
        this.walletProvider = walletProvider;
        this.cacheManager = cacheManager;
    }

    async fetchPrices() {
        try {
            const tokens = ['solana', 'bitcoin', 'ethereum'];
            const prices = {
                solana: { usd: "0" },
                bitcoin: { usd: "0" },
                ethereum: { usd: "0" },
            };

            console.log('Fetching from CoinGecko API...');
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(",")}&vs_currencies=usd`,
                {
                    headers: {
                        "Accept": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw response:', data);

            if (data.solana?.usd) prices.solana.usd = data.solana.usd.toString();
            if (data.bitcoin?.usd) prices.bitcoin.usd = data.bitcoin.usd.toString();
            if (data.ethereum?.usd) prices.ethereum.usd = data.ethereum.usd.toString();

            return prices;
        } catch (error) {
            console.error("Error fetching prices:", error);
            throw error;
        }
    }
}

async function testPriceFetching() {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const dummyPublicKey = new PublicKey('11111111111111111111111111111111');
    const walletProvider = new WalletProvider(connection, dummyPublicKey);

    const tokenProvider = new TokenProvider(
        'solana',
        walletProvider,
        cacheManager
    );

    try {
        console.log('Fetching prices...');
        const prices = await tokenProvider.fetchPrices();
        console.log('Formatted prices:', JSON.stringify(prices, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testPriceFetching();