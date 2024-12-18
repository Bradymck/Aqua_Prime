const COINGECKO_API = "https://api.coingecko.com/api/v3";
const TOKEN_IDS = {
    SOL: "solana",
    BTC: "bitcoin",
    ETH: "ethereum",
};

async function testPriceFetching() {
    try {
        console.log("Fetching prices...");
        const response = await fetch(
            `${COINGECKO_API}/simple/price?ids=${Object.values(TOKEN_IDS).join(",")}&vs_currencies=usd`,
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

        console.log("Current prices:");
        console.log(`SOL: $${data[TOKEN_IDS.SOL]?.usd}`);
        console.log(`BTC: $${data[TOKEN_IDS.BTC]?.usd}`);
        console.log(`ETH: $${data[TOKEN_IDS.ETH]?.usd}`);
    } catch (error) {
        console.error("Error fetching prices:", error);
    }
}

testPriceFetching();