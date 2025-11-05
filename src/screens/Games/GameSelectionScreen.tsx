import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Button, Card, Icon } from '@components/index';
import { useHapticFeedback } from '@hooks/index';

const GameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
`;

const GameHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
  color: white;
`;

const GameTitle = styled.h1`
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

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const GameCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const GameIcon = styled.div`
  font-size: 56px;
  margin-bottom: ${theme.spacing.sm};
`;

const GameName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.xs};
`;

const GameDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
  line-height: 1.4;
`;

const DifficultyBadge = styled.div<{ $level: 'easy' | 'medium' | 'hard' }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${({ $level, theme }) => {
    switch ($level) {
      case 'easy': return theme.colors.success[500];
      case 'medium': return theme.colors.warning[500];
      case 'hard': return theme.colors.error[500];
      default: return theme.colors.gray[500];
    }
  }};
  color: white;
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const AgeRecommendation = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.xl};
  text-align: center;
  color: white;
  margin-bottom: ${theme.spacing.lg};
`;

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;
  skills: string[];
}

const GAMES: Game[] = [
  {
    id: 'sound-treasure-hunt',
    name: '声音寻宝',
    description: '听声音找对应的图片宝箱',
    icon: '🎵',
    route: '/games/sound-treasure-hunt',
    difficulty: 'easy',
    ageRange: '3-4岁',
    skills: ['听力', '词汇认知']
  },
  {
    id: 'magic-puzzle',
    name: '魔法拼图',
    description: '根据提示找到正确的拼图块',
    icon: '🧩',
    route: '/games/magic-puzzle',
    difficulty: 'easy',
    ageRange: '3-5岁',
    skills: ['观察力', '逻辑思维']
  },
  {
    id: 'rainbow-bubbles',
    name: '彩虹泡泡',
    description: '点击目标单词对应的彩色泡泡',
    icon: '🫧',
    route: '/games/rainbow-bubbles',
    difficulty: 'medium',
    ageRange: '4-6岁',
    skills: ['反应速度', '手眼协调']
  },
  {
    id: 'animal-music-box',
    name: '动物音乐盒',
    description: '学习动物的英文名称和叫声',
    icon: '🎹',
    route: '/games/animal-music-box',
    difficulty: 'easy',
    ageRange: '3-6岁',
    skills: ['动物认知', '声音识别']
  },
  {
    id: 'memory-flip',
    name: '记忆翻牌',
    description: '翻开卡片找到相同的配对',
    icon: '🃏',
    route: '/games/memory-flip',
    difficulty: 'medium',
    ageRange: '4-6岁',
    skills: ['记忆力', '专注力']
  },
  {
    id: 'word-artist',
    name: '单词画家',
    description: '根据单词提示画出创意作品',
    icon: '🎨',
    route: '/games/word-artist',
    difficulty: 'hard',
    ageRange: '5-6岁',
    skills: ['创造力', '艺术表达']
  },
];

export const GameSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { onButtonPress } = useHapticFeedback();

  const handleBackToHome = () => {
    onButtonPress();
    navigate('/');
  };

  const handleGameSelect = (game: Game) => {
    onButtonPress();
    navigate(game.route);
  };

  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '';
    }
  };

  return (
    <GameContainer>
      <GameHeader>
        <BackButton
          onClick={handleBackToHome}
          icon={<Icon name="previous" />}
        >
          返回
        </BackButton>

        <GameTitle>
          <Icon name="game" />
          学习游戏
        </GameTitle>

        <div style={{ width: '100px' }} />
      </GameHeader>

      <AgeRecommendation>
        <h3>适合年龄：3-6岁</h3>
        <p>每个游戏都根据儿童发展特点设计，请在家长陪伴下进行游戏学习</p>
      </AgeRecommendation>

      <GameGrid>
        {GAMES.map((game, index) => (
          <GameCard
            key={game.id}
            onClick={() => handleGameSelect(game)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DifficultyBadge $level={game.difficulty}>
              {getDifficultyLabel(game.difficulty)}
            </DifficultyBadge>

            <GameIcon>{game.icon}</GameIcon>
            <GameName>{game.name}</GameName>
            <GameDescription>{game.description}</GameDescription>
          </GameCard>
        ))}
      </GameGrid>
    </GameContainer>
  );
};