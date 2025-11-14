#[cfg(test)]
mod tests {
    use super::*;
    use linera_sdk::base::Owner;
    
    fn mock_owner(id: u8) -> Owner {
        Owner::from([id; 32])
    }
    
    fn create_test_state() -> AionState {
        AionState {
            markets: HashMap::new(),
            next_market_id: 0,
            total_value_locked: 0,
            admin: Some(mock_owner(1)),
        }
    }
    
    #[test]
    fn test_create_market() {
        let mut state = create_test_state();
        
        let market = Market {
            id: "test-market-1".to_string(),
            title: "Bitcoin $100k by 2025?".to_string(),
            description: "Will BTC reach $100k?".to_string(),
            category: "Finance".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 0,
            total_stake_no: 0,
            resolved: false,
            outcome: None,
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        state.markets.insert("test-market-1".to_string(), market);
        
        assert_eq!(state.markets.len(), 1);
        assert!(state.markets.contains_key("test-market-1"));
    }
    
    #[test]
    fn test_stake_on_market() {
        let mut market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 0,
            total_stake_no: 0,
            resolved: false,
            outcome: None,
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        let user = mock_owner(2);
        let amount = 1000u128;
        let prediction = true;
        
        // Add stake
        market.total_stake_yes += amount;
        market.stakes.insert(
            user,
            UserStake {
                amount,
                prediction,
                claimed: false,
            },
        );
        
        assert_eq!(market.total_stake_yes, 1000);
        assert_eq!(market.total_stake_no, 0);
        assert_eq!(market.total_stake(), 1000);
        assert_eq!(market.stakes.len(), 1);
    }
    
    #[test]
    fn test_multiple_stakes() {
        let mut market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 0,
            total_stake_no: 0,
            resolved: false,
            outcome: None,
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        // User 1 stakes YES
        let user1 = mock_owner(2);
        market.total_stake_yes += 1000;
        market.stakes.insert(
            user1,
            UserStake {
                amount: 1000,
                prediction: true,
                claimed: false,
            },
        );
        
        // User 2 stakes NO
        let user2 = mock_owner(3);
        market.total_stake_no += 500;
        market.stakes.insert(
            user2,
            UserStake {
                amount: 500,
                prediction: false,
                claimed: false,
            },
        );
        
        assert_eq!(market.total_stake_yes, 1000);
        assert_eq!(market.total_stake_no, 500);
        assert_eq!(market.total_stake(), 1500);
        assert_eq!(market.stakes.len(), 2);
    }
    
    #[test]
    fn test_resolve_market() {
        let mut market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 1000,
            total_stake_no: 500,
            resolved: false,
            outcome: None,
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        // Resolve with YES outcome
        market.resolved = true;
        market.outcome = Some(true);
        
        assert!(market.resolved);
        assert_eq!(market.outcome, Some(true));
    }
    
    #[test]
    fn test_calculate_reward_winner() {
        let mut market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 1000,
            total_stake_no: 500,
            resolved: true,
            outcome: Some(true), // YES wins
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        let winner = mock_owner(2);
        market.stakes.insert(
            winner,
            UserStake {
                amount: 1000,
                prediction: true, // Predicted YES
                claimed: false,
            },
        );
        
        let reward = market.calculate_reward(&winner).unwrap();
        
        // Winner gets their stake back + all losing stakes
        // 1000 + (1000/1000) * 500 = 1500
        assert_eq!(reward, 1500);
    }
    
    #[test]
    fn test_calculate_reward_loser() {
        let mut market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 1000,
            total_stake_no: 500,
            resolved: true,
            outcome: Some(true), // YES wins
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        let loser = mock_owner(3);
        market.stakes.insert(
            loser,
            UserStake {
                amount: 500,
                prediction: false, // Predicted NO (lost)
                claimed: false,
            },
        );
        
        let reward = market.calculate_reward(&loser).unwrap();
        
        // Loser gets nothing
        assert_eq!(reward, 0);
    }
    
    #[test]
    fn test_calculate_reward_multiple_winners() {
        let mut market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 2000, // 2 winners
            total_stake_no: 1000,  // 1 loser
            resolved: true,
            outcome: Some(true), // YES wins
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        // Winner 1: staked 1500
        let winner1 = mock_owner(2);
        market.stakes.insert(
            winner1,
            UserStake {
                amount: 1500,
                prediction: true,
                claimed: false,
            },
        );
        
        // Winner 2: staked 500
        let winner2 = mock_owner(3);
        market.stakes.insert(
            winner2,
            UserStake {
                amount: 500,
                prediction: true,
                claimed: false,
            },
        );
        
        let reward1 = market.calculate_reward(&winner1).unwrap();
        let reward2 = market.calculate_reward(&winner2).unwrap();
        
        // Winner 1: 1500 + (1500/2000) * 1000 = 1500 + 750 = 2250
        assert_eq!(reward1, 2250);
        
        // Winner 2: 500 + (500/2000) * 1000 = 500 + 250 = 750
        assert_eq!(reward2, 750);
        
        // Total rewards should equal total stakes
        assert_eq!(reward1 + reward2, 3000);
    }
    
    #[test]
    fn test_market_not_resolved_error() {
        let mut market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 1000,
            total_stake_no: 500,
            resolved: false, // Not resolved yet
            outcome: None,
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        let user = mock_owner(2);
        market.stakes.insert(
            user,
            UserStake {
                amount: 1000,
                prediction: true,
                claimed: false,
            },
        );
        
        let result = market.calculate_reward(&user);
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), AionError::MarketNotResolved));
    }
    
    #[test]
    fn test_already_claimed_error() {
        let mut market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 1000,
            total_stake_no: 500,
            resolved: true,
            outcome: Some(true),
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        let user = mock_owner(2);
        market.stakes.insert(
            user,
            UserStake {
                amount: 1000,
                prediction: true,
                claimed: true, // Already claimed
            },
        );
        
        let result = market.calculate_reward(&user);
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), AionError::AlreadyClaimed));
    }
    
    #[test]
    fn test_state_get_market() {
        let mut state = create_test_state();
        
        let market = Market {
            id: "test-market-1".to_string(),
            title: "Test Market".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 0,
            total_stake_no: 0,
            resolved: false,
            outcome: None,
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        state.markets.insert("test-market-1".to_string(), market);
        
        let retrieved = state.get_market("test-market-1");
        assert!(retrieved.is_ok());
        assert_eq!(retrieved.unwrap().id, "test-market-1");
        
        let not_found = state.get_market("non-existent");
        assert!(not_found.is_err());
    }
    
    #[test]
    fn test_tvl_calculation() {
        let mut state = create_test_state();
        
        // Add market 1
        let mut market1 = Market {
            id: "market-1".to_string(),
            title: "Market 1".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 1000,
            total_stake_no: 500,
            resolved: false,
            outcome: None,
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        // Add market 2
        let mut market2 = Market {
            id: "market-2".to_string(),
            title: "Market 2".to_string(),
            description: "Test".to_string(),
            category: "Test".to_string(),
            event_date: 1735689600,
            creator: mock_owner(1),
            total_stake_yes: 2000,
            total_stake_no: 1000,
            resolved: false,
            outcome: None,
            created_at: 0,
            stakes: HashMap::new(),
        };
        
        state.total_value_locked = market1.total_stake() + market2.total_stake();
        
        assert_eq!(state.total_value_locked, 4500);
    }
}
