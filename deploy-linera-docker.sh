#!/bin/bash

# Deploy AION to Linera using Docker
# Fast deployment without building Linera from source

set -e

echo "🚀 AION Linera Deployment (Docker Method)"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Docker
echo "1️⃣ Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found${NC}"
    echo "   Install from: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo -e "${GREEN}✅ Docker found: $(docker --version)${NC}"
echo ""

# Pull Linera image
echo "2️⃣ Pulling Linera Docker image..."
docker pull ghcr.io/linera-io/linera:latest
echo ""

# Build WASM contract
echo "3️⃣ Building WASM contract..."
cd linera
if [ ! -f "Cargo.toml" ]; then
    echo -e "${RED}❌ Cargo.toml not found in linera/${NC}"
    exit 1
fi

echo "   Installing wasm32 target..."
rustup target add wasm32-unknown-unknown

echo "   Building contract..."
cargo build --release --target wasm32-unknown-unknown

if [ ! -f "target/wasm32-unknown-unknown/release/aion_prediction_market.wasm" ]; then
    echo -e "${RED}❌ WASM build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ WASM contract built${NC}"
echo ""

cd ..

# Create Linera alias function
linera_docker() {
    docker run --rm \
        -v "$(pwd):/workspace" \
        -v "$HOME/.config/linera:/root/.config/linera" \
        -w /workspace \
        ghcr.io/linera-io/linera:latest \
        linera "$@"
}

# Initialize wallet if needed
echo "4️⃣ Initializing Linera wallet..."
if [ ! -d "$HOME/.config/linera" ]; then
    echo "   Creating new wallet..."
    linera_docker wallet init --with-new-chain
    echo -e "${GREEN}✅ Wallet created${NC}"
else
    echo -e "${YELLOW}⚠️  Wallet already exists${NC}"
fi
echo ""

# Show wallet info
echo "5️⃣ Wallet information:"
linera_docker wallet show
echo ""

# Get chain ID
echo "6️⃣ Getting Chain ID..."
CHAIN_ID=$(linera_docker wallet show | grep "Chain ID" | head -1 | awk '{print $3}')
if [ -z "$CHAIN_ID" ]; then
    echo -e "${RED}❌ Could not get Chain ID${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Chain ID: $CHAIN_ID${NC}"
echo ""

# Deploy contract
echo "7️⃣ Deploying contract to Linera..."
echo "   This may take a minute..."

DEPLOY_OUTPUT=$(linera_docker publish-and-create \
    --bytecode-path linera/target/wasm32-unknown-unknown/release/aion_prediction_market.wasm \
    2>&1)

echo "$DEPLOY_OUTPUT"

# Extract App ID
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -i "application" | grep -oE '[a-f0-9]{64}[0-9]{24}' | head -1)

if [ -z "$APP_ID" ]; then
    echo -e "${YELLOW}⚠️  Could not auto-extract App ID${NC}"
    echo "   Please copy it manually from output above"
    echo ""
    read -p "Enter App ID: " APP_ID
fi

echo ""
echo -e "${GREEN}✅ Contract deployed!${NC}"
echo ""

# Display IDs
echo "=========================================="
echo "📋 Deployment Information"
echo "=========================================="
echo ""
echo "Chain ID:"
echo "  $CHAIN_ID"
echo ""
echo "App ID:"
echo "  $APP_ID"
echo ""

# Update .env files
echo "8️⃣ Updating configuration files..."

# Update backend/.env
if [ -f "backend/.env" ]; then
    # Backup
    cp backend/.env backend/.env.backup
    
    # Update Chain ID
    sed -i.bak "s/LINERA_MAIN_CHAIN_ID=.*/LINERA_MAIN_CHAIN_ID=$CHAIN_ID/" backend/.env
    
    # Update App ID
    sed -i.bak "s/LINERA_MAIN_APP_ID=.*/LINERA_MAIN_APP_ID=$APP_ID/" backend/.env
    
    rm backend/.env.bak
    echo -e "${GREEN}✅ Updated backend/.env${NC}"
fi

# Update frontend config
if [ -f "AION LINERA/linera-config.js" ]; then
    # Backup
    cp "AION LINERA/linera-config.js" "AION LINERA/linera-config.js.backup"
    
    # Update Chain ID
    sed -i.bak "s/chainId: '[^']*'/chainId: '$CHAIN_ID'/" "AION LINERA/linera-config.js"
    
    # Update App ID
    sed -i.bak "s/appId: '[^']*'/appId: '$APP_ID'/" "AION LINERA/linera-config.js"
    
    rm "AION LINERA/linera-config.js.bak"
    echo -e "${GREEN}✅ Updated AION LINERA/linera-config.js${NC}"
fi

echo ""

# Verify deployment
echo "9️⃣ Verifying deployment..."
linera_docker wallet show
echo ""

# Save deployment info
cat > DEPLOYMENT_INFO.txt << EOF
AION Linera Deployment
======================

Deployment Date: $(date)

Chain ID: $CHAIN_ID
App ID: $APP_ID

RPC URL: http://localhost:8080

Files Updated:
- backend/.env
- AION LINERA/linera-config.js

Backups Created:
- backend/.env.backup
- AION LINERA/linera-config.js.backup

Next Steps:
1. Restart backend: cd backend && uvicorn server:app --reload --port 8001
2. Test deployment: curl http://localhost:8001/api/linera/config
3. Open frontend: open http://localhost:8080

Linera Commands:
- Show wallet: docker run --rm -v ~/.config/linera:/root/.config/linera ghcr.io/linera-io/linera:latest linera wallet show
- Query state: docker run --rm -v ~/.config/linera:/root/.config/linera ghcr.io/linera-io/linera:latest linera query --chain-id $CHAIN_ID
EOF

echo -e "${GREEN}✅ Deployment info saved to DEPLOYMENT_INFO.txt${NC}"
echo ""

# Success message
echo "=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo ""
echo "📋 Summary:"
echo "  Chain ID: $CHAIN_ID"
echo "  App ID: $APP_ID"
echo ""
echo "📁 Files Updated:"
echo "  ✅ backend/.env"
echo "  ✅ AION LINERA/linera-config.js"
echo ""
echo "🔄 Next Steps:"
echo "  1. Restart backend:"
echo "     cd backend && source venv/bin/activate && uvicorn server:app --reload --port 8001"
echo ""
echo "  2. Test Linera integration:"
echo "     curl http://localhost:8001/api/linera/config"
echo ""
echo "  3. Open frontend:"
echo "     open http://localhost:8080"
echo ""
echo "📝 Deployment details saved in: DEPLOYMENT_INFO.txt"
echo ""
