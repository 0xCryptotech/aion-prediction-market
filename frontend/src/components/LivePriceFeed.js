import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

const PRICE_FEEDS = {
    BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'
};

const PYTH_HERMES_URL = 'https://hermes.pyth.network';

const LivePriceFeed = () => {
    const [prices, setPrices] = useState({
        BTC: { price: 67234.50, change: 2.34, loading: true },
        ETH: { price: 3456.78, change: 1.87, loading: true },
        SOL: { price: 142.50, change: -0.52, loading: true }
    });

    const fetchPythPrice = async (symbol, priceId) => {
        try {
            const response = await fetch(`${PYTH_HERMES_URL}/api/latest_price_feeds?ids[]=${priceId}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const priceData = data[0];
                const price = parseFloat(priceData.price.price) * Math.pow(10, priceData.price.expo);
                return price;
            }
        } catch (error) {
            console.error(`Error fetching ${symbol} price:`, error);
        }
        return null;
    };

    const updatePrices = async () => {
        const newPrices = { ...prices };
        
        for (const [symbol, priceId] of Object.entries(PRICE_FEEDS)) {
            const newPrice = await fetchPythPrice(symbol, priceId);
            if (newPrice) {
                const oldPrice = prices[symbol].price;
                const change = oldPrice ? ((newPrice - oldPrice) / oldPrice) * 100 : 0;
                
                newPrices[symbol] = {
                    price: newPrice,
                    change: change,
                    loading: false
                };
            }
        }
        
        setPrices(newPrices);
    };

    useEffect(() => {
        updatePrices();
        const interval = setInterval(updatePrices, 5000);
        return () => clearInterval(interval);
    }, []);

    const PriceCard = ({ symbol, icon, data }) => {
        const isPositive = data.change >= 0;
        
        return (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <span className="text-white font-semibold">{symbol}/USD</span>
                    </div>
                    <span className={`text-sm flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {isPositive ? '+' : ''}{data.change.toFixed(2)}%
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-white text-2xl font-bold">
                        ${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-gray-400">
                        {data.loading ? 'Loading...' : 'Live'}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 backdrop-blur-md rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Live Price Feed
                <span className="ml-auto text-xs text-gray-400">Powered by Pyth</span>
            </h2>
            <div className="space-y-3">
                <PriceCard symbol="BTC" icon="₿" data={prices.BTC} />
                <PriceCard symbol="ETH" icon="Ξ" data={prices.ETH} />
                <PriceCard symbol="SOL" icon="◎" data={prices.SOL} />
            </div>
        </div>
    );
};

export default LivePriceFeed;
