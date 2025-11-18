import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { OrderBookData, OrderBookLevel, AggTrade, Trade } from '../types/binance';

interface BinanceWebSocketContextType {
  orderBook: OrderBookData;
  trades: Trade[];
  isConnected: boolean;
}

const BinanceWebSocketContext = createContext<BinanceWebSocketContextType | undefined>(undefined);

export const useBinanceWebSocket = () => {
  const context = useContext(BinanceWebSocketContext);
  if (!context) {
    throw new Error('useBinanceWebSocket must be used within BinanceWebSocketProvider');
  }
  return context;
};

const SYMBOL = 'btcusdt';
const DEPTH_WS_URL = `wss://stream.binance.com:9443/ws/${SYMBOL}@depth20@100ms`;
const TRADE_WS_URL = `wss://stream.binance.com:9443/ws/${SYMBOL}@aggTrade`;
const MAX_TRADES = 100;

export const BinanceWebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
    lastUpdateId: 0,
  });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const depthWsRef = useRef<WebSocket | null>(null);
  const tradeWsRef = useRef<WebSocket | null>(null);
  const depthReconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const tradeReconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const calculateTotals = useCallback((levels: OrderBookLevel[]): OrderBookLevel[] => {
    let runningTotal = 0;
    return levels.map((level) => {
      runningTotal += parseFloat(level.quantity);
      return {
        ...level,
        total: runningTotal,
      };
    });
  }, []);

  const processDepthUpdate = useCallback((data: any) => {
    // Binance sends data in different formats, handle both
    const bidsArray = data.bids || data.b;
    const asksArray = data.asks || data.a;

    if (!bidsArray || !asksArray || !Array.isArray(bidsArray) || !Array.isArray(asksArray)) {
      return;
    }

    // Bids sorted high to low
    const bids: OrderBookLevel[] = bidsArray
      .map(([price, quantity]: [string, string]) => ({ price, quantity }))
      .filter((bid) => parseFloat(bid.quantity) > 0)
      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      .slice(0, 20);

    // Asks sorted low to high
    const asks: OrderBookLevel[] = asksArray
      .map(([price, quantity]: [string, string]) => ({ price, quantity }))
      .filter((ask) => parseFloat(ask.quantity) > 0)
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .slice(0, 20);

    setOrderBook({
      bids: calculateTotals(bids),
      asks: calculateTotals(asks),
      lastUpdateId: data.u || data.lastUpdateId || 0,
    });
  }, [calculateTotals]);

  const processAggTrade = useCallback((data: any) => {
    if (!data.p || !data.q || !data.T) {
      return;
    }

    const newTrade: Trade = {
      id: data.a || data.aggregateTradeId || Date.now(),
      price: data.p,
      quantity: data.q,
      time: data.T,
      isBuyerMaker: data.m !== undefined ? data.m : false,
    };

    setTrades((prev) => {
      // Skip duplicates
      const isDuplicate = prev.some(
        (trade) => trade.id === newTrade.id && trade.time === newTrade.time
      );
      
      if (isDuplicate) {
        return prev;
      }
      
      const updated = [newTrade, ...prev];
      return updated.slice(0, MAX_TRADES);
    });
  }, []);

  useEffect(() => {
    let depthWs: WebSocket;
    let tradeWs: WebSocket;

    const connectDepthStream = () => {
      if (depthWsRef.current) {
        depthWsRef.current.close();
      }

      depthWs = new WebSocket(DEPTH_WS_URL);
      depthWsRef.current = depthWs;

      depthWs.onopen = () => {
        setIsConnected(true);
      };

      depthWs.onmessage = (event) => {
        try {
          const data: any = JSON.parse(event.data);
          if ((data.bids && data.asks) || (data.b && data.a) || data.e === 'depthUpdate') {
            processDepthUpdate(data);
          }
        } catch (error) {
          // ignore parse errors
        }
      };

      depthWs.onerror = () => {
        // ignore errors
      };

      depthWs.onclose = (event) => {
        setIsConnected(false);
        if (event.code !== 1000) {
          if (depthReconnectTimeoutRef.current) {
            clearTimeout(depthReconnectTimeoutRef.current);
          }
          depthReconnectTimeoutRef.current = setTimeout(() => {
            connectDepthStream();
          }, 2000);
        }
      };
    };

    const connectTradeStream = () => {
      if (tradeWsRef.current) {
        tradeWsRef.current.close();
      }

      tradeWs = new WebSocket(TRADE_WS_URL);
      tradeWsRef.current = tradeWs;

      tradeWs.onopen = () => {};

      tradeWs.onmessage = (event) => {
        try {
          const data: any = JSON.parse(event.data);
          if (data.e === 'aggTrade' || (data.p && data.q && data.T)) {
            processAggTrade(data as AggTrade);
          }
        } catch (error) {
          // ignore parse errors
        }
      };

      tradeWs.onerror = () => {
        // ignore errors
      };

      tradeWs.onclose = (event) => {
        if (event.code !== 1000) {
          if (tradeReconnectTimeoutRef.current) {
            clearTimeout(tradeReconnectTimeoutRef.current);
          }
          tradeReconnectTimeoutRef.current = setTimeout(() => {
            connectTradeStream();
          }, 2000);
        }
      };
    };

    connectDepthStream();
    connectTradeStream();

    return () => {
      if (depthReconnectTimeoutRef.current) {
        clearTimeout(depthReconnectTimeoutRef.current);
      }
      if (tradeReconnectTimeoutRef.current) {
        clearTimeout(tradeReconnectTimeoutRef.current);
      }
      if (depthWsRef.current) {
        depthWsRef.current.close(1000);
      }
      if (tradeWsRef.current) {
        tradeWsRef.current.close(1000);
      }
    };
  }, [processDepthUpdate, processAggTrade]);

  const value: BinanceWebSocketContextType = {
    orderBook,
    trades,
    isConnected,
  };

  return (
    <BinanceWebSocketContext.Provider value={value}>
      {children}
    </BinanceWebSocketContext.Provider>
  );
};

