#!/bin/bash

# Source nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node 23.3.0
nvm use 23.3.0

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="23.3.0"

echo "Current Node.js version: $NODE_VERSION"
echo "Required Node.js version: $REQUIRED_VERSION"

# Fix the version comparison logic
if [ "$(printf '%s\n' "$NODE_VERSION" "$REQUIRED_VERSION" | sort -V | head -n1)" = "$NODE_VERSION" ] && [ "$NODE_VERSION" != "$REQUIRED_VERSION" ]; then
    echo "Node.js version check failed. Please install version $REQUIRED_VERSION or higher"
    exit 1
fi

# Continue with the rest of the script
echo "Node.js version check passed"

# Clean install
echo "Installing dependencies..."
pnpm install

# Build
echo "Building project..."
pnpm build

# Start
echo "Starting project..."
pnpm start

# Start client
echo -e "\033[1mStarting client...\033[0m"
pnpm start:client

# Open webpage
echo -e "\033[1mOpening webpage...\033[0m"
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
else
    echo -e "\033[1;33mPlease open http://localhost:5173 in your browser\033[0m"
fi
