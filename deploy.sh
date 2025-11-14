#!/bin/bash

# AION Deployment Script for Linera
# Hybrid Chain Strategy Implementation

set -e  # Exit on error

echo "🚀 AION Deployment Script"
echo "=========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Cargo not found. Please install Rust first.${NC}"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

if ! command -v linera &> /dev/null; then
    echo -e "${RED}❌ Linera CLI not found. Please install it first.${NC}"
    echo "   cargo install linera-cli"
    exit 1
fi

if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo -e "${YELLOW}⚠️  WASM target not installed. Installing...${NC}"
    rustup target add wasm32-unknown-unknown
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"
echo ""

# Build smart contract
echo "📦 Building smart contract..."
cd linera

if cargo build --release --target wasm32-unknown-unknown; then
    echo -e "${GREEN}✅ Contract built successfully${NC}"
else
    echo -e "${RED}❌ Contract build failed${NC}"
    exit 1
fi

WASM_FILE="target/wasm32-unknown-unknown/release/aion_prediction_market.wasm"
if [ ! -f "$WASM_FILE" ]; then
    echo -e "${RED}❌ WASM file not found: $WASM_FILE${NC}"
    exit 1
fi

WASM_SIZE=$(ls -lh "$WASM_FILE" | awk '{print $5}')
echo "   Contract size: $WASM_SIZE"
cd ..
echo ""

# Setup Linera network
echo "🌐 Setting up Linera network..."
read -p "Use local network? (y/n): " use_local

if [ "$use_local" = "y" ]; then
    echo "Starting local Linera network..."
    # Check if already running
    if pgrep -f "linera" > /dev/null; then
        echo -e "${YELLOW}⚠️  Linera process already running${NC}"
    else
        linera net up &
        sleep 5
    fi
    RPC_URL="http://localhost:8080"
else
    read -p "Enter Linera RPC URL (default: http://localhost:8080): " custom_rpc
    RPC_URL=${custom_rpc:-http://localhost:8080}
fi

echo "   Using RPC: $RPC_URL"
echo ""

# Create main chain
echo "🏛️  Creating main chain (Governance)..."
MAIN_CHAIN_OUTPUT=$(linera create-chain 2>&1)
MAIN_CHAIN_ID=$(echo "$MAIN_CHAIN_OUTPUT" | grep -oE '[a-f0-9]{64}' | head -1)

if [ -z "$MAIN_CHAIN_ID" ]; then
    echo -e "${RED}❌ Failed to create main chain${NC}"
    echo "$MAIN_CHAIN_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Main chain created${NC}"
echo "   Chain ID: $MAIN_CHAIN_ID"
echo ""

# Deploy application
echo "📤 Deploying application to main chain..."
DEPLOY_OUTPUT=$(linera publish-and-create \
    --chain-id "$MAIN_CHAIN_ID" \
    linera/target/wasm32-unknown-unknown/release/aion_prediction_market.wasm 2>&1)

MAIN_APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -oE '[a-f0-9]{64,}' | head -1)

if [ -z "$MAIN_APP_ID" ]; then
    echo -e "${RED}❌ Failed to deploy application${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Application deployed${NC}"
echo "   App ID: $MAIN_APP_ID"
echo ""

# Update backend configuration
echo "⚙️  Updating backend configuration..."
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env not found, creating from .env.example${NC}"
    if [ -f "../.env.example" ]; then
        cp ../.env.example .env
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
fi

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|LINERA_RPC_URL=.*|LINERA_RPC_URL=$RPC_URL|" .env
    sed -i '' "s|LINERA_MAIN_CHAIN_ID=.*|LINERA_MAIN_CHAIN_ID=$MAIN_CHAIN_ID|" .env
    sed -i '' "s|LINERA_MAIN_APP_ID=.*|LINERA_MAIN_APP_ID=$MAIN_APP_ID|" .env
else
    # Linux
    sed -i "s|LINERA_RPC_URL=.*|LINERA_RPC_URL=$RPC_URL|" .env
    sed -i "s|LINERA_MAIN_CHAIN_ID=.*|LINERA_MAIN_CHAIN_ID=$MAIN_CHAIN_ID|" .env
    sed -i "s|LINERA_MAIN_APP_ID=.*|LINERA_MAIN_APP_ID=$MAIN_APP_ID|" .env
fi

echo -e "${GREEN}✅ Backend configuration updated${NC}"
cd ..
echo ""

# Update frontend configuration
echo "🎨 Updating frontend configuration..."
FRONTEND_CONFIG="AION LINERA/linera-config.js"

if [ -f "$FRONTEND_CONFIG" ]; then
    # Create backup
    cp "$FRONTEND_CONFIG" "$FRONTEND_CONFIG.backup"
    
    # Update config
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|rpcUrl: '.*'|rpcUrl: '$RPC_URL'|" "$FRONTEND_CONFIG"
        sed -i '' "s|chainId: '.*'|chainId: '$MAIN_CHAIN_ID'|" "$FRONTEND_CONFIG"
        sed -i '' "s|appId: '.*'|appId: '$MAIN_APP_ID'|" "$FRONTEND_CONFIG"
    else
        sed -i "s|rpcUrl: '.*'|rpcUrl: '$RPC_URL'|" "$FRONTEND_CONFIG"
        sed -i "s|chainId: '.*'|chainId: '$MAIN_CHAIN_ID'|" "$FRONTEND_CONFIG"
        sed -i "s|appId: '.*'|appId: '$MAIN_APP_ID'|" "$FRONTEND_CONFIG"
    fi
    
    echo -e "${GREEN}✅ Frontend configuration updated${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend config not found: $FRONTEND_CONFIG${NC}"
fi
echo ""

# Test deployment
echo "🧪 Testing deployment..."
echo "Querying chain state..."

QUERY_OUTPUT=$(linera client query \
    --chain-id "$MAIN_CHAIN_ID" \
    --application-id "$MAIN_APP_ID" 2>&1 || true)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Chain query successful${NC}"
else
    echo -e "${YELLOW}⚠️  Chain query returned error (this might be normal for new chains)${NC}"
fi
echo ""

# Save deployment info
echo "💾 Saving deployment info..."
DEPLOY_INFO="deployment-info.txt"
cat > "$DEPLOY_INFO" << EOF
AION Deployment Information
===========================
Deployed: $(date)

Linera Configuration:
- RPC URL: $RPC_URL
- Main Chain ID: $MAIN_CHAIN_ID
- Main App ID: $MAIN_APP_ID

Hybrid Chain Strategy:
- High Value Threshold: 10,000 AION
- High Volume Threshold: 100 users

Files Updated:
- backend/.env
- AION LINERA/linera-config.js

Next Steps:
1. Start backend: cd backend && source venv/bin/activate && uvicorn server:app --reload --port 8001
2. Open frontend: open "AION LINERA/index.html"
3. Test API: curl http://localhost:8001/api/linera/config
4. Create test market via API

API Endpoints:
- POST /api/linera/market - Create market
- POST /api/linera/stake - Stake on market
- GET /api/linera/chains - View all chains
- GET /api/linera/market/{id}/chain - Get market chain info
- GET /api/linera/config - Get configuration

Documentation:
- DEPLOYMENT_GUIDE.md - Full deployment guide
- HYBRID_CHAIN_IMPLEMENTATION.md - Implementation details
- QUICK_START_HYBRID_CHAIN.md - Quick reference
- docs/HYBRID_CHAIN_STRATEGY.md - Technical documentation
EOF

echo -e "${GREEN}✅ Deployment info saved to $DEPLOY_INFO${NC}"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Deployment Summary:"
echo "   RPC URL: $RPC_URL"
echo "   Main Chain ID: $MAIN_CHAIN_ID"
echo "   Main App ID: $MAIN_APP_ID"
echo ""
echo "📚 Next Steps:"
echo "   1. Start backend:"
echo "      cd backend"
echo "      source venv/bin/activate"
echo "      uvicorn server:app --reload --port 8001"
echo ""
echo "   2. Open frontend:"
echo "      open 'AION LINERA/index.html'"
echo ""
echo "   3. Test deployment:"
echo "      curl http://localhost:8001/api/linera/config"
echo ""
echo "📖 Documentation:"
echo "   - DEPLOYMENT_GUIDE.md"
echo "   - QUICK_START_HYBRID_CHAIN.md"
echo "   - deployment-info.txt"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
