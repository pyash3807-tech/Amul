import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { Menu, Globe, LogOut, Settings as SettingsIcon, LayoutGrid, User } from 'lucide-react';

const TopbarContainer = styled.header`
  height: 64px;
  background-color: ${props => props.theme.isDark ? props.theme.card : 'rgba(255,255,255,0.8)'};
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${props => props.theme.isDark ? props.theme.border : 'transparent'};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  right: 0;
  left: ${props => props.collapsed ? '70px' : '240px'};
  transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 900;
  font-family: 'Public Sans', 'Inter', sans-serif;

  @media (max-width: 768px) {
    left: 0;
    padding: 0 16px;
    background-color: ${props => props.theme.card};
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuToggleBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LangPill = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid ${props => props.theme.primary};
  background-color: transparent;
  color: ${props => props.theme.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Public Sans', 'Inter', sans-serif;

  &:hover {
    background-color: ${props => `${props.theme.primary}08`};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserAvatar = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.theme.isDark ? '#3d4a5c' : '#c8d0d8'};
  color: ${props => props.theme.isDark ? '#fff' : '#637381'};
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-left: 4px;

  &:hover {
    opacity: 0.85;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 56px;
  right: 0;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  width: 220px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1100;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
`;

const DropdownName = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const DropdownEmail = styled.span`
  font-size: 12px;
  color: ${props => props.theme.muted};
  word-break: break-all;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.15s;
  color: ${props => props.danger ? props.theme.error : props.theme.text};

  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'};
  }
`;

const Topbar = ({ collapsed, sidebarOpen, setSidebarOpen, activeTab, setActiveTab, onOpenSettings, onLogout, user }) => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'en' ? 'gu' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('kps_lang', nextLang);
  };

  const emailDisplay = "abc13@gmail.com";

  return (
    <TopbarContainer theme={theme} collapsed={collapsed}>
      <LeftSection>
        <MenuToggleBtn theme={theme} onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </MenuToggleBtn>
        <LangPill theme={theme} onClick={handleLanguageToggle}>
          <Globe size={16} />
          {i18n.language === 'en' ? 'English' : 'ગુજરાતી'}
        </LangPill>
      </LeftSection>

      <RightSection>
        {/* User Profile */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <UserAvatar theme={theme} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <User size={18} />
          </UserAvatar>

          <Dropdown isOpen={dropdownOpen} theme={theme}>
            <DropdownHeader theme={theme}>
              <DropdownName>{user?.firstName} {user?.lastName}</DropdownName>
              <DropdownEmail theme={theme}>{emailDisplay}</DropdownEmail>
            </DropdownHeader>

            <DropdownItem theme={theme} onClick={() => { setDropdownOpen(false); setActiveTab('dashboard'); }}>
              <LayoutGrid size={16} />
              {t('Dashboard')}
            </DropdownItem>

            <DropdownItem theme={theme} onClick={() => { setDropdownOpen(false); onOpenSettings(); }}>
              <SettingsIcon size={16} />
              {t('Theme Settings')}
            </DropdownItem>

            <DropdownItem theme={theme} danger onClick={() => { setDropdownOpen(false); onLogout(); }}>
              <LogOut size={16} />
              {t('Logout')}
            </DropdownItem>
          </Dropdown>
        </div>
      </RightSection>
    </TopbarContainer>
  );
};

export default Topbar;
