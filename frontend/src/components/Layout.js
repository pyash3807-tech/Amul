import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import ThemePanel from './ThemePanel';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.isDark ? props.theme.background : '#f9fafb'};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s;
  font-family: 'Public Sans', 'Inter', sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  margin-top: 64px;
  margin-left: ${props => props.sidebarCollapsed ? '70px' : '240px'};
  padding: 32px;
  transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px 16px;
    padding-bottom: 84px;
  }
`;

const Layout = ({ activeTab, setActiveTab, children, onLogout, user }) => {
  const { theme } = useContext(ThemeContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <PageWrapper theme={theme}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
      />
      <Topbar 
        collapsed={sidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={onLogout}
        user={user}
      />
      <MainContent sidebarCollapsed={sidebarCollapsed} theme={theme}>
        {children}
      </MainContent>
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={onLogout}
      />
      <ThemePanel 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </PageWrapper>
  );
};

export default Layout;
