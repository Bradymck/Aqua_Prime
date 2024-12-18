export const SubscriptionManagerABI = {
    abi: [
        {
            // Basic subscription management functions
            inputs: [],
            name: "getSubscriptionStatus",
            outputs: [{ type: "bool", name: "active" }],
            stateMutability: "view",
            type: "function"
        }
    ],
    bytecode: "0x..."
} 