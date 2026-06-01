import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { 
  BarChart2, 
  ClipboardList, 
  Building2, 
  Users, 
  MoreHorizontal,
  Truck,
  HardHat,
  TrendingUp,
  Settings,
  LogOut,
  Globe,
  X
} from 'lucide-react';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${props => props.theme.card};
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);

  @media (min-width: 769px) {
    display: none; /* Desktop hidden */
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? props.theme.primary : props.theme.muted};
  font-size: 11px;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  gap: 4px;
  padding: 4px 12px;
  transition: color 0.15s;
`;

const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1050;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DrawerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.card};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.15);
  z-index: 1100;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 24px;
  padding-bottom: calc(24px + 60px); /* Leave room for the bottom bar */
  max-height: 80vh;
  overflow-y: auto;
  color: ${props => props.theme.text};
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const DrawerTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
`;

const DrawerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const DrawerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.active ? `${props.theme.primary}10` : 'transparent'};
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  gap: 8px;
  text-align: center;
  transition: all 0.2s;

  &:active {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
  }
`;

const ActionItem = styled(DrawerItem)`
  color: ${props => props.danger ? props.theme.error : props.theme.text};
  border-color: ${props => props.danger ? `${props.theme.error}30` : props.theme.border};
`;

const BottomNav = ({ activeTab, setActiveTab, onOpenSettings, onLogout }) => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: t('Dashboard'), icon: BarChart2 },
    { id: 'orders', label: t('Orders'), icon: ClipboardList },
    { id: 'companies', label: t('Companies'), icon: Building2 },
    { id: 'users', label: t('Users'), icon: Users }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setDrawerOpen(false);
  };

  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'en' ? 'gu' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('kps_lang', nextLang);
  };

  const handleDrawerItemClick = (id) => {
    setActiveTab(id);
    setDrawerOpen(false);
  };

  return (
    <>
      <NavContainer theme={theme}>
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isTabActive = activeTab === tab.id;
          return (
            <NavItem 
              key={tab.id} 
              active={isTabActive} 
              theme={theme}
              onClick={() => handleTabClick(tab.id)}
            >
              <Icon size={22} />
              <span>{tab.label}</span>
            </NavItem>
          );
        })}
        <NavItem 
          active={drawerOpen || ['vehicles', 'workers', 'account'].includes(activeTab)} 
          theme={theme}
          onClick={() => setDrawerOpen(true)}
        >
          <MoreHorizontal size={22} />
          <span>{t('More')}</span>
        </NavItem>
      </NavContainer>

      <DrawerOverlay isOpen={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <DrawerContainer isOpen={drawerOpen} theme={theme}>
        <DrawerHeader>
          <DrawerTitle>{t('More')}</DrawerTitle>
          <div onClick={() => setDrawerOpen(false)} style={{ cursor: 'pointer' }}>
            <X size={20} />
          </div>
        </DrawerHeader>

        <DrawerGrid>
          <DrawerItem 
            active={activeTab === 'vehicles'} 
            theme={theme} 
            onClick={() => handleDrawerItemClick('vehicles')}
          >
            <Truck size={22} />
            <span>{t('Vehicles')}</span>
          </DrawerItem>

          <DrawerItem 
            active={activeTab === 'workers'} 
            theme={theme} 
            onClick={() => handleDrawerItemClick('workers')}
          >
            <HardHat size={22} />
            <span>{t('Workers')}</span>
          </DrawerItem>

          <DrawerItem 
            active={activeTab === 'account'} 
            theme={theme} 
            onClick={() => handleDrawerItemClick('account')}
          >
            <TrendingUp size={22} />
            <span>{t('Account')}</span>
          </DrawerItem>

          <ActionItem 
            theme={theme} 
            onClick={handleLanguageToggle}
          >
            <Globe size={22} />
            <span>{i18n.language === 'en' ? 'ગુજરાતી' : 'English'}</span>
          </ActionItem>

          <ActionItem 
            theme={theme} 
            onClick={() => { setDrawerOpen(false); onOpenSettings(); }}
          >
            <Settings size={22} />
            <span>{t('Settings')}</span>
          </ActionItem>

          <ActionItem 
            danger 
            theme={theme} 
            onClick={() => { setDrawerOpen(false); onLogout(); }}
          >
            <LogOut size={22} />
            <span>{t('Logout')}</span>
          </ActionItem>
        </DrawerGrid>
      </DrawerContainer>
    </>
  );
};

export default BottomNav;
