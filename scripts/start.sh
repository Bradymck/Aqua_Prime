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

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}Warning: $1${NC}"
}

# Navigate to project root
cd "$(dirname "$0")"/..

# Parse command line arguments
UPDATE=false
SKIP_VERSION_CHECK=false
for arg in "$@"; do
    case $arg in
        --update)
            UPDATE=true
            shift
            ;;
        --skip-version-check)
            SKIP_VERSION_CHECK=true
            shift
            ;;
    esac
done

# Check Node.js version if not skipped
if [ "$SKIP_VERSION_CHECK" = false ]; then
    REQUIRED_NODE_VERSION=22
    CURRENT_NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')

    if (( CURRENT_NODE_VERSION < REQUIRED_NODE_VERSION && CURRENT_NODE_VERSION < 23 )); then
        print_warning "Node.js version $REQUIRED_NODE_VERSION or higher is recommended. Current version is $CURRENT_NODE_VERSION."
        print_warning "Proceeding anyway... If you encounter issues, please upgrade Node.js"
        sleep 2
    fi
fi

# Run update if requested
if [ "$UPDATE" = true ]; then
    print_status "Updating from upstream..."
    if ! bash scripts/update-fork.sh; then
        print_error "Failed to update from upstream"
    fi
fi

# clean cache
print_status "Cleaning cache..."
if ! pnpm clean; then
    print_error "Failed to clean cache"
fi

# Install dependencies
print_status "Installing dependencies..."
if ! pnpm i; then
    print_error "Failed to install dependencies"
fi

# Build project
print_status "Building project..."
if ! pnpm build; then
    print_error "Failed to build project"
fi

# Start project
print_status "Starting project..."
if ! pnpm start; then
    print_error "Failed to start project"
fi

# Start client
print_status "Starting client..."
pnpm start:client

# Open webpage
print_status "Opening webpage..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
else
    echo -e "${YELLOW}Please open http://localhost:5173 in your browser${NC}"
fi
