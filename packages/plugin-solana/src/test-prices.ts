import { TokenProvider } from './providers/token';
import { WalletProvider } from './providers/wallet';
import { Connection, PublicKey } from '@solana/web3.js';

async function testPriceFetching() {
    // Create a dummy wallet provider since we only need it for the TokenProvider constructor
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const dummyPublicKey = new PublicKey('11111111111111111111111111111111');
    const walletProvider = new WalletProvider(connection, dummyPublicKey);

    // Create token provider with SOL address
    const tokenProvider = new TokenProvider(
        'solana', // Using CoinGecko ID for Solana
        walletProvider,
        {
            get: async () => null,
            set: async () => {},
        }
    );

    try {
        console.log('Fetching prices...');
        const prices = await tokenProvider.fetchPrices();
        console.log('Prices:', JSON.stringify(prices, null, 2));
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
}

testPriceFetching();