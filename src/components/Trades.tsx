import React, { useEffect, useRef } from 'react';
import { useBinanceWebSocket } from '../context/BinanceWebSocketContext';
import { Trade } from '../types/binance';

const Trades: React.FC = () => {
  const { trades, isConnected } = useBinanceWebSocket();
  const tradesContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  useEffect(() => {
    if (autoScrollRef.current && tradesContainerRef.current) {
      tradesContainerRef.current.scrollTop = 0;
    }
  }, [trades]);

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatQuantity = (quantity: string) => {
    return parseFloat(quantity).toFixed(5);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleScroll = () => {
    if (tradesContainerRef.current) {
      autoScrollRef.current = tradesContainerRef.current.scrollTop === 0;
    }
  };

  const renderTrade = (trade: Trade, index: number) => {
    const isBuy = !trade.isBuyerMaker;
    const isRecent = index < 3;
    const uniqueKey = `${trade.id}-${trade.time}-${index}`;

    return (
      <div
        key={uniqueKey}
        className={`grid grid-cols-3 gap-2 px-4 py-2 text-xs font-mono hover:bg-bg-vessel transition-colors ${
          isRecent ? 'bg-bg-card' : ''
        }`}
      >
        <div className={`text-left font-semibold ${isBuy ? 'text-buy' : 'text-sell'}`}>
          {formatPrice(trade.price)}
        </div>
        <div className="text-right text-text-primary">
          {formatQuantity(trade.quantity)}
        </div>
        <div className="text-right text-text-secondary">{formatTime(trade.time)}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary">
      <div className="bg-bg-card p-4 border-b border-line">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Recent Trades - BTC/USDT</h1>
            <p className="text-sm text-text-tertiary mt-1">
              Live aggregate trade stream from Binance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-buy' : 'bg-sell'
              }`}
            />
            <span className="text-sm text-text-secondary">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="bg-bg-secondary px-4 py-3 grid grid-cols-3 gap-2 text-xs font-semibold text-text-tertiary border-b border-line">
            <div className="text-left">Price (USDT)</div>
            <div className="text-right">Amount (BTC)</div>
            <div className="text-right">Time</div>
          </div>

          <div
            ref={tradesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto"
          >
            {trades.length > 0 ? (
              trades.map((trade, index) => renderTrade(trade, index))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-text-tertiary">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-sm">Waiting for trades...</div>
                </div>
              </div>
            )}
          </div>

          {trades.length > 0 && (
            <div className="bg-bg-secondary px-4 py-3 border-t border-line">
              <div className="flex items-center justify-between text-xs text-text-tertiary">
                <span>
                  Showing {trades.length} recent trade{trades.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-buy">●</span>
                    <span>Buy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sell">●</span>
                    <span>Sell</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trades;

