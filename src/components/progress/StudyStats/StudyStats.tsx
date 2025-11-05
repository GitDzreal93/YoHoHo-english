import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Icon } from '@components/index';

interface StudyStatsProps {
  studyTime: number; // 总学习时间（分钟）
  wordsLearned: number; // 学习的单词数
  studyDays: number; // 连续学习天数
  accuracy: number; // 正确率（百分比）
  weeklyProgress?: { day: string; minutes: number }[]; // 本周学习进度
  categoryProgress?: { category: string; progress: number; total: number }[]; // 分类进度
}

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const StatCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const StatIcon = styled.div<{ $color: string }>`
  font-size: 32px;
  margin-bottom: ${theme.spacing.sm};
  color: ${({ $color }) => $color};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900];
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600];
`;

const StatTrend = styled.div<{ $trend: 'up' | 'down' | 'stable' }>`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${({ $trend, theme }) => {
    switch ($trend) {
      case 'up': return theme.colors.success[600];
      case 'down': return theme.colors.error[600];
      default: return theme.colors.gray[600];
    }
  }};
`;

const WeeklyProgressContainer = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
`;

const ProgressTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900];
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const WeeklyChart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  margin: ${theme.spacing.lg} 0;
  gap: ${theme.spacing.xs};
`;

const DayColumn = styled.div<{ $height: number; $active: boolean }>`
  flex: 1;
  background: ${({ $active, theme }) => $active ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    background: ${({ $active, theme }) => $active ? theme.colors.primary[600] : theme.colors.gray[400]};
  }
`;

const DayLabel = styled.div<{ $active: boolean }>`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: ${theme.typography.fontSize.xs};
  color: ${({ $active, theme }) => $active ? theme.colors.gray[900] : theme.colors.gray[500]};
  font-weight: ${({ $active }) => $active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
`;

const DayValue = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray[600};
  font-weight: ${theme.typography.fontWeight.medium};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${DayColumn}:hover & {
    opacity: 1;
  }
`;

const CategoryProgressContainer = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
`;

const CategoryItem = styled.div`
  margin-bottom: ${theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const CategoryName = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[700};
`;

const CategoryCount = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.gray[200];
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  background: ${({ $color }) => $color};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
};

const formatAccuracy = (accuracy: number): string => {
  return `${Math.round(accuracy)}%`;
};

export const StudyStats: React.FC<StudyStatsProps> = ({
  studyTime,
  wordsLearned,
  studyDays,
  accuracy,
  weeklyProgress = [],
  categoryProgress = []
}) => {
  // 模拟本周数据
  const defaultWeeklyData = [
    { day: '周一', minutes: 30 },
    { day: '周二', minutes: 45 },
    { day: '周三', minutes: 20 },
    { day: '周四', minutes: 60 },
    { day: '周五', minutes: 35 },
    { day: '周六', minutes: 80 },
    { day: '周日', minutes: 55 },
  ];

  const weeklyData = weeklyProgress.length > 0 ? weeklyProgress : defaultWeeklyData;
  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));

  // 计算趋势
  const getTrend = (): 'up' | 'down' | 'stable' => {
    if (weeklyData.length < 2) return 'stable';
    const recent = weeklyData.slice(-3).reduce((sum, d) => sum + d.minutes, 0);
    const previous = weeklyData.slice(-6, -3).reduce((sum, d) => sum + d.minutes, 0);
    if (recent > previous * 1.2) return 'up';
    if (recent < previous * 0.8) return 'down';
    return 'stable';
  };

  const trend = getTrend();

  // 分类颜色映射
  const categoryColors: Record<string, string> = {
    'animals': theme.colors.success[500],
    'food_and_drink': theme.colors.warning[500],
    'colors_and_shapes': theme.colors.primary[500],
    'numbers': theme.colors.error[500],
    'family': theme.colors.purple[500],
    'nature': theme.colors.green[500],
    'transportation': theme.colors.blue[500],
    'clothing_and_accessories': theme.colors.pink[500],
    'games_and_toys': theme.colors.indigo[500],
    'school': theme.colors.orange[500],
  };

  return (
    <StatsContainer>
      {/* 主要统计数据 */}
      <StatsGrid>
        <StatCard>
          <StatIcon $color={theme.colors.primary[600]}>
            <Icon name="timer" />
          </StatIcon>
          <StatValue>{formatTime(studyTime)}</StatValue>
          <StatLabel>总学习时间</StatLabel>
          <StatTrend $trend={trend}>
            {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→'}
          </StatTrend>
        </StatCard>

        <StatCard>
          <StatIcon $color={theme.colors.success[600]}>
            <Icon name="book" />
          </StatIcon>
          <StatValue>{wordsLearned}</StatValue>
          <StatLabel>学习单词</StatLabel>
          <StatTrend $trend="up">↗️</StatTrend>
        </StatCard>

        <StatCard>
          <StatIcon $color={theme.colors.warning[600]}>
            <Icon name="calendar" />
          </StatIcon>
          <StatValue>{studyDays}</StatValue>
          <StatLabel>连续学习</StatLabel>
          <StatTrend $trend="up">🔥</StatTrend>
        </StatCard>

        <StatCard>
          <StatIcon $color={theme.colors.error[600]}>
            <Icon name="target" />
          </StatIcon>
          <StatValue>{formatAccuracy(accuracy)}</StatValue>
          <StatLabel>平均正确率</StatLabel>
          <StatTrend $trend={accuracy >= 80 ? 'up' : accuracy >= 60 ? 'stable' : 'down'}>
            {accuracy >= 80 ? '↗️' : accuracy >= 60 ? '→' : '↘️'}
          </StatTrend>
        </StatCard>
      </StatsGrid>

      {/* 本周学习进度 */}
      <WeeklyProgressContainer>
        <ProgressTitle>
          <Icon name="chart" />
          本周学习进度
        </ProgressTitle>
        <WeeklyChart>
          {weeklyData.map((day, index) => (
            <DayColumn
              key={day.day}
              $height={maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0}
              $active={day.minutes > 0}
              whileHover={{ y: -4 }}
              initial={{ height: 0 }}
              animate={{ height: maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <DayLabel $active={day.minutes > 0}>
                {day.day.slice(-1)}
              </DayLabel>
              <DayValue>{day.minutes}分</DayValue>
            </DayColumn>
          ))}
        </WeeklyChart>
      </WeeklyProgressContainer>

      {/* 分类学习进度 */}
      {categoryProgress.length > 0 && (
        <CategoryProgressContainer>
          <ProgressTitle>
            <Icon name="category" />
            分类学习进度
          </ProgressTitle>
          {categoryProgress.map((category, index) => (
            <CategoryItem key={category.category}>
              <CategoryHeader>
                <CategoryName>{category.category}</CategoryName>
                <CategoryCount>{category.progress}/{category.total}</CategoryCount>
              </CategoryHeader>
              <ProgressBar>
                <ProgressFill
                  $color={categoryColors[category.category] || theme.colors.primary[500]}
                  initial={{ width: 0 }}
                  animate={{ width: `${(category.progress / category.total) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                />
              </ProgressBar>
            </CategoryItem>
          ))}
        </CategoryProgressContainer>
      )}
    </StatsContainer>
  );
};