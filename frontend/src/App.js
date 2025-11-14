import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import ConnectWallet from './components/ConnectWallet';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Leaderboard from './pages/Leaderboard';
import PredictionDetail from './pages/PredictionDetail';
import Governance from './pages/Governance';
import { LayoutDashboard, Store, Trophy, Vote, Menu, X } from 'lucide-react';
import './App.css';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }`}
      data-testid={`nav-${to.replace('/', '') || 'home'}`}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
};

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" data-testid="logo">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AION
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <NavLink to="/" icon={LayoutDashboard}>
                Dashboard
              </NavLink>
              <NavLink to="/marketplace" icon={Store}>
                Marketplace
              </NavLink>
              <NavLink to="/leaderboard" icon={Trophy}>
                Leaderboard
              </NavLink>
              <NavLink to="/governance" icon={Vote}>
                Governance
              </NavLink>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <ConnectWallet />
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-btn"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
              <NavLink to="/" icon={LayoutDashboard}>
                Dashboard
              </NavLink>
              <NavLink to="/marketplace" icon={Store}>
                Marketplace
              </NavLink>
              <NavLink to="/leaderboard" icon={Trophy}>
                Leaderboard
              </NavLink>
              <NavLink to="/governance" icon={Vote}>
                Governance
              </NavLink>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 AION. Decentralized AI Prediction Market on Linera.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400">
                Docs
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400">
                Whitepaper
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400">
                GitHub
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/prediction/:id" element={<PredictionDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/governance" element={<Governance />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;