#!/bin/bash

# Install Linera CLI from source
# This will take some time (10-15 minutes)

echo "🚀 Installing Linera CLI from source..."
echo ""

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust not found. Please install Rust first:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

echo "✅ Rust found: $(rustc --version)"
echo ""

# Check if wasm32 target is installed
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "📦 Installing wasm32-unknown-unknown target..."
    rustup target add wasm32-unknown-unknown
fi

echo ""
echo "📥 Cloning Linera Protocol repository..."
echo "   This may take a few minutes..."
echo ""

# Clone Linera repository if not exists
if [ ! -d "linera-protocol" ]; then
    git clone https://github.com/linera-io/linera-protocol.git
    cd linera-protocol
else
    echo "✅ Repository already exists, updating..."
    cd linera-protocol
    git pull
fi

echo ""
echo "🔨 Building Linera CLI..."
echo "   This will take 10-15 minutes..."
echo "   ☕ Time for coffee!"
echo ""

# Build Linera service (includes CLI)
cargo build --release -p linera-service

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Linera CLI built successfully!"
    echo ""
    echo "📍 Binary location:"
    echo "   $(pwd)/target/release/linera"
    echo ""
    echo "🔧 To use Linera CLI, add to PATH:"
    echo "   export PATH=\"$(pwd)/target/release:\$PATH\""
    echo ""
    echo "   Or add to your ~/.zshrc:"
    echo "   echo 'export PATH=\"$(pwd)/target/release:\$PATH\"' >> ~/.zshrc"
    echo "   source ~/.zshrc"
    echo ""
    echo "✅ Verify installation:"
    echo "   $(pwd)/target/release/linera --version"
    echo ""
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi
