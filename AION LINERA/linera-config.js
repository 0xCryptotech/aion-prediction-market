/**
 * Linera Configuration for AION
 * Hybrid Chain Strategy Implementation
 */

const LineraConfig = {
  // RPC endpoint
  rpcUrl: 'http://localhost:8080',
  
  // Main chain for governance and global state
  mainChain: {
    chainId: 'default',
    appId: '', // Set after deployment
    purpose: 'Governance, user registry, global state'
  },
  
  // Chain allocation thresholds
  thresholds: {
    highValue: 10000,      // AION tokens
    highVolume: 100        // participants
  },
  
  // Chain types
  chainTypes: {
    MAIN: 'main',
    DEDICATED: 'dedicated',
    SHARED: 'shared'
  },
  
  /**
   * Determine if market should use dedicated chain
   */
  shouldUseDedicatedChain(totalStake, participantCount) {
    return totalStake >= this.thresholds.highValue || 
           participantCount >= this.thresholds.highVolume;
  },
  
  /**
   * Get chain type for display
   */
  getChainTypeLabel(type) {
    const labels = {
      'main': '🏛️ Main Chain',
      'dedicated': '⚡ Dedicated Chain',
      'shared': '🔗 Shared Chain'
    };
    return labels[type] || 'Unknown';
  },
  
  /**
   * Get chain info for a market
   */
  async getMarketChainInfo(marketId) {
    try {
      const response = await fetch(`http://localhost:8001/api/linera/market/${marketId}/chain`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get chain info:', error);
      return null;
    }
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LineraConfig;
}
