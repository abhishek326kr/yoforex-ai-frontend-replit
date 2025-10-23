import apiClient from "./client";
import { API_BASE_URL } from "@/config/api";

export type CashfreeOrderResponse = {
  order_id: string;
  payment_session_id: string;
  amount: number;
  currency: string;
};

export async function startCashfreePlanOrder(params: {
  plan: "pro" | "max";
  currency?: string;
  return_url?: string;
  interval?: "monthly" | "yearly";
}): Promise<CashfreeOrderResponse> {
  const res = await apiClient.post<CashfreeOrderResponse>(
    "/billing/cashfree/plan/order",
    params
  );
  return res.data;
}

// Cashfree Tokens Top-up
export async function startCashfreeTokensOrder(params: {
  tokens: number;
  currency?: string;
  return_url?: string;
}): Promise<CashfreeOrderResponse> {
  const res = await apiClient.post<CashfreeOrderResponse>(
    "/billing/cashfree/tokens/order",
    params
  );
  return res.data;
}

// CoinPayments (Crypto) Checkout
export type CoinPaymentsCheckoutStartResponse = {
  txn_id: string;
  checkout_url: string;
};

export async function startCoinpaymentsCheckout(params: {
  plan: "pro" | "max";
  frontend_base?: string;
  currency?: string;
  interval?: "monthly" | "yearly";
}): Promise<CoinPaymentsCheckoutStartResponse> {
  const res = await apiClient.post<CoinPaymentsCheckoutStartResponse>(
    "/billing/coinpayments/checkout/start",
    params
  );
  return res.data;
}

// Transactions
export type TransactionInfo = {
  id: string;
  type: "subscription" | "credits";
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "processing" | "failed";
  paymentMethod: string;
};

export async function listTransactions(): Promise<TransactionInfo[]> {
  const res = await apiClient.get<TransactionInfo[]>("/billing/transactions");
  return res.data;
}

export type CashfreeOrderStatusResponse = {
  status: "paid" | "pending" | "failed" | "unknown";
  order_id: string;
  payment_id?: string;
  raw_status?: string;
  success_url: string;
  failure_url: string;
};

export async function getCashfreeOrderStatus(
  order_id: string,
  frontendBase?: string
): Promise<CashfreeOrderStatusResponse> {
  const res = await apiClient.get<CashfreeOrderStatusResponse>(
    "/billing/cashfree/order/status",
    {
      params: { order_id, frontend_base: frontendBase },
    }
  );
  return res.data;
}

// Cashfree finalize status (used by success page to check webhook completion)
export type CashfreeFinalizeStatus = {
  finalized: boolean;
  invoice_id?: string;
  plan: string;
};

export async function checkCashfreeFinalized(
  order_id: string
): Promise<CashfreeFinalizeStatus> {
  const res = await apiClient.get<CashfreeFinalizeStatus>(
    "/billing/cashfree/order/finalized",
    {
      params: { order_id },
    }
  );
  return res.data;
}

// Cashfree manual finalize in case webhook is delayed
export async function finalizeCashfreeNow(
  order_id: string,
  hints?: { plan?: "pro" | "max"; credits?: number }
): Promise<{
  status: string;
  finalized: boolean;
  invoice_id?: string;
  plan: string;
}> {
  const res = await apiClient.post<{
    status: string;
    finalized: boolean;
    invoice_id?: string;
    plan: string;
  }>("/billing/cashfree/order/finalize-now", {
    order_id,
    plan: hints?.plan,
    credits: hints?.credits,
  });
  return res.data;
}

// Invoices
export type InvoiceInfo = {
  invoice_id: string;
  created_at: string;
  currency?: string;
  totals?: { amount?: number };
  provider?: string;
  order_id?: string;
  payment_id?: string;
};

export async function listInvoices(): Promise<InvoiceInfo[]> {
  const res = await apiClient.get<InvoiceInfo[]>("/billing/invoices");
  return res.data;
}

export async function downloadInvoice(invoice_id: string): Promise<void> {
  // Use axios to fetch as blob so we can include auth and handle download reliably
  const res = await apiClient.get(
    `${API_BASE_URL}/billing/invoices/${encodeURIComponent(
      invoice_id
    )}/download`,
    {
      responseType: "blob",
    }
  );
  const blob = new Blob([res.data], { type: "text/html" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoice_id}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Plan Details
export type PlanDetailsResponse = {
  plan: string;
  status: string;
  monthly_price_usd: number;
  next_billing_date_iso: string;
  next_billing_date_human?: string | null;
  provider?: string;
  current_period_start_iso?: string | null;
  current_period_end_iso?: string | null;
  current_period_start_human?: string | null;
  current_period_end_human?: string | null;
  is_expired?: boolean | null;
  days_until_expiry?: number | null;
  is_expiring_soon?: boolean | null;
};

export async function getPlanDetails(): Promise<PlanDetailsResponse> {
  const res = await apiClient.get<PlanDetailsResponse>("/billing/plan/details");
  return res.data;
}
