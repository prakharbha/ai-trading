# AI Trading

Real-time order book and trades for BTC/USDT using Binance WebSocket streams.

## Features

- Live order book with depth visualization
- Real-time trade feed
- WebSocket connections persist across routes
- Binance dark theme styling

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Binance WebSocket API

## Setup

```bash
npm install
npm run dev
```

The dev server will start on `http://localhost:5173` (or next available port if 5173 is busy)

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── OrderBook.tsx
│   └── Trades.tsx
├── context/
│   └── BinanceWebSocketContext.tsx
├── types/
│   └── binance.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Routes

- `/book` - Order book
- `/trade` - Recent trades

## WebSocket Streams

Connects to two Binance streams:

1. Partial Book Depth (`@depth20@100ms`) - top 20 bids/asks, updates every 100ms
2. Aggregate Trades (`@aggTrade`) - live trade executions

WebSocket state is managed at the app level, so connections stay alive when navigating between routes.
