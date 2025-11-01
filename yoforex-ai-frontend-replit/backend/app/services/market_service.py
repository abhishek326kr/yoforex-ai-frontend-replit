import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
from ..schemas.trading import Signal, TradingPair


def get_mock_trading_pairs() -> List[TradingPair]:
    """
    Returns mock trading pairs with current prices.
    
    TODO: Integrate with real forex data provider (e.g., Alpha Vantage, OANDA)
    TODO: Implement WebSocket for real-time price updates
    """
    
    pairs = [
        {"symbol": "EUR/USD", "name": "Euro / US Dollar", "base_price": 1.0850},
        {"symbol": "GBP/USD", "name": "British Pound / US Dollar", "base_price": 1.2650},
        {"symbol": "USD/JPY", "name": "US Dollar / Japanese Yen", "base_price": 149.50},
        {"symbol": "USD/CHF", "name": "US Dollar / Swiss Franc", "base_price": 0.8850},
        {"symbol": "AUD/USD", "name": "Australian Dollar / US Dollar", "base_price": 0.6520},
        {"symbol": "USD/CAD", "name": "US Dollar / Canadian Dollar", "base_price": 1.3620},
        {"symbol": "NZD/USD", "name": "New Zealand Dollar / US Dollar", "base_price": 0.5980},
        {"symbol": "EUR/GBP", "name": "Euro / British Pound", "base_price": 0.8580},
        {"symbol": "EUR/JPY", "name": "Euro / Japanese Yen", "base_price": 162.25},
        {"symbol": "GBP/JPY", "name": "British Pound / Japanese Yen", "base_price": 189.15},
    ]
    
    return [
        TradingPair(
            symbol=p["symbol"],
            name=p["name"],
            current_price=round(p["base_price"] + random.uniform(-0.01, 0.01), 4),
            change_24h=round(random.uniform(-2.5, 2.5), 2)
        )
        for p in pairs
    ]


def get_mock_market_data(pair: str, timeframe: str = "1h") -> Dict[str, Any]:
    """
    Returns mock market data for a trading pair.
    
    TODO: Fetch real OHLCV data from forex provider
    TODO: Calculate real technical indicators (RSI, MACD, Bollinger Bands)
    TODO: Add volume and liquidity data
    """
    
    base_price = 1.0850 if "EUR" in pair else random.uniform(0.5, 150)
    
    candles = []
    current_time = datetime.now()
    
    for i in range(100):
        timestamp = current_time - timedelta(hours=100-i)
        open_price = base_price + random.uniform(-0.02, 0.02)
        close_price = open_price + random.uniform(-0.01, 0.01)
        high_price = max(open_price, close_price) + random.uniform(0, 0.005)
        low_price = min(open_price, close_price) - random.uniform(0, 0.005)
        
        candles.append({
            "timestamp": timestamp.isoformat(),
            "open": round(open_price, 5),
            "high": round(high_price, 5),
            "low": round(low_price, 5),
            "close": round(close_price, 5),
            "volume": random.randint(100000, 1000000)
        })
    
    return {
        "pair": pair,
        "timeframe": timeframe,
        "candles": candles,
        "indicators": {
            "rsi": round(random.uniform(30, 70), 2),
            "macd": {
                "macd": round(random.uniform(-0.001, 0.001), 5),
                "signal": round(random.uniform(-0.001, 0.001), 5),
                "histogram": round(random.uniform(-0.0005, 0.0005), 5)
            },
            "bollinger_bands": {
                "upper": round(base_price + 0.02, 5),
                "middle": round(base_price, 5),
                "lower": round(base_price - 0.02, 5)
            }
        }
    }


def get_mock_live_signals() -> List[Signal]:
    """
    Returns mock live trading signals.
    
    TODO: Generate signals from real-time analysis
    TODO: Implement signal filtering based on user preferences
    TODO: Add signal performance tracking
    """
    
    pairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/GBP"]
    directions = ["BUY", "SELL"]
    statuses = ["active", "pending", "closed"]
    
    signals = []
    for i in range(random.randint(3, 8)):
        pair = random.choice(pairs)
        direction = random.choice(directions)
        entry = round(random.uniform(1.0, 1.3), 5)
        
        signals.append(Signal(
            id=f"signal_{i}_{int(datetime.now().timestamp())}",
            pair=pair,
            direction=direction,
            entry_price=entry,
            stop_loss=round(entry - 0.005 if direction == "BUY" else entry + 0.005, 5),
            take_profit=round(entry + 0.015 if direction == "BUY" else entry - 0.015, 5),
            confidence=round(random.uniform(0.7, 0.95), 2),
            status=random.choice(statuses),
            created_at=datetime.now() - timedelta(hours=random.randint(1, 48))
        ))
    
    return signals


def get_mock_news() -> List[Dict[str, Any]]:
    """
    Returns mock forex news and market updates.
    
    TODO: Integrate with real news API (e.g., NewsAPI, Bloomberg)
    TODO: Add sentiment analysis for news impact
    TODO: Filter news by relevant currency pairs
    """
    
    news_items = [
        {
            "id": "news_1",
            "title": "Federal Reserve Signals Potential Rate Cut",
            "summary": "Fed officials hint at possible rate reduction in upcoming meetings, impacting USD strength.",
            "source": "Reuters",
            "published_at": (datetime.now() - timedelta(hours=2)).isoformat(),
            "impact": "high",
            "related_pairs": ["EUR/USD", "GBP/USD", "USD/JPY"]
        },
        {
            "id": "news_2",
            "title": "ECB Maintains Current Monetary Policy",
            "summary": "European Central Bank keeps interest rates unchanged amid economic uncertainty.",
            "source": "Bloomberg",
            "published_at": (datetime.now() - timedelta(hours=5)).isoformat(),
            "impact": "medium",
            "related_pairs": ["EUR/USD", "EUR/GBP"]
        },
        {
            "id": "news_3",
            "title": "Strong US Employment Data Boosts Dollar",
            "summary": "Better-than-expected jobs report strengthens USD across major pairs.",
            "source": "Financial Times",
            "published_at": (datetime.now() - timedelta(hours=8)).isoformat(),
            "impact": "high",
            "related_pairs": ["EUR/USD", "USD/JPY", "GBP/USD"]
        },
        {
            "id": "news_4",
            "title": "UK Inflation Exceeds Expectations",
            "summary": "British inflation rate rises above forecasts, affecting GBP volatility.",
            "source": "The Guardian",
            "published_at": (datetime.now() - timedelta(hours=12)).isoformat(),
            "impact": "medium",
            "related_pairs": ["GBP/USD", "EUR/GBP"]
        }
    ]
    
    return news_items
