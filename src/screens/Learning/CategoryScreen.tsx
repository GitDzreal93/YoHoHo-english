import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { CategorySelector } from '@components/flashcard';
import { Button, Icon } from '@components/index';
import { useHapticFeedback } from '@hooks/index';
import categoriesData from '../../../data/categories.json';

const CategoryContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
`;

const CategoryHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.gray[800]};
`;

const CategoryTitle = styled.h1`
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

// 处理分类数据，添加图标和描述
const categories = categoriesData.categories.map(category => ({
  id: category.id,
  name: category.name,
  count: category.images?.length || 0,
  description: `学习${category.name.zh}相关词汇`,
  icon: getCategoryIcon(category.id),
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

export const CategoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { onButtonPress } = useHapticFeedback();

  const handleBackToHome = () => {
    onButtonPress();
    navigate('/');
  };

  const handleCategorySelect = (categoryId: string) => {
    onButtonPress();
    navigate(`/learning/category/${categoryId}`);
  };

  return (
    <CategoryContainer>
      <CategoryHeader>
        <BackButton
          onClick={handleBackToHome}
          icon={<Icon name="previous" />}
        >
          返回
        </BackButton>

        <CategoryTitle>
          <Icon name="book" />
          选择学习分类
        </CategoryTitle>

        <div style={{ width: '100px' }} />
      </CategoryHeader>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CategorySelector
          categories={categories}
          onCategorySelect={handleCategorySelect}
          showBackButton={false}
          title={undefined}
        />
      </motion.div>
    </CategoryContainer>
  );
};