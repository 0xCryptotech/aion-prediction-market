#!/usr/bin/env python3
import asyncio
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / "backend"))

from linera_adapter import linera_adapter
import argparse

async def create_market(args):
    result = await linera_adapter.create_market(
        title=args.title,
        description=args.description,
        category=args.category,
        event_date=args.event_date
    )
    print(f"Market created: {result}")

async def stake(args):
    result = await linera_adapter.stake(
        market_id=args.market_id,
        amount=args.amount,
        prediction=args.prediction
    )
    print(f"Stake result: {result}")

async def query(args):
    result = await linera_adapter.query_state()
    print(f"Current state: {result}")

async def resolve(args):
    result = await linera_adapter.resolve_market(
        market_id=args.market_id,
        outcome=args.outcome
    )
    print(f"Market resolved: {result}")

def main():
    parser = argparse.ArgumentParser(description="AION CLI for Linera operations")
    subparsers = parser.add_subparsers(dest="command")
    
    # Create market
    create_parser = subparsers.add_parser("create", help="Create new market")
    create_parser.add_argument("--title", required=True)
    create_parser.add_argument("--description", required=True)
    create_parser.add_argument("--category", required=True)
    create_parser.add_argument("--event-date", type=int, required=True)
    
    # Stake
    stake_parser = subparsers.add_parser("stake", help="Stake on market")
    stake_parser.add_argument("--market-id", type=int, required=True)
    stake_parser.add_argument("--amount", type=int, required=True)
    stake_parser.add_argument("--prediction", type=bool, required=True)
    
    # Query
    subparsers.add_parser("query", help="Query current state")
    
    # Resolve
    resolve_parser = subparsers.add_parser("resolve", help="Resolve market")
    resolve_parser.add_argument("--market-id", type=int, required=True)
    resolve_parser.add_argument("--outcome", type=bool, required=True)
    
    args = parser.parse_args()
    
    if args.command == "create":
        asyncio.run(create_market(args))
    elif args.command == "stake":
        asyncio.run(stake(args))
    elif args.command == "query":
        asyncio.run(query(args))
    elif args.command == "resolve":
        asyncio.run(resolve(args))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
