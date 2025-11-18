// Binance WebSocket API Types

export interface DepthUpdate {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  U: number; // First update ID in event
  u: number; // Final update ID in event
  b: [string, string][]; // Bids to be updated [price, quantity]
  a: [string, string][]; // Asks to be updated [price, quantity]
}

export interface OrderBookLevel {
  price: string;
  quantity: string;
  total?: number;
}

export interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastUpdateId: number;
}

export interface AggTrade {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  a: number; // Aggregate trade ID
  p: string; // Price
  q: string; // Quantity
  f: number; // First trade ID
  l: number; // Last trade ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
}

export interface Trade {
  id: number;
  price: string;
  quantity: string;
  time: number;
  isBuyerMaker: boolean;
}

