use crate::{AionState, Market};
use linera_sdk::{base::Owner, Service, ServiceRuntime};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Query requests for AION service
#[derive(Debug, Serialize, Deserialize)]
pub enum AionQuery {
    /// Get all markets
    GetAllMarkets,
    
    /// Get a specific market by ID
    GetMarket { market_id: String },
    
    /// Get markets by category
    GetMarketsByCategory { category: String },
    
    /// Get user's stakes across all markets
    GetUserStakes { user: Owner },
    
    /// Get platform statistics
    GetStatistics,
}

/// Response types for queries
#[derive(Debug, Serialize, Deserialize)]
pub enum AionQueryResponse {
    Markets(Vec<Market>),
    Market(Option<Market>),
    UserStakes(HashMap<String, u128>),
    Statistics(PlatformStatistics),
}

/// Platform-wide statistics
#[derive(Debug, Serialize, Deserialize)]
pub struct PlatformStatistics {
    pub total_markets: usize,
    pub active_markets: usize,
    pub resolved_markets: usize,
    pub total_value_locked: u128,
    pub total_users: usize,
}

/// AION Service for queries
pub struct AionService {
    state: AionState,
}

impl Service for AionService {
    type Parameters = ();
    type Query = AionQuery;
    type QueryResponse = AionQueryResponse;

    async fn handle_query(
        &self,
        _runtime: ServiceRuntime<Self>,
        query: Self::Query,
    ) -> Self::QueryResponse {
        match query {
            AionQuery::GetAllMarkets => {
                let markets: Vec<Market> = self.state.markets.values().cloned().collect();
                AionQueryResponse::Markets(markets)
            }
            
            AionQuery::GetMarket { market_id } => {
                let market = self.state.markets.get(&market_id).cloned();
                AionQueryResponse::Market(market)
            }
            
            AionQuery::GetMarketsByCategory { category } => {
                let markets: Vec<Market> = self
                    .state
                    .markets
                    .values()
                    .filter(|m| m.category == category)
                    .cloned()
                    .collect();
                AionQueryResponse::Markets(markets)
            }
            
            AionQuery::GetUserStakes { user } => {
                let mut stakes = HashMap::new();
                
                for (market_id, market) in &self.state.markets {
                    if let Some(stake) = market.stakes.get(&user) {
                        stakes.insert(market_id.clone(), stake.amount);
                    }
                }
                
                AionQueryResponse::UserStakes(stakes)
            }
            
            AionQuery::GetStatistics => {
                let total_markets = self.state.markets.len();
                let active_markets = self
                    .state
                    .markets
                    .values()
                    .filter(|m| !m.resolved)
                    .count();
                let resolved_markets = total_markets - active_markets;
                
                let mut users = std::collections::HashSet::new();
                for market in self.state.markets.values() {
                    for user in market.stakes.keys() {
                        users.insert(user);
                    }
                }
                
                let stats = PlatformStatistics {
                    total_markets,
                    active_markets,
                    resolved_markets,
                    total_value_locked: self.state.total_value_locked,
                    total_users: users.len(),
                };
                
                AionQueryResponse::Statistics(stats)
            }
        }
    }
}
