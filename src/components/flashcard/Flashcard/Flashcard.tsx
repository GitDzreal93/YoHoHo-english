import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@styles/index';
import { Button, Card, Icon } from '@components/ui';
import { useAudioPlayer } from '@hooks/index';
import { useHapticFeedback } from '@hooks/index';
import { Word } from '@types/index';

interface FlashcardProps {
  word: Word;
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isFlipped?: boolean;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  showTranslation?: boolean;
  autoPlay?: boolean;
}

const flipAnimation = keyframes`
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(0deg); }
`;

const FlipContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const FlashcardStyled = styled(motion.div)<{ $flipped: boolean }>`
  width: 100%;
  aspect-ratio: 4/3;
  position: relative;
  transform-style: preserve-3d;
  animation: ${({ $flipped }) => $flipped ? flipAnimation : 'none'} 0.6s ease-in-out;
`;

const CardSide = styled.div<{ $visible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: ${theme.borderRadius.xl};
  background: white;
  box-shadow: ${theme.shadows.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transition: opacity 0.3s ease;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
`;

const CardImage = styled.div<{ $src?: string }>`
  width: 120px;
  height: 120px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};

  ${({ $src }) => $src && `
    background-image: url(${$src});
  `}

  /* Placeholder for missing images */
  ${({ $src }) => !$src && `
    background: ${theme.colors.gray[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: ${theme.colors.gray[400]};
  `}
`;

const CardWord = styled.h2`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.sm};
  font-family: ${theme.typography.fontFamily.display};
  text-align: center;
`;

const CardTranslation = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.gray[600]};
  text-align: center;
  line-height: ${theme.typography.lineHeight.normal};
  margin-bottom: ${theme.spacing.md};
`;

const AudioButton = styled(Button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  color: ${theme.colors.primary[600]};
  box-shadow: ${theme.shadows.md};

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  position: absolute;
  bottom: 20px;
  left: 20px;
`;

const FavoriteButton = styled.button<{ $active: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.warning[500] : 'white'};
  color: ${({ $active }) => $active ? 'white' : theme.colors.warning[500]};
  box-shadow: ${theme.shadows.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.md};
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.lg};
  gap: ${theme.spacing.md};
  width: 100%;
  max-width: 400px;
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.9);
  border-radius: ${theme.borderRadius.xl};
  backdrop-filter: blur(10px);
  color: ${theme.colors.gray[700]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ProgressDots = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const ProgressDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active, theme }) => $active ? theme.colors.primary[600] : theme.colors.gray[300]};
  transition: all 0.2s ease;
`;

const getAudioUrl = (filename: string): string => {
  // In a real app, this would map to actual audio files
  // For now, return a placeholder URL
  return `/audio/${filename}`;
};

const getImageUrl = (filename: string): string => {
  // In a real app, this would map to actual image files
  // For now, return a placeholder URL
  return `/images/${filename}`;
};

export const Flashcard: React.FC<FlashcardProps> = ({
  word,
  onFlip,
  onNext,
  onPrevious,
  isFlipped = false,
  onToggleFavorite,
  isFavorite = false,
  showTranslation = false,
  autoPlay = true,
}) => {
  const { play, isPlaying, isLoading } = useAudioPlayer();
  const { onCardFlip, onCorrectAnswer } = useHapticFeedback();
  const [localIsFlipped, setLocalIsFlipped] = useState(isFlipped);

  const handleCardClick = () => {
    setLocalIsFlipped(!localIsFlipped);
    onCardFlip();
    if (onFlip) {
      onFlip();
    }
  };

  const playAudio = async (language: 'en' | 'zh') => {
    try {
      const audioFilename = language === 'en' ? word.voiceFilename.en : word.voiceFilename.zh;
      if (audioFilename) {
        await play(getAudioUrl(audioFilename));
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  // Auto-play audio when card changes
  React.useEffect(() => {
    if (autoPlay && !localIsFlipped) {
      playAudio('en');
    }
  }, [word, autoPlay, localIsFlipped]);

  React.useEffect(() => {
    setLocalIsFlipped(isFlipped);
  }, [isFlipped]);

  const imageUrl = getImageUrl(word.filename);

  return (
    <>
      <FlipContainer>
        <FlashcardStyled
          $flipped={localIsFlipped}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Front side - English */}
          <CardSide $visible={!localIsFlipped}>
            <CardImage $src={imageUrl} />
            <CardWord>{word.word.en}</CardWord>
            <CardTranslation style={{ opacity: showTranslation ? 1 : 0 }}>
              {showTranslation && word.word.zh}
            </CardTranslation>

            <AudioButton
              onClick={() => playAudio('en')}
              disabled={isLoading}
              title="播放英文发音"
            >
              <Icon
                name={isPlaying && !isLoading ? 'pause' : 'sound'}
                size="md"
              />
            </AudioButton>

            <CardActions>
              <FavoriteButton
                $active={isFavorite}
                onClick={onToggleFavorite}
                title={isFavorite ? '取消收藏' : '收藏卡片'}
              >
                <Icon name={isFavorite ? 'star' : 'star'} size="sm" />
              </FavoriteButton>
            </CardActions>
          </CardSide>

          {/* Back side - Chinese */}
          <CardSide $visible={localIsFlipped} style={{ transform: 'rotateY(180deg)' }}>
            <CardImage $src={imageUrl} />
            <CardWord>{word.word.zh}</CardWord>
            <CardTranslation>{word.word.en}</CardTranslation>

            <AudioButton
              onClick={() => playAudio('zh')}
              disabled={isLoading}
              title="播放中文发音"
            >
              <Icon
                name={isPlaying && !isLoading ? 'pause' : 'sound'}
                size="md"
              />
            </AudioButton>

            <CardActions>
              <FavoriteButton
                $active={isFavorite}
                onClick={onToggleFavorite}
                title={isFavorite ? '取消收藏' : '收藏卡片'}
              >
                <Icon name={isFavorite ? 'star' : 'star'} size="sm" />
              </FavoriteButton>
            </CardActions>
          </CardSide>
        </FlashcardStyled>
      </FlipContainer>

      <ProgressIndicator>
        <ProgressDots>
          <ProgressDot $active={true} />
          <ProgressDot $active={false} />
          <ProgressDot $active={false} />
        </ProgressDots>
      </ProgressIndicator>

      <NavigationContainer>
        <Button
          variant="secondary"
          onClick={onPrevious}
          icon={<Icon name="previous" />}
          size="sm"
        >
          上一张
        </Button>

        <Button
          onClick={handleCardClick}
          variant="primary"
          icon={<Icon name="refresh" />}
        >
          {localIsFlipped ? '看图片' : '看中文'}
        </Button>

        <Button
          variant="secondary"
          onClick={onNext}
          icon={<Icon name="next" />}
          size="sm"
        >
          下一张
        </Button>
      </NavigationContainer>
    </>
  );
};