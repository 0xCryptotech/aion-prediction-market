@echo off
echo ========================================
echo AION Linera Setup Script
echo ========================================
echo.

echo [1/4] Checking Rust installation...
rustc --version
if %errorlevel% neq 0 (
    echo ERROR: Rust not installed. Install from https://rustup.rs/
    exit /b 1
)

echo [2/4] Adding wasm32 target...
rustup target add wasm32-unknown-unknown

echo [3/4] Installing Linera CLI...
cargo install linera-cli

echo [4/4] Verifying installation...
linera --version

echo.
echo ========================================
echo Setup complete! Next steps:
echo 1. linera net up --local
echo 2. cd linera ^&^& cargo build --target wasm32-unknown-unknown --release
echo ========================================
