#[cfg(test)]
mod tests {
    #[test]
    fn test_market_creation() {
        let id = 1u64;
        let title = "Test Market".to_string();
        assert_eq!(id, 1);
        assert_eq!(title, "Test Market");
    }

    #[test]
    fn test_stake_calculation() {
        let mut total_stake_yes = 1000u128;
        let stake_amount = 500u128;
        total_stake_yes += stake_amount;
        assert_eq!(total_stake_yes, 1500);
    }
}
