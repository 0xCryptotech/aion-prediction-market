from fastapi import FastAPI, APIRouter, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
import logging
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import random

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI(title="AION Prediction Market API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# MongoDB connection (lazy loading)
client = None

def get_db():
    """Lazy MongoDB connection - non-blocking"""
    global client
    if client is None:
        try:
            # Use MONGODB_URI or MONGO_URL from environment
            mongo_url = os.getenv("MONGODB_URI") or os.getenv("MONGO_URL")
            
            # Skip if no MongoDB or localhost (Railway doesn't have local MongoDB)
            if not mongo_url or "localhost" in mongo_url:
                logger.warning("No valid MongoDB URI configured (skipping localhost)")
                return None
            
            client = MongoClient(mongo_url, serverSelectionTimeoutMS=3000)
            # Don't test connection here - let it fail lazily
            logger.info("MongoDB client initialized")
        except Exception as e:
            logger.warning(f"MongoDB not available: {e}")
            return None
    
    db_name = os.getenv("DB_NAME", "aion_db")
    return client[db_name] if client else None

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

def seed_database():
    """Seed database with initial data - non-blocking"""
    db = get_db()
    if db is None:
        logger.info("MongoDB not available, skipping database seeding")
        return
    
    try:
        # Check if data already exists
        existing_models = db.ai_models.count_documents({})
        if existing_models > 0:
            logger.info("Database already seeded")
            return
    except Exception as e:
        logger.warning(f"Could not seed database: {e}")
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
    db.ai_models.insert_many(ai_models)
    
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
    
    db.predictions.insert_many(predictions)
    
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
    db.dao_proposals.insert_many(proposals)
    logger.info("Database seeded successfully")

# ============ ENDPOINTS ============

@app.get("/")
def root():
    return {"message": "AION Prediction Market API", "version": "1.0.0", "status": "online"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/test-db")
def test_db():
    db = get_db()
    if db is None:
        return {"db": "not connected"}
    return {"db": "connected"}

@api_router.get("/")
def api_root():
    return {"message": "AION Prediction Market API", "version": "1.0.0"}

@api_router.get("/ai-models", response_model=List[AIModel])
def get_ai_models():
    db = get_db()
    if db is None:
        return []
    models = list(db.ai_models.find({}, {"_id": 0}).sort("rank", 1).limit(100))
    for model in models:
        if isinstance(model['created_at'], str):
            model['created_at'] = datetime.fromisoformat(model['created_at'])
    return models

@api_router.get("/ai-models/{model_id}", response_model=AIModel)
def get_ai_model(model_id: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    model = db.ai_models.find_one({"id": model_id}, {"_id": 0})
    if not model:
        raise HTTPException(status_code=404, detail="AI Model not found")
    if isinstance(model['created_at'], str):
        model['created_at'] = datetime.fromisoformat(model['created_at'])
    return model

@api_router.get("/predictions", response_model=List[Prediction])
def get_predictions(status: Optional[str] = None, category: Optional[str] = None):
    db = get_db()
    if db is None:
        return []
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    
    predictions = list(db.predictions.find(query, {"_id": 0}).limit(1000))
    for pred in predictions:
        if isinstance(pred['created_at'], str):
            pred['created_at'] = datetime.fromisoformat(pred['created_at'])
        if isinstance(pred['event_date'], str):
            pred['event_date'] = datetime.fromisoformat(pred['event_date'])
    return predictions

@api_router.get("/predictions/{prediction_id}", response_model=Prediction)
def get_prediction(prediction_id: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    prediction = db.predictions.find_one({"id": prediction_id}, {"_id": 0})
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    if isinstance(prediction['created_at'], str):
        prediction['created_at'] = datetime.fromisoformat(prediction['created_at'])
    if isinstance(prediction['event_date'], str):
        prediction['event_date'] = datetime.fromisoformat(prediction['event_date'])
    return prediction

@api_router.post("/predictions/{prediction_id}/stake")
def stake_on_prediction(prediction_id: str, wallet_address: str, amount: float):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    prediction = db.predictions.find_one({"id": prediction_id})
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    stake_record = {
        "id": str(uuid.uuid4()),
        "prediction_id": prediction_id,
        "wallet_address": wallet_address,
        "amount": amount,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    db.stakes.insert_one(stake_record)
    
    # Update prediction total stake
    db.predictions.update_one(
        {"id": prediction_id},
        {"$inc": {"total_stake": amount}}
    )
    
    return {"message": "Stake successful", "stake_id": stake_record["id"]}

@api_router.get("/dao-proposals", response_model=List[DAOProposal])
def get_dao_proposals():
    db = get_db()
    if db is None:
        return []
    proposals = list(db.dao_proposals.find({}, {"_id": 0}).limit(100))
    for prop in proposals:
        if isinstance(prop['created_at'], str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
        if isinstance(prop['end_date'], str):
            prop['end_date'] = datetime.fromisoformat(prop['end_date'])
    return proposals

@api_router.post("/dao-proposals/{proposal_id}/vote")
def vote_on_proposal(proposal_id: str, wallet_address: str, vote: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    proposal = db.dao_proposals.find_one({"id": proposal_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    if vote not in ["for", "against"]:
        raise HTTPException(status_code=400, detail="Vote must be 'for' or 'against'")
    
    # Update votes
    update_field = "votes_for" if vote == "for" else "votes_against"
    db.dao_proposals.update_one(
        {"id": proposal_id},
        {"$inc": {update_field: 1, "total_votes": 1}}
    )
    
    return {"message": "Vote recorded successfully"}

@api_router.get("/wallet/{wallet_address}/balance", response_model=WalletBalance)
def get_wallet_balance(wallet_address: str):
    db = get_db()
    staked_amount = 0
    if db is not None:
        stakes = list(db.stakes.find({"wallet_address": wallet_address}, {"_id": 0}).limit(1000))
        staked_amount = sum(stake["amount"] for stake in stakes)
    
    return {
        "wallet_address": wallet_address,
        "aion_balance": round(random.uniform(1000, 100000), 2),
        "staked_amount": staked_amount,
        "earned_rewards": round(staked_amount * 0.15, 2)
    }

@api_router.get("/statistics", response_model=PlatformStats)
def get_platform_stats():
    db = get_db()
    if db is None:
        return {
            "total_predictions": 0,
            "active_predictions": 0,
            "total_ai_models": 0,
            "total_value_locked": 0,
            "total_staked": 0,
            "accuracy_rate": 0,
            "total_users": 0
        }
    
    total_predictions = db.predictions.count_documents({})
    active_predictions = db.predictions.count_documents({"status": "active"})
    total_ai_models = db.ai_models.count_documents({})
    
    # Calculate total value locked
    predictions = list(db.predictions.find({}, {"_id": 0, "total_stake": 1}).limit(1000))
    total_staked = sum(pred["total_stake"] for pred in predictions)
    
    # Calculate average accuracy
    models = list(db.ai_models.find({}, {"_id": 0, "accuracy_rate": 1}).limit(100))
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
# TODO: Add Linera integration endpoints here

@api_router.get("/linera/config")
def get_linera_config():
    """Get Linera configuration"""
    return {
        "status": "not_configured",
        "message": "Linera integration coming soon"
    }

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.getenv('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """Non-blocking startup"""
    logger.info("AION Backend starting up...")
    logger.info("Skipping database seeding on startup (call /api/seed manually if needed)")

@app.on_event("shutdown")
def shutdown_event():
    """Cleanup on shutdown"""
    global client
    if client:
        try:
            client.close()
            logger.info("MongoDB connection closed")
        except:
            pass
