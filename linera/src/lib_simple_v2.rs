// Simplified AION Contract for Linera SDK 0.12
// Onchain Semu - Hybrid Architecture

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Market data structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Market {
    pub id: String,
    pub title: String,
    pub description: String,
    pub category: String,
    pub event_date: u64,
    pub total_stake_yes: u128,
    pub total_stake_no: u128,
    pub resolved: bool,
    pub outcome: Option<bool>,
    pub created_at: u64,
}

/// User stake
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserStake {
    pub amount: u128,
    pub prediction: bool,
    pub claimed: bool,
}

/// Global state
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AionState {
    pub markets: HashMap<String, Market>,
    pub stakes: HashMap<String, HashMap<String, UserStake>>, // market_id -> user_id -> stake
    pub total_value_locked: u128,
}

/// Operations
#[derive(Debug, Serialize, Deserialize)]
pub enum AionOperation {
    CreateMarket {
        market_id: String,
        title: String,
        description: String,
        category: String,
        event_date: u64,
    },
    Stake {
        market_id: String,
        user_id: String,
        amount: u128,
        prediction: bool,
    },
    ResolveMarket {
        market_id: String,
        outcome: bool,
    },
}

impl AionState {
    pub fn create_market(
        &mut self,
        market_id: String,
        title: String,
        description: String,
        category: String,
        event_date: u64,
        created_at: u64,
    ) {
        let market = Market {
            id: market_id.clone(),
            title,
            description,
            category,
            event_date,
            total_stake_yes: 0,
            total_stake_no: 0,
            resolved: false,
            outcome: None,
            created_at,
        };
        
        self.markets.insert(market_id.clone(), market);
        self.stakes.insert(market_id, HashMap::new());
    }
    
    pub fn stake(
        &mut self,
        market_id: &str,
        user_id: String,
        amount: u128,
        prediction: bool,
    ) -> Result<(), String> {
        let market = self.markets.get_mut(market_id)
            .ok_or("Market not found")?;
        
        if market.resolved {
            return Err("Market already resolved".to_string());
        }
        
        // Update market totals
        if prediction {
            market.total_stake_yes += amount;
        } else {
            market.total_stake_no += amount;
        }
        
        // Update user stake
        let market_stakes = self.stakes.get_mut(market_id).unwrap();
        market_stakes
            .entry(user_id)
            .and_modify(|stake| {
                stake.amount += amount;
                stake.prediction = prediction;
            })
            .or_insert(UserStake {
                amount,
                prediction,
                claimed: false,
            });
        
        self.total_value_locked += amount;
        Ok(())
    }
    
    pub fn resolve_market(&mut self, market_id: &str, outcome: bool) -> Result<(), String> {
        let market = self.markets.get_mut(market_id)
            .ok_or("Market not found")?;
        
        if market.resolved {
            return Err("Market already resolved".to_string());
        }
        
        market.resolved = true;
        market.outcome = Some(outcome);
        Ok(())
    }
}
