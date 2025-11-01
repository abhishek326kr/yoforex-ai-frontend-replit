from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class TradingPairEnum(str, Enum):
    EUR_USD = "EUR/USD"
    GBP_USD = "GBP/USD"
    USD_JPY = "USD/JPY"
    USD_CHF = "USD/CHF"
    AUD_USD = "AUD/USD"
    USD_CAD = "USD/CAD"
    NZD_USD = "NZD/USD"
    EUR_GBP = "EUR/GBP"
    EUR_JPY = "EUR/JPY"
    GBP_JPY = "GBP/JPY"


class TimeframeEnum(str, Enum):
    M1 = "1m"
    M5 = "5m"
    M15 = "15m"
    M30 = "30m"
    H1 = "1h"
    H4 = "4h"
    D1 = "1d"
    W1 = "1w"


class StrategyEnum(str, Enum):
    TREND_FOLLOWING = "Trend Following"
    BREAKOUT = "Breakout"
    SCALPING = "Scalping"
    SWING = "Swing Trading"
    POSITION = "Position Trading"


class AIModelEnum(str, Enum):
    GPT4 = "gpt-4"
    CLAUDE = "claude-3-opus"
    GEMINI = "gemini-pro"


class TradingPair(BaseModel):
    symbol: str
    name: str
    current_price: Optional[float] = None
    change_24h: Optional[float] = None


class AnalysisRequest(BaseModel):
    pair: str
    timeframe: str
    strategy: str
    use_ai: bool = True
    ai_models: Optional[List[str]] = None


class ManualAnalysisRequest(BaseModel):
    pair: str
    timeframe: str
    text_analysis: Optional[str] = None
    images: Optional[List[str]] = None
    ai_models: List[str]


class RiskMatrix(BaseModel):
    stop_loss: float
    take_profit: float
    risk_reward_ratio: float
    position_size: str


class Scenario(BaseModel):
    name: str
    probability: float
    description: str
    impact: str


class ConfidenceBreakdown(BaseModel):
    technical_analysis: float
    fundamental_analysis: float
    market_sentiment: float
    risk_assessment: float


class AIModelResult(BaseModel):
    model: str
    recommendation: str
    confidence: float
    reasoning: str
    confidence_breakdown: Optional[ConfidenceBreakdown] = None


class MultiModelResponse(BaseModel):
    consensus: str
    avg_confidence: float
    models: List[AIModelResult]
    final_recommendation: str


class AnalysisResult(BaseModel):
    id: str
    pair: str
    timeframe: str
    strategy: str
    recommendation: str
    confidence: float
    entry_price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    risk_reward_ratio: Optional[float] = None
    key_levels: Optional[Dict[str, Any]] = None
    analysis_summary: str
    risk_matrix: Optional[RiskMatrix] = None
    scenarios: Optional[List[Scenario]] = None
    confidence_breakdown: Optional[ConfidenceBreakdown] = None
    multi_model: Optional[MultiModelResponse] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class Signal(BaseModel):
    id: str
    pair: str
    direction: str
    entry_price: float
    stop_loss: float
    take_profit: float
    confidence: float
    status: str
    created_at: datetime


class Position(BaseModel):
    id: str
    pair: str
    direction: str
    entry_price: float
    current_price: float
    quantity: float
    pnl: float
    pnl_percentage: float
    opened_at: datetime


class Trade(BaseModel):
    id: str
    pair: str
    direction: str
    entry_price: float
    exit_price: Optional[float] = None
    quantity: float
    pnl: Optional[float] = None
    status: str
    opened_at: datetime
    closed_at: Optional[datetime] = None
