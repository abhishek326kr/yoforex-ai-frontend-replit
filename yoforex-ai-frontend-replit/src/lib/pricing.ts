// Utilities for country-based pricing derived from user's phone country code
import { getCountryByDialCode } from "@/data/countries";

export type UserPricing = {
  currency: "USD" | "INR";
  symbol: string;
  rateToLocal: number; // multiply USD by this to get local
};

// Very small mapping. Extend if needed.
const CURRENCY_BY_ISO2_BASE: Record<string, Omit<UserPricing, "rateToLocal"> & Partial<UserPricing>> = {
  in: { currency: "INR", symbol: "₹" },
};

const DEFAULT_PRICING: UserPricing = { currency: "USD", symbol: "$", rateToLocal: 1 };

function extractDialFromPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  const digits = String(phone).replace(/\D/g, ''); // strip all non-digits
  if (!digits) return undefined;
  // Try longest plausible country code first (4 -> 1)
  for (let len = Math.min(4, digits.length); len >= 1; len--) {
    const maybe = digits.slice(0, len);
    const found = getCountryByDialCode(maybe);
    if (found) return maybe;
  }
  return undefined;
}

export function getUserPricing(): UserPricing {
  try {
    const raw = localStorage.getItem("userProfile");
    const phone = raw ? (JSON.parse(raw)?.phone as string | undefined) : undefined;
    const dial = extractDialFromPhone(phone);
    const country = dial ? getCountryByDialCode(dial) : undefined;
    if (country) {
      const iso = country.iso2.toLowerCase();
      // Dynamic FX for INR; fallback to last cached or default
      if (iso === 'in') {
        // Per requirement: show INR as USD * 92
        const rate = 92;
        return { currency: 'INR', symbol: '₹', rateToLocal: rate };
      }
      const base = CURRENCY_BY_ISO2_BASE[iso];
      if (base && base.currency === 'INR') {
        const rate = 92;
        return { currency: 'INR', symbol: base.symbol || '₹', rateToLocal: rate };
      }
      return DEFAULT_PRICING;
    }
  } catch {}
  return DEFAULT_PRICING;
}

export function formatPriceUSDToLocal(usdAmount: number, pricing: UserPricing = getUserPricing()): string {
  const local = Math.round(usdAmount * pricing.rateToLocal);
  return `${pricing.symbol}${local.toLocaleString()}`;
}

export function getUserPricingFromPhone(phone?: string | null): UserPricing {
  const dial = extractDialFromPhone(phone || undefined);
  const country = dial ? getCountryByDialCode(dial) : undefined;
  if (country) {
    const iso = country.iso2.toLowerCase();
    if (iso === 'in') {
      const rate = 92;
      return { currency: 'INR', symbol: '₹', rateToLocal: rate };
    }
  }
  return DEFAULT_PRICING;
}

// === FX rate caching and refresh (USD -> INR) ===
type FxCache = { rate: number; updatedAt: number };
const FX_KEY_USD_INR = 'fx:USDINR';
const FX_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getUsdInrRateCached(): number {
  try {
    const raw = localStorage.getItem(FX_KEY_USD_INR);
    if (raw) {
      const parsed = JSON.parse(raw) as FxCache;
      if (typeof parsed?.rate === 'number' && parsed.rate > 0) return parsed.rate;
    }
  } catch {}
  // conservative fallback
  return 85;
}

function isUsdInrStale(): boolean {
  try {
    const raw = localStorage.getItem(FX_KEY_USD_INR);
    if (!raw) return true;
    const parsed = JSON.parse(raw) as FxCache;
    const age = Date.now() - (parsed?.updatedAt || 0);
    return !(age >= 0 && age < FX_TTL_MS);
  } catch {
    return true;
  }
}

export async function refreshUsdInrRate(): Promise<number> {
  try {
    // Use a free, no-key API
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=INR');
    if (!res.ok) throw new Error(`FX fetch failed: ${res.status}`);
    const data = await res.json();
    const rate = Number(data?.rates?.INR);
    if (!rate || !isFinite(rate) || rate <= 0) throw new Error('Invalid INR rate');
    const cache: FxCache = { rate, updatedAt: Date.now() };
    try { localStorage.setItem(FX_KEY_USD_INR, JSON.stringify(cache)); } catch {}
    // dispatch a light custom event so pages can optionally re-render if listening
    try { window.dispatchEvent(new CustomEvent('fx:updated', { detail: { pair: 'USDINR', rate } })); } catch {}
    return rate;
  } catch {
    return getUsdInrRateCached();
  }
}
