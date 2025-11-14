import subprocess
import json
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

class ChainType:
    MAIN = "main"           # Governance, user registry, global state
    DEDICATED = "dedicated" # High-value/high-volume markets
    SHARED = "shared"       # Small markets

class LineraAdapter:
    def __init__(self):
        self.main_app_id = os.getenv("LINERA_MAIN_APP_ID")
        self.rpc_url = os.getenv("LINERA_RPC_URL", "http://localhost:8080")
        self.main_chain_id = os.getenv("LINERA_MAIN_CHAIN_ID", "default")
        
        # Thresholds for chain allocation
        self.high_value_threshold = int(os.getenv("HIGH_VALUE_THRESHOLD", "10000"))
        self.high_volume_threshold = int(os.getenv("HIGH_VOLUME_THRESHOLD", "100"))
        
        # Track dedicated chains for markets
        self.market_chains: Dict[str, Dict[str, str]] = {}  # market_id -> {chain_id, app_id}
    
    def should_use_dedicated_chain(self, total_stake: float, participant_count: int) -> bool:
        """Determine if market should get dedicated chain"""
        return (total_stake >= self.high_value_threshold or 
                participant_count >= self.high_volume_threshold)
    
    async def allocate_chain(self, market_id: str, total_stake: float = 0, 
                            participant_count: int = 0) -> Dict[str, str]:
        """Allocate appropriate chain for market (hybrid strategy)"""
        if self.should_use_dedicated_chain(total_stake, participant_count):
            # Create dedicated chain for high-value/high-volume market
            chain_info = await self.create_dedicated_chain(market_id)
            self.market_chains[market_id] = chain_info
            logger.info(f"Allocated dedicated chain for market {market_id}: {chain_info['chain_id']}")
            return chain_info
        else:
            # Use shared chain for small markets
            logger.info(f"Using shared chain for market {market_id}")
            return {
                "chain_id": self.main_chain_id,
                "app_id": self.main_app_id,
                "type": ChainType.SHARED
            }
    
    async def create_dedicated_chain(self, market_id: str) -> Dict[str, str]:
        """Create new dedicated microchain for a market"""
        try:
            # Create new chain
            cmd = ["linera", "client", "create-chain"]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Failed to create chain: {result.stderr}")
            
            chain_id = result.stdout.strip()
            
            # Deploy application to new chain
            cmd = [
                "linera", "client", "publish-and-create",
                "--chain-id", chain_id,
                "--contract", "target/wasm32-unknown-unknown/release/aion_contract.wasm",
                "--service", "target/wasm32-unknown-unknown/release/aion_service.wasm"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Failed to deploy app: {result.stderr}")
            
            app_id = result.stdout.strip()
            
            return {
                "chain_id": chain_id,
                "app_id": app_id,
                "type": ChainType.DEDICATED,
                "market_id": market_id
            }
        except Exception as e:
            logger.error(f"Error creating dedicated chain: {e}")
            # Fallback to shared chain
            return {
                "chain_id": self.main_chain_id,
                "app_id": self.main_app_id,
                "type": ChainType.SHARED
            }
    
    def get_chain_info(self, market_id: str) -> Dict[str, str]:
        """Get chain info for a market"""
        return self.market_chains.get(market_id, {
            "chain_id": self.main_chain_id,
            "app_id": self.main_app_id,
            "type": ChainType.SHARED
        })
    
    async def call_operation(self, operation: str, params: Dict[str, Any], 
                            chain_id: Optional[str] = None, 
                            app_id: Optional[str] = None) -> Dict[str, Any]:
        """Send operation to Linera smart contract"""
        try:
            target_chain = chain_id or self.main_chain_id
            target_app = app_id or self.main_app_id
            
            cmd = [
                "linera", "client", "call",
                "--chain-id", target_chain,
                "--application-id", target_app,
                "--operation", operation,
                "--params", json.dumps(params)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Linera call failed: {result.stderr}")
            
            return {"success": True, "data": result.stdout, "chain_id": target_chain}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def query_state(self, chain_id: Optional[str] = None, 
                         app_id: Optional[str] = None) -> Dict[str, Any]:
        """Query current state from Linera application"""
        try:
            target_chain = chain_id or self.main_chain_id
            target_app = app_id or self.main_app_id
            
            cmd = [
                "linera", "client", "query",
                "--chain-id", target_chain,
                "--application-id", target_app
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Query failed: {result.stderr}")
            
            return json.loads(result.stdout)
        except Exception as e:
            return {"error": str(e)}
    
    async def create_market(self, market_id: str, title: str, description: str, 
                           category: str, event_date: int, 
                           estimated_stake: float = 0, estimated_participants: int = 0):
        """Create new prediction market with hybrid chain allocation"""
        # Allocate appropriate chain based on estimates
        chain_info = await self.allocate_chain(market_id, estimated_stake, estimated_participants)
        
        result = await self.call_operation(
            "CreateMarket",
            {
                "market_id": market_id,
                "title": title,
                "description": description,
                "category": category,
                "event_date": event_date
            },
            chain_id=chain_info["chain_id"],
            app_id=chain_info["app_id"]
        )
        
        if result.get("success"):
            result["chain_info"] = chain_info
        
        return result
    
    async def stake(self, market_id: str, amount: int, prediction: bool, user_address: str):
        """Stake on a market (routes to correct chain)"""
        chain_info = self.get_chain_info(market_id)
        
        return await self.call_operation(
            "Stake",
            {
                "market_id": market_id,
                "amount": amount,
                "prediction": prediction,
                "user": user_address
            },
            chain_id=chain_info["chain_id"],
            app_id=chain_info["app_id"]
        )
    
    async def resolve_market(self, market_id: str, outcome: bool):
        """Resolve market with outcome (routes to correct chain)"""
        chain_info = self.get_chain_info(market_id)
        
        return await self.call_operation(
            "ResolveMarket",
            {
                "market_id": market_id,
                "outcome": outcome
            },
            chain_id=chain_info["chain_id"],
            app_id=chain_info["app_id"]
        )
    
    async def migrate_to_dedicated_chain(self, market_id: str, current_stake: float, 
                                        participant_count: int) -> Dict[str, Any]:
        """Migrate market from shared to dedicated chain if thresholds exceeded"""
        if not self.should_use_dedicated_chain(current_stake, participant_count):
            return {"migrated": False, "reason": "Thresholds not met"}
        
        current_chain = self.get_chain_info(market_id)
        if current_chain["type"] == ChainType.DEDICATED:
            return {"migrated": False, "reason": "Already on dedicated chain"}
        
        try:
            # Create dedicated chain
            new_chain_info = await self.create_dedicated_chain(market_id)
            
            # Query current state from shared chain
            state = await self.query_state(
                chain_id=current_chain["chain_id"],
                app_id=current_chain["app_id"]
            )
            
            # Migrate state to new chain (implementation depends on contract)
            # This is a placeholder - actual migration logic depends on contract design
            logger.info(f"Migrating market {market_id} to dedicated chain {new_chain_info['chain_id']}")
            
            return {
                "migrated": True,
                "old_chain": current_chain,
                "new_chain": new_chain_info
            }
        except Exception as e:
            logger.error(f"Migration failed: {e}")
            return {"migrated": False, "error": str(e)}

linera_adapter = LineraAdapter()
