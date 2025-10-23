/// <reference types="vite/client" />

interface Window {
  TradingView: {
    widget: (options: any) => void;
  };
}