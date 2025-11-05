import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@styles/index';
import { Button, Card, Icon, Loading } from '@components/index';
import { Flashcard } from '@components/flashcard';
import { useAppStore, useProgress } from '@stores/index';
import { useAudioPlayer } from '@hooks/index';
import { useHapticFeedback } from '@hooks/index';
import { Word, Category } from '@types/index';

const FlashcardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  color: white;
`;

const HeaderTitle = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  font-family: ${theme.typography.fontFamily.display};
`;

const StatsBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.xl};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
`;

const FlashcardWrapper = styled.div`
  width: 100%;
  max-width: 400px;
`;

const ModeSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing.md};
`;

const ModeButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const NavigationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 400px;
  gap: ${theme.spacing.md};
`;

const ControlButton = styled(Button)`
  background: rgba(255, 255, 255, 0.9);
  color: ${theme.colors.primary[600]};
  backdrop-filter: blur(10px);
`;

const LoadingMessage = styled.div`
  color: white;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

// Mock data - in real app, this would come from API or categories.json
const mockCategories: Category[] = [
  { id: 'animals', name: { en: 'Animals', zh: '动物' }, count: 287 },
  { id: 'food_and_drink', name: { en: 'Food & Drink', zh: '食物饮料' }, count: 156 },
  { id: 'colors_and_shapes', name: { en: 'Colors & Shapes', zh: '颜色形状' }, count: 50 },
  { id: 'numbers', name: { en: 'Numbers', zh: '数字' }, count: 30 },
];

const mockWords: Word[] = [
  {
    id: '1',
    filename: 'cat.png',
    word: { en: 'Cat', zh: '猫' },
    voiceFilename: { en: 'cat_en.wav', zh: 'cat_cn.wav' },
    category: 'animals',
  },
  {
    id: '2',
    filename: 'dog.png',
    word: { en: 'Dog', zh: '狗' },
    voiceFilename: { en: 'dog_en.wav', zh: 'dog_cn.wav' },
    category: 'animals',
  },
  {
    id: '3',
    filename: 'rabbit.png',
    word: { en: 'Rabbit', zh: '兔子' },
    voiceFilename: { en: 'rabbit_en.wav', zh: 'rabbit_cn.wav' },
    category: 'animals',
  },
  // Add more mock words as needed
];

export const FlashcardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const { progress, updateProgress } = useProgress();
  const { play: playAudio } = useAudioPlayer();
  const { onCardFlip, onSuccess, onError } = useHapticFeedback();

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [learningMode, setLearningMode] = useState<'browse' | 'learn' | 'review'>('browse');
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

  // Load words for the selected category
  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const categoryWords = mockWords.filter(word => word.category === categoryId);
        setWords(categoryWords);
        setCurrentIndex(0);
        setIsLoading(false);
      }, 500);
    }
  }, [categoryId]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      onCardFlip();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      onCardFlip();
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onCardFlip();

    // Mark as reviewed
    if (currentWord) {
      const now = new Date().toISOString();
      updateProgress({
        lastPlayedDate: now,
        categoryProgress: {
          ...progress.categoryProgress,
          [categoryId]: {
            total: words.length,
            mastered: progress.categoryProgress[categoryId]?.mastered || 0,
            lastStudied: now,
          },
        },
      });
    }
  };

  const toggleFavorite = () => {
    if (currentWord) {
      setFavorites(prev => {
        if (prev.includes(currentWord.id)) {
          return prev.filter(id => id !== currentWord.id);
        } else {
          return [...prev, currentWord.id];
        }
      });
    }
  };

  const isFavorite = currentWord ? favorites.includes(currentWord.id) : false;

  const handleModeChange = (mode: 'browse' | 'learn' | 'review') => {
    setLearningMode(mode);
  };

  const handleBackToCategories = () => {
    navigate('/learning/categories');
  };

  const playBackgroundMusic = async () => {
    try {
      // In a real app, this would play background music
      // await playAudio('/audio/background-music.mp3', { volume: 0.3, loop: true });
    } catch (error) {
      console.warn('Background music not available:', error);
    }
  };

  // Play background music on mount
  useEffect(() => {
    playBackgroundMusic();
  }, []);

  if (isLoading) {
    return (
      <FlashcardContainer>
        <Header>
          <Button
            variant="secondary"
            onClick={handleBackToCategories}
            icon={<Icon name="previous" />}
          >
            返回
          </Button>
        </Header>

        <MainContent>
          <LoadingMessage>
            <Icon name="book" size="lg" />
            <div>加载单词中...</div>
          </LoadingMessage>
          <Loading />
        </MainContent>
      </FlashcardContainer>
    );
  }

  if (words.length === 0) {
    return (
      <FlashcardContainer>
        <Header>
          <Button
            variant="secondary"
            onClick={handleBackToCategories}
            icon={<Icon name="previous" />}
          >
            返回
          </Button>
        </Header>

        <MainContent>
          <Card style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <Icon name="error" size="lg" style={{ fontSize: '64px', marginBottom: theme.spacing.md }} />
            <h3>暂无词汇</h3>
            <p style={{ color: theme.colors.gray[600] }}>
              该分类下还没有单词，请选择其他分类。
            </p>
            <Button
              onClick={handleBackToCategories}
              icon={<Icon name="back" />}
              style={{ marginTop: theme.spacing.lg }}
            >
              返回分类选择
            </Button>
          </Card>
        </MainContent>
      </FlashcardContainer>
    );
  }

  return (
    <FlashcardContainer>
      <Header>
        <Button
          variant="secondary"
          onClick={handleBackToCategories}
          icon={<Icon name="previous" />}
        >
          返回
        </Button>

        <HeaderTitle>闪卡学习</HeaderTitle>

        <StatsBadge>
          {currentIndex + 1} / {words.length}
        </StatsBadge>
      </Header>

      <MainContent>
        <ModeSelector>
          <ModeButton
            $active={learningMode === 'browse'}
            onClick={() => handleModeChange('browse')}
          >
            浏览模式
          </ModeButton>
          <ModeButton
            $active={learningMode === 'learn'}
            onClick={() => handleModeChange('learn')}
          >
            学习模式
          </ModeButton>
          <ModeButton
            $active={learningMode === 'review'}
            onClick={() => handleModeChange('review')}
          >
            复习模式
          </ModeButton>
        </ModeSelector>

        <FlashcardWrapper>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord?.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Flashcard
                word={currentWord}
                isFlipped={isFlipped}
                showTranslation={showTranslation}
                autoPlay={learningMode === 'learn'}
                onFlip={handleFlip}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            </motion.div>
          </AnimatePresence>
        </FlashcardWrapper>

        <NavigationControls>
          <ControlButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            icon={<Icon name="previous" />}
            size="sm"
          >
            上一张
          </ControlButton>

          <ControlButton
            onClick={handleFlip}
            icon={<Icon name="refresh" />}
          >
            {isFlipped ? '看图片' : '看中文'}
          </ControlButton>

          <ControlButton
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            icon={<Icon name="next" />}
            size="sm"
          >
            下一张
          </ControlButton>
        </NavigationControls>
      </MainContent>
    </FlashcardContainer>
  );
};