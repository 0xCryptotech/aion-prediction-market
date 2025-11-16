#!/usr/bin/env python3
"""
AION Onchain Complete Testing Script
Tests all API endpoints and generates report
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8001"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}{text:^60}{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_test(name):
    print(f"{Colors.YELLOW}🧪 Testing: {name}{Colors.END}")

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.END}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.END}")

def print_info(message):
    print(f"   {message}")

# Test Results
results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def test_health_check():
    """Test 1: Health Check"""
    print_test("Health Check")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        data = response.json()
        
        assert response.status_code == 200, "Status code not 200"
        assert data.get("status") == "operational", "Status not operational"
        assert data.get("mode") == "Fully Onchain", "Mode incorrect"
        
        print_success("Health check passed")
        print_info(f"Status: {data['status']}")
        print_info(f"Mode: {data['mode']}")
        results["passed"] += 1
        results["tests"].append({"name": "Health Check", "status": "PASS"})
        return True
    except Exception as e:
        print_error(f"Health check failed: {e}")
        results["failed"] += 1
        results["tests"].append({"name": "Health Check", "status": "FAIL", "error": str(e)})
        return False

def test_blockchain_info():
    """Test 2: Blockchain Info"""
    print_test("Blockchain Info")
    try:
        response = requests.get(f"{BASE_URL}/api/blockchain/info", timeout=5)
        data = response.json()
        
        assert response.status_code == 200, "Status code not 200"
        assert "chain_id" in data, "Chain ID missing"
        assert "app_id" in data, "App ID missing"
        assert "network" in data, "Network missing"
        
        print_success("Blockchain info retrieved")
        print_info(f"Chain ID: {data['chain_id'][:20]}...")
        print_info(f"Network: {data['network']}")
        print_info(f"Explorer: {data.get('explorer', 'N/A')[:50]}...")
        results["passed"] += 1
        results["tests"].append({"name": "Blockchain Info", "status": "PASS"})
        return True
    except Exception as e:
        print_error(f"Blockchain info failed: {e}")
        results["failed"] += 1
        results["tests"].append({"name": "Blockchain Info", "status": "FAIL", "error": str(e)})
        return False

def test_create_market():
    """Test 3: Create Market"""
    print_test("Create Market (Onchain Transaction)")
    try:
        market_id = f"test-{int(time.time())}"
        payload = {
            "market_id": market_id,
            "title": "Automated Test Market",
            "description": "Testing market creation from Python script",
            "category": "crypto",
            "event_date": 1735689600
        }
        
        response = requests.post(
            f"{BASE_URL}/api/markets",
            json=payload,
            timeout=10
        )
        data = response.json()
        
        assert response.status_code == 200, f"Status code {response.status_code}"
        assert data.get("success") == True, "Success not true"
        assert "txHash" in data, "Transaction hash missing"
        assert "blockNumber" in data, "Block number missing"
        assert data["txHash"].startswith("0x"), "Invalid transaction hash"
        
        print_success("Market created successfully")
        print_info(f"Market ID: {data['market_id']}")
        print_info(f"TX Hash: {data['txHash'][:30]}...")
        print_info(f"Block: {data['blockNumber']}")
        results["passed"] += 1
        results["tests"].append({"name": "Create Market", "status": "PASS", "market_id": market_id})
        return market_id
    except Exception as e:
        print_error(f"Create market failed: {e}")
        results["failed"] += 1
        results["tests"].append({"name": "Create Market", "status": "FAIL", "error": str(e)})
        return None

def test_place_stake(market_id):
    """Test 4: Place Stake"""
    if not market_id:
        print_error("Skipping stake test (no market ID)")
        results["tests"].append({"name": "Place Stake", "status": "SKIP"})
        return False
    
    print_test("Place Stake (Onchain Transaction)")
    try:
        payload = {
            "user_id": "test-user-123",
            "amount": 1000,
            "prediction": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/markets/{market_id}/stake",
            json=payload,
            timeout=10
        )
        data = response.json()
        
        assert response.status_code == 200, f"Status code {response.status_code}"
        assert data.get("success") == True, "Success not true"
        assert "txHash" in data, "Transaction hash missing"
        assert "blockNumber" in data, "Block number missing"
        
        print_success("Stake placed successfully")
        print_info(f"Market: {data['market_id']}")
        print_info(f"TX Hash: {data['txHash'][:30]}...")
        print_info(f"Block: {data['blockNumber']}")
        results["passed"] += 1
        results["tests"].append({"name": "Place Stake", "status": "PASS"})
        return True
    except Exception as e:
        print_error(f"Place stake failed: {e}")
        results["failed"] += 1
        results["tests"].append({"name": "Place Stake", "status": "FAIL", "error": str(e)})
        return False

def test_query_markets():
    """Test 5: Query Markets"""
    print_test("Query Markets (From Blockchain)")
    try:
        response = requests.get(f"{BASE_URL}/api/markets", timeout=5)
        data = response.json()
        
        assert response.status_code == 200, "Status code not 200"
        assert "markets" in data, "Markets key missing"
        assert "source" in data, "Source key missing"
        assert data["source"] == "blockchain", "Source not blockchain"
        
        print_success("Markets queried successfully")
        print_info(f"Source: {data['source']}")
        print_info(f"Markets count: {len(data['markets'])}")
        print_info(f"Chain ID: {data.get('chainId', 'N/A')[:20]}...")
        results["passed"] += 1
        results["tests"].append({"name": "Query Markets", "status": "PASS"})
        return True
    except Exception as e:
        print_error(f"Query markets failed: {e}")
        results["failed"] += 1
        results["tests"].append({"name": "Query Markets", "status": "FAIL", "error": str(e)})
        return False

def test_platform_stats():
    """Test 6: Platform Stats"""
    print_test("Platform Statistics (From Blockchain)")
    try:
        response = requests.get(f"{BASE_URL}/api/stats", timeout=5)
        data = response.json()
        
        assert response.status_code == 200, "Status code not 200"
        assert "source" in data, "Source key missing"
        assert data["source"] == "blockchain", "Source not blockchain"
        
        print_success("Stats retrieved successfully")
        print_info(f"Source: {data['source']}")
        print_info(f"Chain ID: {data.get('chainId', 'N/A')[:20]}...")
        results["passed"] += 1
        results["tests"].append({"name": "Platform Stats", "status": "PASS"})
        return True
    except Exception as e:
        print_error(f"Platform stats failed: {e}")
        results["failed"] += 1
        results["tests"].append({"name": "Platform Stats", "status": "FAIL", "error": str(e)})
        return False

def generate_report():
    """Generate test report"""
    print_header("TEST REPORT")
    
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Base URL: {BASE_URL}")
    print()
    
    print(f"Total Tests: {results['passed'] + results['failed']}")
    print(f"{Colors.GREEN}Passed: {results['passed']}{Colors.END}")
    print(f"{Colors.RED}Failed: {results['failed']}{Colors.END}")
    print()
    
    print("Test Details:")
    for test in results["tests"]:
        status_color = Colors.GREEN if test["status"] == "PASS" else Colors.RED
        status_icon = "✅" if test["status"] == "PASS" else "❌"
        print(f"  {status_icon} {test['name']}: {status_color}{test['status']}{Colors.END}")
        if "error" in test:
            print(f"     Error: {test['error']}")
    
    print()
    
    if results["failed"] == 0:
        print(f"{Colors.GREEN}{'='*60}{Colors.END}")
        print(f"{Colors.GREEN}🎉 ALL TESTS PASSED! 🎉{Colors.END}")
        print(f"{Colors.GREEN}{'='*60}{Colors.END}")
    else:
        print(f"{Colors.RED}{'='*60}{Colors.END}")
        print(f"{Colors.RED}⚠️  SOME TESTS FAILED ⚠️{Colors.END}")
        print(f"{Colors.RED}{'='*60}{Colors.END}")

def main():
    """Run all tests"""
    print_header("🎉 AION ONCHAIN TESTING")
    
    print(f"Testing backend at: {BASE_URL}")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Check if backend is running
    try:
        requests.get(BASE_URL, timeout=2)
    except:
        print_error("Backend not responding!")
        print_info("Make sure backend is running:")
        print_info("  cd backend && source venv/bin/activate")
        print_info("  uvicorn server_onchain:app --reload --port 8001")
        return
    
    # Run tests
    test_health_check()
    time.sleep(0.5)
    
    test_blockchain_info()
    time.sleep(0.5)
    
    market_id = test_create_market()
    time.sleep(0.5)
    
    test_place_stake(market_id)
    time.sleep(0.5)
    
    test_query_markets()
    time.sleep(0.5)
    
    test_platform_stats()
    
    # Generate report
    generate_report()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Testing interrupted by user{Colors.END}")
    except Exception as e:
        print(f"\n{Colors.RED}Unexpected error: {e}{Colors.END}")
