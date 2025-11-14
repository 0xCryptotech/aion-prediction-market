use linera_sdk::{
    base::{Account, Amount, Owner, WithContractAbi},
    Contract, ContractRuntime,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use thiserror::Error;

pub mod service;

#[cfg(test)]
mod tests;

/// Custom error types for AION contract
#[derive(Debug, Error)]
pub enum AionError {
    #[error("Market not found: {0}")]
    MarketNotFound(String),
    
    #[error("Market already resolved")]
    MarketAlreadyResolved,
    
    #[error("Invalid stake amount")]
    InvalidStakeAmount,
    
    #[error("Market not resolved yet")]
    MarketNotResolved,
    
    #[error("No rewards to claim")]
    NoRewardsToClaim,
    
    #[error("Already claimed rewards")]
    AlreadyClaimed,
    
    #[error("Insufficient balance")]
    InsufficientBalance,
    
    #[error("Unauthorized")]
    Unauthorized,
    
    #[error("Invalid market data")]
    InvalidMarketData,
}

/// Operations that can be performed on AION markets
#[derive(Debug, Serialize, Deserialize)]
pub enum AionOperation {
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
    },
    
    /// Resolve a market with the outcome
    ResolveMarket {
        market_id: String,
        outcome: bool,
    },
    
    /// Claim rewards from a resolved market
    ClaimRewards {
        market_id: String,
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
    pub creator: Owner,
    pub total_stake_yes: u128,
    pub total_stake_no: u128,
    pub resolved: bool,
    pub outcome: Option<bool>,
    pub created_at: u64,
    /// Map of user address to their stake
    pub stakes: HashMap<Owner, UserStake>,
}

impl Market {
    /// Calculate total stake in the market
    pub fn total_stake(&self) -> u128 {
        self.total_stake_yes + self.total_stake_no
    }
    
    /// Calculate rewards for a user
    pub fn calculate_reward(&self, user: &Owner) -> Result<u128, AionError> {
        if !self.resolved {
            return Err(AionError::MarketNotResolved);
        }
        
        let stake = self.stakes.get(user).ok_or(AionError::NoRewardsToClaim)?;
        
        if stake.claimed {
            return Err(AionError::AlreadyClaimed);
        }
        
        let outcome = self.outcome.ok_or(AionError::MarketNotResolved)?;
        
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
                return Ok(0);
            }
            
            // Reward = stake + (stake / winning_pool) * losing_pool
            let share = (stake.amount as f64) / (winning_pool as f64);
            let reward_from_losers = (share * losing_pool as f64) as u128;
            
            Ok(stake.amount + reward_from_losers)
        } else {
            // User predicted incorrectly, no reward
            Ok(0)
        }
    }
}

/// Global state of the AION application
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AionState {
    /// All markets indexed by ID
    pub markets: HashMap<String, Market>,
    
    /// Counter for generating market IDs
    pub next_market_id: u64,
    
    /// Total value locked in all markets
    pub total_value_locked: u128,
    
    /// Admin/owner of the contract
    pub admin: Option<Owner>,
}

impl AionState {
    /// Get a market by ID
    pub fn get_market(&self, market_id: &str) -> Result<&Market, AionError> {
        self.markets
            .get(market_id)
            .ok_or_else(|| AionError::MarketNotFound(market_id.to_string()))
    }
    
    /// Get a mutable market by ID
    pub fn get_market_mut(&mut self, market_id: &str) -> Result<&mut Market, AionError> {
        self.markets
            .get_mut(market_id)
            .ok_or_else(|| AionError::MarketNotFound(market_id.to_string()))
    }
}

/// AION Prediction Market Contract
pub struct AionContract {
    state: AionState,
    runtime: ContractRuntime<Self>,
}

impl Contract for AionContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = Owner;

    async fn instantiate(&mut self, runtime: ContractRuntime<Self>) {
        // Initialize state with admin
        self.state = AionState {
            markets: HashMap::new(),
            next_market_id: 0,
            total_value_locked: 0,
            admin: Some(runtime.authenticated_signer().unwrap()),
        };
        self.runtime = runtime;
    }

    async fn execute_operation(&mut self, runtime: ContractRuntime<Self>, operation: Self::Operation) {
        self.runtime = runtime;
        
        match operation {
            AionOperation::CreateMarket {
                market_id,
                title,
                description,
                category,
                event_date,
            } => {
                self.create_market(market_id, title, description, category, event_date)
                    .await
                    .expect("Failed to create market");
            }
            
            AionOperation::Stake {
                market_id,
                amount,
                prediction,
            } => {
                self.stake(market_id, amount, prediction)
                    .await
                    .expect("Failed to stake");
            }
            
            AionOperation::ResolveMarket { market_id, outcome } => {
                self.resolve_market(market_id, outcome)
                    .await
                    .expect("Failed to resolve market");
            }
            
            AionOperation::ClaimRewards { market_id } => {
                self.claim_rewards(market_id)
                    .await
                    .expect("Failed to claim rewards");
            }
        }
    }
}

impl AionContract {
    /// Create a new prediction market
    async fn create_market(
        &mut self,
        market_id: String,
        title: String,
        description: String,
        category: String,
        event_date: u64,
    ) -> Result<(), AionError> {
        // Validate inputs
        if title.is_empty() || description.is_empty() {
            return Err(AionError::InvalidMarketData);
        }
        
        // Check if market already exists
        if self.state.markets.contains_key(&market_id) {
            return Err(AionError::InvalidMarketData);
        }
        
        let creator = self.runtime.authenticated_signer()
            .ok_or(AionError::Unauthorized)?;
        
        let current_time = self.runtime.system_time().micros();
        
        // Create new market
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
        
        // Store market
        self.state.markets.insert(market_id.clone(), market);
        self.state.next_market_id += 1;
        
        Ok(())
    }
    
    /// Stake tokens on a market prediction
    async fn stake(
        &mut self,
        market_id: String,
        amount: u128,
        prediction: bool,
    ) -> Result<(), AionError> {
        // Validate amount
        if amount == 0 {
            return Err(AionError::InvalidStakeAmount);
        }
        
        let user = self.runtime.authenticated_signer()
            .ok_or(AionError::Unauthorized)?;
        
        // Get market
        let market = self.state.get_market_mut(&market_id)?;
        
        // Check if market is already resolved
        if market.resolved {
            return Err(AionError::MarketAlreadyResolved);
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
                stake.prediction = prediction; // Update prediction if changed
            })
            .or_insert(UserStake {
                amount,
                prediction,
                claimed: false,
            });
        
        // Update TVL
        self.state.total_value_locked += amount;
        
        Ok(())
    }
    
    /// Resolve a market with the outcome
    async fn resolve_market(
        &mut self,
        market_id: String,
        outcome: bool,
    ) -> Result<(), AionError> {
        let caller = self.runtime.authenticated_signer()
            .ok_or(AionError::Unauthorized)?;
        
        // Only admin can resolve markets
        if Some(caller) != self.state.admin {
            return Err(AionError::Unauthorized);
        }
        
        // Get market
        let market = self.state.get_market_mut(&market_id)?;
        
        // Check if already resolved
        if market.resolved {
            return Err(AionError::MarketAlreadyResolved);
        }
        
        // Resolve market
        market.resolved = true;
        market.outcome = Some(outcome);
        
        Ok(())
    }
    
    /// Claim rewards from a resolved market
    async fn claim_rewards(&mut self, market_id: String) -> Result<(), AionError> {
        let user = self.runtime.authenticated_signer()
            .ok_or(AionError::Unauthorized)?;
        
        // Get market
        let market = self.state.get_market_mut(&market_id)?;
        
        // Check if market is resolved
        if !market.resolved {
            return Err(AionError::MarketNotResolved);
        }
        
        // Calculate reward
        let reward = market.calculate_reward(&user)?;
        
        if reward == 0 {
            return Err(AionError::NoRewardsToClaim);
        }
        
        // Mark as claimed
        if let Some(stake) = market.stakes.get_mut(&user) {
            stake.claimed = true;
        }
        
        // Update TVL
        self.state.total_value_locked = self.state.total_value_locked.saturating_sub(reward);
        
        // Transfer tokens to user (in real implementation)
        // self.runtime.transfer(user, Amount::from(reward)).await?;
        
        Ok(())
    }
}

impl WithContractAbi for AionContract {
    type Abi = ();
}
