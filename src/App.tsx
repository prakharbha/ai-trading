import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BinanceWebSocketProvider } from './context/BinanceWebSocketContext';
import OrderBook from './components/OrderBook';
import Trades from './components/Trades';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-bg-card border-b border-line px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-primary rounded-lg flex items-center justify-center text-bg-primary font-bold text-sm">
              AI
            </div>
            <span className="text-lg font-bold text-text-primary">Trading</span>
          </div>
          <div className="flex gap-1">
            <Link
              to="/book"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/book')
                  ? 'bg-yellow-primary text-bg-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-vessel'
              }`}
            >
              Order Book
            </Link>
            <Link
              to="/trade"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/trade')
                  ? 'bg-yellow-primary text-bg-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-vessel'
              }`}
            >
              Trades
            </Link>
          </div>
        </div>
        <div className="text-base text-text-tertiary">
          Dev: Prakhar Bhatiya ( <a href="mailto:prakhar@nandann.com" className="text-yellow-primary hover:underline">prakhar@nandann.com</a> )
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<OrderBook />} />
          <Route path="/book" element={<OrderBook />} />
          <Route path="/trade" element={<Trades />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <BinanceWebSocketProvider>
        <AppContent />
      </BinanceWebSocketProvider>
    </Router>
  );
};

export default App;

