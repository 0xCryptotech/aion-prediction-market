import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from linera_adapter import linera_adapter
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

class LineraIndexer:
    def __init__(self):
        self.mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
        self.db = self.mongo_client[os.getenv("DB_NAME")]
        self.markets_collection = self.db.markets
        self.sync_interval = 15  # seconds
    
    async def sync_markets(self):
        """Sync Linera state to MongoDB"""
        try:
            state = await linera_adapter.query_state()
            
            if "error" in state:
                print(f"Error querying state: {state['error']}")
                return
            
            markets = state.get("markets", [])
            
            for market in markets:
                await self.markets_collection.update_one(
                    {"market_id": market["id"]},
                    {
                        "$set": {
                            "market_id": market["id"],
                            "title": market["title"],
                            "description": market["description"],
                            "category": market["category"],
                            "event_date": market["event_date"],
                            "total_stake_yes": market["total_stake_yes"],
                            "total_stake_no": market["total_stake_no"],
                            "resolved": market["resolved"],
                            "outcome": market.get("outcome"),
                            "last_synced": datetime.utcnow()
                        }
                    },
                    upsert=True
                )
            
            print(f"Synced {len(markets)} markets at {datetime.utcnow()}")
        
        except Exception as e:
            print(f"Sync error: {e}")
    
    async def run(self):
        """Run indexer loop"""
        print("Starting Linera indexer...")
        while True:
            await self.sync_markets()
            await asyncio.sleep(self.sync_interval)

if __name__ == "__main__":
    indexer = LineraIndexer()
    asyncio.run(indexer.run())
