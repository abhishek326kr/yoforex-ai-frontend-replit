import { useEffect, useRef, memo, useMemo } from 'react';
import { formatTradingViewSymbol } from '@/utils/trading';


// Re-export the CandleData type for external use
export type { CandleData } from '@/lib/api/analysis';


declare global {
  interface Window {
    TradingView: {
      widget: (options: any) => void;
    };
  }
}

export interface TradingViewWidgetProps {
  symbol: string;
  interval?: string;
  theme?: 'light' | 'dark';
  autosize?: boolean;
  hideSideToolbar?: boolean;
  hideTopToolbar?: boolean;
  width?: string | number;
  height?: string | number;
  style?: string;
  allowSymbolChange?: boolean;
  saveImage?: boolean;
  showVolume?: boolean;
  hideVolume?: boolean;
  containerId?: string;
  onTimeframeChange?: (timeframe: string) => void;
  onCandleDataUpdate?: (data: any[]) => void;
}

const TradingViewWidget = ({
  symbol,
  interval = '60',
  theme = 'dark',
  autosize = true,
  hideSideToolbar = false,
  hideTopToolbar = false,
  width = '100%',
  height = '100%',
  style = '1',
  saveImage = true,
  showVolume = true,
  hideVolume = false,
  containerId = 'tradingview-widget-container',
  onTimeframeChange,
}: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);
  const prevSymbolRef = useRef<string>('');
  const prevIntervalRef = useRef<string>('');
  const widgetInstance = useRef<any>(null);

  // Format the symbol for TradingView and check if it has limited timeframes
  const { symbol: formattedSymbol, limitedTimeframes } = useMemo(() => formatTradingViewSymbol(symbol), [symbol]);
  
  // Handle interval for indices with limited timeframes (only D, W, M)
  const safeInterval = useMemo(() => {
    if (!limitedTimeframes) return interval;
    
    // Convert interval to uppercase for comparison
    const upperInterval = interval.toUpperCase();
    
    // If the interval is already one of the allowed ones, return it
    if (['D', 'W', 'M'].includes(upperInterval)) {
      return upperInterval;
    }
    
    // Default to 'D' (daily) for indices with limited timeframes
    return 'D';
  }, [interval, limitedTimeframes]);

  // Initialize widget
  useEffect(() => {
    const containerElement = container.current;
    if (!containerElement) return;

    // Clear container
    while (containerElement.firstChild) {
      containerElement.removeChild(containerElement.firstChild);
    }

    let script: HTMLScriptElement | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    const initialize = () => {
      // Check if TradingView script is already loaded
      if (window.TradingView) {
        initializeWidget();
        return;
      }

      // Check if script is already being loaded
      if (document.getElementById('tradingview-widget-script')) {
        // If script is still loading, wait for it
        timeoutId = setTimeout(() => {
          if (window.TradingView) {
            initializeWidget();
          }
        }, 500);
        return;
      }

      // Load TradingView script
      script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.id = 'tradingview-widget-script';
      
      script.onload = () => {
        if (window.TradingView) {
          initializeWidget();
        }
      };

      script.onerror = () => {
        console.error('Failed to load TradingView widget script');
      };

      document.body.appendChild(script);
    };

    // Add a small delay to prevent rapid re-initialization
    const initTimer = setTimeout(initialize, 100);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(timeoutId);
      
      // Clean up widget instance
      if (window.TradingView && typeof window.TradingView.widget === 'function') {
        const widgets = document.querySelectorAll('[id^=tradingview_]');
        widgets.forEach(widget => {
          widget.remove();
        });
      }
      
      // Clean up script if it was created by this component
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [formattedSymbol, safeInterval]);

  // Handle symbol and interval changes
  useEffect(() => {
    // Store previous values for comparison
    const prevSymbol = prevSymbolRef.current;
    const prevInterval = prevIntervalRef.current;
    
    // Check if we need to update
    const symbolChanged = formattedSymbol !== prevSymbol;
    const intervalChanged = safeInterval !== prevInterval;
    
    if (symbolChanged || intervalChanged) {
      console.log('Symbol or interval changed, reinitializing widget', {
        prevSymbol,
        newSymbol: formattedSymbol,
        prevInterval,
        newInterval: safeInterval
      });
      
      // Update refs with new values
      prevSymbolRef.current = formattedSymbol;
      prevIntervalRef.current = safeInterval;
      
      // Notify parent component about the timeframe change if needed
      if (limitedTimeframes && safeInterval !== interval && onTimeframeChange) {
        onTimeframeChange(safeInterval);
      }
      
      // Force reinitialization of the widget
      const cleanup = () => {
        if (widgetInstance.current) {
          try {
            widgetInstance.current.remove();
          } catch (e) {
            console.error('Error removing widget:', e);
          }
          widgetInstance.current = null;
        }
      };
      
      cleanup();
      
      // Add a small delay to ensure cleanup is complete
      const timer = setTimeout(() => {
        initializeWidget();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [formattedSymbol, safeInterval, limitedTimeframes, onTimeframeChange, interval]);

  const initializeWidget = () => {
    const containerElement = container.current;
    if (!containerElement || !window.TradingView) return;

    // Clear any existing widgets
    const existingWidgets = containerElement.querySelectorAll('[id^=tradingview_]');
    existingWidgets.forEach(widget => widget.remove());
    
    // Clear container
    while (containerElement.firstChild) {
      containerElement.removeChild(containerElement.firstChild);
    }
    
    // Create new container for the widget
    const widgetContainer = document.createElement('div');
    widgetContainer.id = containerId;
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';
    containerElement.appendChild(widgetContainer);

    // Initialize the widget
    const widgetOptions: any = {
      autosize,
      symbol: formattedSymbol,
      interval: safeInterval,
      timezone: 'exchange',
      theme,
      style,
      locale: 'en',
      toolbar_bg: '#1e1e2d',
      enable_publishing: false,
      allow_symbol_change: !limitedTimeframes,
      hide_side_toolbar: hideSideToolbar,
      hide_top_toolbar: hideTopToolbar,
      save_image: saveImage,
      hide_volume: hideVolume,
      container_id: containerId,
      ...(showVolume && { studies: ['Volume@tv-basicstudies'] }),
      overrides: {
        'paneProperties.background': '#131722',
        'paneProperties.vertGridProperties.color': 'rgba(255, 255, 255, 0.06)',
        'paneProperties.horzGridProperties.color': 'rgba(255, 255, 255, 0.06)',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#d1d4dc',
        'mainSeriesProperties.candleStyle.upColor': '#26a69a',
        'mainSeriesProperties.candleStyle.downColor': '#ef5350',
        'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
        'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
        'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
        'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
      },
      disabled_features: [
        'header_widget',
        'left_toolbar',
        'header_indicators',
        'header_chart_type',
        'header_chart_properties',
        'header_undo_redo',
        'header_screenshot',
        'header_saveload',
        'header_fullscreen_button',
        'timeframes_toolbar',
        'edit_buttons_in_legend',
        'context_menus',
        'legend_widget',
        'property_pages',
        'create_volume_indicator_by_default',
        'border_around_the_chart',
        'chart_property_page_style',
        'chart_property_page_scales',
      ],
      
    };

    try {
      // Using type assertion to handle the constructor call
      const TradingViewWidget = window.TradingView.widget as unknown as { new (options: any): any };
      new TradingViewWidget(widgetOptions);
    } catch (error) {
      console.error('Error initializing TradingView widget:', error);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      const containerElement = container.current;
      if (containerElement) {
        while (containerElement.firstChild) {
          containerElement.removeChild(containerElement.firstChild);
        }
      }
    };
  }, []);
  
  return (
    <div 
      id={containerId} 
      ref={container} 
      style={{
        width,
        height,
        minHeight: '400px',
        position: 'relative',
      }}
    >
      {limitedTimeframes && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
          Only D, W, M timeframes are supported for this symbol
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading chart...
        </div>
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
