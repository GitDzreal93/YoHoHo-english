import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { theme } from '@styles/index';
import { Card, Icon, Button } from '@components/ui';
import { Category } from '@types/index';
import { useHapticFeedback } from '@hooks/index';

interface CategorySelectorProps {
  categories: Category[];
  onCategorySelect?: (categoryId: string) => void;
  showBackButton?: boolean;
  title?: string;
}

const CategoryContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
`;

const CategoryHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
  color: white;
`;

const CategoryTitle = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  font-family: ${theme.typography.fontFamily.display};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const CategoryCard = styled(motion.div)<{ $progress: number; $unlocked: boolean }>`
  background: ${({ $unlocked }) => $unlocked ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: ${({ $unlocked }) => $unlocked ? 'none' : 'blur(10px)'};
  border: 2px solid ${({ $unlocked, theme }) => $unlocked ? theme.colors.gray[200] : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  text-align: center;
  cursor: ${({ $unlocked }) => $unlocked ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${({ $unlocked }) => $unlocked && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CategoryIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing.sm};
`;

const CategoryName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${({ $unlocked, theme }) => $unlocked ? theme.colors.gray[900] : theme.colors.gray[100]};
  margin-bottom: ${theme.spacing.xs};
`;

const CategoryCount = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${({ $unlocked, theme }) => $unlocked ? theme.colors.gray[600] : theme.colors.gray[200]};
  margin-bottom: ${theme.spacing.md};
`;

const CategoryProgress = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ $unlocked, theme }) => $unlocked ? theme.colors.gray[200] : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: ${theme.spacing.sm};
`;

const ProgressFill = styled.div<{ $progress: number; $unlocked: boolean }>`
  height: 100%;
  background: ${({ $progress, $unlocked, theme }) => {
    if (!$unlocked) return 'rgba(255, 255, 255, 0.2)';
    if ($progress >= 80) return theme.colors.success[500];
    if ($progress >= 50) return theme.colors.warning[500];
    return theme.colors.primary[500];
  }};
  width: ${({ $progress }) => $progress}%;
  border-radius: 3px;
  transition: width 0.3s ease;
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
  font-size: 32px;
  color: rgba(255, 255, 255, 0.8);
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled(Button)<{ $active: boolean }>`
  background: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  font-size: ${theme.typography.fontSize.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const getCategoryIcon = (categoryId: string): string => {
  const iconMap: Record<string, string> = {
    animals: '🐾',
    food_and_drink: '🍎',
    colors_and_shapes: '🌈',
    numbers: '🔢',
    family: '👨‍👩‍👧‍👦',
    nature: '🌳',
    transportation: '🚗',
    clothing_and_accessories: '👕',
    games_and_toys: '🎮',
    school: '🏫',
    weather_and_climate: '☁️',
    art_and_craft: '🎨',
    buildings_and_places: '🏛️',
    professions: '👷',
    science_and_education: '🔬',
    sports_and_fitness: '⚽',
    technology: '💻',
    tools_and_equipment: '🔧',
    music_and_instruments: '🎵',
    events_and_celebrations: '🎉',
    fantasy_and_mythology: '🦄',
    household_items: '🏠',
    others: '📦',
  };

  return iconMap[categoryId] || '📚';
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onCategorySelect,
  showBackButton = true,
  title = '选择学习分类',
}) => {
  const navigate = useNavigate();
  const { onButtonPress } = useHapticFeedback();
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'unlocked' | 'favorites'>('all');

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category.id);
    } else {
      navigate(`/learning/category/${category.id}`);
    }
  };

  const filteredCategories = categories.filter(category => {
    if (activeFilter === 'unlocked') {
      return category.count > 0; // Only show unlocked categories
    }
    return true; // Show all categories
  });

  return (
    <CategoryContainer>
      <CategoryHeader>
        {showBackButton && (
          <Button
            variant="secondary"
            onClick={() => {
              onButtonPress();
              navigate('/');
            }}
            icon={<Icon name="previous" />}
          >
            返回
          </Button>
        )}

        <CategoryTitle>
          <Icon name="book" />
          {title}
        </CategoryTitle>

        <div style={{ width: '100px' }} />
      </CategoryHeader>

      <FilterContainer>
        <FilterButton
          $active={activeFilter === 'all'}
          onClick={() => {
            onButtonPress();
            setActiveFilter('all');
          }}
        >
          全部分类
        </FilterButton>

        <FilterButton
          $active={activeFilter === 'unlocked'}
          onClick={() => {
            onButtonPress();
            setActiveFilter('unlocked');
          }}
        >
          已解锁
        </FilterButton>

        <FilterButton
          $active={activeFilter === 'favorites'}
          onClick={() => {
            onButtonPress();
            setActiveFilter('favorites');
          }}
        >
          收藏夹
        </FilterButton>
      </FilterContainer>

      <CategoryGrid>
        {filteredCategories.map((category, index) => {
          const progress = Math.min(100, Math.floor((category.count / 200) * 100)); // Assuming 200 words per category
          const isUnlocked = category.count > 0;

          return (
            <CategoryCard
              key={category.id}
              $progress={progress}
              $unlocked={isUnlocked}
              onClick={() => {
                if (isUnlocked) {
                  handleCategoryClick(category);
                }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={isUnlocked ? { scale: 1.02 } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
            >
              <CategoryIcon>{getCategoryIcon(category.id)}</CategoryIcon>
              <CategoryName $unlocked={isUnlocked}>
                {category.name.zh}
              </CategoryName>
              <CategoryCount $unlocked={isUnlocked}>
                {category.count} 个词汇
              </CategoryCount>
              <CategoryProgress>
                <ProgressFill $progress={progress} $unlocked={isUnlocked} />
              </CategoryProgress>

              {!isUnlocked && (
                <LockOverlay>
                  <LockIcon>🔒</LockIcon>
                </LockOverlay>
              )}
            </CategoryCard>
          );
        })}
      </CategoryGrid>
    </CategoryContainer>
  );
};