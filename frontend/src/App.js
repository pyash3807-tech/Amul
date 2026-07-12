import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import './i18n'; // Bootstrap translations
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Vehicles from './pages/Vehicles';
import Workers from './pages/Workers';
import Account from './pages/Account';

function AppContent() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#/', '');
    return hash || 'dashboard';
  });

  // Sync tab with URL hash for browser back/forward navigation support
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
  };

  const handleLoginSuccess = (userToken, userData) => {
    setToken(userToken);
    setUser(userData);
    handleTabChange('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  // Auth Guard
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={handleTabChange} token={token} />;
      case 'companies':
        return <Companies setActiveTab={handleTabChange} token={token} />;
      case 'users':
        return <Users setActiveTab={handleTabChange} token={token} />;
      case 'orders':
        return <Orders setActiveTab={handleTabChange} token={token} />;
      case 'vehicles':
        return <Vehicles setActiveTab={handleTabChange} token={token} />;
      case 'workers':
        return <Workers setActiveTab={handleTabChange} token={token} />;
      case 'account':
        return <Account setActiveTab={handleTabChange} token={token} />;
      default:
        return <Dashboard setActiveTab={handleTabChange} token={token} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={handleTabChange} 
      onLogout={handleLogout} 
      user={user}
    >
      {renderActivePage()}
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
