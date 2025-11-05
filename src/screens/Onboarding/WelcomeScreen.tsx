import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { theme } from '@styles/index';
import { Button, Card, Icon } from '@components/index';
import { useAppStore } from '@stores/index';
import { useHapticFeedback } from '@hooks/index';

const WelcomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  color: white;
  text-align: center;
`;

const WelcomeCard = styled(Card)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  width: 100%;
  margin-bottom: ${theme.spacing.xl};
`;

const WelcomeIcon = styled.div`
  font-size: 120px;
  margin-bottom: ${theme.spacing.lg};
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;

const WelcomeTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
  font-family: ${theme.typography.fontFamily.display};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  margin-bottom: ${theme.spacing.lg};
  opacity: 0.9;
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const FeaturesList = styled.div`
  text-align: left;
  margin: ${theme.spacing.lg} 0;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
`;

const AvatarSelection = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

const AvatarOption = styled(motion.button)<{ $selected: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid ${({ $selected }) => $selected ? theme.colors.warning[500] : 'transparent'};
  background: white;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    border-color: ${theme.colors.warning[400]};
  }
`;

const AVATARS = ['👧', '👦', '👱', '👶', '🧒', '👨', '👩', '🧑', '👮', '👷', '💂', '🕵️'];

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, updateSettings } = useAppStore();
  const { onButtonPress } = useHapticFeedback();

  const [selectedAvatar, setSelectedAvatar] = React.useState(AVATARS[0]);
  const [userName, setUserName] = React.useState('');

  const handleContinue = () => {
    onButtonPress();

    // Create user profile
    const newUser = {
      id: Date.now().toString(),
      name: userName || '小朋友',
      avatar: selectedAvatar,
      age: 4, // Will be set in age selection
      level: 'beginner' as const,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setUser(newUser);

    // Update settings with user preferences
    updateSettings({
      soundEnabled: true,
      hapticEnabled: true,
      language: 'zh',
      dailyTimeLimit: 30,
    });

    navigate('/onboarding/age');
  };

  return (
    <WelcomeContainer>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <WelcomeIcon>🎨</WelcomeIcon>
      </motion.div>

      <WelcomeCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <WelcomeTitle>欢迎来到 YoHoHo English!</WelcomeTitle>
        <WelcomeSubtitle>
          开启你的英语学习之旅，通过有趣的游戏和闪卡，轻松掌握英语词汇！
        </WelcomeSubtitle>

        <FeaturesList>
          <FeatureItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Icon name="book" />
            <span>3000+ 卡通词汇卡片</span>
          </FeatureItem>

          <FeatureItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Icon name="game" />
            <span>6个趣味学习游戏</span>
          </FeatureItem>

          <FeatureItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Icon name="trophy" />
            <span>成就系统激励学习</span>
          </FeatureItem>

          <FeatureItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Icon name="user" />
            <span>个性化学习进度</span>
          </FeatureItem>
        </FeaturesList>
      </WelcomeCard>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{ display: 'block', marginBottom: theme.spacing.sm, fontSize: theme.typography.fontSize.base }}>
            选择你的头像
          </label>
          <AvatarSelection>
            {AVATARS.map((avatar, index) => (
              <AvatarOption
                key={avatar}
                $selected={selectedAvatar === avatar}
                onClick={() => {
                  setSelectedAvatar(avatar);
                  onButtonPress();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
              >
                {avatar}
              </AvatarOption>
            ))}
          </AvatarSelection>
        </div>

        <div style={{ marginBottom: theme.spacing.xl }}>
          <label style={{ display: 'block', marginBottom: theme.spacing.sm, fontSize: theme.typography.fontSize.base }}>
            你的名字 (可选)
          </label>
          <input
            type="text"
            placeholder="输入你的名字"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={10}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: theme.borderRadius.lg,
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: theme.typography.fontSize.base,
              backdropFilter: 'blur(10px)',
            }}
          />
        </div>

        <Button
          onClick={handleContinue}
          fullWidth
          size="lg"
          icon={<Icon name="next" />}
        >
          开始学习
        </Button>
      </motion.div>
    </WelcomeContainer>
  );
};