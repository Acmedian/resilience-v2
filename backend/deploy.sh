#!/bin/bash
# Resilience v2 — backend deployment script for AWS Lightsail Ubuntu
# Run on server: bash deploy.sh

set -e
echo "=== Resilience v2 Backend Deploy ==="

# Pull latest
git pull origin main

# Install/update deps
pip install -r requirements.txt --break-system-packages

# Run migrations (alembic)
alembic upgrade head

# Restart PM2 process
pm2 restart resilience-api || pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8001" --name resilience-api

echo "=== Deploy complete ==="
