// Pyth Network Integration for Live Price Feed
// Price Feed IDs from Pyth Network
const PRICE_FEEDS = {
    BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD
    ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD
    SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'  // SOL/USD
};

// Pyth Hermes API endpoint (mainnet)
const PYTH_HERMES_URL = 'https://hermes.pyth.network';

// Function to fetch price from Pyth Network
async function fetchPythPrice(priceId) {
    try {
        const response = await fetch(`${PYTH_HERMES_URL}/api/latest_price_feeds?ids[]=${priceId}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const priceData = data[0];
            const price = parseFloat(priceData.price.price) * Math.pow(10, priceData.price.expo);
            const conf = parseFloat(priceData.price.conf) * Math.pow(10, priceData.price.expo);
            const publishTime = new Date(priceData.price.publish_time * 1000);
            
            return {
                price: price,
                confidence: conf,
                publishTime: publishTime
            };
        }
    } catch (error) {
        console.error('Error fetching Pyth price:', error);
        return null;
    }
}

// Function to update price display
function updatePriceDisplay(symbol, price, change) {
    const priceElement = document.getElementById(`${symbol.toLowerCase()}-price`);
    const changeElement = document.getElementById(`${symbol.toLowerCase()}-change`);
    const timeElement = document.getElementById(`${symbol.toLowerCase()}-time`);
    
    if (priceElement) {
        priceElement.textContent = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Add animation
        priceElement.classList.add('animate-pulse');
        setTimeout(() => priceElement.classList.remove('animate-pulse'), 500);
    }
    
    if (changeElement) {
        const isPositive = change >= 0;
        changeElement.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
        changeElement.className = `text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`;
    }
    
    if (timeElement) {
        timeElement.textContent = 'Live';
    }
}

// Store previous prices for change calculation
let previousPrices = {
    BTC: null,
    ETH: null,
    SOL: null
};

// Function to update all prices
async function updateAllPrices() {
    // Update BTC
    const btcData = await fetchPythPrice(PRICE_FEEDS.BTC);
    if (btcData) {
        const change = previousPrices.BTC ? ((btcData.price - previousPrices.BTC) / previousPrices.BTC) * 100 : 2.34;
        updatePriceDisplay('BTC', btcData.price, change);
        previousPrices.BTC = btcData.price;
    }
    
    // Update ETH
    const ethData = await fetchPythPrice(PRICE_FEEDS.ETH);
    if (ethData) {
        const change = previousPrices.ETH ? ((ethData.price - previousPrices.ETH) / previousPrices.ETH) * 100 : 1.87;
        updatePriceDisplay('ETH', ethData.price, change);
        previousPrices.ETH = ethData.price;
    }
    
    // Update SOL
    const solData = await fetchPythPrice(PRICE_FEEDS.SOL);
    if (solData) {
        const change = previousPrices.SOL ? ((solData.price - previousPrices.SOL) / previousPrices.SOL) * 100 : -0.52;
        updatePriceDisplay('SOL', solData.price, change);
        previousPrices.SOL = solData.price;
    }
}

// Function to simulate AI predictions updates
function updateAIPredictions() {
    const predictions = [
        {
            model: '🤖 GPT-4 Oracle',
            pair: 'BTC/USD Next Hour',
            sentiment: 'Bullish',
            price: (67234 + Math.random() * 200 - 100).toFixed(2),
            confidence: (95 + Math.random() * 2).toFixed(1)
        },
        {
            model: '🧠 Claude Predictor',
            pair: 'ETH/USD Next Hour',
            sentiment: 'Bullish',
            price: (3456 + Math.random() * 50 - 25).toFixed(2),
            confidence: (94 + Math.random() * 2).toFixed(1)
        },
        {
            model: '⚡ Llama Vision',
            pair: 'SOL/USD Next Hour',
            sentiment: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
            price: (142.50 + Math.random() * 10 - 5).toFixed(2),
            confidence: (90 + Math.random() * 3).toFixed(1)
        }
    ];
    
    const container = document.getElementById('live-predictions');
    if (container) {
        container.innerHTML = predictions.map(pred => {
            const isBullish = pred.sentiment === 'Bullish';
            return `
                <div class="bg-white/5 border border-white/10 rounded-lg p-4 animate-pulse">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-white font-semibold text-sm">${pred.model}</span>
                        <span class="${isBullish ? 'text-green-400' : 'text-red-400'} text-xs">${isBullish ? '▲' : '▼'} ${pred.sentiment}</span>
                    </div>
                    <div class="text-gray-400 text-xs mb-2">${pred.pair}</div>
                    <div class="flex items-center justify-between">
                        <span class="text-white font-bold">$${parseFloat(pred.price).toLocaleString()}</span>
                        <span class="bg-${isBullish ? 'green' : 'red'}-500/20 text-${isBullish ? 'green' : 'red'}-400 px-2 py-1 rounded text-xs">${pred.confidence}%</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Remove animation class after a short delay
        setTimeout(() => {
            const elements = container.querySelectorAll('.animate-pulse');
            elements.forEach(el => el.classList.remove('animate-pulse'));
        }, 500);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Pyth Network integration...');
    
    // Initial update
    updateAllPrices();
    updateAIPredictions();
    
    // Update prices every 5 seconds
    setInterval(updateAllPrices, 5000);
    
    // Update AI predictions every 10 seconds
    setInterval(updateAIPredictions, 10000);
});
