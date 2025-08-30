// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

/**
 * TradingViewCrossRatesWidget
 * - Safe ref checks, JSON.stringify config, and cleanup on unmount.
 * - Usage: <TradingViewCrossRatesWidget theme="light" width={750} height={420} currencies={['EUR','USD','JPY','GBP','CHF','AUD','CAD','NZD']} />
 */
function TradingViewWidget({
  theme = 'light',
  width = '100%',
  height = 420,
  currencies = ['EUR','USD','JPY','GBP','CHF','AUD','CAD','NZD'],
}: {
  theme?: 'light' | 'dark';
  width?: number | string;
  height?: number;
  currencies?: string[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

  // create a script element with the TradingView embed JSON config as its text
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.id = 'tradingview-forex-cross-rates';
  // use TradingView's external-embedding script for cross rates
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';

    const config = {
      colorTheme: theme === 'dark' ? 'dark' : 'light',
      isTransparent: false,
      locale: 'en',
      currencies,
      width,
      height,
    };

    // TradingView market/cross widget expects the config JSON as the script's innerHTML
    script.innerHTML = JSON.stringify(config);

    // append a wrapper div for TradingView to render into (keeps things isolated)
    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'tradingview-widget-container__widget';
    // ensure clean state
    while (container.firstChild) container.removeChild(container.firstChild);

  container.appendChild(script);
  // append wrapper after script so TradingView can mount into it when script runs
  container.appendChild(widgetWrapper);

    // cleanup: remove script and wrapper if we unmount or re-run
    // capture container in closure for safe cleanup
    const mountedContainer = container;
    return () => {
      if (!mountedContainer) return;
      const s = document.getElementById('tradingview-forex-cross-rates');
      if (s && s.parentNode) s.parentNode.removeChild(s);
      // remove any children the widget added
      while (mountedContainer.firstChild) mountedContainer.removeChild(mountedContainer.firstChild);
    };
  }, [theme, width, height, currencies]);

  return (
  <div className="tradingview-widget-container" ref={containerRef} style={{ width: typeof width === 'number' ? `${width}px` : width, minWidth: 300 }}>
      {/* TradingView will replace / render inside the appended widget wrapper */}
    </div>
  );
}

export default memo(TradingViewWidget);
