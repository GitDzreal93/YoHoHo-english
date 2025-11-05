import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Button, Card, Icon } from '@components/index';
import { useAppStore } from '@stores/index';
import { useHapticFeedback } from '@hooks/index';

const ParentsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
`;

const ParentsHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
  color: white;
`;

const ParentsTitle = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  font-family: ${theme.typography.fontFamily.display};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.9);
  color: ${theme.colors.primary[600]};
  backdrop-filter: blur(10px);
`;

const AuthContainer = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.xl};
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
`;

const AuthIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.lg};
`;

const AuthTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.md};
`;

const AuthDescription = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.5;
`;

const PinInput = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: center;
  margin-bottom: ${theme.spacing.xl};
`;

const PinDigit = styled.input`
  width: 60px;
  height: 60px;
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  text-align: center;
  background: white;
  color: ${theme.colors.gray[900]};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }
`;

const AuthButton = styled(Button)`
  background: ${theme.colors.primary[500]};
  color: white;
  width: 100%;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing.md};
`;

const HelpButton = styled(Button)`
  background: rgba(255, 255, 255, 0.9);
  color: ${theme.colors.primary[600]};
  border: 1px solid ${theme.colors.primary[300]};
`;

const DashboardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
`;

const DashboardCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const CardIcon = styled.div<{ $color: string }>`
  font-size: 48px;
  margin-bottom: ${theme.spacing.md};
  color: ${({ $color }) => $color};
`;

const CardTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: \1}
  margin-bottom: ${theme.spacing.sm};
`;

const CardDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: \1}
  line-height: 1.4;
  margin-bottom: ${theme.spacing.md};
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.md};
  border-top: 1px solid \1}
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: \1}
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: \1}
  margin-top: ${theme.spacing.xs};
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const QuickActionButton = styled(Button)`
  background: rgba(255, 255, 255, 0.9);
  color: ${theme.colors.primary[600]};
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.md} ${theme.spacing.lg};
`;

const WelcomeBanner = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.xl};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

const WelcomeTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: \1}
  margin-bottom: ${theme.spacing.sm};
`;

const WelcomeText = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: \1}
  margin-bottom: ${theme.spacing.lg};
`;

const DEFAULT_PIN = '1234';

export const ParentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { onButtonPress, onSuccess, onError } = useHapticFeedback();
  const { user } = useAppStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleBackToHome = () => {
    onButtonPress();
    navigate('/');
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handlePinKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleVerifyPin = () => {
    const enteredPin = pin.join('');

    if (enteredPin.length !== 4) {
      setError('请输入完整的4位密码');
      onError();
      return;
    }

    if (enteredPin === DEFAULT_PIN) {
      setIsAuthenticated(true);
      onSuccess();
      onButtonPress();
    } else {
      setAttempts(prev => prev + 1);
      setError('密码错误，请重试');
      onError();
      setPin(['', '', '', '']);

      // Focus first input
      const firstInput = document.getElementById('pin-0') as HTMLInputElement;
      firstInput?.focus();

      // Lock after 3 attempts
      if (attempts >= 2) {
        setError('错误次数过多，请稍后再试');
        setTimeout(() => {
          setAttempts(0);
          setError('');
        }, 30000);
      }
    }
  };

  const handleGetHelp = () => {
    onButtonPress();
    // In a real app, this would open help or contact support
    alert('默认密码为1234，请妥善保管并及时修改密码');
  };

  const handleCardClick = (feature: string) => {
    onButtonPress();
    // Navigate to specific feature
    console.log(`Navigating to ${feature}`);
  };

  const handleLogout = () => {
    onButtonPress();
    setIsAuthenticated(false);
    setPin(['', '', '', '']);
    setAttempts(0);
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <ParentsContainer>
        <ParentsHeader>
          <BackButton
            onClick={handleBackToHome}
            icon={<Icon name="previous" />}
          >
            返回
          </BackButton>

          <ParentsTitle>
            <Icon name="parents" />
            家长专区
          </ParentsTitle>

          <div style={{ width: '100px' }} />
        </ParentsHeader>

        <AuthContainer>
          <AuthIcon>🔒</AuthIcon>
          <AuthTitle>家长认证</AuthTitle>
          <AuthDescription>
            请输入家长密码进入家长专区<br />
            此功能用于管理孩子的学习内容和时间
          </AuthDescription>

          <PinInput>
            {pin.map((digit, index) => (
              <PinDigit
                key={index}
                id={`pin-${index}`}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyPress(index, e.key)}
                placeholder="•"
              />
            ))}
          </PinInput>

          {error && (
            <div style={{ color: theme.colors.error[600], marginBottom: theme.spacing.md, fontSize: theme.typography.fontSize.sm }}>
              {error}
            </div>
          )}

          <AuthButton
            onClick={handleVerifyPin}
            icon={<Icon name="lock" />}
          >
            验证密码
          </AuthButton>

          <HelpButton
            onClick={handleGetHelp}
            icon={<Icon name="help" />}
          >
            忘记密码
          </HelpButton>
        </AuthContainer>
      </ParentsContainer>
    );
  }

  return (
    <ParentsContainer>
      <ParentsHeader>
        <div style={{ width: '100px' }} />

        <ParentsTitle>
          <Icon name="parents" />
          家长专区
        </ParentsTitle>

        <Button
          onClick={handleLogout}
          variant="secondary"
          icon={<Icon name="logout" />}
        >
          退出
        </Button>
      </ParentsHeader>

      <DashboardContainer>
        <WelcomeBanner>
          <WelcomeTitle>欢迎，家长！</WelcomeTitle>
          <WelcomeText>
            这里您可以查看孩子的学习进度，管理学习时间，以及调整应用设置。
            让我们一起陪伴孩子的成长！
          </WelcomeText>
          <QuickActions>
            <QuickActionButton
              icon={<Icon name="report" />}
              onClick={() => handleCardClick('reports')}
            >
              查看学习报告
            </QuickActionButton>
            <QuickActionButton
              icon={<Icon name="settings" />}
              onClick={() => handleCardClick('settings')}
            >
              管理设置
            </QuickActionButton>
          </QuickActions>
        </WelcomeBanner>

        <DashboardGrid>
          <DashboardCard onClick={() => handleCardClick('progress')}>
            <CardIcon $color={theme.colors.primary[600]}>
              <Icon name="chart" />
            </CardIcon>
            <CardTitle>学习进度</CardTitle>
            <CardDescription>
              查看孩子的详细学习数据，包括单词掌握情况、游戏成绩和学习时长统计
            </CardDescription>
            <CardStats>
              <StatItem>
                <StatValue>156</StatValue>
                <StatLabel>学习单词</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>12.5</StatValue>
                <StatLabel>学习小时</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>85%</StatValue>
                <StatLabel>平均正确率</StatLabel>
              </StatItem>
            </CardStats>
          </DashboardCard>

          <DashboardCard onClick={() => handleCardClick('time-control')}>
            <CardIcon $color={theme.colors.success[600]}>
              <Icon name="timer" />
            </CardIcon>
            <CardTitle>时间管理</CardTitle>
            <CardDescription>
              设置每日学习时间限制，合理安排学习和休息时间，培养良好学习习惯
            </CardDescription>
            <CardStats>
              <StatItem>
                <StatValue>30分钟</StatValue>
                <StatLabel>每日限制</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>15分钟</StatValue>
                <StatLabel>今日已学</StatLabel>
              </StatItem>
            </CardStats>
          </DashboardCard>

          <DashboardCard onClick={() => handleCardClick('content-control')}>
            <CardIcon $color={theme.colors.warning[600]}>
              <Icon name="shield" />
            </CardIcon>
            <CardTitle>内容管理</CardTitle>
            <CardDescription>
              选择适合孩子年龄的学习内容，调整难度级别，过滤不适宜的内容
            </CardDescription>
            <CardStats>
              <StatItem>
                <StatValue>3-4岁</StatValue>
                <StatLabel>年龄设置</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>简单</StatValue>
                <StatLabel>难度级别</StatLabel>
              </StatItem>
            </CardStats>
          </DashboardCard>

          <DashboardCard onClick={() => handleCardClick('achievements')}>
            <CardIcon $color={theme.colors.purple[600]}>
              <Icon name="trophy" />
            </CardIcon>
            <CardTitle>成就奖励</CardTitle>
            <CardDescription>
              查看孩子获得的学习成就，设置奖励机制，激励持续学习
            </CardDescription>
            <CardStats>
              <StatItem>
                <StatValue>12</StatValue>
                <StatLabel>获得成就</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>450</StatValue>
                <StatLabel>总积分</StatLabel>
              </StatItem>
            </CardStats>
          </DashboardCard>

          <DashboardCard onClick={() => handleCardClick('reports')}>
            <CardIcon $color={theme.colors.error[600]}>
              <Icon name="document" />
            </CardIcon>
            <CardTitle>学习报告</CardTitle>
            <CardDescription>
              生成详细的学习报告，了解孩子的学习趋势和薄弱环节
            </CardDescription>
            <CardStats>
              <StatItem>
                <StatValue>本周</StatValue>
                <StatLabel>最新报告</StatLabel>
              </StatItem>
            </CardStats>
          </DashboardCard>

          <DashboardCard onClick={() => handleCardClick('settings')}>
            <CardIcon $color={theme.colors.indigo[600]}>
              <Icon name="settings" />
            </CardIcon>
            <CardTitle>系统设置</CardTitle>
            <CardDescription>
              管理账户信息，调整音效和通知设置，保护隐私数据
            </CardDescription>
            <CardStats>
              <StatItem>
                <StatValue>安全</StatValue>
                <StatLabel>隐私保护</StatLabel>
              </StatItem>
            </CardStats>
          </DashboardCard>
        </DashboardGrid>
      </DashboardContainer>
    </ParentsContainer>
  );
};