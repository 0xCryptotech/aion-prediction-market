#!/bin/bash

# AION Onchain Complete Testing Script
# Tests all API endpoints

BASE_URL="http://localhost:8001"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

echo ""
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}           🎉 AION ONCHAIN TESTING${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""
echo "Testing backend at: $BASE_URL"
echo "Started at: $(date)"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}🧪 Test 1: Health Check${NC}"
RESPONSE=$(curl -s $BASE_URL/)
if echo "$RESPONSE" | grep -q "operational"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "   Status: operational"
    ((PASSED++))
else
    echo -e "${RED}❌ Health check failed${NC}"
    ((FAILED++))
fi
echo ""
sleep 0.5

# Test 2: Blockchain Info
echo -e "${YELLOW}🧪 Test 2: Blockchain Info${NC}"
RESPONSE=$(curl -s $BASE_URL/api/blockchain/info)
if echo "$RESPONSE" | grep -q "chain_id"; then
    echo -e "${GREEN}✅ Blockchain info retrieved${NC}"
    CHAIN_ID=$(echo "$RESPONSE" | grep -o '"chain_id":"[^"]*"' | cut -d'"' -f4 | cut -c1-20)
    echo "   Chain ID: ${CHAIN_ID}..."
    ((PASSED++))
else
    echo -e "${RED}❌ Blockchain info failed${NC}"
    ((FAILED++))
fi
echo ""
sleep 0.5

# Test 3: Create Market
echo -e "${YELLOW}🧪 Test 3: Create Market (Onchain Transaction)${NC}"
MARKET_ID="test-$(date +%s)"
RESPONSE=$(curl -s -X POST $BASE_URL/api/markets \
  -H "Content-Type: application/json" \
  -d "{
    \"market_id\": \"$MARKET_ID\",
    \"title\": \"Automated Test Market\",
    \"description\": \"Testing from bash script\",
    \"category\": \"crypto\",
    \"event_date\": 1735689600
  }")

if echo "$RESPONSE" | grep -q "txHash"; then
    echo -e "${GREEN}✅ Market created successfully${NC}"
    TX_HASH=$(echo "$RESPONSE" | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4 | cut -c1-30)
    BLOCK=$(echo "$RESPONSE" | grep -o '"blockNumber":[0-9]*' | cut -d':' -f2)
    echo "   Market ID: $MARKET_ID"
    echo "   TX Hash: ${TX_HASH}..."
    echo "   Block: $BLOCK"
    ((PASSED++))
else
    echo -e "${RED}❌ Market creation failed${NC}"
    echo "   Response: $RESPONSE"
    ((FAILED++))
    MARKET_ID=""
fi
echo ""
sleep 0.5

# Test 4: Place Stake
if [ -n "$MARKET_ID" ]; then
    echo -e "${YELLOW}🧪 Test 4: Place Stake (Onchain Transaction)${NC}"
    RESPONSE=$(curl -s -X POST $BASE_URL/api/markets/$MARKET_ID/stake \
      -H "Content-Type: application/json" \
      -d '{
        "user_id": "test-user-123",
        "amount": 1000,
        "prediction": true
      }')
    
    if echo "$RESPONSE" | grep -q "txHash"; then
        echo -e "${GREEN}✅ Stake placed successfully${NC}"
        TX_HASH=$(echo "$RESPONSE" | grep -o '"txHash":"[^"]*"' | cut -d'"' -f4 | cut -c1-30)
        BLOCK=$(echo "$RESPONSE" | grep -o '"blockNumber":[0-9]*' | cut -d':' -f2)
        echo "   TX Hash: ${TX_HASH}..."
        echo "   Block: $BLOCK"
        ((PASSED++))
    else
        echo -e "${RED}❌ Stake placement failed${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  Test 4: Skipped (no market ID)${NC}"
fi
echo ""
sleep 0.5

# Test 5: Query Markets
echo -e "${YELLOW}🧪 Test 5: Query Markets (From Blockchain)${NC}"
RESPONSE=$(curl -s $BASE_URL/api/markets)
if echo "$RESPONSE" | grep -q "blockchain"; then
    echo -e "${GREEN}✅ Markets queried successfully${NC}"
    echo "   Source: blockchain"
    ((PASSED++))
else
    echo -e "${RED}❌ Query markets failed${NC}"
    ((FAILED++))
fi
echo ""
sleep 0.5

# Test 6: Platform Stats
echo -e "${YELLOW}🧪 Test 6: Platform Statistics${NC}"
RESPONSE=$(curl -s $BASE_URL/api/stats)
if echo "$RESPONSE" | grep -q "blockchain"; then
    echo -e "${GREEN}✅ Stats retrieved successfully${NC}"
    echo "   Source: blockchain"
    ((PASSED++))
else
    echo -e "${RED}❌ Stats retrieval failed${NC}"
    ((FAILED++))
fi
echo ""

# Report
echo ""
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}                    TEST REPORT${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""
echo "Date: $(date)"
echo "Base URL: $BASE_URL"
echo ""
TOTAL=$((PASSED + FAILED))
echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}============================================================${NC}"
    echo -e "${GREEN}              🎉 ALL TESTS PASSED! 🎉${NC}"
    echo -e "${GREEN}============================================================${NC}"
    exit 0
else
    echo -e "${RED}============================================================${NC}"
    echo -e "${RED}              ⚠️  SOME TESTS FAILED ⚠️${NC}"
    echo -e "${RED}============================================================${NC}"
    exit 1
fi
