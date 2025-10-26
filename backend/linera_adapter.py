import subprocess
import json
import os
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

class LineraAdapter:
    def __init__(self):
        self.app_id = os.getenv("LINERA_APP_ID")
        self.rpc_url = os.getenv("LINERA_RPC_URL", "http://localhost:8080")
        self.chain_id = os.getenv("LINERA_CHAIN_ID", "default")
    
    async def call_operation(self, operation: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Send operation to Linera smart contract"""
        try:
            cmd = [
                "linera", "client", "call",
                "--application-id", self.app_id,
                "--operation", operation,
                "--params", json.dumps(params)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Linera call failed: {result.stderr}")
            
            return {"success": True, "data": result.stdout}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def query_state(self) -> Dict[str, Any]:
        """Query current state from Linera application"""
        try:
            cmd = ["linera", "client", "query", "--application-id", self.app_id]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Query failed: {result.stderr}")
            
            return json.loads(result.stdout)
        except Exception as e:
            return {"error": str(e)}
    
    async def create_market(self, title: str, description: str, category: str, event_date: int):
        """Create new prediction market"""
        return await self.call_operation("CreateMarket", {
            "title": title,
            "description": description,
            "category": category,
            "event_date": event_date
        })
    
    async def stake(self, market_id: int, amount: int, prediction: bool):
        """Stake on a market"""
        return await self.call_operation("Stake", {
            "market_id": market_id,
            "amount": amount,
            "prediction": prediction
        })
    
    async def resolve_market(self, market_id: int, outcome: bool):
        """Resolve market with outcome"""
        return await self.call_operation("ResolveMarket", {
            "market_id": market_id,
            "outcome": outcome
        })

linera_adapter = LineraAdapter()
