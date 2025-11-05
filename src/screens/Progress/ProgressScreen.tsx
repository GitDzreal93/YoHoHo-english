import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Button, Card, Icon, Loading } from '@components/index';
import { ProgressChart } from '@components/progress/ProgressChart';
import { AchievementCard } from '@components/progress/AchievementCard';
import { StudyStats } from '@components/progress/StudyStats';
import { LearningPath } from '@components/progress/LearningPath';
import { useAppStore, useAchievementStore } from '@stores/index';
import { useHapticFeedback } from '@hooks/index';

const ProgressContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
`;

const ProgressHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
  color: white;
`;

const ProgressTitle = styled.h1`
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

const TabSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing.lg};
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  background: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  color: ${({ $active }) => $active ? theme.colors.primary[600] : 'white'};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const AchievementsSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: white;
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

const EmptyState = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.gray[600]};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const AchievementNotification = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.xl};
  z-index: 1000;
  max-width: 300px;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

const NotificationTitle = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
`;

const NotificationDescription = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${theme.colors.gray[400]};
  padding: ${theme.spacing.xs};
`;

type TabType = 'overview' | 'achievements' | 'learning-path' | 'reports';

export const ProgressScreen: React.FC = () => {
  const navigate = useNavigate();
  const { onButtonPress } = useHapticFeedback();
  const { progress, user } = useAppStore();
  const { achievements, totalPoints, newUnlocks, markAsViewed } = useAchievementStore();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showNotification, setShowNotification] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<typeof achievements[0] | null>(null);

  useEffect(() => {
    if (newUnlocks.length > 0 && !showNotification) {
      const latestId = newUnlocks[newUnlocks.length - 1];
      const achievement = achievements.find(a => a.id === latestId);
      if (achievement) {
        setLatestAchievement(achievement);
        setShowNotification(true);
        onButtonPress();
      }
    }
  }, [newUnlocks, showNotification, achievements, onButtonPress]);

  const handleBackToHome = () => {
    onButtonPress();
    navigate('/');
  };

  const handleTabChange = (tab: TabType) => {
    onButtonPress();
    setActiveTab(tab);
  };

  const handleAchievementClick = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && newUnlocks.includes(achievementId)) {
      markAsViewed(achievementId);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    if (latestAchievement) {
      markAsViewed(latestAchievement.id);
    }
  };

  // 模拟学习数据
  const mockStudyData = {
    studyTime: 180, // 3小时
    wordsLearned: 45,
    studyDays: 7,
    accuracy: 85,
    weeklyProgress: [
      { day: '周一', minutes: 20 },
      { day: '周二', minutes: 35 },
      { day: '周三', minutes: 15 },
      { day: '周四', minutes: 40 },
      { day: '周五', minutes: 25 },
      { day: '周六', minutes: 30 },
      { day: '周日', minutes: 15 },
    ],
    categoryProgress: [
      { category: 'animals', progress: 25, total: 50 },
      { category: 'colors_and_shapes', progress: 15, total: 20 },
      { category: 'numbers', progress: 18, total: 20 },
      { category: 'family', progress: 8, total: 15 },
    ]
  };

  // 模拟学习路径数据
  const mockLearningPath = [
    {
      id: 'intro',
      title: '入门介绍',
      description: '学习基础单词',
      icon: '📚',
      type: 'lesson' as const,
      status: 'completed' as const,
      progress: 1,
      total: 1
    },
    {
      id: 'animals_basic',
      title: '基础动物',
      description: '学习常见动物',
      icon: '🐱',
      type: 'lesson' as const,
      status: 'completed' as const,
      progress: 10,
      total: 10
    },
    {
      id: 'animals_game',
      title: '动物游戏',
      description: '动物音乐盒游戏',
      icon: '🎮',
      type: 'game' as const,
      status: 'in_progress' as const,
      progress: 3,
      total: 5
    },
    {
      id: 'colors_quiz',
      title: '颜色测试',
      description: '颜色知识测试',
      icon: '📝',
      type: 'quiz' as const,
      status: 'available' as const,
      progress: 0,
      total: 1
    },
    {
      id: 'milestone1',
      title: '第一个里程碑',
      description: '完成基础学习',
      icon: '🏆',
      type: 'achievement' as const,
      status: 'locked' as const,
      progress: 0,
      total: 1
    }
  ];

  const renderOverview = () => (
    <>
      <OverviewGrid>
        <ProgressChart
          title="总体进度"
          value={mockStudyData.wordsLearned}
          maxValue={100}
          color={theme.colors.primary[500]}
          size="medium"
          subtitle="已学习单词"
        />
        <ProgressChart
          title="本周学习"
          value={mockStudyData.studyTime}
          maxValue={300} // 5小时目标
          color={theme.colors.success[500]}
          size="medium"
          subtitle="学习时间"
        />
        <ProgressChart
          title="学习正确率"
          value={mockStudyData.accuracy}
          maxValue={100}
          color={theme.colors.warning[500]}
          size="medium"
          showPercentage={true}
          subtitle="平均准确率"
        />
      </OverviewGrid>

      <StudyStats {...mockStudyData} />
    </>
  );

  const renderAchievements = () => {
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <SectionTitle>
            <Icon name="trophy" />
            成就 ({unlockedAchievements.length}/{achievements.length})
          </SectionTitle>
          <div style={{ color: 'white', fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.bold }}>
            总积分: {totalPoints}
          </div>
        </div>

        <AchievementsGrid>
          {unlockedAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onClick={() => handleAchievementClick(achievement.id)}
            />
          ))}
          {lockedAchievements.slice(0, 6).map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onClick={() => handleAchievementClick(achievement.id)}
              compact={true}
            />
          ))}
        </AchievementsGrid>
      </>
    );
  };

  const renderLearningPath = () => (
    <div>
      <SectionTitle>
        <Icon name="path" />
        学习路径
      </SectionTitle>
      <LearningPath
        nodes={mockLearningPath}
        currentNodeId="animals_game"
        onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
      />
    </div>
  );

  const renderReports = () => (
    <EmptyState>
      <Icon name="report" size="lg" style={{ fontSize: '64px', marginBottom: theme.spacing.lg }} />
      <h3>学习报告</h3>
      <p>详细的学习报告功能正在开发中...</p>
      <Button
        onClick={() => setActiveTab('overview')}
        icon={<Icon name="chart" />}
        style={{ marginTop: theme.spacing.lg }}
      >
        查看总览
      </Button>
    </EmptyState>
  );

  return (
    <ProgressContainer>
      <ProgressHeader>
        <BackButton
          onClick={handleBackToHome}
          icon={<Icon name="previous" />}
        >
          返回
        </BackButton>

        <ProgressTitle>
          <Icon name="progress" />
          学习进度
        </ProgressTitle>

        <div style={{ width: '100px' }} />
      </ProgressHeader>

      <TabSelector>
        <TabButton
          $active={activeTab === 'overview'}
          onClick={() => handleTabChange('overview')}
        >
          学习总览
        </TabButton>
        <TabButton
          $active={activeTab === 'achievements'}
          onClick={() => handleTabChange('achievements')}
        >
          成就徽章
        </TabButton>
        <TabButton
          $active={activeTab === 'learning-path'}
          onClick={() => handleTabChange('learning-path')}
        >
          学习路径
        </TabButton>
        <TabButton
          $active={activeTab === 'reports'}
          onClick={() => handleTabChange('reports')}
        >
          学习报告
        </TabButton>
      </TabSelector>

      <ContentContainer>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'learning-path' && renderLearningPath()}
        {activeTab === 'reports' && renderReports()}
      </ContentContainer>

      {/* 成就解锁通知 */}
      {showNotification && latestAchievement && (
        <AchievementNotification
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <NotificationHeader>
            <div style={{ fontSize: '32px' }}>{latestAchievement.icon}</div>
            <div style={{ flex: 1 }}>
              <NotificationTitle>🎉 成就解锁！</NotificationTitle>
              <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.warning[600] }}>
                +{latestAchievement.points} 积分
              </div>
            </div>
            <CloseButton onClick={handleCloseNotification}>×</CloseButton>
          </NotificationHeader>
          <NotificationDescription>
            <strong>{latestAchievement.title}</strong><br />
            {latestAchievement.description}
          </NotificationDescription>
        </AchievementNotification>
      )}
    </ProgressContainer>
  );
};