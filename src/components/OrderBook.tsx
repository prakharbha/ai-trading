import React, { useMemo } from 'react';
import { useBinanceWebSocket } from '../context/BinanceWebSocketContext';
import { OrderBookLevel } from '../types/binance';

const OrderBook: React.FC = () => {
  const { orderBook, isConnected } = useBinanceWebSocket();

  const maxTotal = useMemo(() => {
    const bidMax = Math.max(...orderBook.bids.map((b) => b.total || 0));
    const askMax = Math.max(...orderBook.asks.map((a) => a.total || 0));
    return Math.max(bidMax, askMax);
  }, [orderBook]);

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatQuantity = (quantity: string) => {
    return parseFloat(quantity).toFixed(5);
  };

  const getDepthPercentage = (total: number | undefined) => {
    if (!total || !maxTotal) return 0;
    return (total / maxTotal) * 100;
  };

  const renderOrderBookRow = (
    level: OrderBookLevel,
    type: 'bid' | 'ask',
    index: number
  ) => {
    const depthPercentage = getDepthPercentage(level.total);

    return (
      <div
        key={`${type}-${level.price}-${index}`}
        className="relative h-6 flex items-center text-xs font-mono"
      >
        <div
          className={`absolute inset-0 ${
            type === 'bid' ? 'bg-buy-bg' : 'bg-sell-bg'
          } opacity-60`}
          style={{
            width: `${depthPercentage}%`,
            right: type === 'bid' ? 0 : 'auto',
            left: type === 'ask' ? 0 : 'auto',
          }}
        />

          <div className="relative z-10 w-full grid grid-cols-3 gap-2 px-3">
          <div
            className={`text-left ${
              type === 'bid' ? 'text-buy' : 'text-sell'
            } font-semibold`}
          >
            {formatPrice(level.price)}
          </div>
          <div className="text-right text-text-primary">
            {formatQuantity(level.quantity)}
          </div>
          <div className="text-right text-text-secondary">
            {level.total?.toFixed(5) || '0.00000'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary">
      <div className="bg-bg-card p-4 border-b border-line">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Order Book - BTC/USDT</h1>
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
          <div className="bg-bg-secondary px-3 py-2 grid grid-cols-3 gap-2 text-xs font-semibold text-text-tertiary border-b border-line">
            <div className="text-left">Price (USDT)</div>
            <div className="text-right">Amount (BTC)</div>
            <div className="text-right">Total</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col-reverse">
              {orderBook.asks.length > 0 ? (
                orderBook.asks.map((ask, index) =>
                  renderOrderBookRow(ask, 'ask', index)
                )
              ) : (
                <div className="p-4 text-center text-text-tertiary text-sm">
                  Loading asks...
                </div>
              )}
            </div>

            {orderBook.bids.length > 0 && orderBook.asks.length > 0 && (
              <div className="bg-bg-card py-3 px-3 border-y border-line">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-tertiary">Spread:</span>
                  <span className="text-yellow-primary font-bold">
                    {formatPrice(orderBook.asks[0].price)} ↔{' '}
                    {formatPrice(orderBook.bids[0].price)}
                  </span>
                  <span className="text-text-secondary">
                    {(
                      parseFloat(orderBook.asks[0].price) -
                      parseFloat(orderBook.bids[0].price)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div>
              {orderBook.bids.length > 0 ? (
                orderBook.bids.map((bid, index) =>
                  renderOrderBookRow(bid, 'bid', index)
                )
              ) : (
                <div className="p-4 text-center text-text-tertiary text-sm">
                  Loading bids...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;

