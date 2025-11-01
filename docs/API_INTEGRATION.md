# YoForex AI - API Integration Guide

**Complete guide for developers integrating YoForex AI into their applications.**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Rate Limiting](#rate-limiting)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Code Examples](#code-examples)
9. [WebSocket Support](#websocket-support)
10. [SDKs and Libraries](#sdks-and-libraries)

---

## Introduction

The YoForex AI API provides programmatic access to our AI trading analysis platform. Use our API to:

- Run AI analysis on currency pairs
- Access trading history and performance data
- Manage user subscriptions
- Retrieve market data and signals
- Build custom trading applications

**API Base URL:**
```
https://backend.yoforexai.com
```

**API Version:** v1 (current)

**Protocol:** REST (JSON)

**Data Format:** JSON

---

## Getting Started

### Prerequisites

Before integrating with our API, you'll need:

1. **YoForex AI Account** (Free or paid plan)
2. **API Key** (Generated from dashboard)
3. **Programming knowledge** (JavaScript, Python, or similar)
4. **HTTP client** (fetch, axios, requests, etc.)

### Create API Key

**Step 1: Login to Dashboard**
1. Visit https://yoforexai.com
2. Login to your account

**Step 2: Navigate to API Settings**
1. Click Settings → API Configuration
2. Click "Create New API Key"

**Step 3: Configure Permissions**
```
Available Permissions:
- Read Only: View data only (recommended for analytics)
- Trade: Execute analyses (for trading apps)
- Withdraw: Access funds (requires 2FA)
```

**Step 4: Generate & Save**
1. Click "Generate API Key"
2. **IMPORTANT**: Copy and save key immediately (shown only once!)
3. Store securely (environment variable, secrets manager)

**Example API Key:**
```
yf_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**Security Warning:**
- Never commit API keys to version control
- Never share API keys publicly
- Use environment variables
- Regenerate if compromised

---

## Authentication

All API requests must include authentication via **JWT Bearer Token**.

### Getting JWT Token

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "plan": "pro"
  }
}
```

**Token Expiry:**
- Default: 1 hour
- Refresh before expiry
- Store securely (not localStorage for sensitive apps)

### Using Authentication

**Include in every API request:**

**Header Format:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example with fetch (JavaScript):**
```javascript
const response = await fetch('https://backend.yoforexai.com/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(analysisData)
});
```

**Example with axios (JavaScript):**
```javascript
import axios from 'axios';

axios.defaults.baseURL = 'https://backend.yoforexai.com';
axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
```

**Example with requests (Python):**
```python
import requests

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

response = requests.post(
    'https://backend.yoforexai.com/api/analyze',
    headers=headers,
    json=analysis_data
)
```

### Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request:**
```json
{
  "refresh_token": "your_refresh_token"
}
```

**Response:**
```json
{
  "access_token": "new_access_token",
  "expires_in": 3600
}
```

**Best Practice:**
- Refresh token 5 minutes before expiry
- Implement automatic refresh logic
- Handle 401 errors by refreshing token

---

## API Endpoints

### Analysis Endpoints

#### Run Single AI Analysis

**Endpoint:** `POST /api/analyze`

**Request:**
```json
{
  "pair": "EUR/USD",
  "timeframe": "H1",
  "strategy": "breakout",
  "ai_model": "claude_sonnet"
}
```

**Response:**
```json
{
  "analysis_id": "ana_123456",
  "pair": "EUR/USD",
  "timeframe": "H1",
  "strategy": "breakout",
  "ai_model": "claude_sonnet",
  "result": {
    "action": "BUY",
    "entry": 1.0850,
    "stop_loss": 1.0825,
    "take_profit": 1.0900,
    "confidence": 78.5,
    "risk_reward": 2.0,
    "explanation": "Strong bullish momentum with breakout above resistance..."
  },
  "credits_used": 12500,
  "timestamp": "2025-11-01T12:30:00Z"
}
```

**Parameters:**
- `pair` (string, required): Currency pair (e.g., "EUR/USD")
- `timeframe` (string, required): M1, M5, M15, H1, H4, D1, W1, M
- `strategy` (string, required): breakout, ict, smc, fibonacci, etc.
- `ai_model` (string, optional): claude_sonnet, gpt4, mistral, etc.

---

#### Run Multi-AI Analysis

**Endpoint:** `POST /api/analyze/multi`

**Request:**
```json
{
  "pair": "GBP/JPY",
  "timeframe": "H4",
  "strategy": "fibonacci",
  "ai_models": ["claude_opus", "gpt4_turbo", "gemini_pro"]
}
```

**Response:**
```json
{
  "analysis_id": "ana_789012",
  "pair": "GBP/JPY",
  "timeframe": "H4",
  "consensus": {
    "action": "SELL",
    "entry_range": [189.40, 189.50],
    "stop_loss": 189.80,
    "take_profit": 188.60,
    "confidence": 82.3,
    "agreement_level": 85.0
  },
  "individual_results": [
    {
      "ai_model": "claude_opus",
      "action": "SELL",
      "entry": 189.45,
      "confidence": 80.0
    },
    {
      "ai_model": "gpt4_turbo",
      "action": "SELL",
      "entry": 189.42,
      "confidence": 85.0
    },
    {
      "ai_model": "gemini_pro",
      "action": "SELL",
      "entry": 189.48,
      "confidence": 82.0
    }
  ],
  "credits_used": 45000,
  "timestamp": "2025-11-01T14:15:00Z"
}
```

---

### Dashboard Endpoints

#### Get Account Summary

**Endpoint:** `GET /dashboard/account-summary`

**Response:**
```json
{
  "account_balance": 10250.00,
  "available_credits": 1450000,
  "subscription_plan": "pro",
  "monthly_pnl_percentage": 12.4,
  "account_currency": "USD"
}
```

---

#### Get Performance Data

**Endpoint:** `GET /dashboard/performance?period=weekly`

**Query Parameters:**
- `period` (optional): weekly, monthly, yearly

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

---

#### Get Top Performing Pairs

**Endpoint:** `GET /dashboard/top-pairs?limit=5`

**Response:**
```json
[
  {
    "pair": "EUR/USD",
    "win_rate": 78.5,
    "total_trades": 42,
    "avg_profit": 125.50,
    "total_profit": 5271.00
  }
]
```

---

### Trading Endpoints

#### Get Active Trades

**Endpoint:** `GET /trades/active`

**Response:**
```json
{
  "trades": [
    {
      "trade_id": "trd_123456",
      "pair": "EUR/USD",
      "direction": "BUY",
      "entry_price": 1.0850,
      "current_price": 1.0870,
      "stop_loss": 1.0825,
      "take_profit": 1.0900,
      "pnl": 200.00,
      "pnl_percentage": 0.18,
      "status": "open",
      "opened_at": "2025-11-01T10:00:00Z"
    }
  ],
  "total_count": 7,
  "total_pnl": 450.00
}
```

---

#### Get Trade History

**Endpoint:** `GET /trades/history?limit=50&offset=0`

**Query Parameters:**
- `limit` (optional): Number of trades (default: 50, max: 100)
- `offset` (optional): Pagination offset
- `pair` (optional): Filter by pair
- `from_date` (optional): ISO date string
- `to_date` (optional): ISO date string

**Response:**
```json
{
  "trades": [
    {
      "trade_id": "trd_789012",
      "pair": "GBP/JPY",
      "direction": "SELL",
      "entry_price": 189.50,
      "exit_price": 188.80,
      "profit": 350.00,
      "strategy": "fibonacci",
      "opened_at": "2025-10-30T08:00:00Z",
      "closed_at": "2025-10-31T15:30:00Z"
    }
  ],
  "total_count": 142,
  "has_more": true
}
```

---

### Billing Endpoints

#### Get Subscription Info

**Endpoint:** `GET /billing/subscription`

**Response:**
```json
{
  "plan": "pro",
  "status": "active",
  "credits_remaining": 8500000,
  "credits_total": 10000000,
  "next_billing_date": "2025-12-01",
  "amount": 69.00,
  "currency": "USD"
}
```

---

#### Get Invoices

**Endpoint:** `GET /billing/invoices?limit=10`

**Response:**
```json
{
  "invoices": [
    {
      "invoice_id": "inv_123456",
      "date": "2025-11-01",
      "amount": 69.00,
      "currency": "USD",
      "status": "paid",
      "download_url": "https://..."
    }
  ]
}
```

---

## Rate Limiting

**Rate limits prevent abuse and ensure fair usage.**

### Limits by Plan

| Plan | Requests/Hour | Requests/Day |
|------|---------------|--------------|
| Free | 100 | 1,000 |
| Pro | 1,000 | 10,000 |
| Max | 5,000 | 50,000 |

### Rate Limit Headers

Every response includes rate limit info:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1698854400
```

**Headers:**
- `X-RateLimit-Limit`: Total requests allowed per hour
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### Handling Rate Limits

**429 Too Many Requests Response:**
```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Try again in 3245 seconds.",
    "retry_after": 3245
  }
}
```

**Best Practices:**

**1. Check Headers:**
```javascript
const remaining = response.headers.get('X-RateLimit-Remaining');
if (remaining < 10) {
  console.warn('Approaching rate limit!');
}
```

**2. Implement Backoff:**
```javascript
async function analyzeWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await analyze(data);
      return response;
    } catch (error) {
      if (error.status === 429) {
        const retryAfter = error.headers['retry-after'] || 60;
        await sleep(retryAfter * 1000);
        continue;
      }
      throw error;
    }
  }
}
```

**3. Batch Requests:**
```javascript
// Bad: Rapid sequential requests
for (const pair of pairs) {
  await analyze(pair);  // Hits rate limit!
}

// Good: Batch and delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

for (const pair of pairs) {
  await analyze(pair);
  await delay(1000);  // 1 request/second
}
```

**4. Cache Results:**
```javascript
const cache = new Map();

async function analyzeWithCache(pair, timeframe) {
  const key = `${pair}_${timeframe}`;
  
  if (cache.has(key)) {
    const cached = cache.get(key);
    if (Date.now() - cached.timestamp < 60000) { // 1 min cache
      return cached.data;
    }
  }
  
  const data = await analyze(pair, timeframe);
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

---

## Error Handling

### Error Response Format

All errors follow consistent format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Temporary maintenance |

### Common Error Codes

#### `invalid_credentials`
```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "Email or password is incorrect"
  }
}
```

**Solution**: Verify email and password

---

#### `insufficient_credits`
```json
{
  "error": {
    "code": "insufficient_credits",
    "message": "Not enough credits to complete analysis",
    "details": {
      "required": 15000,
      "available": 5000
    }
  }
}
```

**Solution**: Upgrade plan or wait for monthly reset

---

#### `invalid_pair`
```json
{
  "error": {
    "code": "invalid_pair",
    "message": "Currency pair not supported",
    "details": {
      "pair": "XYZ/ABC"
    }
  }
}
```

**Solution**: Use valid pair (EUR/USD, GBP/JPY, etc.)

---

#### `analysis_failed`
```json
{
  "error": {
    "code": "analysis_failed",
    "message": "AI analysis failed to complete",
    "details": {
      "reason": "Market data unavailable"
    }
  }
}
```

**Solution**: Retry with different timeframe or pair

---

### Error Handling Example

**JavaScript:**
```javascript
try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    
    switch (error.error.code) {
      case 'insufficient_credits':
        alert('Please upgrade your plan');
        break;
      case 'rate_limit_exceeded':
        const retryAfter = error.error.retry_after;
        setTimeout(() => retry(), retryAfter * 1000);
        break;
      case 'invalid_credentials':
        logout();
        break;
      default:
        console.error('API Error:', error.error.message);
    }
    
    return;
  }

  const result = await response.json();
  // Process successful response
  
} catch (error) {
  console.error('Network error:', error);
  // Handle network errors
}
```

**Python:**
```python
import requests
from requests.exceptions import RequestException

try:
    response = requests.post(
        url,
        headers={'Authorization': f'Bearer {token}'},
        json=data,
        timeout=30
    )
    
    response.raise_for_status()
    result = response.json()
    
except requests.exceptions.HTTPError as e:
    error = e.response.json()
    error_code = error['error']['code']
    
    if error_code == 'insufficient_credits':
        print('Please upgrade your plan')
    elif error_code == 'rate_limit_exceeded':
        retry_after = error['error'].get('retry_after', 60)
        time.sleep(retry_after)
        # Retry request
    else:
        print(f"API Error: {error['error']['message']}")
        
except RequestException as e:
    print(f'Network error: {e}')
```

---

## Best Practices

### 1. Security

**Store API Keys Securely:**
```javascript
// ❌ Bad
const API_KEY = 'yf_live_abc123...';  // Hardcoded

// ✅ Good
const API_KEY = process.env.YOFOREX_API_KEY;
```

**Use Environment Variables:**
```bash
# .env file (never commit to git!)
YOFOREX_API_KEY=yf_live_abc123...
YOFOREX_API_URL=https://backend.yoforexai.com
```

**Add to .gitignore:**
```
.env
.env.local
*.key
secrets/
```

---

### 2. Token Management

**Implement Token Refresh:**
```javascript
let accessToken = null;
let tokenExpiry = null;

async function getValidToken() {
  if (!accessToken || Date.now() > tokenExpiry - 300000) {
    // Refresh 5 minutes before expiry
    const response = await refreshToken();
    accessToken = response.access_token;
    tokenExpiry = Date.now() + (response.expires_in * 1000);
  }
  return accessToken;
}

// Use in requests
const token = await getValidToken();
```

---

### 3. Request Optimization

**Batch Requests:**
```javascript
// Instead of multiple single requests
const results = await Promise.all([
  analyze('EUR/USD', 'H1'),
  analyze('GBP/JPY', 'H1'),
  analyze('USD/JPY', 'H1')
]);
```

**Use Pagination:**
```javascript
// Get large datasets in chunks
async function getAllTrades() {
  const allTrades = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await getTrades({ limit, offset });
    allTrades.push(...response.trades);
    
    if (!response.has_more) break;
    offset += limit;
  }
  
  return allTrades;
}
```

---

### 4. Error Recovery

**Implement Retry Logic:**
```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return await response.json();
      }
      
      // Don't retry client errors (4xx except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      // Retry server errors and rate limits
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;  // Exponential backoff
        await sleep(delay);
        continue;
      }
      
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

---

### 5. Logging and Monitoring

**Log API Interactions:**
```javascript
function logApiCall(endpoint, method, duration, status) {
  console.log({
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    duration,
    status
  });
}

async function apiCall(endpoint, options) {
  const start = Date.now();
  try {
    const response = await fetch(endpoint, options);
    logApiCall(endpoint, options.method, Date.now() - start, response.status);
    return response;
  } catch (error) {
    logApiCall(endpoint, options.method, Date.now() - start, 'ERROR');
    throw error;
  }
}
```

---

## Code Examples

### Complete JavaScript Example

```javascript
import axios from 'axios';

class YoForexClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://backend.yoforexai.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async login(email, password) {
    const response = await axios.post(`${this.baseURL}/auth/login`, {
      email,
      password
    });
    
    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    return response.data;
  }

  async getValidToken() {
    if (!this.accessToken || Date.now() > this.tokenExpiry - 300000) {
      throw new Error('Token expired. Please login again.');
    }
    return this.accessToken;
  }

  async analyze(pair, timeframe, strategy, aiModel = 'claude_sonnet') {
    const token = await this.getValidToken();
    
    const response = await axios.post(
      `${this.baseURL}/api/analyze`,
      {
        pair,
        timeframe,
        strategy,
        ai_model: aiModel
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  }

  async getActiveTrades() {
    const token = await this.getValidToken();
    
    const response = await axios.get(
      `${this.baseURL}/trades/active`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    return response.data;
  }

  async getDashboard() {
    const token = await this.getValidToken();
    
    const [summary, performance, topPairs] = await Promise.all([
      axios.get(`${this.baseURL}/dashboard/account-summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      axios.get(`${this.baseURL}/dashboard/performance?period=weekly`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      axios.get(`${this.baseURL}/dashboard/top-pairs?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);
    
    return {
      summary: summary.data,
      performance: performance.data,
      topPairs: topPairs.data
    };
  }
}

// Usage
const client = new YoForexClient(process.env.YOFOREX_API_KEY);

async function main() {
  try {
    // Login
    await client.login('user@example.com', 'password');
    
    // Run analysis
    const analysis = await client.analyze('EUR/USD', 'H1', 'breakout');
    console.log('Analysis:', analysis);
    
    // Get dashboard
    const dashboard = await client.getDashboard();
    console.log('Dashboard:', dashboard);
    
    // Get active trades
    const trades = await client.getActiveTrades();
    console.log('Active Trades:', trades);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

---

### Python Example

```python
import requests
import os
from datetime import datetime, timedelta

class YoForexClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('YOFOREX_API_KEY')
        self.base_url = 'https://backend.yoforexai.com'
        self.access_token = None
        self.token_expiry = None

    def login(self, email, password):
        response = requests.post(
            f'{self.base_url}/auth/login',
            json={'email': email, 'password': password}
        )
        response.raise_for_status()
        
        data = response.json()
        self.access_token = data['access_token']
        self.token_expiry = datetime.now() + timedelta(seconds=data['expires_in'])
        
        return data

    def get_valid_token(self):
        if not self.access_token or datetime.now() > self.token_expiry - timedelta(minutes=5):
            raise Exception('Token expired. Please login again.')
        return self.access_token

    def analyze(self, pair, timeframe, strategy, ai_model='claude_sonnet'):
        token = self.get_valid_token()
        
        response = requests.post(
            f'{self.base_url}/api/analyze',
            headers={'Authorization': f'Bearer {token}'},
            json={
                'pair': pair,
                'timeframe': timeframe,
                'strategy': strategy,
                'ai_model': ai_model
            }
        )
        response.raise_for_status()
        
        return response.json()

    def get_active_trades(self):
        token = self.get_valid_token()
        
        response = requests.get(
            f'{self.base_url}/trades/active',
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        
        return response.json()

    def get_dashboard(self):
        token = self.get_valid_token()
        
        # Parallel requests
        import concurrent.futures
        
        def fetch_summary():
            r = requests.get(
                f'{self.base_url}/dashboard/account-summary',
                headers={'Authorization': f'Bearer {token}'}
            )
            r.raise_for_status()
            return r.json()
        
        def fetch_performance():
            r = requests.get(
                f'{self.base_url}/dashboard/performance?period=weekly',
                headers={'Authorization': f'Bearer {token}'}
            )
            r.raise_for_status()
            return r.json()
        
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_summary = executor.submit(fetch_summary)
            future_performance = executor.submit(fetch_performance)
            
            return {
                'summary': future_summary.result(),
                'performance': future_performance.result()
            }

# Usage
if __name__ == '__main__':
    client = YoForexClient()
    
    try:
        # Login
        client.login('user@example.com', 'password')
        
        # Run analysis
        analysis = client.analyze('EUR/USD', 'H1', 'breakout')
        print('Analysis:', analysis)
        
        # Get dashboard
        dashboard = client.get_dashboard()
        print('Dashboard:', dashboard)
        
    except Exception as e:
        print(f'Error: {e}')
```

---

## WebSocket Support

**Real-time updates via WebSocket (Coming Soon)**

### Connection

```javascript
const ws = new WebSocket('wss://backend.yoforexai.com/ws');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    token: accessToken
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'trade_update':
      console.log('Trade updated:', data.trade);
      break;
    case 'price_update':
      console.log('Price update:', data.pair, data.price);
      break;
    case 'analysis_complete':
      console.log('Analysis ready:', data.analysis);
      break;
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket closed');
  // Implement reconnection logic
};
```

### Subscribe to Events

```javascript
// Subscribe to pair price updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'prices',
  pairs: ['EUR/USD', 'GBP/JPY']
}));

// Subscribe to trade updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'trades'
}));
```

**Note**: WebSocket support is planned for Q2 2026. Check documentation for updates.

---

## SDKs and Libraries

### Official SDKs (Coming Soon)

We're developing official SDKs for popular languages:

- **JavaScript/TypeScript** (Q1 2026)
- **Python** (Q1 2026)
- **PHP** (Q2 2026)
- **Ruby** (Q2 2026)
- **Go** (Q3 2026)

### Community Libraries

Check our GitHub organization for community-contributed libraries:
https://github.com/yoforexai

---

## Support

**Need help with API integration?**

- **Documentation**: This guide + [User Guide](USER_GUIDE.md)
- **API Support**: api-support@yoforex.net
- **Developer Forum**: https://community.yoforexai.com/developers
- **GitHub Issues**: Report bugs or request features
- **Discord**: Join our developer community (coming soon)

**Response Times:**
- Free: 48 hours
- Pro: 24 hours
- Max: 4 hours
- Critical issues: Prioritized

---

**API Version**: v1.0.0  
**Last Updated**: November 1, 2025

**Happy Coding! 🚀💻**
