"""
AION Backend - Fully Onchain Mode
Semua data di blockchain, backend hanya proxy
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

from blockchain_proxy import BlockchainProxy

load_dotenv()

app = FastAPI(title="AION Prediction Market - Onchain")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize blockchain proxy
CHAIN_ID = os.getenv("LINERA_MAIN_CHAIN_ID", "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65")
APP_ID = os.getenv("LINERA_MAIN_APP_ID", "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65000000000000000000000000")

# Create global instance
blockchain_proxy = BlockchainProxy(CHAIN_ID, APP_ID)

# Models
class CreateMarketRequest(BaseModel):
    market_id: str
    title: str
    description: str
    category: str
    event_date: int

class StakeRequest(BaseModel):
    user_id: str
    amount: float
    prediction: bool

class ResolveRequest(BaseModel):
    outcome: bool

# Routes - All forward to blockchain

@app.get("/")
async def root():
    return {
        "name": "AION Prediction Market",
        "mode": "Fully Onchain",
        "blockchain": "Linera Protocol",
        "chain_id": CHAIN_ID,
        "status": "operational"
    }

@app.get("/api/blockchain/info")
async def blockchain_info():
    """Get blockchain information"""
    return {
        "chain_id": CHAIN_ID,
        "app_id": APP_ID,
        "network": "Linera Testnet",
        "explorer": f"https://explorer.linera.io/chain/{CHAIN_ID}"
    }

@app.post("/api/markets")
async def create_market(request: CreateMarketRequest):
    """Create market - Onchain transaction"""
    result = await blockchain_proxy.execute_operation(
        "CreateMarket",
        {
            "market_id": request.market_id,
            "title": request.title,
            "description": request.description,
            "category": request.category,
            "event_date": request.event_date
        }
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return {
        "success": True,
        "market_id": request.market_id,
        "txHash": result["txHash"],
        "blockNumber": result["blockNumber"],
        "chainId": CHAIN_ID
    }

@app.get("/api/markets")
async def get_markets():
    """Get all markets - Query blockchain"""
    result = await blockchain_proxy.query_state("GetAllMarkets")
    
    return {
        "markets": result.get("data", []),
        "source": "blockchain",
        "chainId": CHAIN_ID
    }

@app.get("/api/markets/{market_id}")
async def get_market(market_id: str):
    """Get market details - Query blockchain"""
    result = await blockchain_proxy.query_state(
        "GetMarket",
        {"market_id": market_id}
    )
    
    return {
        "market": result.get("data"),
        "source": "blockchain",
        "chainId": CHAIN_ID
    }

@app.post("/api/markets/{market_id}/stake")
async def place_stake(market_id: str, request: StakeRequest):
    """Place stake - Onchain transaction"""
    result = await blockchain_proxy.execute_operation(
        "PlaceStake",
        {
            "market_id": market_id,
            "user_id": request.user_id,
            "amount": int(request.amount * 1000000),  # Convert to smallest unit
            "prediction": request.prediction
        }
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return {
        "success": True,
        "market_id": market_id,
        "txHash": result["txHash"],
        "blockNumber": result["blockNumber"],
        "chainId": CHAIN_ID
    }

@app.post("/api/markets/{market_id}/resolve")
async def resolve_market(market_id: str, request: ResolveRequest):
    """Resolve market - Onchain transaction"""
    result = await blockchain_proxy.execute_operation(
        "ResolveMarket",
        {
            "market_id": market_id,
            "outcome": request.outcome
        }
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return {
        "success": True,
        "market_id": market_id,
        "outcome": request.outcome,
        "txHash": result["txHash"],
        "blockNumber": result["blockNumber"],
        "chainId": CHAIN_ID
    }

@app.get("/api/users/{user_id}/stakes")
async def get_user_stakes(user_id: str):
    """Get user stakes - Query blockchain"""
    result = await blockchain_proxy.query_state(
        "GetUserStakes",
        {"user_id": user_id}
    )
    
    return {
        "stakes": result.get("data", {}),
        "source": "blockchain",
        "chainId": CHAIN_ID
    }

@app.get("/api/stats")
async def get_stats():
    """Get platform stats - Query blockchain"""
    result = await blockchain_proxy.query_state("GetStats")
    
    return {
        "stats": result.get("data", {}),
        "source": "blockchain",
        "chainId": CHAIN_ID
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
