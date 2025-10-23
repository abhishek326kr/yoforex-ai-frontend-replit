import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

// Cryptocurrencies verified to work with CoinPayments
// Based on CoinPayments API documentation and common support
const SUPPORTED_CRYPTOCURRENCIES = [
  { code: 'BTC', name: 'Bitcoin', icon: '₿', popular: true },
  { code: 'LTC', name: 'Litecoin', icon: 'Ł', popular: true },
  { code: 'ETH', name: 'Ethereum', icon: 'Ξ', popular: true },
  { code: 'BCH', name: 'Bitcoin Cash', icon: '₿', popular: true },
  { code: 'DOGE', name: 'Dogecoin', icon: 'Ð', popular: true },
  { code: 'DASH', name: 'Dash', icon: 'Đ', popular: true },
  { code: 'XMR', name: 'Monero', icon: 'ɱ', popular: false },
  { code: 'ZEC', name: 'Zcash', icon: 'ⓩ', popular: false },
  { code: 'XRP', name: 'Ripple', icon: '◉', popular: false },
  { code: 'ADA', name: 'Cardano', icon: '₳', popular: false },
  { code: 'DOT', name: 'Polkadot', icon: '●', popular: false },
  { code: 'LINK', name: 'Chainlink', icon: '⬢', popular: false },
  { code: 'TRX', name: 'TRON', icon: '◈', popular: false },
];

interface CryptoCurrencySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (currency: string) => void;
  plan: 'pro' | 'max';
}

export function CryptoCurrencySelector({ 
  open, 
  onOpenChange, 
  onSelect, 
  plan 
}: CryptoCurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BTC');

  const popularCurrencies = SUPPORTED_CRYPTOCURRENCIES.filter(c => c.popular);
  const otherCurrencies = SUPPORTED_CRYPTOCURRENCIES.filter(c => !c.popular);

  const handleConfirm = () => {
    onSelect(selectedCurrency);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Cryptocurrency</DialogTitle>
          <DialogDescription>
            Choose your preferred cryptocurrency to pay for the {plan.toUpperCase()} plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Popular Cryptocurrencies */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              Popular Choices
              <Badge variant="secondary" className="text-xs">Recommended</Badge>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {popularCurrencies.map((crypto) => (
                <button
                  key={crypto.code}
                  onClick={() => setSelectedCurrency(crypto.code)}
                  className={`p-3 rounded-lg border text-left transition-all hover:bg-muted/50 ${
                    selectedCurrency === crypto.code
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{crypto.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{crypto.code}</div>
                        <div className="text-xs text-muted-foreground">{crypto.name}</div>
                      </div>
                    </div>
                    {selectedCurrency === crypto.code && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Other Cryptocurrencies */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Other Options</h4>
            <div className="grid grid-cols-1 gap-1">
              {otherCurrencies.map((crypto) => (
                <button
                  key={crypto.code}
                  onClick={() => setSelectedCurrency(crypto.code)}
                  className={`p-2 rounded-md border text-left transition-all hover:bg-muted/50 ${
                    selectedCurrency === crypto.code
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{crypto.icon}</span>
                      <div>
                        <span className="font-medium text-sm">{crypto.code}</span>
                        <span className="text-xs text-muted-foreground ml-2">{crypto.name}</span>
                      </div>
                    </div>
                    {selectedCurrency === crypto.code && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1 btn-trading-primary">
              Pay with {selectedCurrency}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
