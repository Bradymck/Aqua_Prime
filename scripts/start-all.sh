#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Function to print status messages
print_status() {
    echo -e "${BOLD}$1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Navigate to project root
cd "$(dirname "$0")"/..

# Install dependencies if needed
print_status "Checking dependencies..."
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install it first."
fi

# Install dependencies for both projects
print_status "Installing dependencies for Eliza..."
pnpm install

print_status "Installing dependencies for private app..."
cd private && pnpm install && cd ..

# Build projects
print_status "Building Eliza..."
pnpm build

print_status "Building private app..."
cd private && pnpm build && cd ..

# Start all services using concurrently
print_status "Starting all services..."
pnpm add -g concurrently

concurrently \
    --names "ELIZA,PRIVATE" \
    --prefix-colors "cyan,magenta" \
    --kill-others \
    "pnpm start" \
    "cd private && pnpm dev"