import { Connection } from "@solana/web3.js";
import fetch from "cross-fetch";

describe("Solana Plugin Connection Tests", () => {
    const rpcUrl = process.env.RPC_URL || "https://api.mainnet-beta.solana.com";
    const birdeyeApiKey = process.env.BIRDEYE_API_KEY;
    const BIRDEYE_API = "https://public-api.birdeye.so";
    const SOL_ADDRESS = "So11111111111111111111111111111111111111112";
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    beforeAll(() => {
        if (!process.env.RPC_URL) {
            console.warn("Warning: RPC_URL not set, using default mainnet RPC");
        }
        if (!process.env.BIRDEYE_API_KEY) {
            console.warn("Warning: BIRDEYE_API_KEY not set, skipping Birdeye API tests");
        }
    });

    test("Solana RPC Connection", async () => {
        const connection = new Connection(rpcUrl);
        const version = await connection.getVersion();
        expect(version).toBeDefined();
        expect(version["solana-core"]).toBeDefined();
    });

    const fetchWithRetry = async (url: string, options: RequestInit = {}) => {
        let lastError: Error;

        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        "Accept": "application/json",
                        "x-chain": "solana",
                        "X-API-KEY": birdeyeApiKey,
                        ...options.headers,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                return await response.json();
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                lastError = error;
                if (i < MAX_RETRIES - 1) {
                    const delay = RETRY_DELAY * Math.pow(2, i);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
            }
        }

        throw lastError;
    };

    (birdeyeApiKey ? describe : describe.skip)("Birdeye API Tests", () => {
        test("Birdeye API Price Endpoint", async () => {
            const data = await fetchWithRetry(
                `${BIRDEYE_API}/defi/price?address=${SOL_ADDRESS}`
            );

            expect(data.success).toBe(true);
            expect(data.data).toBeDefined();
            expect(data.data.value).toBeDefined();
        });

        test("Birdeye API Rate Limits", async () => {
            // Test multiple requests with delay to respect rate limits
            for (let i = 0; i < 3; i++) {
                const data = await fetchWithRetry(
                    `${BIRDEYE_API}/defi/price?address=${SOL_ADDRESS}`
                );
                expect(data.success).toBe(true);
                if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
            }
        });
    });
});