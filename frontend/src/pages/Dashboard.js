import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { 
  ClipboardList, 
  Sun, 
  Moon, 
  DollarSign, 
  ArrowRight,
  Download
} from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  font-family: 'Public Sans', 'Inter', sans-serif;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 4px 0;
`;

const Breadcrumb = styled.div`
  font-size: 13px;
  color: ${props => props.theme.muted};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BreadLink = styled.span`
  cursor: pointer;
  color: ${props => props.theme.text};
  font-weight: 500;
  &:hover {
    color: ${props => props.theme.primary};
    text-decoration: underline;
  }
`;

const CompanyCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const CompanyText = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

// BANNER CARD
const BannerCard = styled.div`
  background: ${props => props.slide === 0 
    ? (props.theme.isDark ? '#212b36' : '#ffffff') 
    : 'linear-gradient(135deg, #0c53b7 0%, #161c24 100%)'};
  border-radius: 16px;
  min-height: 260px;
  padding: 32px;
  color: ${props => props.slide === 0 ? props.theme.text : '#fff'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: ${props => props.slide === 0 
    ? '0 8px 24px rgba(255, 72, 66, 0.08)' 
    : '0 8px 24px rgba(12, 83, 183, 0.2)'};
  border: ${props => props.slide === 0 ? '2px solid #ff4842' : `1px solid ${props.theme.border}`};
  position: relative;
  transition: all 0.3s ease;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 24px;
  }
`;

const SlideWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 24px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const WarningContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const WarningBadge = styled.span`
  background-color: #ff4842;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  width: fit-content;
  margin-bottom: 12px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const WarningMessage = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.isDark ? '#ff4842' : '#b71d18'};
  line-height: 1.5;
`;

const SlideLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.muted};
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 16px;
`;

const IllustrationSvg = ({ isDark }) => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="48" fill={isDark ? "rgba(255, 72, 66, 0.15)" : "rgba(255, 72, 66, 0.08)"} />
    <path d="M45 85 C45 68, 50 64, 60 64 C70 64, 75 68, 75 85 Z" fill={isDark ? "#919eab" : "#637381"} />
    <circle cx="60" cy="50" r="10" fill={isDark ? "#919eab" : "#637381"} />
    <rect x="72" y="52" width="22" height="32" rx="3" fill="#212b36" stroke="#454f5b" strokeWidth="2" />
    <rect x="76" y="56" width="14" height="24" fill="#fff" />
    <path d="M83 62 L87 69 L79 69 Z" fill="#ff4842" />
    <circle cx="83" cy="73" r="1" fill="#ff4842" />
    <path d="M25 45 L35 35 L45 42 L55 30" stroke="#00AB55" strokeWidth="2" strokeLinecap="round" />
    <path d="M25 55 L35 50 L45 52 L55 45" stroke="#ff4842" strokeWidth="2" strokeLinecap="round" />
    <circle cx="55" cy="30" r="2.5" fill="#00AB55" />
    <circle cx="55" cy="45" r="2.5" fill="#ff4842" />
  </svg>
);

const NavControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const NavArrow = styled.button`
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    background-color: ${props => props.theme.isDark ? '#2d3748' : '#f4f6f8'};
    color: ${props => props.theme.primary};
  }
`;

const BannerLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BannerTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(90deg, #ffffff, #919eab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const BannerSlogan = styled.p`
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  color: #00AB55;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ChartContainer = styled.div`
  width: 400px;
  height: 200px;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

// STATS ROW
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const IconBg = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${props => `${props.colorVal}15`};
  color: ${props => props.colorVal};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatNumber = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.muted};
  margin-top: 4px;
`;

// QUICK ACTIONS
const QuickActionsCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
`;

const ActionsHeader = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 20px;
  color: ${props => props.theme.text};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ViewBtn = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px ${props => `${props.theme.primary}24`};
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
    box-shadow: 0 6px 14px ${props => `${props.theme.primary}32`};
  }
`;

const DownloadBtn = styled.button`
  padding: 12px 24px;
  background-color: transparent;
  color: ${props => props.theme.primary};
  border: 1.5px solid ${props => props.theme.primary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => `${props.theme.primary}10`};
  }
`;

// Animated CountUp component
const CountUp = ({ end }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const stepTime = Math.abs(Math.floor(duration / end)) || 20;

    if (end === 0) {
      setCount(0);
      return;
    }

    const timer = setInterval(() => {
      start += Math.ceil(end / 40) || 1;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end]);

  return <>{typeof end === 'number' ? count.toLocaleString() : end}</>;
};

const Dashboard = ({ setActiveTab, token }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    morningOrders: 0,
    eveningOrders: 0,
    revenue: 0,
    weeklyTrends: []
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await axios.get(`/api/orders/summary?date=${todayStr}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) {
      fetchSummary();
    }
  }, [token]);

  // Recharts custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#212b36', 
          color: '#fff', 
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '12px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }}>
          <div>Date: {payload[0].payload.date}</div>
          <div style={{ color: '#00AB55' }}>Morning: {payload[0].payload.morning} crates</div>
          <div style={{ color: '#ef4444' }}>Evening: {payload[0].payload.evening} crates</div>
        </div>
      );
    }
    return null;
  };

  return (
    <Container>
      <PageTitle theme={theme}>Dashboard</PageTitle>
      <Breadcrumb theme={theme}>
        <span>Dashboard</span>
      </Breadcrumb>

      <CompanyCard theme={theme}>
        <CompanyText theme={theme}>Yash Milk Marketing-Rajkot-1007459M</CompanyText>
      </CompanyCard>

      <BannerCard theme={theme} slide={currentSlide}>
        {currentSlide === 0 ? (
          <SlideWrapper>
            <IllustrationSvg isDark={theme.isDark} />
            <WarningContent>
              <WarningBadge>
                ⚠ Warning
              </WarningBadge>
              <WarningMessage theme={theme}>
                Subscription is in wait state, please contact administrator...
              </WarningMessage>
              <SlideLabel theme={theme}>Subscription</SlideLabel>
            </WarningContent>
            <NavControls theme={theme}>
              <NavArrow theme={theme} onClick={() => setCurrentSlide(1)}>
                ▶
              </NavArrow>
            </NavControls>
          </SlideWrapper>
        ) : (
          <SlideWrapper>
            <BannerLeft>
              <BannerTitle>Amul Milk</BannerTitle>
              <BannerSlogan>અમૂલ દૂધ પીતા હે ઇન્ડિયા</BannerSlogan>
            </BannerLeft>
            <ChartContainer>
              {summary.weeklyTrends && summary.weeklyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="date" stroke="#919eab" fontSize={10} tickFormatter={(v) => v.substring(8, 10)} />
                    <YAxis stroke="#919eab" fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="morning" fill="#00AB55" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="evening" fill="#e63946" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>
                  Loading chart...
                </div>
              )}
            </ChartContainer>
            <NavControls theme={theme} style={{ marginLeft: '12px' }}>
              <NavArrow theme={theme} onClick={() => setCurrentSlide(0)}>
                ◀
              </NavArrow>
            </NavControls>
          </SlideWrapper>
        )}
      </BannerCard>

      <StatsGrid>
        <StatCard theme={theme}>
          <IconBg colorVal="#2065D1">
            <ClipboardList size={24} />
          </IconBg>
          <StatDetails>
            <StatNumber theme={theme}><CountUp end={summary.totalOrders} /></StatNumber>
            <StatLabel theme={theme}>{t('Total Orders Today')}</StatLabel>
          </StatDetails>
        </StatCard>

        <StatCard theme={theme}>
          <IconBg colorVal="#00AB55">
            <Sun size={24} />
          </IconBg>
          <StatDetails>
            <StatNumber theme={theme}><CountUp end={summary.morningOrders} /></StatNumber>
            <StatLabel theme={theme}>{t('Morning Orders')}</StatLabel>
          </StatDetails>
        </StatCard>

        <StatCard theme={theme}>
          <IconBg colorVal="#ff4842">
            <Moon size={24} />
          </IconBg>
          <StatDetails>
            <StatNumber theme={theme}><CountUp end={summary.eveningOrders} /></StatNumber>
            <StatLabel theme={theme}>{t('Evening Orders')}</StatLabel>
          </StatDetails>
        </StatCard>

        <StatCard theme={theme}>
          <IconBg colorVal="#f59e0b">
            <DollarSign size={24} />
          </IconBg>
          <StatDetails>
            <StatNumber theme={theme}>₹<CountUp end={summary.revenue} /></StatNumber>
            <StatLabel theme={theme}>{t('Revenue Today')}</StatLabel>
          </StatDetails>
        </StatCard>
      </StatsGrid>

      <QuickActionsCard theme={theme}>
        <ActionsHeader theme={theme}>Quick Actions</ActionsHeader>
        <ButtonRow>
          <ViewBtn theme={theme} onClick={() => setActiveTab('orders')}>
            <ClipboardList size={18} />
            {t('View Orders')}
            <ArrowRight size={16} />
          </ViewBtn>


        </ButtonRow>
      </QuickActionsCard>
    </Container>
  );
};

export default Dashboard;
