@echo off
echo ========================================
echo AION Test Suite
echo ========================================
echo.

echo [1/3] Testing Rust contract...
cd linera
cargo test
if %errorlevel% neq 0 (
    echo ERROR: Rust tests failed
    exit /b 1
)
cd ..

echo.
echo [2/3] Testing Python backend...
cd backend
pytest tests/
if %errorlevel% neq 0 (
    echo ERROR: Python tests failed
    exit /b 1
)
cd ..

echo.
echo [3/3] Linting Python code...
cd backend
black --check .
flake8 .
cd ..

echo.
echo ========================================
echo All tests passed!
echo ========================================
