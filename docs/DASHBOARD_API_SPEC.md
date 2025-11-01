# Dashboard API Specification

This document describes the backend API endpoints required for the YoForex AI Dashboard features.

## Base URL
All endpoints are relative to your API base URL: `https://backend.yoforexai.com`

## Authentication
All endpoints require JWT authentication via Bearer token in the `Authorization` header.

---

## Endpoints

### 1. Get Account Summary
**Endpoint:** `GET /dashboard/account-summary`

**Description:** Returns user's account balance, credits, subscription plan, and monthly P&L.

**Response:**
```json
{
  "account_balance": 10250.00,
  "available_credits": 1450,
  "subscription_plan": "pro",
  "monthly_pnl_percentage": 12.4,
  "account_currency": "USD"
}
```

**Fields:**
- `account_balance` (number): User's current account balance
- `available_credits` (number): Remaining AI analysis credits
- `subscription_plan` (string): One of: "free", "pro", "max"
- `monthly_pnl_percentage` (number): Month-to-date profit/loss percentage
- `account_currency` (string): Currency code (e.g., "USD", "EUR")

---

### 2. Get Performance Data
**Endpoint:** `GET /dashboard/performance`

**Description:** Returns P&L chart data for specified time period.

**Query Parameters:**
- `period` (string, optional): One of "weekly", "monthly", "yearly". Default: "weekly"

**Response:**
```json
{
  "data_points": [
    {
      "date": "2025-10-25",
      "profit": 245.50,
      "timestamp": 1729814400
    },
    {
      "date": "2025-10-26",
      "profit": -120.30,
      "timestamp": 1729900800
    }
  ],
  "period": "weekly",
  "total_pnl": 1250.00,
  "percentage_change": 12.4
}
```

**Fields:**
- `data_points` (array): Array of daily profit/loss data points
  - `date` (string): ISO date string
  - `profit` (number): Profit/loss for that day
  - `timestamp` (number, optional): Unix timestamp
- `period` (string): The time period returned
- `total_pnl` (number): Total profit/loss for the period
- `percentage_change` (number): Overall percentage change for the period

---

### 3. Get Top Performing Pairs
**Endpoint:** `GET /dashboard/top-pairs`

**Description:** Returns currency pairs with highest win rates.

**Query Parameters:**
- `limit` (number, optional): Number of pairs to return. Default: 5

**Response:**
```json
[
  {
    "pair": "EUR/USD",
    "win_rate": 78.5,
    "total_trades": 42,
    "avg_profit": 125.50,
    "total_profit": 5271.00
  },
  {
    "pair": "GBP/JPY",
    "win_rate": 72.3,
    "total_trades": 35,
    "avg_profit": 98.20,
    "total_profit": 3437.00
  }
]
```

**Fields:**
- `pair` (string): Currency pair symbol
- `win_rate` (number): Win rate percentage (0-100)
- `total_trades` (number): Total number of trades for this pair
- `avg_profit` (number, optional): Average profit per trade
- `total_profit` (number, optional): Total profit from all trades

---

### 4. Get Market Movers
**Endpoint:** `GET /dashboard/market-movers`

**Description:** Returns biggest price movers in the last 24 hours.

**Query Parameters:**
- `limit` (number, optional): Number of movers to return. Default: 5

**Response:**
```json
[
  {
    "pair": "EUR/USD",
    "price_change_percentage": 2.8,
    "direction": "up",
    "current_price": 1.0847,
    "volume_24h": 1250000
  },
  {
    "pair": "GBP/JPY",
    "price_change_percentage": -1.5,
    "direction": "down",
    "current_price": 189.45,
    "volume_24h": 890000
  }
]
```

**Fields:**
- `pair` (string): Currency pair symbol
- `price_change_percentage` (number): 24h price change percentage
- `direction` (string): "up" or "down"
- `current_price` (number, optional): Current price
- `volume_24h` (number, optional): 24-hour trading volume

---

### 5. Get Recent Activity
**Endpoint:** `GET /dashboard/recent-activity`

**Description:** Returns user's recent activities (trades, analyses, transactions).

**Query Parameters:**
- `limit` (number, optional): Number of activities to return. Default: 5

**Response:**
```json
[
  {
    "id": "act_123456",
    "type": "trade",
    "description": "Opened BUY position on EUR/USD",
    "timestamp": "2025-11-01T08:30:00Z",
    "metadata": {
      "pair": "EUR/USD",
      "direction": "BUY",
      "entry": 1.0847
    }
  },
  {
    "id": "act_123457",
    "type": "analysis",
    "description": "Ran AI analysis on GBP/JPY",
    "timestamp": "2025-11-01T07:15:00Z",
    "metadata": {
      "pair": "GBP/JPY",
      "strategy": "ICT Concept"
    }
  }
]
```

**Fields:**
- `id` (string): Unique activity ID
- `type` (string): One of: "trade", "analysis", "deposit", "withdrawal", "upgrade", "other"
- `description` (string): Human-readable activity description
- `timestamp` (string): ISO 8601 timestamp
- `metadata` (object, optional): Additional activity-specific data

---

### 6. Get Risk Metrics
**Endpoint:** `GET /dashboard/risk-metrics`

**Description:** Returns portfolio risk metrics.

**Response:**
```json
{
  "max_drawdown_percentage": -8.2,
  "risk_reward_ratio": 2.3,
  "open_positions_risk_amount": 450.00,
  "portfolio_var": 1250.00,
  "sharpe_ratio": 1.8,
  "total_exposure": 3500.00
}
```

**Fields:**
- `max_drawdown_percentage` (number): Maximum drawdown as negative percentage
- `risk_reward_ratio` (number): Overall risk/reward ratio
- `open_positions_risk_amount` (number): Total risk from open positions
- `portfolio_var` (number, optional): Portfolio Value at Risk
- `sharpe_ratio` (number, optional): Sharpe ratio
- `total_exposure` (number, optional): Total portfolio exposure

---

### 7. Get Portfolio Stats
**Endpoint:** `GET /dashboard/portfolio-stats`

**Description:** Returns overall portfolio statistics.

**Response:**
```json
{
  "active_trades": 7,
  "win_rate": 73.4,
  "ai_signals_24h": 156,
  "total_profit": 8450.50,
  "total_trades": 142
}
```

**Fields:**
- `active_trades` (number): Number of currently active trades
- `win_rate` (number): Overall win rate percentage
- `ai_signals_24h` (number): AI signals generated in last 24 hours
- `total_profit` (number): Total profit (all-time)
- `total_trades` (number): Total number of trades (all-time)

---

### 8. Get Dashboard Overview (Optional)
**Endpoint:** `GET /dashboard/overview`

**Description:** Returns all dashboard data in a single call for efficiency.

**Response:**
```json
{
  "account_summary": { /* AccountSummary object */ },
  "performance_data": { /* PerformanceData object */ },
  "top_pairs": [ /* TopPerformingPair array */ ],
  "market_movers": [ /* MarketMover array */ ],
  "recent_activity": [ /* ActivityItem array */ ],
  "risk_metrics": { /* RiskMetrics object */ }
}
```

This is a combined endpoint that returns all dashboard data at once. This is **optional** but recommended for better performance if fetching multiple data sets.

---

## Error Responses

All endpoints should return standard error responses:

**400 Bad Request:**
```json
{
  "detail": "Invalid period parameter. Must be one of: weekly, monthly, yearly"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Authentication required"
}
```

**429 Too Many Requests:**
```json
{
  "detail": {
    "code": "rate_limit_exceeded",
    "error": "Too many requests. Please try again later."
  }
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error occurred"
}
```

---

## Implementation Notes

1. **Caching:** Consider caching dashboard data for 30-60 seconds to reduce database load
2. **Pagination:** Activity endpoint should support pagination for users with many activities
3. **Real-time Updates:** Consider WebSocket support for real-time activity updates
4. **Data Aggregation:** Performance data and stats should be pre-aggregated for performance
5. **Security:** Ensure users can only access their own dashboard data

---

## Frontend Implementation

The frontend uses:
- **API Client:** `src/lib/api/dashboard.ts` - Contains all API functions
- **React Hooks:** `src/hooks/useDashboard.ts` - Contains React hooks for each endpoint
- **Dashboard Page:** `src/pages/Dashboard.tsx` - Uses these hooks to display data

### Usage Example:

```typescript
import { useAccountSummary, usePerformanceData } from '@/hooks/useDashboard';

function Dashboard() {
  const { data: accountData, loading, error } = useAccountSummary();
  const { data: performanceData } = usePerformanceData('weekly');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Balance: ${accountData?.account_balance}</h1>
      {/* ... */}
    </div>
  );
}
```

---

## Testing

Use these endpoints to test the frontend:
1. Create mock endpoints that return the example responses
2. Use tools like Postman or curl to verify responses
3. Check CORS headers are properly configured
4. Verify JWT authentication works correctly

---

## Questions?

If you have questions about these API specifications, please refer to:
- Frontend implementation: `src/lib/api/dashboard.ts`
- Type definitions in the same file show exact expected structure
- React hooks in `src/hooks/useDashboard.ts` show how data is consumed
