import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Icon } from '@components/index';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
  compact?: boolean;
}

const AchievementContainer = styled(motion.div)<{ $unlocked: boolean; $rarity: string }>`
  background: ${({ $unlocked, $rarity, theme }) => {
    if (!$unlocked) return 'rgba(255, 255, 255, 0.1)';
    switch ($rarity) {
      case 'legendary': return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 'epic': return 'linear-gradient(135deg, #9B59B6, #8E44AD)';
      case 'rare': return 'linear-gradient(135deg, #3498DB, #2980B9)';
      default: return 'linear-gradient(135deg, #2ECC71, #27AE60)';
    }
  }};
  backdrop-filter: ${({ $unlocked }) => $unlocked ? 'none' : 'blur(10px)'};
  border: 2px solid ${({ $unlocked, $rarity, theme }) => {
    if (!$unlocked) return 'rgba(255, 255, 255, 0.2)';
    switch ($rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9B59B6';
      case 'rare': return '#3498DB';
      default: return '#2ECC71';
    }
  }};
  border-radius: ${theme.borderRadius.xl};
  padding: ${({ $compact }) => $compact ? theme.spacing.md : theme.spacing.lg};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${({ $unlocked }) => $unlocked ? 1 : 0.6};
  min-width: ${({ $compact }) => $compact ? '140px' : '200px'};
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const AchievementIcon = styled.div<{ $unlocked: boolean; $compact: boolean }>`
  font-size: ${({ $compact }) => $compact ? '32px' : '48px'};
  margin-bottom: ${theme.spacing.sm};
  filter: ${({ $unlocked }) => $unlocked ? 'none' : 'grayscale(100%)'};
  opacity: ${({ $unlocked }) => $unlocked ? 1 : 0.5};
`;

const AchievementTitle = styled.h4<{ $unlocked: boolean }>`
  font-size: ${({ $compact }) => $compact ? theme.typography.fontSize.sm : theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${({ $unlocked }) => $unlocked ? 'white' : theme.colors.gray[300]};
  margin-bottom: ${theme.spacing.xs};
`;

const AchievementDescription = styled.p<{ $unlocked: boolean; $compact: boolean }>`
  font-size: ${({ $compact }) => $compact ? theme.typography.fontSize.xs : theme.typography.fontSize.sm};
  color: ${({ $unlocked }) => $unlocked ? 'rgba(255, 255, 255, 0.9)' : theme.colors.gray[400]};
  line-height: 1.4;
`;

const AchievementRarity = styled.div<{ $rarity: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${({ $rarity }) => {
    switch ($rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9B59B6';
      case 'rare': return '#3498DB';
      default: return '#2ECC71';
    }
  }};
  color: white;
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  text-transform: uppercase;
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
`;

const LockIcon = styled.div`
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
`;

const ProgressBar = styled.div<{ $rarity: string }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${theme.spacing.sm};
`;

const ProgressFill = styled(motion.div)<{ $rarity: string }>`
  height: 100%;
  background: ${({ $rarity }) => {
    switch ($rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9B59B6';
      case 'rare': return '#3498DB';
      default: return '#2ECC71';
    }
  }};
  border-radius: 2px;
`;

const ProgressText = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: rgba(255, 255, 255, 0.8);
  margin-top: ${theme.spacing.xs};
`;

const Sparkle = styled(motion.div)`
  position: absolute;
  font-size: 16px;
  pointer-events: none;
`;

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onClick,
  compact = false
}) => {
  const {
    title,
    description,
    icon,
    rarity,
    unlocked,
    unlockedAt,
    progress = 0,
    maxProgress = 1
  } = achievement;

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '传说';
      case 'epic': return '史诗';
      case 'rare': return '稀有';
      default: return '普通';
    }
  };

  const progressPercentage = Math.round((progress / maxProgress) * 100);

  return (
    <AchievementContainer
      $unlocked={unlocked}
      $rarity={rarity}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {unlocked && (
        <Sparkle
          style={{ top: '20%', left: '10%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          ✨
        </Sparkle>
      )}

      <AchievementIcon $unlocked={unlocked} $compact={compact}>
        {icon}
      </AchievementIcon>

      <AchievementTitle $unlocked={unlocked}>
        {title}
      </AchievementTitle>

      <AchievementDescription $unlocked={unlocked} $compact={compact}>
        {description}
      </AchievementDescription>

      {!unlocked && progress > 0 && maxProgress > 1 && (
        <>
          <ProgressBar $rarity={rarity}>
            <ProgressFill
              $rarity={rarity}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </ProgressBar>
          <ProgressText>
            {progress}/{maxProgress} ({progressPercentage}%)
          </ProgressText>
        </>
      )}

      <AchievementRarity $rarity={rarity}>
        {getRarityLabel(rarity)}
      </AchievementRarity>

      {!unlocked && (
        <LockOverlay>
          <LockIcon>🔒</LockIcon>
        </LockOverlay>
      )}
    </AchievementContainer>
  );
};