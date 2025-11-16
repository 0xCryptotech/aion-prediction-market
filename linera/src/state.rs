// AION State - Simplified

use linera_sdk::{
    base::Owner,
    views::{MapView, RegisterView, RootView, View},
};
use serde::{Deserialize, Serialize};

/// Market
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Market {
    pub id: String,
    pub title: String,
    pub description: String,
    pub category: String,
    pub event_date: u64,
    pub creator: Owner,
    pub total_stake_yes: u128,
    pub total_stake_no: u128,
    pub resolved: bool,
    pub outcome: Option<bool>,
}

/// Stake
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stake {
    pub amount: u128,
    pub prediction: bool,
}

/// State
#[derive(RootView)]
pub struct AionState {
    pub markets: MapView<String, Market>,
    pub stakes: MapView<(String, Owner), Stake>,
    pub tvl: RegisterView<u128>,
}

impl AionState {
    pub async fn create_market(
        &mut self,
        market_id: String,
        title: String,
        description: String,
        category: String,
        event_date: u64,
        creator: Owner,
    ) {
        let market = Market {
            id: market_id.clone(),
            title,
            description,
            category,
            event_date,
            creator,
            total_stake_yes: 0,
            total_stake_no: 0,
            resolved: false,
            outcome: None,
        };
        
        self.markets.insert(&market_id, market).expect("Insert failed");
    }
    
    pub async fn place_stake(
        &mut self,
        market_id: String,
        user: Owner,
        amount: u128,
        prediction: bool,
    ) -> Result<(), String> {
        // Get market
        let market_opt = self.markets.get(&market_id).await
            .map_err(|e| format!("Get error: {}", e))?;
        
        let mut market = market_opt.ok_or("Market not found")?;
        
        if market.resolved {
            return Err("Market resolved".to_string());
        }
        
        // Update totals
        if prediction {
            market.total_stake_yes += amount;
        } else {
            market.total_stake_no += amount;
        }
        
        self.markets.insert(&market_id, market)
            .map_err(|e| format!("Insert error: {}", e))?;
        
        // Save stake
        let stake = Stake { amount, prediction };
        self.stakes.insert(&(market_id, user), stake)
            .map_err(|e| format!("Stake insert error: {}", e))?;
        
        // Update TVL
        let mut tvl = self.tvl.get();
        tvl += amount;
        self.tvl.set(tvl);
        
        Ok(())
    }
    
    pub async fn resolve_market(
        &mut self,
        market_id: String,
        outcome: bool,
    ) -> Result<(), String> {
        let market_opt = self.markets.get(&market_id).await
            .map_err(|e| format!("Get error: {}", e))?;
        
        let mut market = market_opt.ok_or("Market not found")?;
        
        if market.resolved {
            return Err("Already resolved".to_string());
        }
        
        market.resolved = true;
        market.outcome = Some(outcome);
        
        self.markets.insert(&market_id, market)
            .map_err(|e| format!("Insert error: {}", e))?;
        
        Ok(())
    }
    
    pub async fn get_market(&self, market_id: &str) -> Option<Market> {
        self.markets.get(market_id).await.ok().flatten()
    }
    
    pub async fn get_all_markets(&self) -> Vec<Market> {
        let mut markets = Vec::new();
        
        // Note: This is simplified - in production would use proper iteration
        // For now, return empty vec as we can't easily iterate MapView
        
        markets
    }
}
