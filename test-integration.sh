#!/bin/bash

# AION Integration Test Script
# Verifies all components are working

echo "🧪 AION Integration Test"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $response, expected $expected)"
        ((FAILED++))
    fi
}

# Test backend running
echo "1️⃣ Backend Status"
echo "-------------------"
if curl -s http://localhost:8001/api/statistics > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo "   Start with: cd backend && source venv/bin/activate && uvicorn server:app --reload --port 8001"
    ((FAILED++))
    exit 1
fi
echo ""

# Test MongoDB
echo "2️⃣ MongoDB Status"
echo "-------------------"
if pgrep -x mongod > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ MongoDB is NOT running${NC}"
    echo "   Start with: brew services start mongodb-community"
    ((FAILED++))
fi
echo ""

# Test API endpoints
echo "3️⃣ API Endpoints"
echo "-------------------"
test_endpoint "Statistics" "http://localhost:8001/api/statistics" "200"
test_endpoint "Predictions" "http://localhost:8001/api/predictions" "200"
test_endpoint "AI Models" "http://localhost:8001/api/ai-models" "200"
test_endpoint "DAO Proposals" "http://localhost:8001/api/dao-proposals" "200"
echo ""

# Test data availability
echo "4️⃣ Data Availability"
echo "-------------------"

# Test predictions count
pred_count=$(curl -s http://localhost:8001/api/predictions | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
if [ "$pred_count" -ge "15" ]; then
    echo -e "${GREEN}✅ Predictions: $pred_count items${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Predictions: $pred_count items (expected 15+)${NC}"
    ((FAILED++))
fi

# Test AI models count
model_count=$(curl -s http://localhost:8001/api/ai-models | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
if [ "$model_count" -ge "5" ]; then
    echo -e "${GREEN}✅ AI Models: $model_count items${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ AI Models: $model_count items (expected 5+)${NC}"
    ((FAILED++))
fi

# Test proposals count
proposal_count=$(curl -s http://localhost:8001/api/dao-proposals | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
if [ "$proposal_count" -ge "3" ]; then
    echo -e "${GREEN}✅ DAO Proposals: $proposal_count items${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ DAO Proposals: $proposal_count items (expected 3+)${NC}"
    ((FAILED++))
fi
echo ""

# Test CORS
echo "5️⃣ CORS Configuration"
echo "-------------------"
cors_response=$(curl -s -H "Origin: null" -H "Access-Control-Request-Method: GET" -X OPTIONS http://localhost:8001/api/statistics -o /dev/null -w "%{http_code}")
if [ "$cors_response" = "200" ]; then
    echo -e "${GREEN}✅ CORS working (file:// protocol supported)${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ CORS not working (HTTP $cors_response)${NC}"
    ((FAILED++))
fi
echo ""

# Test frontend files
echo "6️⃣ Frontend Files"
echo "-------------------"
if [ -f "AION LINERA/index.html" ]; then
    echo -e "${GREEN}✅ index.html exists${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ index.html missing${NC}"
    ((FAILED++))
fi

if [ -f "AION LINERA/api.js" ]; then
    echo -e "${GREEN}✅ api.js exists${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ api.js missing${NC}"
    ((FAILED++))
fi

if grep -q "api.js" "AION LINERA/index.html"; then
    echo -e "${GREEN}✅ api.js included in HTML${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ api.js NOT included in HTML${NC}"
    ((FAILED++))
fi
echo ""

# Summary
echo "========================"
echo "📊 Test Summary"
echo "========================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo ""
    echo "✅ Frontend-Backend Integration: COMPLETE"
    echo ""
    echo "🚀 Ready to open static HTML:"
    echo "   open \"AION LINERA/index.html\""
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo ""
    echo "Please fix the issues above before proceeding."
    echo ""
    exit 1
fi
