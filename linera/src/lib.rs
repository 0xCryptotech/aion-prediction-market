// AION Prediction Market - Simplified for Linera Testnet
// Based on Linera SDK 0.12 patterns

#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_trait::async_trait;
use linera_sdk::{
    base::{ContractAbi, Owner, ServiceAbi, WithContractAbi},
    views::{RootView, View, ViewStorageContext},
    Contract, ContractRuntime, Service, ServiceRuntime,
};
use serde::{Deserialize, Serialize};
use state::{AionState, Market, Stake};

/// Application state
pub struct AionApplication {
    state: AionState,
    runtime: ContractRuntime<Self>,
}

/// Operations
#[derive(Debug, Serialize, Deserialize)]
pub enum Operation {
    CreateMarket {
        market_id: String,
        title: String,
        description: String,
        category: String,
        event_date: u64,
    },
    PlaceStake {
        market_id: String,
        amount: u128,
        prediction: bool,
    },
    ResolveMarket {
        market_id: String,
        outcome: bool,
    },
}

/// Messages
#[derive(Debug, Serialize, Deserialize)]
pub enum Message {}

/// Response
pub type Response = ();

/// Query
#[derive(Debug, Serialize, Deserialize)]
pub enum Query {
    GetMarket { market_id: String },
    GetAllMarkets,
}

/// Query Response
#[derive(Debug, Serialize, Deserialize)]
pub enum QueryResponse {
    Market(Option<Market>),
    Markets(Vec<Market>),
}

/// ABI
pub struct AionAbi;

impl ContractAbi for AionAbi {
    type Operation = Operation;
    type Response = Response;
}

impl ServiceAbi for AionAbi {
    type Query = Query;
    type QueryResponse = QueryResponse;
}

impl WithContractAbi for AionApplication {
    type Abi = AionAbi;
}

#[async_trait]
impl Contract for AionApplication {
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = AionState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        AionApplication { state, runtime }
    }

    async fn instantiate(&mut self, _argument: ()) {
        // Initialize
    }

    async fn execute_operation(&mut self, operation: Operation) -> Response {
        match operation {
            Operation::CreateMarket {
                market_id,
                title,
                description,
                category,
                event_date,
            } => {
                let creator = self.runtime
                    .authenticated_signer()
                    .expect("Missing signer");
                
                self.state.create_market(
                    market_id,
                    title,
                    description,
                    category,
                    event_date,
                    creator,
                ).await;
            }
            
            Operation::PlaceStake {
                market_id,
                amount,
                prediction,
            } => {
                let user = self.runtime
                    .authenticated_signer()
                    .expect("Missing signer");
                
                self.state.place_stake(market_id, user, amount, prediction)
                    .await
                    .expect("Failed to place stake");
            }
            
            Operation::ResolveMarket {
                market_id,
                outcome,
            } => {
                self.state.resolve_market(market_id, outcome)
                    .await
                    .expect("Failed to resolve market");
            }
        }
    }

    async fn execute_message(&mut self, _message: Message) {
        // No messages
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save");
    }
}

/// Service
pub struct AionService {
    state: AionState,
}

#[async_trait]
impl Service for AionService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = AionState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        AionService { state }
    }

    async fn handle_query(&self, query: Query) -> QueryResponse {
        match query {
            Query::GetMarket { market_id } => {
                let market = self.state.get_market(&market_id).await;
                QueryResponse::Market(market)
            }
            Query::GetAllMarkets => {
                let markets = self.state.get_all_markets().await;
                QueryResponse::Markets(markets)
            }
        }
    }
}

impl WithContractAbi for AionService {
    type Abi = AionAbi;
}

linera_sdk::contract!(AionApplication);
linera_sdk::service!(AionService);
