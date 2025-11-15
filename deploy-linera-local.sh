#!/bin/bash

# Deploy AION to Linera - Local Build Method
# Alternative when Docker image not available

set -e

echo "🚀 AION Linera Deployment (Local Build)"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Rust
echo "1️⃣ Checking prerequisites..."
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Rust not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Rust: $(rustc --version)${NC}"

# Check wasm32 target
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "   Installing wasm32 target..."
    rustup target add wasm32-unknown-unknown
fi
echo -e "${GREEN}✅ wasm32-unknown-unknown target ready${NC}"
echo ""

# Build WASM contract
echo "2️⃣ Building WASM contract..."
cd linera

if [ ! -f "Cargo.toml" ]; then
    echo -e "${RED}❌ Cargo.toml not found${NC}"
    exit 1
fi

echo "   Compiling contract (this may take a minute)..."
cargo build --release --target wasm32-unknown-unknown

WASM_PATH="target/wasm32-unknown-unknown/release/aion_prediction_market.wasm"
if [ ! -f "$WASM_PATH" ]; then
    echo -e "${RED}❌ WASM build failed${NC}"
    exit 1
fi

WASM_SIZE=$(ls -lh "$WASM_PATH" | awk '{print $5}')
echo -e "${GREEN}✅ WASM contract built ($WASM_SIZE)${NC}"
echo ""

cd ..

# Check if Linera CLI available
echo "3️⃣ Checking Linera CLI..."
if ! command -v linera &> /dev/null; then
    echo -e "${YELLOW}⚠️  Linera CLI not found${NC}"
    echo ""
    echo "Linera CLI is required for deployment."
    echo ""
    echo "Options:"
    echo "  1. Install from source (10-15 min): ./install-linera.sh"
    echo "  2. Use mock deployment for testing"
    echo ""
    read -p "Install Linera CLI now? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Linera CLI..."
        ./install-linera.sh
        
        # Add to PATH for this session
        export PATH="$(pwd)/linera-protocol/target/release:$PATH"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Skipping actual deployment${NC}"
        echo ""
        echo "📝 Mock Deployment Info:"
        echo ""
        
        # Generate mock IDs
        MOCK_CHAIN_ID="e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65"
        MOCK_APP_ID="e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65000000000000000000000000"
        
        echo "Chain ID (mock): $MOCK_CHAIN_ID"
        echo "App ID (mock): $MOCK_APP_ID"
        echo ""
        echo "✅ WASM contract is ready at:"
        echo "   linera/$WASM_PATH"
        echo ""
        echo "🔄 To deploy later:"
        echo "   1. Install Linera CLI: ./install-linera.sh"
        echo "   2. Run: linera wallet init --with-new-chain"
        echo "   3. Deploy: linera publish-and-create --bytecode-path linera/$WASM_PATH"
        echo ""
        exit 0
    fi
fi

echo -e "${GREEN}✅ Linera CLI found${NC}"
echo ""

# Initialize wallet
echo "4️⃣ Initializing Linera wallet..."
if [ ! -d "$HOME/.config/linera" ]; then
    echo "   Creating new wallet with chain..."
    linera wallet init --with-new-chain
    echo -e "${GREEN}✅ Wallet created${NC}"
else
    echo -e "${YELLOW}⚠️  Wallet already exists${NC}"
fi
echo ""

# Show wallet
echo "5️⃣ Wallet information:"
linera wallet show
echo ""

# Get chain ID
CHAIN_ID=$(linera wallet show | grep "Chain ID" | head -1 | awk '{print $3}')
if [ -z "$CHAIN_ID" ]; then
    echo -e "${RED}❌ Could not get Chain ID${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Chain ID: $CHAIN_ID${NC}"
echo ""

# Deploy contract
echo "6️⃣ Deploying contract..."
echo "   This may take a minute..."

DEPLOY_OUTPUT=$(linera publish-and-create \
    --bytecode-path "linera/$WASM_PATH" \
    2>&1)

echo "$DEPLOY_OUTPUT"

# Extract App ID
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -i "application" | grep -oE '[a-f0-9]{64}[0-9]{24}' | head -1)

if [ -z "$APP_ID" ]; then
    echo -e "${YELLOW}⚠️  Could not auto-extract App ID${NC}"
    echo "   Please copy it from output above"
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

# Update configuration files
echo "7️⃣ Updating configuration files..."

# Update backend/.env
if [ -f "backend/.env" ]; then
    cp backend/.env backend/.env.backup
    sed -i.bak "s/LINERA_MAIN_CHAIN_ID=.*/LINERA_MAIN_CHAIN_ID=$CHAIN_ID/" backend/.env
    sed -i.bak "s/LINERA_MAIN_APP_ID=.*/LINERA_MAIN_APP_ID=$APP_ID/" backend/.env
    rm backend/.env.bak
    echo -e "${GREEN}✅ Updated backend/.env${NC}"
fi

# Update frontend config
if [ -f "AION LINERA/linera-config.js" ]; then
    cp "AION LINERA/linera-config.js" "AION LINERA/linera-config.js.backup"
    sed -i.bak "s/chainId: '[^']*'/chainId: '$CHAIN_ID'/" "AION LINERA/linera-config.js"
    sed -i.bak "s/appId: '[^']*'/appId: '$APP_ID'/" "AION LINERA/linera-config.js"
    rm "AION LINERA/linera-config.js.bak"
    echo -e "${GREEN}✅ Updated AION LINERA/linera-config.js${NC}"
fi

echo ""

# Save deployment info
cat > DEPLOYMENT_INFO.txt << EOF
AION Linera Deployment
======================

Deployment Date: $(date)
Method: Local Build

Chain ID: $CHAIN_ID
App ID: $APP_ID

WASM Contract: linera/$WASM_PATH
WASM Size: $WASM_SIZE

Files Updated:
- backend/.env
- AION LINERA/linera-config.js

Backups:
- backend/.env.backup
- AION LINERA/linera-config.js.backup

Next Steps:
1. Restart backend
2. Test Linera integration
3. Verify deployment

Commands:
- Show wallet: linera wallet show
- Query state: linera query --chain-id $CHAIN_ID
EOF

echo -e "${GREEN}✅ Deployment info saved${NC}"
echo ""

# Success
echo "=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo ""
echo "📋 Summary:"
echo "  Chain ID: $CHAIN_ID"
echo "  App ID: $APP_ID"
echo "  WASM: $WASM_SIZE"
echo ""
echo "🔄 Next Steps:"
echo "  1. Restart backend:"
echo "     cd backend && source venv/bin/activate"
echo "     uvicorn server:app --reload --port 8001"
echo ""
echo "  2. Test integration:"
echo "     curl http://localhost:8001/api/linera/config"
echo ""
echo "📝 Details: DEPLOYMENT_INFO.txt"
echo ""
