#!/bin/bash
set -e

echo "🚀 AION Linera Deployment Script"
echo "=================================="

# Build contract
echo "📦 Building Wasm contract..."
cd linera
cargo build --target wasm32-unknown-unknown --release

# Deploy to Linera
echo "🌐 Deploying to Linera testnet..."
WASM_PATH="target/wasm32-unknown-unknown/release/aion_prediction_market.wasm"

APP_ID=$(linera project deploy --wasm $WASM_PATH --network testnet | grep "Application ID" | awk '{print $3}')

echo "✅ Deployed! Application ID: $APP_ID"

# Update .env
echo "📝 Updating .env file..."
cd ..
sed -i "s/LINERA_APP_ID=.*/LINERA_APP_ID=$APP_ID/" backend/.env

echo "✅ Deployment complete!"
echo "Application ID: $APP_ID"
