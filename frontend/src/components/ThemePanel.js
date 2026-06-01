import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { X, Sun, Moon, Check } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1200;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const PanelContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  border-left: 1px solid ${props => props.theme.border};
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 1300;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  padding-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  &:hover {
    background-color: ${props => props.theme.border};
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionLabel = styled.h4`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.muted};
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
`;

const ModeCardsContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const ModeCard = styled.div`
  flex: 1;
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background-color: ${props => props.active ? `${props.theme.primary}10` : 'transparent'};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  font-weight: 600;
  font-size: 14px;

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const PresetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const PresetBox = styled.div`
  height: 48px;
  border-radius: 8px;
  background-color: ${props => props.colorVal};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: transform 0.15s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  position: relative;

  &:hover {
    transform: scale(1.05);
  }
`;

const ActiveBorder = styled.div`
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px solid ${props => props.theme.text};
  border-radius: 11px;
  pointer-events: none;
`;

const ThemePanel = ({ isOpen, onClose }) => {
  const { isDark, preset, toggleTheme, changePreset, theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <PanelContainer isOpen={isOpen} theme={theme}>
        <Header theme={theme}>
          <Title>{t('Settings')}</Title>
          <CloseBtn theme={theme} onClick={onClose}>
            <X size={20} />
          </CloseBtn>
        </Header>

        {/* SECTION 1 - MODE */}
        <Section>
          <SectionLabel theme={theme}>{t('Mode')}</SectionLabel>
          <ModeCardsContainer>
            <ModeCard 
              active={!isDark} 
              theme={theme}
              onClick={() => isDark && toggleTheme()}
            >
              <Sun size={24} />
              <span>{t('Light')}</span>
            </ModeCard>
            <ModeCard 
              active={isDark} 
              theme={theme}
              onClick={() => !isDark && toggleTheme()}
            >
              <Moon size={24} />
              <span>{t('Dark')}</span>
            </ModeCard>
          </ModeCardsContainer>
        </Section>

        {/* SECTION 2 - COLOR PRESETS */}
        <Section>
          <SectionLabel theme={theme}>{t('Color Presets')}</SectionLabel>
          <PresetsGrid>
            {Object.keys(theme.presets).map(name => {
              const colorVal = theme.presets[name];
              const isActive = preset === name;
              return (
                <PresetBox 
                  key={name}
                  colorVal={colorVal}
                  onClick={() => changePreset(name)}
                >
                  {isActive && <Check size={18} strokeWidth={3} />}
                  {isActive && <ActiveBorder theme={theme} />}
                </PresetBox>
              );
            })}
          </PresetsGrid>
        </Section>
      </PanelContainer>
    </>
  );
};

export default ThemePanel;
