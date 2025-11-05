import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { theme } from '@styles/index';
import { Button, Card, Icon } from '@components/index';
import { useAppStore, useTotalStars, useMasteredWordsCount, useCurrentStreak, useProgress } from '@stores/index';
import { useHapticFeedback } from '@hooks/index';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  color: white;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: ${theme.shadows.md};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const UserLevel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0.9;
`;

const StatsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.xl};
  backdrop-filter: blur(10px);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const StatIcon = styled.div`
  font-size: 18px;
`;

const StatValue = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.base};
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const TodayCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  }
`;

const TodayTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const TodayStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.md};
`;

const TodayStatValue = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
`;

const TodayStatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.gray[200]};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${theme.spacing.md};
`;

const ProgressFill = styled(motion.div)<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.success[500]}, ${theme.colors.success[600]});
  border-radius: 4px;
  width: ${({ $progress }) => $progress}%;
`;

const FunctionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.lg};
`;

const FunctionCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $color }) => $color};
  }
`;

const FunctionIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing.md};
`;

const FunctionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.xs};
`;

const FunctionDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
  line-height: ${theme.typography.lineHeight.normal};
`;

const ProgressCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const ProgressTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary[600]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary[700]};
  }
`;

const CategoryProgress = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
`;

const CategoryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CategoryName = styled.div`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[900]};
  margin-bottom: 2px;
`;

const CategoryProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${theme.colors.gray[200]};
  border-radius: 3px;
  overflow: hidden;
`;

const CategoryProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  width: ${({ $progress }) => $progress}%;
  border-radius: 3px;
`;

const CategoryProgressText = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[600]};
  min-width: 40px;
  text-align: right;
`;

import categoriesData from '../../../data/categories.json';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const progress = useProgress();
  const totalStars = useTotalStars();
  const masteredWords = useMasteredWordsCount();
  const currentStreak = useCurrentStreak();
  const { onButtonPress } = useHapticFeedback();

  // 模拟今日统计数据，实际应用中应该从学习活动中累计
  const todayStats = {
    newWords: progress.masteredWords.length,
    gamesPlayed: 0,
    studyMinutes: Math.floor(progress.totalPlayTime / 60),
    accuracy: 85, // 暂时固定值，应该从实际测试结果计算
    dailyProgress: Math.min((progress.masteredWords.length / 10) * 100, 100)
  };

  // 获取分类数据并计算进度
  const categories = categoriesData.categories.slice(0, 4).map(category => ({
    name: category.name.zh,
    icon: getCategoryIcon(category.id),
    progress: 0, // 进度应该从实际的学习数据中计算
    words: category.count
  }));

  const getCategoryIcon = (categoryId: string): string => {
    const iconMap: Record<string, string> = {
      animals: '🐾',
      colors: '🌈',
      numbers: '🔢',
      food_and_drink: '🍎',
      nature: '🌿',
      clothing_and_accessories: '👕',
      transportation: '🚗',
      buildings_and_places: '🏢',
      art_and_craft: '🎨',
      music_and_instruments: '🎵',
      sports_and_fitness: '⚽',
      games_and_toys: '🎮',
      fantasy_and_mythology: '🐉',
      science_and_education: '🔬',
      technology: '💻',
      tools_and_equipment: '🔧',
      household_items: '🏠',
      office_and_school: '📚',
      professions: '👨‍⚕️',
      events_and_celebrations: '🎉',
      weather_and_climate: '☀️',
      others: '📦'
    };
    return iconMap[categoryId] || '📦';
  };

  const handleNavigation = (path: string) => {
    onButtonPress();
    navigate(path);
  };

  return (
    <HomeContainer>
      <Header>
        <UserSection>
          <UserAvatar>{user?.avatar || '👶'}</UserAvatar>
          <UserInfo>
            <UserName>{user?.name || '小朋友'}</UserName>
            <UserLevel>{user?.level === 'beginner' ? '初学者' : user?.level === 'intermediate' ? '进阶者' : '高级'}</UserLevel>
          </UserInfo>
        </UserSection>

        <StatsSection>
          <StatItem>
            <StatIcon>⭐</StatIcon>
            <StatValue>{totalStars}</StatValue>
          </StatItem>
          <StatItem>
            <StatIcon>🔥</StatIcon>
            <StatValue>{currentStreak}</StatValue>
          </StatItem>
          <StatItem>
            <StatIcon>📚</StatIcon>
            <StatValue>{masteredWords}</StatValue>
          </StatItem>
        </StatsSection>
      </Header>

      <MainContent>
        <TodayCard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TodayTitle>
              <Icon name="calendar" />
              今日学习
            </TodayTitle>

            <StatsGrid>
              <TodayStat>
                <TodayStatValue>{todayStats.newWords}</TodayStatValue>
                <TodayStatLabel>新学词汇</TodayStatLabel>
              </TodayStat>
              <TodayStat>
                <TodayStatValue>{todayStats.gamesPlayed}</TodayStatValue>
                <TodayStatLabel>完成游戏</TodayStatLabel>
              </TodayStat>
              <TodayStat>
                <TodayStatValue>{todayStats.studyMinutes}</TodayStatValue>
                <TodayStatLabel>学习分钟</TodayStatLabel>
              </TodayStat>
              <TodayStat>
                <TodayStatValue>{todayStats.accuracy}%</TodayStatValue>
                <TodayStatLabel>正确率</TodayStatLabel>
              </TodayStat>
            </StatsGrid>

            <ProgressBar>
              <ProgressFill $progress={todayStats.dailyProgress} initial={{ width: 0 }} animate={{ width: todayStats.dailyProgress }} transition={{ delay: 0.5 }} />
            </ProgressBar>

            <Button
              onClick={() => handleNavigation('/learning')}
              fullWidth
              icon={<Icon name="play" />}
            >
              继续学习
            </Button>
          </motion.div>
        </TodayCard>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FunctionGrid>
            <FunctionCard
              onClick={() => handleNavigation('/learning')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #22c55e, #16a34a)' }} />
              <FunctionIcon>📚</FunctionIcon>
              <FunctionTitle>闪卡学习</FunctionTitle>
              <FunctionDescription>3000+ 词汇卡片</FunctionDescription>
            </FunctionCard>

            <FunctionCard
              onClick={() => handleNavigation('/games')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #f97316, #ea580c)' }} />
              <FunctionIcon>🎮</FunctionIcon>
              <FunctionTitle>游戏中心</FunctionTitle>
              <FunctionDescription>6个趣味游戏</FunctionDescription>
            </FunctionCard>
          </FunctionGrid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProgressCard>
            <ProgressHeader>
              <ProgressTitle>
                <Icon name="trophy" />
                学习进度
              </ProgressTitle>
              <ViewAllButton onClick={() => handleNavigation('/progress')}>
                查看全部
                <Icon name="arrow" />
              </ViewAllButton>
            </ProgressHeader>

            {categories.map((category, index) => (
              <CategoryProgress key={category.name}>
                <CategoryIcon>{category.icon}</CategoryIcon>
                <CategoryInfo>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryProgress>
                    <CategoryProgressBar>
                      <CategoryProgressFill $progress={category.progress} />
                    </CategoryProgressBar>
                    <CategoryProgressText>{category.words}/200</CategoryProgressText>
                  </CategoryProgress>
                </CategoryInfo>
              </CategoryProgress>
            ))}
          </ProgressCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="secondary"
            onClick={() => handleNavigation('/parents')}
            fullWidth
            icon={<Icon name="settings" />}
          >
            家长中心
          </Button>
        </motion.div>
      </MainContent>
    </HomeContainer>
  );
};