from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ...services.market_service import get_mock_news, get_mock_market_data

router = APIRouter(prefix="/market", tags=["Market Data"])


@router.get("/news", response_model=List[Dict[str, Any]])
async def get_news(limit: int = 10):
    """
    Get latest forex news and market updates.
    
    TODO: Integrate with real news API (NewsAPI, Bloomberg)
    TODO: Add sentiment analysis for market impact
    TODO: Filter by currency pairs and relevance
    """
    
    news = get_mock_news()
    return news[:limit]


@router.get("/data/{pair}", response_model=Dict[str, Any])
async def get_market_data(pair: str, timeframe: str = "1h"):
    """
    Get market data including OHLCV and technical indicators for a trading pair.
    
    TODO: Fetch real market data from forex provider
    TODO: Calculate accurate technical indicators
    TODO: Add real-time WebSocket support
    """
    
    valid_pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", 
                   "USD/CAD", "NZD/USD", "EUR/GBP", "EUR/JPY", "GBP/JPY"]
    
    if pair not in valid_pairs:
        raise HTTPException(
            status_code=404,
            detail=f"Trading pair {pair} not found. Valid pairs: {', '.join(valid_pairs)}"
        )
    
    return get_mock_market_data(pair, timeframe)
