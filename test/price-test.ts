import { TokenProvider } from '../packages/plugin-solana/src/providers/token';
import { WalletProvider } from '../packages/plugin-solana/src/providers/wallet';
import { Connection } from '@solana/web3.js';

const PROVIDER_CONFIG = {
    DEFAULT_RPC: "https://api.mainnet-beta.solana.com",
    TOKEN_ADDRESSES: {
        SOL: "solana",
        BTC: "bitcoin",
        ETH: "ethereum",
    },
};

async function testPriceFetching() {
    try {
        const connection = new Connection(PROVIDER_CONFIG.DEFAULT_RPC);
        const dummyPublicKey = { toBase58: () => "dummy" };
        const walletProvider = new WalletProvider(connection, dummyPublicKey as any);

        console.log("Fetching prices...");
        const prices = await walletProvider.fetchPrices({
            getSetting: (key: string) => process.env[key] || ""
        });

        console.log("Current prices:");
        console.log(`SOL: $${prices.solana.usd}`);
        console.log(`BTC: $${prices.bitcoin.usd}`);
        console.log(`ETH: $${prices.ethereum.usd}`);
    } catch (error) {
        console.error("Error fetching prices:", error);
    }
}

testPriceFetching();