// Simplified AION Contract for Linera SDK 0.12
// This version focuses on core functionality with proper SDK integration

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Operations that can be performed on AION markets
#[derive(Debug, Serialize, Deserialize)]
pub enum Operation {
    /// Create a new prediction market
    CreateMarket {
        market_id: String,
        title: String,
        description: String,
        category: String,
        event_date: u64,
    },
    
    /// Stake tokens on a market prediction
    Stake {
        market_id: String,
        amount: u128,
        prediction: bool, // true = YES, false = NO
        user: String,
    },
    
    /// Resolve a market with the outcome
    ResolveMarket {
        market_id: String,
        outcome: bool,
    },
    
    /// Claim rewards from a resolved market
    ClaimRewards {
        market_id: String,
        user: String,
    },
}

/// Represents a user's stake in a market
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserStake {
    pub amount: u128,
    pub prediction: bool,
    pub claimed: bool,
}

/// Represents a prediction market
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Market {
    pub id: String,
    pub title: String,
    pub description: String,
    pub category: String,
    pub event_date: u64,
    pub creator: String,
    pub total_stake_yes: u128,
    pub total_stake_no: u128,
    pub resolved: bool,
    pub outcome: Option<bool>,
    pub created_at: u64,
    /// Map of user address to their stake
    pub stakes: HashMap<String, UserStake>,
}

impl Market {
    /// Calculate total stake in the market
    pub fn total_stake(&self) -> u128 {
        self.total_stake_yes + self.total_stake_no
    }
    
    /// Calculate rewards for a user
    pub fn calculate_reward(&self, user: &str) -> Option<u128> {
        if !self.resolved {
            return None;
        }
        
        let stake = self.stakes.get(user)?;
        
        if stake.claimed {
            return None;
        }
        
        let outcome = self.outcome?;
        
        // If user predicted correctly
        if stake.prediction == outcome {
            let winning_pool = if outcome {
                self.total_stake_yes
            } else {
                self.total_stake_no
            };
            
            let losing_pool = if outcome {
                self.total_stake_no
            } else {
                self.total_stake_yes
            };
            
            if winning_pool == 0 {
                return Some(0);
            }
            
            // Reward = stake + (stake / winning_pool) * losing_pool
            let share = (stake.amount as f64) / (winning_pool as f64);
            let reward_from_losers = (share * losing_pool as f64) as u128;
            
            Some(stake.amount + reward_from_losers)
        } else {
            // User predicted incorrectly, no reward
            Some(0)
        }
    }
}

/// Global state of the AION application
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct State {
    /// All markets indexed by ID
    pub markets: HashMap<String, Market>,
    
    /// Counter for generating market IDs
    pub next_market_id: u64,
    
    /// Total value locked in all markets
    pub total_value_locked: u128,
    
    /// Admin/owner of the contract
    pub admin: Option<String>,
}

impl State {
    pub fn new(admin: String) -> Self {
        Self {
            markets: HashMap::new(),
            next_market_id: 0,
            total_value_locked: 0,
            admin: Some(admin),
        }
    }
    
    /// Create a new market
    pub fn create_market(
        &mut self,
        market_id: String,
        title: String,
        description: String,
        category: String,
        event_date: u64,
        creator: String,
        current_time: u64,
    ) -> Result<(), String> {
        if self.markets.contains_key(&market_id) {
            return Err("Market already exists".to_string());
        }
        
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
            created_at: current_time,
            stakes: HashMap::new(),
        };
        
        self.markets.insert(market_id, market);
        self.next_market_id += 1;
        
        Ok(())
    }
    
    /// Stake on a market
    pub fn stake(
        &mut self,
        market_id: String,
        amount: u128,
        prediction: bool,
        user: String,
    ) -> Result<(), String> {
        let market = self.markets.get_mut(&market_id)
            .ok_or("Market not found")?;
        
        if market.resolved {
            return Err("Market already resolved".to_string());
        }
        
        if amount == 0 {
            return Err("Invalid stake amount".to_string());
        }
        
        // Update market stakes
        if prediction {
            market.total_stake_yes += amount;
        } else {
            market.total_stake_no += amount;
        }
        
        // Update or create user stake
        market.stakes
            .entry(user)
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
    
    /// Resolve a market
    pub fn resolve_market(
        &mut self,
        market_id: String,
        outcome: bool,
        caller: String,
    ) -> Result<(), String> {
        // Check admin
        if Some(caller) != self.admin {
            return Err("Unauthorized".to_string());
        }
        
        let market = self.markets.get_mut(&market_id)
            .ok_or("Market not found")?;
        
        if market.resolved {
            return Err("Market already resolved".to_string());
        }
        
        market.resolved = true;
        market.outcome = Some(outcome);
        
        Ok(())
    }
    
    /// Claim rewards
    pub fn claim_rewards(
        &mut self,
        market_id: String,
        user: String,
    ) -> Result<u128, String> {
        let market = self.markets.get_mut(&market_id)
            .ok_or("Market not found")?;
        
        if !market.resolved {
            return Err("Market not resolved".to_string());
        }
        
        let reward = market.calculate_reward(&user)
            .ok_or("No rewards to claim")?;
        
        if reward == 0 {
            return Err("No rewards to claim".to_string());
        }
        
        // Mark as claimed
        if let Some(stake) = market.stakes.get_mut(&user) {
            stake.claimed = true;
        }
        
        self.total_value_locked = self.total_value_locked.saturating_sub(reward);
        
        Ok(reward)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_create_market() {
        let mut state = State::new("admin".to_string());
        
        let result = state.create_market(
            "market-1".to_string(),
            "Test Market".to_string(),
            "Description".to_string(),
            "Finance".to_string(),
            1735689600,
            "creator".to_string(),
            0,
        );
        
        assert!(result.is_ok());
        assert_eq!(state.markets.len(), 1);
    }
    
    #[test]
    fn test_stake() {
        let mut state = State::new("admin".to_string());
        
        state.create_market(
            "market-1".to_string(),
            "Test".to_string(),
            "Test".to_string(),
            "Test".to_string(),
            1735689600,
            "creator".to_string(),
            0,
        ).unwrap();
        
        let result = state.stake(
            "market-1".to_string(),
            1000,
            true,
            "user1".to_string(),
        );
        
        assert!(result.is_ok());
        assert_eq!(state.total_value_locked, 1000);
        
        let market = state.markets.get("market-1").unwrap();
        assert_eq!(market.total_stake_yes, 1000);
    }
    
    #[test]
    fn test_resolve_and_claim() {
        let mut state = State::new("admin".to_string());
        
        // Create market
        state.create_market(
            "market-1".to_string(),
            "Test".to_string(),
            "Test".to_string(),
            "Test".to_string(),
            1735689600,
            "creator".to_string(),
            0,
        ).unwrap();
        
        // Stake
        state.stake("market-1".to_string(), 1000, true, "user1".to_string()).unwrap();
        state.stake("market-1".to_string(), 500, false, "user2".to_string()).unwrap();
        
        // Resolve
        let result = state.resolve_market(
            "market-1".to_string(),
            true,
            "admin".to_string(),
        );
        assert!(result.is_ok());
        
        // Claim rewards
        let reward = state.claim_rewards("market-1".to_string(), "user1".to_string());
        assert!(reward.is_ok());
        assert_eq!(reward.unwrap(), 1500); // 1000 + 500
    }
}
