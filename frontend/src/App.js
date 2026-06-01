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
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLoginSuccess = (userToken, userData) => {
    setToken(userToken);
    setUser(userData);
    setActiveTab('dashboard');
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
        return <Dashboard setActiveTab={setActiveTab} token={token} />;
      case 'companies':
        return <Companies setActiveTab={setActiveTab} token={token} />;
      case 'users':
        return <Users setActiveTab={setActiveTab} token={token} />;
      case 'orders':
        return <Orders setActiveTab={setActiveTab} token={token} />;
      case 'vehicles':
        return <Vehicles setActiveTab={setActiveTab} token={token} />;
      case 'workers':
        return <Workers setActiveTab={setActiveTab} token={token} />;
      case 'account':
        return <Account setActiveTab={setActiveTab} token={token} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} token={token} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
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
