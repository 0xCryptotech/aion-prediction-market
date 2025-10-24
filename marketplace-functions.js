// Marketplace Functions
function filterMarket(category) {
    alert(`Filtering by: ${category}`);
}

function showItemDetail(itemId) {
    const items = {
        ai1: {name: 'GPT-5 Oracle Pro', price: '850 AION', desc: 'AI Predictor Lv.5 — Boosts accuracy by 25%', rarity: 'LEGENDARY'},
        boost1: {name: 'Speed Predictor', price: '320 AION', desc: 'Speed Booster — Reduces prediction time by 50%', rarity: 'RARE'},
        nft1: {name: 'Bull Avatar #142', price: '580 AION', desc: 'Limited NFT — Increases rewards by 10%', rarity: 'EPIC'},
        ai2: {name: 'Basic AI Predictor', price: '120 AION', desc: 'Starter AI — Boosts accuracy by 5%', rarity: 'COMMON'},
        boost2: {name: 'Profit Multiplier', price: '450 AION', desc: 'Reward Booster — 2x rewards for 12h', rarity: 'RARE'},
        nft2: {name: 'Bear Mask #89', price: '380 AION', desc: 'Collectible NFT — +8% XP gain', rarity: 'RARE'}
    };
    
    const item = items[itemId];
    if (!item) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black border-2 border-red-500 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 class="text-3xl font-bold mb-2 text-white">${item.name}</h3>
            <p class="text-gray-400 mb-4">${item.desc}</p>
            <div class="bg-white/5 rounded-lg p-4 mb-4">
                <div class="flex justify-between mb-2">
                    <span class="text-gray-400">Rarity:</span>
                    <span class="text-yellow-400 font-bold">${item.rarity}</span>
                </div>
                <div class="flex justify-between mb-2">
                    <span class="text-gray-400">Price:</span>
                    <span class="text-green-400 font-bold">${item.price}</span>
                </div>
            </div>
            <div class="flex gap-3">
                <button onclick="buyItem('${itemId}')" class="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold">
                    Buy Now
                </button>
                <button onclick="closeModal()" class="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 font-bold">
                    Cancel
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function buyItem(itemId) {
    if (!isConnected) {
        alert('Please connect your wallet first!');
        return;
    }
    closeModal();
    alert('✅ Purchase successful! Item added to your inventory.');
}
