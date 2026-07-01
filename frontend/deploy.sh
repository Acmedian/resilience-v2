#!/bin/bash
# Resilience v2 — frontend deployment script
# Run locally: bash deploy.sh

set -e
echo "=== Resilience v2 Frontend Deploy ==="

# Build
npm run build

# Sync to server (update IP if needed)
rsync -avz --delete dist/ ubuntu@3.109.197.47:/var/www/resilience-v2/

echo "=== Frontend deployed ==="
echo "Visit: https://resilience.acmedian.com"
