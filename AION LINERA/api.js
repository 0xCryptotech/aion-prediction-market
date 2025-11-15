/**
 * AION API Integration
 * Connects frontend to backend API
 */

// Configuration - Auto-detect environment
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' &&
                     !window.location.protocol.includes('file');

const API_CONFIG = {
    baseURL: isProduction 
        ? 'https://aion-backend-production.up.railway.app'  // Production backend
        : 'http://localhost:8001',  // Local backend
    timeout: 10000,
};

// Log current environment
console.log('🌍 Environment:', isProduction ? 'Production' : 'Local');
console.log('🔌 API URL:', API_CONFIG.baseURL);

// API Client
class AionAPI {
    constructor(baseURL = API_CONFIG.baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // ============ Predictions API ============

    /**
     * Get all predictions
     */
    async getPredictions(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/api/predictions?${params}`);
    }

    /**
     * Get prediction by ID
     */
    async getPrediction(id) {
        return this.request(`/api/predictions/${id}`);
    }

    /**
     * Stake on prediction
     */
    async stakePrediction(predictionId, data) {
        return this.request(`/api/predictions/${predictionId}/stake`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // ============ AI Models API ============

    /**
     * Get all AI models
     */
    async getAIModels() {
        return this.request('/api/ai-models');
    }

    /**
     * Get AI model by ID
     */
    async getAIModel(id) {
        return this.request(`/api/ai-models/${id}`);
    }

    // ============ DAO Governance API ============

    /**
     * Get all DAO proposals
     */
    async getProposals() {
        return this.request('/api/dao-proposals');
    }

    /**
     * Vote on proposal
     */
    async voteProposal(proposalId, vote) {
        return this.request(`/api/dao-proposals/${proposalId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ vote }),
        });
    }

    // ============ Statistics API ============

    /**
     * Get platform statistics
     */
    async getStatistics() {
        return this.request('/api/statistics');
    }

    // ============ Wallet API ============

    /**
     * Get wallet balance
     */
    async getWalletBalance(address) {
        return this.request(`/api/wallet/${address}/balance`);
    }

    // ============ Linera API ============

    /**
     * Get Linera configuration
     */
    async getLineraConfig() {
        return this.request('/api/linera/config');
    }

    /**
     * Get all chains
     */
    async getChains() {
        return this.request('/api/linera/chains');
    }

    /**
     * Get market chain info
     */
    async getMarketChain(marketId) {
        return this.request(`/api/linera/market/${marketId}/chain`);
    }

    /**
     * Create market on Linera
     */
    async createMarket(data, apiKey) {
        return this.request('/api/linera/market', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
            },
            body: JSON.stringify(data),
        });
    }

    /**
     * Stake on Linera
     */
    async stakeLinera(data) {
        return this.request('/api/linera/stake', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

// Create global API instance
const api = new AionAPI();

// ============ Data Loading Functions ============

/**
 * Load and display predictions
 */
async function loadPredictions(filters = {}) {
    try {
        showLoading('predictions');
        const predictions = await api.getPredictions(filters);
        displayPredictions(predictions);
        hideLoading('predictions');
        return predictions;
    } catch (error) {
        console.error('Failed to load predictions:', error);
        showError('predictions', 'Failed to load predictions');
        hideLoading('predictions');
        return [];
    }
}

/**
 * Load and display AI models
 */
async function loadAIModels() {
    try {
        showLoading('ai-models');
        const models = await api.getAIModels();
        displayAIModels(models);
        hideLoading('ai-models');
        return models;
    } catch (error) {
        console.error('Failed to load AI models:', error);
        showError('ai-models', 'Failed to load AI models');
        hideLoading('ai-models');
        return [];
    }
}

/**
 * Load and display DAO proposals
 */
async function loadProposals() {
    try {
        showLoading('proposals');
        const proposals = await api.getProposals();
        displayProposals(proposals);
        hideLoading('proposals');
        return proposals;
    } catch (error) {
        console.error('Failed to load proposals:', error);
        showError('proposals', 'Failed to load proposals');
        hideLoading('proposals');
        return [];
    }
}

/**
 * Load and display statistics
 */
async function loadStatistics() {
    try {
        const stats = await api.getStatistics();
        displayStatistics(stats);
        return stats;
    } catch (error) {
        console.error('Failed to load statistics:', error);
        return null;
    }
}

/**
 * Load Linera configuration
 */
async function loadLineraConfig() {
    try {
        const config = await api.getLineraConfig();
        console.log('Linera Config:', config);
        return config;
    } catch (error) {
        console.error('Failed to load Linera config:', error);
        return null;
    }
}

// ============ Display Functions ============

/**
 * Display predictions in marketplace
 */
function displayPredictions(predictions) {
    const container = document.getElementById('predictions-container');
    if (!container) return;

    if (!predictions || predictions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No predictions found</p>';
        return;
    }

    container.innerHTML = predictions.map(pred => `
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${pred.title}</h3>
                    <p class="text-sm text-gray-600 mb-3">${pred.description}</p>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">${pred.category}</span>
                        <span class="px-2 py-1 bg-${getStatusColor(pred.status)}-100 text-${getStatusColor(pred.status)}-600 text-xs rounded">${pred.status}</span>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-red-600">${pred.confidence_score}%</p>
                    <p class="text-xs text-gray-500">Confidence</p>
                </div>
            </div>
            <div class="border-t pt-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Total Stake</span>
                    <span class="text-sm font-semibold">${formatNumber(pred.total_stake)} AION</span>
                </div>
                <div class="flex items-center justify-between mb-4">
                    <span class="text-sm text-gray-600">Event Date</span>
                    <span class="text-sm">${formatDate(pred.event_date)}</span>
                </div>
                <button onclick="stakePrediction('${pred.id}')" class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Stake Now
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Display AI models in leaderboard
 */
function displayAIModels(models) {
    const container = document.getElementById('ai-models-container');
    if (!container) return;

    if (!models || models.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No AI models found</p>';
        return;
    }

    container.innerHTML = models.map((model, index) => `
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xl">
                    #${index + 1}
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900">${model.name}</h3>
                    <p class="text-sm text-gray-600">${model.model_type}</p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-red-600">${model.reputation_score}</p>
                    <p class="text-xs text-gray-500">Reputation</p>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4 text-center border-t pt-4">
                <div>
                    <p class="text-sm text-gray-600">Accuracy</p>
                    <p class="text-lg font-semibold">${model.accuracy_rate}%</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Predictions</p>
                    <p class="text-lg font-semibold">${model.total_predictions}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Earned</p>
                    <p class="text-lg font-semibold">${formatNumber(model.total_earned)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Display DAO proposals
 */
function displayProposals(proposals) {
    const container = document.getElementById('proposals-container');
    if (!container) return;

    if (!proposals || proposals.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No proposals found</p>';
        return;
    }

    container.innerHTML = proposals.map(proposal => `
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-2">${proposal.title}</h3>
            <p class="text-sm text-gray-600 mb-4">${proposal.description}</p>
            <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                    <span>For: ${proposal.votes_for}</span>
                    <span>Against: ${proposal.votes_against}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: ${calculateVotePercentage(proposal)}%"></div>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="voteProposal('${proposal.id}', true)" class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                    Vote For
                </button>
                <button onclick="voteProposal('${proposal.id}', false)" class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                    Vote Against
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Display statistics on dashboard
 */
function displayStatistics(stats) {
    if (!stats) return;

    // Update TVL
    const tvlElement = document.getElementById('stat-tvl');
    if (tvlElement) {
        tvlElement.textContent = `$${formatNumber(stats.total_value_locked)}`;
    }

    // Update active predictions
    const activePredElement = document.getElementById('stat-active');
    if (activePredElement) {
        activePredElement.textContent = stats.active_predictions;
    }

    // Update accuracy rate
    const accuracyElement = document.getElementById('stat-accuracy');
    if (accuracyElement) {
        accuracyElement.textContent = `${stats.accuracy_rate}%`;
    }

    // Update total users
    const usersElement = document.getElementById('stat-users');
    if (usersElement) {
        usersElement.textContent = formatNumber(stats.total_users);
    }
}

// ============ Utility Functions ============

function showLoading(section) {
    console.log(`Loading ${section}...`);
}

function hideLoading(section) {
    console.log(`Loaded ${section}`);
}

function showError(section, message) {
    console.error(`Error in ${section}:`, message);
    alert(`Error: ${message}`);
}

function getStatusColor(status) {
    const colors = {
        'active': 'green',
        'resolved': 'blue',
        'disputed': 'yellow',
        'pending': 'gray',
    };
    return colors[status.toLowerCase()] || 'gray';
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function calculateVotePercentage(proposal) {
    const total = proposal.votes_for + proposal.votes_against;
    if (total === 0) return 50;
    return (proposal.votes_for / total) * 100;
}

// ============ Action Functions ============

/**
 * Stake on a prediction
 */
async function stakePrediction(predictionId) {
    // Check if wallet is connected
    if (!window.ethereum || !window.ethereum.selectedAddress) {
        alert('Please connect your wallet first');
        return;
    }

    const amount = prompt('Enter stake amount (AION):');
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Invalid amount');
        return;
    }

    try {
        const result = await api.stakePrediction(predictionId, {
            amount: parseFloat(amount),
            wallet_address: window.ethereum.selectedAddress,
        });

        alert('Stake successful!');
        loadPredictions(); // Reload predictions
    } catch (error) {
        alert('Stake failed: ' + error.message);
    }
}

/**
 * Vote on a proposal
 */
async function voteProposal(proposalId, vote) {
    // Check if wallet is connected
    if (!window.ethereum || !window.ethereum.selectedAddress) {
        alert('Please connect your wallet first');
        return;
    }

    try {
        const result = await api.voteProposal(proposalId, vote);
        alert('Vote submitted!');
        loadProposals(); // Reload proposals
    } catch (error) {
        alert('Vote failed: ' + error.message);
    }
}

// ============ Initialize on Page Load ============

document.addEventListener('DOMContentLoaded', async () => {
    console.log('AION API initialized');
    
    // Load initial data
    await loadStatistics();
    await loadPredictions();
    await loadAIModels();
    await loadProposals();
    await loadLineraConfig();
    
    console.log('Initial data loaded');
});

// Export for use in other scripts
window.AionAPI = api;
