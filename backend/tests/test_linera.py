import pytest
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from linera_adapter import LineraAdapter

@pytest.fixture
def adapter():
    return LineraAdapter()

@pytest.mark.asyncio
async def test_query_state(adapter):
    result = await adapter.query_state()
    assert result is not None

@pytest.mark.asyncio
async def test_create_market(adapter):
    result = await adapter.create_market(
        title="Test Market",
        description="Test Description",
        category="Finance",
        event_date=1735689600
    )
    assert "success" in result or "error" in result
