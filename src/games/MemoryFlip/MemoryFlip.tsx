import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Button, Icon, Loading } from '@components/index';
import { useGameStore, useUIStore } from '@stores/index';
import { useAudioPlayer, useHapticFeedback } from '@hooks/index';

const GameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
`;

const GameHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
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

const GameStats = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const StatBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.xl};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const GameContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
`;

const InstructionCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.xl};
  text-align: center;
  max-width: 400px;
`;

const MemoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.md};
  width: 100%;
  max-width: 500px;
  padding: ${theme.spacing.lg};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.xl};
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const MemoryCard = styled(motion.div)<{ $flipped: boolean; $matched: boolean; $disabled: boolean }>`
  aspect-ratio: 1;
  background: ${({ $flipped, $matched, theme }) =>
    $flipped || $matched
      ? $matched
        ? theme.colors.success[500]
        : 'white'
      : 'rgba(255, 255, 255, 0.1)'
  };
  backdrop-filter: ${({ $flipped, $matched }) => $flipped || $matched ? 'none' : 'blur(10px)'};
  border: 2px solid ${({ $flipped, $matched, theme }) =>
    $flipped || $matched
      ? $matched
        ? theme.colors.success[600]
        : 'rgba(255, 255, 255, 0.3)'
      : 'rgba(255, 255, 255, 0.3)'
  };
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  min-height: 80px;

  ${({ $flipped }) => $flipped && `
    transform: rotateY(180deg);
  `}
`;

const CardFace = styled.div<{ $front: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  transform: ${({ $front }) => $front ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardBack = styled.div`
  font-size: 32px;
  color: rgba(255, 255, 255, 0.8);
`;

const CardFront = styled.div`
  font-size: 36px;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const CardText = styled.div<{ $matched: boolean }>`
  font-size: 14px;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${({ $matched, theme }) => $matched ? 'white' : theme.colors.gray[700]};
  text-align: center;
`;

const MatchAnimation = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  z-index: 100;
  pointer-events: none;
`;

const GameControls = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const ControlButton = styled(Button)`
  background: rgba(255, 255, 255, 0.9);
  color: ${theme.colors.primary[600]};
  backdrop-filter: blur(10px);
`;

const ResultModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.lg};
`;

const ResultContent = styled(Card)`
  background: white;
  padding: ${theme.spacing.xl};
  text-align: center;
  max-width: 400px;
`;

const ResultTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.md};
`;

const ResultStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin: ${theme.spacing.lg} 0;
`;

const ResultStat = styled.div`
  text-align: center;
`;

const ResultStatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
`;

const ResultStatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const DifficultySelector = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  margin-bottom: ${theme.spacing.lg};
`;

const DifficultyButton = styled(Button)<{ $selected: boolean }>`
  background: ${({ $selected, theme }) => $selected ? theme.colors.primary[500] : 'rgba(255, 255, 255, 0.9)'};
  color: ${({ $selected }) => $selected ? 'white' : theme.colors.primary[600]};
`;

interface MemoryCard {
  id: string;
  emoji: string;
  word: { en: string; zh: string };
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_PAIRS = {
  easy: [
    { emoji: '🐱', word: { en: 'Cat', zh: '猫' } },
    { emoji: '🐕', word: { en: 'Dog', zh: '狗' } },
    { emoji: '🍎', word: { en: 'Apple', zh: '苹果' } },
    { emoji: '⚽', word: { en: 'Ball', zh: '球' } },
  ],
  medium: [
    { emoji: '🐱', word: { en: 'Cat', zh: '猫' } },
    { emoji: '🐕', word: { en: 'Dog', zh: '狗' } },
    { emoji: '🍎', word: { en: 'Apple', zh: '苹果' } },
    { emoji: '⚽', word: { en: 'Ball', zh: '球' } },
    { emoji: '🌸', word: { en: 'Flower', zh: '花' } },
    { emoji: '🌳', word: { en: 'Tree', zh: '树' } },
  ],
  hard: [
    { emoji: '🐱', word: { en: 'Cat', zh: '猫' } },
    { emoji: '🐕', word: { en: 'Dog', zh: '狗' } },
    { emoji: '🍎', word: { en: 'Apple', zh: '苹果' } },
    { emoji: '⚽', word: { en: 'Ball', zh: '球' } },
    { emoji: '🌸', word: { en: 'Flower', zh: '花' } },
    { emoji: '🌳', word: { en: 'Tree', zh: '树' } },
    { emoji: '🚗', word: { en: 'Car', zh: '汽车' } },
    { emoji: '📚', word: { en: 'Book', zh: '书' } },
  ],
};

export const MemoryFlip: React.FC = () => {
  const {
    score,
    moves,
    timeLeft,
    isPlaying,
    difficulty,
    startGame,
    endGame,
    incrementScore,
    incrementMoves,
    updateTimeLeft
  } = useGameStore();

  const { showToast } = useUIStore();
  const { play: playAudio } = useAudioPlayer();
  const { onSuccess, onError, onButtonPress } = useHapticFeedback();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Game timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => {
        updateTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      handleGameEnd();
    }
  }, [isPlaying, timeLeft, gameState]);

  const generateCards = useCallback((difficulty: 'easy' | 'medium' | 'hard'): MemoryCard[] => {
    const pairs = CARD_PAIRS[difficulty];
    const gameCards: MemoryCard[] = [];

    pairs.forEach((pair, index) => {
      const pairId = `pair-${index}`;

      // Create two cards for each pair
      gameCards.push({
        id: `card-${index * 2}`,
        emoji: pair.emoji,
        word: pair.word,
        pairId,
        isFlipped: false,
        isMatched: false,
      });

      gameCards.push({
        id: `card-${index * 2 + 1}`,
        emoji: pair.emoji,
        word: pair.word,
        pairId,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    return gameCards.sort(() => Math.random() - 0.5);
  }, []);

  const startNewGame = () => {
    onButtonPress();
    const newCards = generateCards(selectedDifficulty);
    setCards(newCards);
    setSelectedCards([]);
    setMatchedPairs(0);
    setIsChecking(false);
    setGameState('playing');
    startGame();

    // Set time limit based on difficulty
    const timeLimits = { easy: 120, medium: 180, hard: 240 };
    updateTimeLeft(timeLimits[selectedDifficulty]);
  };

  const handleCardClick = (cardId: string) => {
    if (isChecking) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    onButtonPress();
    incrementMoves();

    // Flip the card
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    // Play flip sound
    try {
      console.log(`Playing card flip sound`);
      // await playAudio('/audio/flip.wav');
    } catch (error) {
      console.error('Error playing flip sound:', error);
    }

    // Check for match when two cards are selected
    if (newSelectedCards.length === 2) {
      setIsChecking(true);
      const [firstId, secondId] = newSelectedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard) {
        const isMatch = firstCard.pairId === secondCard.pairId;

        setTimeout(() => {
          if (isMatch) {
            // Match found
            onSuccess();
            incrementScore(20);
            setMatchedPairs(prev => prev + 1);
            setCards(prev => prev.map(c =>
              c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
            ));
            showToast('配对成功！', 'success');

            // Check if game is complete
            if (matchedPairs + 1 === cards.length / 2) {
              setTimeout(handleGameEnd, 1000);
            }
          } else {
            // No match
            onError();
            setCards(prev => prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            ));
            showToast('不匹配，再试试！', 'error');
          }

          setSelectedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const handleGameEnd = () => {
    endGame();
    setGameState('result');
  };

  const handleBackToMenu = () => {
    onButtonPress();
    setGameState('menu');
  };

  if (gameState === 'menu') {
    return (
      <GameContainer>
        <GameHeader>
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            icon={<Icon name="previous" />}
          >
            返回
          </Button>
          <GameTitle>
            <Icon name="memory" />
            记忆翻牌
          </GameTitle>
          <div style={{ width: '100px' }} />
        </GameHeader>

        <GameContent>
          <InstructionCard>
            <Icon name="memory" size="lg" style={{ fontSize: '64px', marginBottom: theme.spacing.lg }} />
            <h2>记忆翻牌游戏</h2>
            <p style={{ color: theme.colors.gray[600], margin: theme.spacing.md 0 }}>
              翻开卡片找到配对！<br />
              记住卡片位置，找到相同的图案<br />
              考验你的记忆力和专注力。
            </p>

            <DifficultySelector>
              <DifficultyButton
                $selected={selectedDifficulty === 'easy'}
                onClick={() => setSelectedDifficulty('easy')}
              >
                简单
              </DifficultyButton>
              <DifficultyButton
                $selected={selectedDifficulty === 'medium'}
                onClick={() => setSelectedDifficulty('medium')}
              >
                中等
              </DifficultyButton>
              <DifficultyButton
                $selected={selectedDifficulty === 'hard'}
                onClick={() => setSelectedDifficulty('hard')}
              >
                困难
              </DifficultyButton>
            </DifficultySelector>

            <ControlButton
              onClick={startNewGame}
              icon={<Icon name="play" />}
            >
              开始游戏
            </ControlButton>
          </InstructionCard>
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'playing') {
    return (
      <GameContainer>
        <GameHeader>
          <Button
            variant="secondary"
            onClick={handleBackToMenu}
            icon={<Icon name="previous" />}
          >
            返回
          </Button>
          <GameTitle>
            <Icon name="memory" />
            记忆翻牌
          </GameTitle>
          <GameStats>
            <StatBadge>
              <Icon name="timer" />
              {timeLeft}秒
            </StatBadge>
            <StatBadge>
              <Icon name="move" />
              {moves}步
            </StatBadge>
            <StatBadge>
              <Icon name="star" />
              {score}分
            </StatBadge>
            <StatBadge>
              <Icon name="match" />
              {matchedPairs}/{cards.length / 2}
            </StatBadge>
          </GameStats>
        </GameHeader>

        <GameContent>
          <MemoryGrid>
            {cards.map(card => (
              <MemoryCard
                key={card.id}
                $flipped={card.isFlipped}
                $matched={card.isMatched}
                $disabled={isChecking || card.isMatched}
                onClick={() => handleCardClick(card.id)}
                whileHover={!isChecking && !card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
                whileTap={!isChecking && !card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <CardFace $front={false}>
                  <CardBack>
                    <Icon name="question" />
                  </CardBack>
                </CardFace>
                <CardFace $front={true}>
                  <CardFront>
                    {card.emoji}
                    <CardText $matched={card.isMatched}>
                      {card.word.zh} ({card.word.en})
                    </CardText>
                  </CardFront>
                </CardFace>

                {card.isMatched && (
                  <MatchAnimation
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8 }}
                  >
                    ✨
                  </MatchAnimation>
                )}
              </MemoryCard>
            ))}
          </MemoryGrid>

          <GameControls>
            <ControlButton
              onClick={handleGameEnd}
              icon={<Icon name="stop" }}
            >
              结束游戏
            </ControlButton>
          </GameControls>
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'result') {
    const totalPairs = cards.length / 2;
    const accuracy = moves > 0 ? Math.max(0, Math.round((totalPairs / moves) * 100)) : 0;
    const timeBonus = Math.max(0, timeLeft * 2);
    const finalScore = score + timeBonus;
    const rating = accuracy >= 80 ? '⭐⭐⭐' : accuracy >= 60 ? '⭐⭐' : accuracy >= 40 ? '⭐' : '💪';

    return (
      <ResultModal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ResultContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ResultTitle>游戏完成！</ResultTitle>

          <div style={{ fontSize: '48px', margin: theme.spacing.md 0 }}>
            {rating}
          </div>

          <ResultStats>
            <ResultStat>
              <ResultStatValue>{finalScore}</ResultStatValue>
              <ResultStatLabel>最终得分</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{accuracy}%</ResultStatValue>
              <ResultStatLabel>准确率</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{moves}</ResultStatValue>
              <ResultStatLabel>总步数</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>+{timeBonus}</ResultStatValue>
              <ResultStatLabel>时间奖励</ResultStatLabel>
            </ResultStat>
          </ResultStats>

          <GameControls>
            <ControlButton
              onClick={startNewGame}
              icon={<Icon name="replay" />}
            >
              再玩一次
            </ControlButton>
            <ControlButton
              onClick={handleBackToMenu}
              icon={<Icon name="home" />}
            >
              返回菜单
            </ControlButton>
          </GameControls>
        </ResultContent>
      </ResultModal>
    );
  }

  return null;
};