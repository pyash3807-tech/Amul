import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
import axios from 'axios';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.isDark ? '#161c24' : '#f5f5f5'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Public Sans', 'Inter', sans-serif;
  transition: background-color 0.2s;
`;

const Card = styled.div`
  width: 960px;
  max-width: 100%;
  min-height: 560px;
  background-color: ${props => props.theme.card};
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// LEFT PANEL
const LeftPanel = styled.div`
  background: linear-gradient(145deg, #f7f9fa, #eef1f3);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  border-right: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00AB55, #007B3E);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 171, 85, 0.3);
`;

const WelcomeText = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #161c24;
  margin: 40px 0 12px 0;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #919eab;
  margin: 0;
  font-weight: 500;
`;

const IllustrationWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

// Running girl illustration SVG styled
const SvgIllustration = styled.svg`
  width: 240px;
  height: 240px;
`;

// RIGHT PANEL
const RightPanel = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 480px) {
    padding: 30px;
  }
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const FormSub = styled.p`
  font-size: 14px;
  color: ${props => props.theme.muted};
  margin: 0 0 32px 0;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.text};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  color: ${props => props.theme.muted};
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.error ? props.theme.error : props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? props.theme.error : props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.error ? `${props.theme.error}15` : `${props.theme.primary}15`};
  }
`;

const PassInput = styled(Input)`
  padding-right: 42px;
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: ${props => props.theme.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  &:hover {
    background-color: rgba(0,0,0,0.02);
  }
`;

const ForgotLink = styled.a`
  display: block;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.primary};
  text-decoration: none;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.span`
  display: block;
  font-size: 12px;
  color: ${props => props.theme.error};
  margin-top: 6px;
`;

const LoginBtn = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 24px;
  box-shadow: 0 8px 16px ${props => `${props.theme.primary}24`};
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
    transform: translateY(-1px);
    box-shadow: 0 10px 20px ${props => `${props.theme.primary}32`};
  }

  &:active {
    transform: translateY(0);
  }
`;

const DemoBox = styled.div`
  margin-top: 32px;
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed ${props => props.theme.border};
  background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};
`;

const DemoTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.muted};
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
`;

const DemoText = styled.div`
  font-size: 13px;
  color: ${props => props.theme.text};
  display: flex;
  justify-content: space-between;
`;

const Login = ({ onLoginSuccess }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('amul123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    let errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await axios.post('/api/auth/login', {
        username,
        password
      });
      
      const { token, user } = res.data;
      onLoginSuccess(token, user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Container theme={theme}>
      <Card theme={theme}>
        {/* LEFT PANEL */}
        <LeftPanel>
          <LogoWrapper>
            <Logo>🐄</Logo>
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#161c24' }}>KPS-Report</span>
          </LogoWrapper>
          <div>
            <WelcomeText>{t('Welcome Back')}</WelcomeText>
            <Subtitle>{t('Subtitle')}</Subtitle>
          </div>
          <IllustrationWrapper>
            <SvgIllustration viewBox="0 0 200 200">
              {/* Simple stylized SVG of a girl running/delivering milk */}
              <circle cx="100" cy="100" r="80" fill="#E8F8F0" />
              <path d="M75 140 L70 165 L60 162" stroke="#00AB55" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M105 140 L115 165 L125 163" stroke="#00AB55" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="95" cy="65" r="14" fill="#00AB55" />
              <path d="M95 80 Q95 140 85 140 Q115 140 105 80 Z" fill="#007B3E" />
              <path d="M100 90 L135 110" stroke="#00AB55" strokeWidth="5" strokeLinecap="round" />
              <path d="M90 90 L60 110" stroke="#00AB55" strokeWidth="5" strokeLinecap="round" />
              {/* Milk bottle container carried */}
              <rect x="130" y="105" width="16" height="24" rx="3" fill="#ffffff" stroke="#919eab" strokeWidth="2" />
              <rect x="135" y="101" width="6" height="4" fill="#ff4842" />
            </SvgIllustration>
          </IllustrationWrapper>
        </LeftPanel>

        {/* RIGHT PANEL */}
        <RightPanel theme={theme}>
          <FormTitle>{t('SignIn')}</FormTitle>
          <FormSub theme={theme}>{t('EnterDetails')}</FormSub>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#ffe8e6', 
                color: '#ff4842', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: 600,
                marginBottom: '20px' 
              }}>
                {error}
              </div>
            )}

            <InputGroup>
              <Label theme={theme}>{t('Username')}</Label>
              <InputWrapper>
                <InputIcon theme={theme}><UserIcon size={18} /></InputIcon>
                <Input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  error={fieldErrors.username}
                  theme={theme}
                />
              </InputWrapper>
              {fieldErrors.username && <ErrorMsg theme={theme}>{fieldErrors.username}</ErrorMsg>}
            </InputGroup>

            <InputGroup>
              <Label theme={theme}>{t('Password')}</Label>
              <InputWrapper>
                <InputIcon theme={theme}><Lock size={18} /></InputIcon>
                <PassInput 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  error={fieldErrors.password}
                  theme={theme}
                />
                <EyeBtn 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  theme={theme}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </EyeBtn>
              </InputWrapper>
              {fieldErrors.password && <ErrorMsg theme={theme}>{fieldErrors.password}</ErrorMsg>}
              <ForgotLink theme={theme}>{t('ForgotPassword')}</ForgotLink>
            </InputGroup>

            <LoginBtn type="submit" theme={theme}>{t('Login')}</LoginBtn>
          </form>

          <DemoBox theme={theme}>
            <DemoTitle theme={theme}>Demo Credentials</DemoTitle>
            <DemoText theme={theme}>
              <span>Username: <strong>admin</strong></span>
              <span>Password: <strong>amul123</strong></span>
            </DemoText>
          </DemoBox>
        </RightPanel>
      </Card>
    </Container>
  );
};

export default Login;
