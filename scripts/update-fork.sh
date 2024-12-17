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

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}Warning: $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Navigate to project root
cd "$(dirname "$0")"/..

# List of files to protect (add more as needed)
PROTECTED_FILES=(
    "agent/src/index.ts"
    ".cursorignore"
    ".env"
    ".env.local"
)

# Backup protected files
print_status "Creating backup of protected files..."
mkdir -p .backup
for file in "${PROTECTED_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" ".backup/$(basename "$file")" || print_error "Failed to backup $file"
    fi
done

# Fetch upstream changes
print_status "Fetching upstream changes..."
git fetch upstream || print_error "Failed to fetch upstream changes"

# Create temporary branch for updates
TEMP_BRANCH="temp-upstream-update-$(date +%s)"
git checkout -b "$TEMP_BRANCH" || print_error "Failed to create temporary branch"

# Merge upstream changes
print_status "Merging upstream changes..."
git merge upstream/main --no-commit --no-ff || true

# Restore protected files
print_status "Restoring protected files..."
for file in "${PROTECTED_FILES[@]}"; do
    if [ -f ".backup/$(basename "$file")" ]; then
        cp ".backup/$(basename "$file")" "$file" || print_error "Failed to restore $file"
    fi
done

# Stage all changes except protected files
print_status "Staging changes..."
git add . || print_error "Failed to stage changes"
for file in "${PROTECTED_FILES[@]}"; do
    git reset HEAD "$file" 2>/dev/null || true
done

# Check if there are changes to commit
if git diff --cached --quiet; then
    print_warning "No changes to commit - already up to date"
else
    # Commit changes
    print_status "Committing changes..."
    git commit -m "Update from upstream (automated) $(date +%Y-%m-%d)" || print_error "Failed to commit changes"
fi

# Switch back to main branch
git checkout main || print_error "Failed to switch to main branch"

# Merge changes from temporary branch if there were any
if ! git diff --quiet main "$TEMP_BRANCH"; then
    git merge "$TEMP_BRANCH" || print_error "Failed to merge changes from temporary branch"
fi

# Delete temporary branch
git branch -D "$TEMP_BRANCH" || print_error "Failed to delete temporary branch"

# Clean up backup directory
rm -rf .backup

print_status "${GREEN}Successfully checked for updates!${NC}"