#!/bin/bash

# Save current Node version
CURRENT_NODE_VERSION=$(node -v)

echo "Current Node version: $CURRENT_NODE_VERSION"
echo "Switching to Node v20 for contract compilation..."

# Switch to Node v20 for contract compilation
fnm use 20

# Install dependencies if needed
cd contracts
npm install

# Compile contracts
npx hardhat compile

# Switch back to the original Node version
echo "Switching back to Node v32..."
cd ..
fnm use 32

echo "Contract compilation complete!"