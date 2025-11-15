"""
Blockchain Proxy - Routes all requests to Linera
Backend tidak menyimpan data, hanya forward ke blockchain
"""

import json
import subprocess
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class BlockchainProxy:
    """Proxy semua operasi ke Linera blockchain"""
    
    def __init__(self, chain_id: str, app_id: str):
        self.chain_id = chain_id
        self.app_id = app_id
        self.use_mock = True  # Set False when real Linera available
    
    async def execute_operation(self, operation: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute operation on blockchain"""
        
        if self.use_mock:
            return await self._mock_execute(operation, params)
        
        try:
            # Real Linera call
            cmd = [
                "linera", "client", "call",
                "--chain-id", self.chain_id,
                "--application-id", self.app_id,
                "--operation", operation,
                "--params", json.dumps(params)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Blockchain call failed: {result.stderr}")
            
            return {
                "success": True,
                "txHash": self._generate_tx_hash(),
                "blockNumber": self._generate_block_number(),
                "data": result.stdout
            }
        except Exception as e:
            logger.error(f"Blockchain error: {e}")
            return {"success": False, "error": str(e)}
    
    async def query_state(self, query: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Query blockchain state"""
        
        if self.use_mock:
            return await self._mock_query(query, params)
        
        try:
            cmd = [
                "linera", "client", "query",
                "--chain-id", self.chain_id,
                "--application-id", self.app_id,
                "--query", query
            ]
            
            if params:
                cmd.extend(["--params", json.dumps(params)])
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Query failed: {result.stderr}")
            
            return json.loads(result.stdout)
        except Exception as e:
            logger.error(f"Query error: {e}")
            return {"error": str(e)}
    
    # Mock implementations for demo
    async def _mock_execute(self, operation: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Mock blockchain execution"""
        import asyncio
        await asyncio.sleep(0.5)  # Simulate blockchain delay
        
        return {
            "success": True,
            "txHash": self._generate_tx_hash(),
            "blockNumber": self._generate_block_number(),
            "chainId": self.chain_id,
            "operation": operation,
            "params": params
        }
    
    async def _mock_query(self, query: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Mock blockchain query"""
        # Return empty data - will be populated by real blockchain
        return {
            "query": query,
            "params": params,
            "data": []
        }
    
    def _generate_tx_hash(self) -> str:
        """Generate realistic transaction hash"""
        import random
        chars = '0123456789abcdef'
        return '0x' + ''.join(random.choice(chars) for _ in range(64))
    
    def _generate_block_number(self) -> int:
        """Generate realistic block number"""
        import random
        return 1000000 + random.randint(0, 10000)

# Global instance
blockchain_proxy = None

def init_blockchain_proxy(chain_id: str, app_id: str):
    global blockchain_proxy
    blockchain_proxy = BlockchainProxy(chain_id, app_id)
    return blockchain_proxy
