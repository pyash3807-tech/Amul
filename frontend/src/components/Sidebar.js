import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { 
  BarChart2, 
  Building2, 
  Users, 
  ClipboardList, 
  Truck, 
  HardHat, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

const SidebarContainer = styled.aside`
  width: ${props => props.collapsed ? '70px' : '240px'};
  background-color: ${props => props.theme.card};
  border-right: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  font-family: 'Public Sans', 'Inter', sans-serif;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TopHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  padding: 20px 16px 12px 16px;
  position: relative;
  min-height: 56px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  min-width: 36px;
`;

const ToggleBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.theme.isDark ? '#2d3748' : '#f4f6f8'};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.muted};
  display: ${props => props.collapsed ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => props.theme.isDark ? '#3d4a5c' : '#e9ecef'};
    color: ${props => props.theme.text};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const CollapsedToggle = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  color: ${props => props.theme.muted};
  display: ${props => props.collapsed ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${props => props.collapsed ? '12px 0' : '12px 16px'};
  background-color: ${props => props.theme.isDark ? '#2d3748' : '#f4f6f8'};
  border-radius: 12px;
  margin: ${props => props.collapsed ? '8px 8px' : '8px 16px'};
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  transition: all 0.25s;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.theme.isDark ? '#3d4a5c' : '#c8d0d8'};
  color: ${props => props.theme.isDark ? '#fff' : '#637381'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const NavList = styled.nav`
  flex: 1;
  padding: 0 8px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.border};
    border-radius: 4px;
  }
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.muted};
  padding: 20px 12px 8px 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2px;
  position: relative;
  color: ${props => props.active ? props.theme.primary : props.theme.isDark ? '#c4cdd5' : '#637381'};
  background-color: ${props => props.active ? `${props.theme.primary}12` : 'transparent'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 14px;
  transition: all 0.15s ease;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.active 
      ? `${props.theme.primary}18` 
      : props.theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(99,115,129,0.08)'};
    color: ${props => props.active ? props.theme.primary : props.theme.text};
  }

  svg {
    flex-shrink: 0;
  }

  /* Tooltip on collapsed hover */
  &::after {
    content: "${props => props.label}";
    position: absolute;
    left: 64px;
    background-color: #212b36;
    color: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s;
    display: ${props => props.collapsed ? 'block' : 'none'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
    z-index: 2000;
  }

  &:hover::after {
    opacity: 1;
  }
`;

/* Multi-color logo SVG matching the screenshot */
const LogoSvg = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Peacock/bird body */}
    <circle cx="24" cy="28" r="8" fill="#00AB55"/>
    <circle cx="24" cy="18" r="6" fill="#2065D1"/>
    {/* Feather plumes */}
    <path d="M12 12 C16 8, 20 10, 22 16" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M36 12 C32 8, 28 10, 26 16" stroke="#00AB55" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M8 20 C12 14, 18 14, 22 18" stroke="#2065D1" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M40 20 C36 14, 30 14, 26 18" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M16 6 C18 4, 22 6, 23 12" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M32 6 C30 4, 26 6, 25 12" stroke="#7635dc" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Eye */}
    <circle cx="24" cy="17" r="1.5" fill="#fff"/>
    {/* Beak */}
    <path d="M24 21 L22 23 L26 23 Z" fill="#f59e0b"/>
    {/* Feet */}
    <line x1="21" y1="36" x2="19" y2="42" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    <line x1="27" y1="36" x2="29" y2="42" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    {/* Small dots on feathers */}
    <circle cx="10" cy="16" r="2" fill="#f59e0b" opacity="0.6"/>
    <circle cx="38" cy="16" r="2" fill="#00AB55" opacity="0.6"/>
    <circle cx="14" cy="8" r="1.5" fill="#e63946" opacity="0.5"/>
    <circle cx="34" cy="8" r="1.5" fill="#7635dc" opacity="0.5"/>
  </svg>
);

const Sidebar = ({ collapsed, setCollapsed, activeTab, setActiveTab, user }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const navigation = {
    main: [
      { id: 'dashboard', label: t('Dashboard'), icon: BarChart2 }
    ],
    management: [
      { id: 'companies', label: t('Companies'), icon: Building2 },
      { id: 'users', label: t('Users'), icon: Users },
      { id: 'orders', label: t('Orders'), icon: ClipboardList },
      { id: 'vehicles', label: t('Vehicles'), icon: Truck },
      { id: 'workers', label: t('Workers'), icon: HardHat },
      { id: 'account', label: t('Account'), icon: TrendingUp }
    ]
  };

  return (
    <SidebarContainer collapsed={collapsed} theme={theme}>
      <TopHeader collapsed={collapsed}>
        {!collapsed && (
          <LogoWrapper>
            <LogoSvg />
          </LogoWrapper>
        )}
        <ToggleBtn onClick={() => setCollapsed(!collapsed)} theme={theme} collapsed={collapsed}>
          <ChevronLeft size={16} />
        </ToggleBtn>
        <CollapsedToggle onClick={() => setCollapsed(!collapsed)} theme={theme} collapsed={collapsed}>
          <ChevronRight size={16} />
        </CollapsedToggle>
      </TopHeader>

      <UserSection theme={theme} collapsed={collapsed}>
        <Avatar theme={theme}>
          {user?.firstName ? <User size={18} /> : <User size={18} />}
        </Avatar>
        <UserName theme={theme} collapsed={collapsed}>
          {user ? `${user.firstName} ${user.lastName}` : 'User'}
        </UserName>
      </UserSection>

      <NavList theme={theme}>
        <SectionLabel collapsed={collapsed} theme={theme}>MAIN</SectionLabel>
        {navigation.main.map(item => {
          const Icon = item.icon;
          return (
            <NavItem 
              key={item.id} 
              active={activeTab === item.id}
              label={item.label}
              collapsed={collapsed}
              onClick={() => setActiveTab(item.id)}
              theme={theme}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavItem>
          );
        })}

        <SectionLabel collapsed={collapsed} theme={theme}>MANAGEMENT</SectionLabel>
        {navigation.management.map(item => {
          const Icon = item.icon;
          return (
            <NavItem 
              key={item.id} 
              active={activeTab === item.id}
              label={item.label}
              collapsed={collapsed}
              onClick={() => setActiveTab(item.id)}
              theme={theme}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavItem>
          );
        })}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;
