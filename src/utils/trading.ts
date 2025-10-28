// List of major forex pairs (OANDA codes) and commodities
const MAJOR_FOREX_PAIRS = [
  'EUR/USD', 'USD/JPY', 'GBP/USD', 'AUD/USD', 'USD/CAD',
  'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY',
  // Major commodity forex-style pairs
  'XAU/USD', 'XAG/USD', 'XPT/USD', 'XPD/USD', 'WTICO/USD', // WTI Crude
  'BCO/USD', // Brent Crude
  'NATGAS/USD', 'COPPER/USD', 'PLATINUM/USD', 'PALLADIUM/USD'
];

// Crypto pairs with their TradingView symbols
const CRYPTO_PAIRS: Record<string, string> = {
  'BTC/USD': 'BINANCE:BTCUSDT',
  'ETH/USD': 'BINANCE:ETHUSDT',
  'XRP/USD': 'BINANCE:XRPUSDT',
  'SOL/USD': 'BINANCE:SOLUSDT',
  'ADA/USD': 'BINANCE:ADAUSDT',
  'DOT/USD': 'BINANCE:DOTUSDT',
  'DOGE/USD': 'BINANCE:DOGEUSDT',
  'AVAX/USD': 'BINANCE:AVAXUSDT',
  'LINK/USD': 'BINANCE:LINKUSDT',
  'MATIC/USD': 'BINANCE:MATICUSDT',
  'BNB/USD': 'BINANCE:BNBUSDT',
  'XLM/USD': 'BINANCE:XLMUSDT',
  'UNI/USD': 'BINANCE:UNIUSDT',
  'ATOM/USD': 'BINANCE:ATOMUSDT',
  'LTC/USD': 'BINANCE:LTCUSDT'
};

// Stock indices list
const STOCK_INDICES = [
  'S&P 500', 'DOW', 'NASDAQ', 'DAX',
  'NIKKEI 225'
  // Indian Indices
  
];

// Indian stocks list
const INDIAN_STOCKS: Record<string, string> = {
  'RELIANCE': 'NSE:RELIANCE',
  'TCS': 'NSE:TCS',
  'HDFC BANK': 'NSE:HDFCBANK',
  'ICICI BANK': 'NSE:ICICIBANK',
  'HUL': 'NSE:HINDUNILVR',
  'INFOSYS': 'NSE:INFY',
  'ITC': 'NSE:ITC',
  'BHARTI AIRTEL': 'NSE:BHARTIARTL',
  'SBI': 'NSE:SBIN',
  'LT': 'NSE:LT',
  'HCL TECH': 'NSE:HCLTECH',
  'BAJAJ FINANCE': 'NSE:BAJFINANCE',
  'ASIAN PAINTS': 'NSE:ASIANPAINT',
  'HDFC LIFE': 'NSE:HDFCLIFE',
  'KOTAK MAHINDRA': 'NSE:KOTAKBANK',
  'TATA MOTORS': 'NSE:TATAMOTORS',
  'TATA STEEL': 'NSE:TATASTEEL',
  'WIPRO': 'NSE:WIPRO',
  'ADANI PORTS': 'NSE:ADANIPORTS',
  'NTPC': 'NSE:NTPC',
  'POWERGRID': 'NSE:POWERGRID',
  'ULTRATECH CEMENT': 'NSE:ULTRACEMCO',
  'TITAN': 'NSE:TITAN',
  'SUN PHARMA': 'NSE:SUNPHARMA',
  'NESTLE': 'NSE:NESTLEIND'
};

// Commodity TradingView symbols (fixed for OANDA compatibility)
const COMMODITY_SYMBOLS: Record<string, string> = {
  'XAU/USD': 'TVC:GOLD',
  'XAG/USD': 'TVC:SILVER',
  'WTICO/USD': 'TVC:USOIL',   
  'BCO/USD': 'TVC:UKOIL',     
  'NATGAS/USD': 'NATGASUSD', 
  'COPPER/USD': 'XCUUSD',     
  'XPT/USD': 'XPTUSD',
  'XPD/USD': 'XPDUSD'
};

interface FormattedSymbol {
  symbol: string;
  limitedTimeframes: boolean;
}

export const formatTradingViewSymbol = (pair: string): FormattedSymbol => {
  const cleanPair = pair.replace(/\s+/g, '').toUpperCase();

  if (cleanPair.includes(':')) {
    return { symbol: cleanPair, limitedTimeframes: false };
  }

  if (CRYPTO_PAIRS[pair]) {
    return { symbol: CRYPTO_PAIRS[pair], limitedTimeframes: false };
  }

  if (COMMODITY_SYMBOLS[pair]) {
    return { symbol: COMMODITY_SYMBOLS[pair], limitedTimeframes: false };
  }

  if (MAJOR_FOREX_PAIRS.includes(pair)) {
    if (!pair.startsWith('X') || !pair.includes('/USD')) {
      return { symbol: `FX:${cleanPair.replace('/', '')}`, limitedTimeframes: false };
    }
  }

  switch (pair) {
    case 'S&P 500': return { symbol: 'SPX', limitedTimeframes: false };
    case 'DOW': return { symbol: 'DOW', limitedTimeframes: false };
    case 'NASDAQ': return { symbol: 'IXIC', limitedTimeframes: false };
    case 'FTSE 100': return { symbol: 'FTSE:UKX', limitedTimeframes: false };
    case 'DAX': return { symbol: 'GER30', limitedTimeframes: false };
    case 'NIKKEI 225': return { symbol: 'JPN225', limitedTimeframes: false };
    case 'HANG SENG': return { symbol: 'HSI', limitedTimeframes: false };
    case 'ASX 200': return { symbol: 'AS51', limitedTimeframes: false };
    case 'CAC 40': return { symbol: 'CAC40', limitedTimeframes: false };
    case 'SENSEX': return { symbol: 'BSE:SENSEX', limitedTimeframes: false };
    case 'NIFTY 50': return { symbol: 'NSE:NIFTY50', limitedTimeframes: false };
    case 'NIFTY BANK': return { symbol: 'NSE:BANKNIFTY', limitedTimeframes: false };
    case 'NIFTY NEXT 50': return { symbol: 'NSE:JUNIORBEES', limitedTimeframes: false };
  }

  if (INDIAN_STOCKS[pair]) {
    return { symbol: INDIAN_STOCKS[pair], limitedTimeframes: false };
  }

  if (cleanPair.includes('/')) {
    return { symbol: `FX:${cleanPair.replace('/', '')}`, limitedTimeframes: false };
  }

  return { symbol: cleanPair, limitedTimeframes: false };
};

export const getTradingPairs = () => ({
  // Exclude all commodity-style pairs from the forex list
  // This filters out metals (XAU/USD, XAG/USD, XPT/USD, XPD/USD) and energy/metal commodities
  // like WTICO/USD, BCO/USD, NATGAS/USD, COPPER/USD, PLATINUM/USD, PALLADIUM/USD
  forex: MAJOR_FOREX_PAIRS.filter(pair => {
    const isMetalStyle = pair.startsWith('X') && pair.endsWith('/USD');
    const isCommodityKey = Object.prototype.hasOwnProperty.call(COMMODITY_SYMBOLS, pair);
    return !isMetalStyle && !isCommodityKey;
  }),
  crypto: Object.keys(CRYPTO_PAIRS),
  // Remove all NIFTY indices from UI
  indices: STOCK_INDICES.filter(name => !name.toUpperCase().includes('NIFTY')),
  indianStocks: Object.keys(INDIAN_STOCKS).sort(),
  commodities: Object.keys(COMMODITY_SYMBOLS)
});

// OANDA mapping function
export const mapToOandaInstrument = (pair: string): string => {
  const cleanPair = pair.trim().toUpperCase();

  // Special case for COPPER/USD - return XCU_USD for OANDA
  if (pair === 'COPPER/USD') {
    return 'XCU_USD';
  }

  // Forex Pairs (OANDA format: EUR_USD, USD_JPY etc.)
  if (MAJOR_FOREX_PAIRS.includes(pair)) {
    return cleanPair.replace('/', '_');
  }

  // Commodities in OANDA format (same as forex style but with underscore)
  if (COMMODITY_SYMBOLS[pair]) {
    return COMMODITY_SYMBOLS[pair];
  }

  // Crypto — OANDA doesn’t list BINANCE symbols, map only if they exist there
  if (CRYPTO_PAIRS[pair]) {
    // Example mapping, adjust if you have exact OANDA instrument names
    return cleanPair.replace('/', '_');
  }

  // Stock Indices mapping (common OANDA names)
  const indexMap: Record<string, string> = {
    'S&P 500': 'SPX500_USD',
    'DOW': 'US30_USD',
    'NASDAQ': 'NAS100_USD',
    'FTSE 100': 'UK100_GBP',
    'DAX': 'DE30_EUR',
    'NIKKEI 225': 'JP225_USD',
    'HANG SENG': 'HK33_HKD',
    'ASX 200': 'AU200_AUD',
    'CAC 40': 'FR40_EUR'
  };
  if (indexMap[cleanPair]) return indexMap[cleanPair];

  // Indian stocks — OANDA generally doesn’t have these, keep original
  if (INDIAN_STOCKS[pair]) {
    return INDIAN_STOCKS[pair]; // or some custom mapping if needed
  }

  // Default — just replace / with _
  else if (cleanPair.includes('/')) {
    return cleanPair.replace('/', '_');
  }

  return "EUR_USD"
};

