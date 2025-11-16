/**
 * Test Helpers - Easy testing from browser console
 * Usage: Open console (F12) and call these functions
 */

// API Base URL
const API_URL = 'http://localhost:8001';

/**
 * Test 1: Create Market
 */
async function testCreateMarket(title = 'Test Market') {
    console.log('🧪 Testing: Create Market');
    
    const marketId = 'market-' + Date.now();
    const userId = userManager.getUserId();
    
    try {
        const response = await fetch(`${API_URL}/api/markets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                market_id: marketId,
                title: title,
                description: 'Testing from browser',
                category: 'crypto',
                event_date: 1735689600
            })
        });
        
        const data = await response.json();
        
        console.log('✅ Market Created!');
        console.log('   Market ID:', data.market_id);
        console.log('   TX Hash:', data.txHash);
        console.log('   Block:', data.blockNumber);
        console.log('   User:', userId);
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

/**
 * Test 2: Place Stake
 */
async function testPlaceStake(marketId, amount = 1000, prediction = true) {
    console.log('🧪 Testing: Place Stake');
    
    const userId = userManager.getUserId();
    
    try {
        const response = await fetch(`${API_URL}/api/markets/${marketId}/stake`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                amount: amount,
                prediction: prediction
            })
        });
        
        const data = await response.json();
        
        console.log('✅ Stake Placed!');
        console.log('   Market:', data.market_id);
        console.log('   Amount:', amount);
        console.log('   Prediction:', prediction ? 'YES' : 'NO');
        console.log('   TX Hash:', data.txHash);
        console.log('   Block:', data.blockNumber);
        console.log('   User:', userId);
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

/**
 * Test 3: Get All Markets
 */
async function testGetMarkets() {
    console.log('🧪 Testing: Get Markets');
    
    try {
        const response = await fetch(`${API_URL}/api/markets`);
        const data = await response.json();
        
        console.log('✅ Markets Retrieved!');
        console.log('   Count:', data.markets.length);
        console.log('   Source:', data.source);
        console.log('   Chain ID:', data.chainId?.substring(0, 20) + '...');
        
        if (data.markets.length > 0) {
            console.log('   Markets:', data.markets);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

/**
 * Test 4: Get Blockchain Info
 */
async function testBlockchainInfo() {
    console.log('🧪 Testing: Blockchain Info');
    
    try {
        const response = await fetch(`${API_URL}/api/blockchain/info`);
        const data = await response.json();
        
        console.log('✅ Blockchain Info:');
        console.log('   Chain ID:', data.chain_id?.substring(0, 20) + '...');
        console.log('   Network:', data.network);
        console.log('   Explorer:', data.explorer);
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

/**
 * Test 5: Full Flow
 */
async function testFullFlow() {
    console.log('🎯 Running Full Test Flow...\n');
    
    // 1. Check blockchain
    await testBlockchainInfo();
    console.log('');
    
    // 2. Create market
    const market = await testCreateMarket('Full Flow Test Market');
    if (!market) return;
    console.log('');
    
    // 3. Place stake YES
    await testPlaceStake(market.market_id, 1000, true);
    console.log('');
    
    // 4. Place stake NO
    await testPlaceStake(market.market_id, 500, false);
    console.log('');
    
    // 5. Get all markets
    await testGetMarkets();
    console.log('');
    
    console.log('🎉 Full Flow Complete!');
}

/**
 * Show User Info
 */
function showUserInfo() {
    console.log('👤 Current User Info:');
    console.log('   User ID:', userManager.getUserId());
    console.log('   Display:', userManager.getDisplayName());
}

/**
 * Reset User
 */
function resetUser() {
    const newId = userManager.resetUser();
    console.log('🔄 User Reset!');
    console.log('   New ID:', newId);
}

/**
 * Show Help
 */
function showTestHelp() {
    console.log('🧪 AION Test Helpers\n');
    console.log('Available Commands:');
    console.log('  testCreateMarket()           - Create a test market');
    console.log('  testPlaceStake(marketId)     - Place stake on market');
    console.log('  testGetMarkets()             - Get all markets');
    console.log('  testBlockchainInfo()         - Get blockchain info');
    console.log('  testFullFlow()               - Run complete test');
    console.log('  showUserInfo()               - Show current user');
    console.log('  resetUser()                  - Reset user ID');
    console.log('  showTestHelp()               - Show this help\n');
    console.log('Example:');
    console.log('  testCreateMarket("Bitcoin $100K?")');
    console.log('  testPlaceStake("market-123", 1000, true)');
}

// Show help on load
console.log('');
console.log('🧪 Test Helpers Loaded!');
console.log('   Type: showTestHelp() for commands');
console.log('');

// Make functions available globally
window.testCreateMarket = testCreateMarket;
window.testPlaceStake = testPlaceStake;
window.testGetMarkets = testGetMarkets;
window.testBlockchainInfo = testBlockchainInfo;
window.testFullFlow = testFullFlow;
window.showUserInfo = showUserInfo;
window.resetUser = resetUser;
window.showTestHelp = showTestHelp;
