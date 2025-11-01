declare module '@cashfreepayments/cashfree-js' {
  export type Cashfree = {
    checkout: (options: {
      paymentSessionId: string;
      redirectTarget?: '_self' | '_blank' | '_modal';
      [key: string]: unknown;
    }) => Promise<void> | void;
  };

  export function load(options: { mode: 'sandbox' | 'production' }): Promise<Cashfree>;
}
