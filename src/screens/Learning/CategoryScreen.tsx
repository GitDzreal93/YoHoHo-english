import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { CategorySelector } from '@components/flashcard';
import { Button, Icon } from '@components/index';
import { useHapticFeedback } from '@hooks/index';

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

// Mock categories - in real app, this would come from categories.json
const categories = [
  {
    id: 'animals',
    name: { en: 'Animals', zh: '动物' },
    count: 287,
    description: '学习各种动物的英文名称',
    icon: '🐾',
  },
  {
    id: 'food_and_drink',
    name: { en: 'Food & Drink', zh: '食物饮料' },
    count: 156,
    description: '认识常见食物和饮品的英文名称',
    icon: '🍎',
  },
  {
    id: 'colors_and_shapes',
    name: { en: 'Colors & Shapes', zh: '颜色形状' },
    count: 50,
    description: '学习颜色和基础几何图形',
    icon: '🌈',
  },
  {
    id: 'numbers',
    name: { en: 'Numbers', zh: '数字' },
    count: 30,
    description: '学习数字1-100的英文表达',
    icon: '🔢',
  },
  {
    id: 'family',
    name: { en: 'Family', zh: '家庭' },
    count: 40,
    description: '学习家庭成员的英文名称',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'nature',
    name: { en: 'Nature', zh: '自然' },
    count: 89,
    description: '探索大自然的英文名称',
    icon: '🌳',
  },
  {
    id: 'transportation',
    name: { en: 'Transportation', zh: '交通工具' },
    count: 67,
    description: '学习各种交通工具的英文名称',
    icon: '🚗',
  },
  {
    id: 'clothing_and_accessories',
    name: { en: 'Clothing & Accessories', zh: '服饰配件' },
    count: 82,
    description: '认识服装和配饰的英文名称',
    icon: '👕',
  },
  {
    id: 'games_and_toys',
    name: { en: 'Games & Toys', zh: '游戏玩具' },
    count: 45,
    description: '学习游戏和玩具的英文名称',
    icon: '🎮',
  },
  {
    id: 'school',
    name: { en: 'School', zh: '学校' },
    count: 58,
    description: '学校相关词汇的英文名称',
    icon: '🏫',
  },
  {
    id: 'weather_and_climate',
    name: { en: 'Weather & Climate', zh: '天气气候' },
    count: 32,
    description: '学习天气现象和气候词汇',
    icon: '☁️',
  },
  {
    id: 'art_and_craft',
    name: { en: 'Art & Craft', zh: '艺术手工' },
    count: 41,
    description: '艺术和手工相关词汇',
    icon: '🎨',
  },
  {
    id: 'buildings_and_places',
    name: { en: 'Buildings & Places', zh: '建筑场所' },
    count: 73,
    description: '建筑物和地点的英文名称',
    icon: '🏛️',
  },
  {
    id: 'professions',
    name: { en: 'Professions', zh: '职业' },
    count: 55,
    description: '学习各种职业的英文名称',
    icon: '👷',
  },
  {
    id: 'science_and_education',
    name: { en: 'Science & Education', zh: '科学教育' },
    count: 47,
    description: '科学和教育相关词汇',
    icon: '🔬',
  },
  {
    id: 'sports_and_fitness',
    name: { en: 'Sports & Fitness', zh: '运动健身' },
    count: 38,
    description: '体育运动和健身相关词汇',
    icon: '⚽',
  },
  {
    id: 'technology',
    name: { en: 'Technology', zh: '科技' },
    count: 29,
    description: '科技和电子设备词汇',
    icon: '💻',
  },
  {
    id: 'tools_and_equipment',
    name: { en: 'Tools & Equipment', zh: '工具设备' },
    count: 36,
    description: '工具和设备相关词汇',
    icon: '🔧',
  },
  {
    id: 'music_and_instruments',
    name: { en: 'Music & Instruments', zh: '音乐乐器' },
    count: 42,
    description: '音乐和乐器相关词汇',
    icon: '🎵',
  },
  {
    id: 'events_and_celebrations',
    name: { en: 'Events & Celebrations', zh: '节日庆典' },
    count: 31,
    description: '节日和庆典相关词汇',
    icon: '🎉',
  },
  {
    id: 'fantasy_and_mythology',
    name: { en: 'Fantasy & Mythology', zh: '幻想神话' },
    count: 24,
    description: '幻想和神话相关词汇',
    icon: '🦄',
  },
  {
    id: 'household_items',
    name: { en: 'Household Items', zh: '家居用品' },
    count: 68,
    description: '家居用品相关词汇',
    icon: '🏠',
  },
  {
    id: 'others',
    name: { en: 'Others', zh: '其他' },
    count: 19,
    description: '其他分类词汇',
    icon: '📦',
  },
];

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