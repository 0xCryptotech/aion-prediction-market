from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import random
from linera_adapter import linera_adapter

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'aion_db')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class AIModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    model_type: str  # GPT-4, Claude, Llama, etc
    reputation_score: float
    total_predictions: int
    correct_predictions: int
    accuracy_rate: float
    total_staked: float
    total_earned: float
    rank: int
    avatar_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Prediction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # Finance, Esports, Climate, Politics, Tech
    event_date: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str  # active, resolved, disputed
    total_stake: float
    ai_model_id: str
    ai_model_name: str
    prediction_value: str
    confidence_score: float
    outcome: Optional[str] = None
    verification_status: str  # pending, verified, failed
    oracle_nodes: int = 3

class StakeRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prediction_id: str
    wallet_address: str
    amount: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DAOProposal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    proposer: str
    status: str  # active, passed, rejected
    votes_for: int
    votes_against: int
    total_votes: int
    end_date: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WalletBalance(BaseModel):
    wallet_address: str
    aion_balance: float
    staked_amount: float
    earned_rewards: float

class PlatformStats(BaseModel):
    total_predictions: int
    active_predictions: int
    total_ai_models: int
    total_value_locked: float
    total_staked: float
    accuracy_rate: float
    total_users: int

class LineraStakeRequest(BaseModel):
    market_id: int
    amount: int
    prediction: bool
    wallet_address: str

class LineraMarketRequest(BaseModel):
    market_id: str
    title: str
    description: str
    category: str
    event_date: int
    estimated_stake: Optional[float] = 0
    estimated_participants: Optional[int] = 0

class LineraStakeRequest(BaseModel):
    market_id: str
    amount: int
    prediction: bool
    user_address: str

# ============ SEED DATA ============

async def seed_database():
    # Check if data already exists
    existing_models = await db.ai_models.count_documents({})
    if existing_models > 0:
        return
    
    # Seed AI Models
    ai_models = [
        {
            "id": str(uuid.uuid4()),
            "name": "GPT-4 Oracle Alpha",
            "model_type": "GPT-4",
            "reputation_score": 95.8,
            "total_predictions": 1247,
            "correct_predictions": 1194,
            "accuracy_rate": 95.8,
            "total_staked": 125400.50,
            "total_earned": 89230.25,
            "rank": 1,
            "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=gpt4",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Claude Predictor",
            "model_type": "Claude-3",
            "reputation_score": 93.2,
            "total_predictions": 982,
            "correct_predictions": 915,
            "accuracy_rate": 93.2,
            "total_staked": 98500.00,
            "total_earned": 72340.80,
            "rank": 2,
            "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=claude",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Llama Vision Pro",
            "model_type": "Llama-3",
            "reputation_score": 91.5,
            "total_predictions": 1103,
            "correct_predictions": 1009,
            "accuracy_rate": 91.5,
            "total_staked": 87650.75,
            "total_earned": 65420.30,
            "rank": 3,
            "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=llama",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Gemini Forecast",
            "model_type": "Gemini-Pro",
            "reputation_score": 89.7,
            "total_predictions": 756,
            "correct_predictions": 678,
            "accuracy_rate": 89.7,
            "total_staked": 65430.20,
            "total_earned": 52100.50,
            "rank": 4,
            "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=gemini",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Mistral Oracle",
            "model_type": "Mistral-Large",
            "reputation_score": 87.3,
            "total_predictions": 634,
            "correct_predictions": 553,
            "accuracy_rate": 87.3,
            "total_staked": 54200.00,
            "total_earned": 43210.75,
            "rank": 5,
            "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=mistral",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.ai_models.insert_many(ai_models)
    
    # Seed Predictions
    categories = ["Finance", "Esports", "Climate", "Politics", "Technology"]
    predictions = []
    
    for i, model in enumerate(ai_models[:5]):
        for j in range(3):
            pred = {
                "id": str(uuid.uuid4()),
                "title": f"{categories[i]} Market Prediction #{j+1}",
                "description": f"Detailed prediction about {categories[i].lower()} market trends and outcomes.",
                "category": categories[i],
                "event_date": (datetime.now(timezone.utc) + timedelta(days=random.randint(7, 90))).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "status": random.choice(["active", "active", "resolved"]),
                "total_stake": round(random.uniform(5000, 50000), 2),
                "ai_model_id": model["id"],
                "ai_model_name": model["name"],
                "prediction_value": random.choice(["Bullish", "Bearish", "Neutral", "High Probability", "Low Probability"]),
                "confidence_score": round(random.uniform(0.75, 0.99), 2),
                "outcome": None if random.random() > 0.3 else "correct",
                "verification_status": random.choice(["pending", "verified", "pending"]),
                "oracle_nodes": 3
            }
            predictions.append(pred)
    
    await db.predictions.insert_many(predictions)
    
    # Seed DAO Proposals
    proposals = [
        {
            "id": str(uuid.uuid4()),
            "title": "Increase AI Model Stake Requirement",
            "description": "Proposal to increase minimum stake from 1000 to 5000 AION tokens to improve prediction quality.",
            "proposer": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
            "status": "active",
            "votes_for": 12450,
            "votes_against": 3420,
            "total_votes": 15870,
            "end_date": (datetime.now(timezone.utc) + timedelta(days=5)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Add New Market Category: DeFi",
            "description": "Proposal to add DeFi as a new prediction market category.",
            "proposer": "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
            "status": "active",
            "votes_for": 8920,
            "votes_against": 1240,
            "total_votes": 10160,
            "end_date": (datetime.now(timezone.utc) + timedelta(days=3)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Reduce Oracle Verification Time",
            "description": "Proposal to reduce oracle verification time from 24h to 12h.",
            "proposer": "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
            "status": "passed",
            "votes_for": 18500,
            "votes_against": 2100,
            "total_votes": 20600,
            "end_date": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()
        }
    ]
    await db.dao_proposals.insert_many(proposals)

# ============ ENDPOINTS ============

@api_router.get("/")
async def root():
    return {"message": "AION Prediction Market API", "version": "1.0.0"}

@api_router.get("/ai-models", response_model=List[AIModel])
async def get_ai_models():
    models = await db.ai_models.find({}, {"_id": 0}).sort("rank", 1).to_list(100)
    for model in models:
        if isinstance(model['created_at'], str):
            model['created_at'] = datetime.fromisoformat(model['created_at'])
    return models

@api_router.get("/ai-models/{model_id}", response_model=AIModel)
async def get_ai_model(model_id: str):
    model = await db.ai_models.find_one({"id": model_id}, {"_id": 0})
    if not model:
        raise HTTPException(status_code=404, detail="AI Model not found")
    if isinstance(model['created_at'], str):
        model['created_at'] = datetime.fromisoformat(model['created_at'])
    return model

@api_router.get("/predictions", response_model=List[Prediction])
async def get_predictions(status: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    
    predictions = await db.predictions.find(query, {"_id": 0}).to_list(1000)
    for pred in predictions:
        if isinstance(pred['created_at'], str):
            pred['created_at'] = datetime.fromisoformat(pred['created_at'])
        if isinstance(pred['event_date'], str):
            pred['event_date'] = datetime.fromisoformat(pred['event_date'])
    return predictions

@api_router.get("/predictions/{prediction_id}", response_model=Prediction)
async def get_prediction(prediction_id: str):
    prediction = await db.predictions.find_one({"id": prediction_id}, {"_id": 0})
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    if isinstance(prediction['created_at'], str):
        prediction['created_at'] = datetime.fromisoformat(prediction['created_at'])
    if isinstance(prediction['event_date'], str):
        prediction['event_date'] = datetime.fromisoformat(prediction['event_date'])
    return prediction

@api_router.post("/predictions/{prediction_id}/stake")
async def stake_on_prediction(prediction_id: str, wallet_address: str, amount: float):
    prediction = await db.predictions.find_one({"id": prediction_id})
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    stake_record = {
        "id": str(uuid.uuid4()),
        "prediction_id": prediction_id,
        "wallet_address": wallet_address,
        "amount": amount,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.stakes.insert_one(stake_record)
    
    # Update prediction total stake
    await db.predictions.update_one(
        {"id": prediction_id},
        {"$inc": {"total_stake": amount}}
    )
    
    return {"message": "Stake successful", "stake_id": stake_record["id"]}

@api_router.get("/dao-proposals", response_model=List[DAOProposal])
async def get_dao_proposals():
    proposals = await db.dao_proposals.find({}, {"_id": 0}).to_list(100)
    for prop in proposals:
        if isinstance(prop['created_at'], str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
        if isinstance(prop['end_date'], str):
            prop['end_date'] = datetime.fromisoformat(prop['end_date'])
    return proposals

@api_router.post("/dao-proposals/{proposal_id}/vote")
async def vote_on_proposal(proposal_id: str, wallet_address: str, vote: str):
    proposal = await db.dao_proposals.find_one({"id": proposal_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    if vote not in ["for", "against"]:
        raise HTTPException(status_code=400, detail="Vote must be 'for' or 'against'")
    
    # Update votes
    update_field = "votes_for" if vote == "for" else "votes_against"
    await db.dao_proposals.update_one(
        {"id": proposal_id},
        {"$inc": {update_field: 1, "total_votes": 1}}
    )
    
    return {"message": "Vote recorded successfully"}

@api_router.get("/wallet/{wallet_address}/balance", response_model=WalletBalance)
async def get_wallet_balance(wallet_address: str):
    # Mock balance for demo
    stakes = await db.stakes.find({"wallet_address": wallet_address}, {"_id": 0}).to_list(1000)
    staked_amount = sum(stake["amount"] for stake in stakes)
    
    return {
        "wallet_address": wallet_address,
        "aion_balance": round(random.uniform(1000, 100000), 2),
        "staked_amount": staked_amount,
        "earned_rewards": round(staked_amount * 0.15, 2)
    }

@api_router.get("/statistics", response_model=PlatformStats)
async def get_platform_stats():
    total_predictions = await db.predictions.count_documents({})
    active_predictions = await db.predictions.count_documents({"status": "active"})
    total_ai_models = await db.ai_models.count_documents({})
    
    # Calculate total value locked
    predictions = await db.predictions.find({}, {"_id": 0, "total_stake": 1}).to_list(1000)
    total_staked = sum(pred["total_stake"] for pred in predictions)
    
    # Calculate average accuracy
    models = await db.ai_models.find({}, {"_id": 0, "accuracy_rate": 1}).to_list(100)
    avg_accuracy = sum(model["accuracy_rate"] for model in models) / len(models) if models else 0
    
    return {
        "total_predictions": total_predictions,
        "active_predictions": active_predictions,
        "total_ai_models": total_ai_models,
        "total_value_locked": round(total_staked * 1.5, 2),
        "total_staked": round(total_staked, 2),
        "accuracy_rate": round(avg_accuracy, 2),
        "total_users": random.randint(5000, 15000)
    }

# ============ LINERA ENDPOINTS ============

def verify_api_key(x_api_key: str = Header(None)):
    api_key = os.getenv("API_KEY")
    if api_key and x_api_key != api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

@api_router.post("/linera/market")
async def create_linera_market(request: LineraMarketRequest, x_api_key: str = Header(None)):
    """Create market with hybrid chain allocation"""
    verify_api_key(x_api_key)
    result = await linera_adapter.create_market(
        market_id=request.market_id,
        title=request.title,
        description=request.description,
        category=request.category,
        event_date=request.event_date,
        estimated_stake=request.estimated_stake,
        estimated_participants=request.estimated_participants
    )
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    return result

@api_router.post("/linera/stake")
async def linera_stake(request: LineraStakeRequest):
    """Stake on market (auto-routes to correct chain)"""
    result = await linera_adapter.stake(
        market_id=request.market_id,
        amount=request.amount,
        prediction=request.prediction,
        user_address=request.user_address
    )
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    return result

@api_router.get("/linera/state")
async def get_linera_state(chain_id: Optional[str] = None, app_id: Optional[str] = None):
    """Query state from Linera (optionally specify chain)"""
    result = await linera_adapter.query_state(chain_id=chain_id, app_id=app_id)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@api_router.post("/linera/resolve/{market_id}")
async def resolve_linera_market(market_id: str, outcome: bool, x_api_key: str = Header(None)):
    """Resolve market (auto-routes to correct chain)"""
    verify_api_key(x_api_key)
    result = await linera_adapter.resolve_market(market_id=market_id, outcome=outcome)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    return result

# ============ HYBRID CHAIN MANAGEMENT ============

@api_router.get("/linera/market/{market_id}/chain")
async def get_market_chain_info(market_id: str):
    """Get chain allocation info for a market"""
    chain_info = linera_adapter.get_chain_info(market_id)
    return {
        "market_id": market_id,
        "chain_info": chain_info
    }

@api_router.get("/linera/chains")
async def get_all_chains():
    """Get overview of all active chains"""
    return {
        "main_chain": {
            "chain_id": linera_adapter.main_chain_id,
            "app_id": linera_adapter.main_app_id,
            "type": "main"
        },
        "dedicated_chains": [
            {
                "market_id": market_id,
                **chain_info
            }
            for market_id, chain_info in linera_adapter.market_chains.items()
            if chain_info.get("type") == "dedicated"
        ],
        "thresholds": {
            "high_value": linera_adapter.high_value_threshold,
            "high_volume": linera_adapter.high_volume_threshold
        }
    }

@api_router.post("/linera/market/{market_id}/migrate")
async def migrate_market_chain(
    market_id: str, 
    current_stake: float, 
    participant_count: int,
    x_api_key: str = Header(None)
):
    """Migrate market to dedicated chain if thresholds exceeded"""
    verify_api_key(x_api_key)
    result = await linera_adapter.migrate_to_dedicated_chain(
        market_id=market_id,
        current_stake=current_stake,
        participant_count=participant_count
    )
    return result

@api_router.get("/linera/config")
async def get_linera_config():
    """Get Linera configuration and thresholds"""
    return {
        "rpc_url": linera_adapter.rpc_url,
        "main_chain_id": linera_adapter.main_chain_id,
        "main_app_id": linera_adapter.main_app_id,
        "thresholds": {
            "high_value": linera_adapter.high_value_threshold,
            "high_volume": linera_adapter.high_volume_threshold
        },
        "strategy": "hybrid"
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await seed_database()
    logger.info("Database seeded successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# For Railway deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
