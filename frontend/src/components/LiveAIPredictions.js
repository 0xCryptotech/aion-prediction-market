import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';

const LiveAIPredictions = () => {
    const [predictions, setPredictions] = useState([
        {
            model: '🤖 GPT-4 Oracle',
            pair: 'BTC/USD Next Hour',
            sentiment: 'Bullish',
            price: 67234,
            confidence: 96.2
        },
        {
            model: '🧠 Claude Predictor',
            pair: 'ETH/USD Next Hour',
            sentiment: 'Bullish',
            price: 3456,
            confidence: 94.8
        },
        {
            model: '⚡ Llama Vision',
            pair: 'SOL/USD Next Hour',
            sentiment: 'Bearish',
            price: 142.50,
            confidence: 91.3
        }
    ]);

    const updatePredictions = () => {
        setPredictions(prev => prev.map(pred => ({
            ...pred,
            sentiment: Math.random() > 0.4 ? 'Bullish' : 'Bearish',
            price: pred.pair.includes('BTC') 
                ? (67234 + Math.random() * 200 - 100).toFixed(2)
                : pred.pair.includes('ETH')
                ? (3456 + Math.random() * 50 - 25).toFixed(2)
                : (142.50 + Math.random() * 10 - 5).toFixed(2),
            confidence: (90 + Math.random() * 8).toFixed(1)
        })));
    };

    useEffect(() => {
        const interval = setInterval(updatePredictions, 10000);
        return () => clearInterval(interval);
    }, []);

    const PredictionCard = ({ prediction }) => {
        const isBullish = prediction.sentiment === 'Bullish';
        
        return (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-sm">{prediction.model}</span>
                    <span className={`text-xs flex items-center gap-1 ${isBullish ? 'text-green-400' : 'text-red-400'}`}>
                        {isBullish ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {prediction.sentiment}
                    </span>
                </div>
                <div className="text-gray-400 text-xs mb-2">{prediction.pair}</div>
                <div className="flex items-center justify-between">
                    <span className="text-white font-bold">
                        ${parseFloat(prediction.price).toLocaleString()}
                    </span>
                    <span className={`${isBullish ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} px-2 py-1 rounded text-xs border`}>
                        {prediction.confidence}%
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 backdrop-blur-md rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Live AI Predictions
                <span className="ml-auto bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    LIVE
                </span>
            </h2>
            <div className="space-y-3">
                {predictions.map((pred, index) => (
                    <PredictionCard key={index} prediction={pred} />
                ))}
            </div>
        </div>
    );
};

export default LiveAIPredictions;
