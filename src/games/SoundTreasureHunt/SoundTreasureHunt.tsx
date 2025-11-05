import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Button, Icon, Loading } from '@components/index';
import { useGameStore, useUIStore } from '@stores/index';
import { useAudioPlayer, useHapticFeedback } from '@hooks/index';
import { Word } from '@types/index';

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

const TreasureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 500px;
`;

const TreasureBox = styled(motion.div)<{ $revealed: boolean; $correct: boolean | null }>`
  background: ${({ $revealed, $correct, theme }) =>
    $revealed
      ? $correct
        ? theme.colors.success[500]
        : theme.colors.error[500]
      : 'rgba(255, 255, 255, 0.1)'
  };
  backdrop-filter: ${({ $revealed }) => $revealed ? 'none' : 'blur(10px)'};
  border: 2px solid ${({ $revealed, theme }) =>
    $revealed
      ? 'transparent'
      : 'rgba(255, 255, 255, 0.3)'
  };
  border-radius: ${theme.borderRadius.xl};
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $revealed }) => $revealed ? 'default' : 'pointer'};
  position: relative;
  overflow: hidden;
  min-height: 120px;
`;

const TreasureIcon = styled.div`
  font-size: 48px;
  color: ${({ $revealed, theme }) =>
    $revealed
      ? 'white'
      : theme.colors.gray[300]
  };
`;

const TreasureEmoji = styled(motion.div)<{ $revealed: boolean }>`
  font-size: 64px;
  position: absolute;
  opacity: ${({ $revealed }) => $revealed ? 1 : 0};
`;

const SoundIndicator = styled(motion.div)`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const GameControls = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
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

interface GameWord extends Word {
  emoji?: string;
}

const generateGameWords = (): GameWord[] => {
  return [
    { id: '1', filename: 'cat.png', word: { en: 'Cat', zh: '猫' }, voiceFilename: { en: 'cat_en.wav', zh: 'cat_cn.wav' }, category: 'animals', emoji: '🐱' },
    { id: '2', filename: 'dog.png', word: { en: 'Dog', zh: '狗' }, voiceFilename: { en: 'dog_en.wav', zh: 'dog_cn.wav' }, category: 'animals', emoji: '🐕' },
    { id: '3', filename: 'apple.png', word: { en: 'Apple', zh: '苹果' }, voiceFilename: { en: 'apple_en.wav', zh: 'apple_cn.wav' }, category: 'food_and_drink', emoji: '🍎' },
    { id: '4', filename: 'ball.png', word: { en: 'Ball', zh: '球' }, voiceFilename: { en: 'ball_en.wav', zh: 'ball_cn.wav' }, category: 'games_and_toys', emoji: '⚽' },
    { id: '5', filename: 'car.png', word: { en: 'Car', zh: '汽车' }, voiceFilename: { en: 'car_en.wav', zh: 'car_cn.wav' }, category: 'transportation', emoji: '🚗' },
    { id: '6', filename: 'book.png', word: { en: 'Book', zh: '书' }, voiceFilename: { en: 'book_en.wav', zh: 'book_cn.wav' }, category: 'school', emoji: '📚' },
    { id: '7', filename: 'flower.png', word: { en: 'Flower', zh: '花' }, voiceFilename: { en: 'flower_en.wav', zh: 'flower_cn.wav' }, category: 'nature', emoji: '🌸' },
    { id: '8', filename: 'tree.png', word: { en: 'Tree', zh: '树' }, voiceFilename: { en: 'tree_en.wav', zh: 'tree_cn.wav' }, category: 'nature', emoji: '🌳' },
    { id: '9', filename: 'star.png', word: { en: 'Star', zh: '星星' }, voiceFilename: { en: 'star_en.wav', zh: 'star_cn.wav' }, category: 'others', emoji: '⭐' },
  ];
};

export const SoundTreasureHunt: React.FC = () => {
  const {
    score,
    timeLeft,
    isPlaying,
    difficulty,
    startGame,
    endGame,
    incrementScore,
    updateTimeLeft
  } = useGameStore();

  const { showToast } = useUIStore();
  const { play: playAudio } = useAudioPlayer();
  const { onSuccess, onError, onButtonPress } = useHapticFeedback();

  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const [currentWord, setCurrentWord] = useState<GameWord | null>(null);
  const [revealedBoxes, setRevealedBoxes] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Initialize game
  useEffect(() => {
    const words = generateGameWords();
    setGameWords(words);
  }, []);

  // Game timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        updateTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      handleGameEnd();
    }
  }, [isPlaying, timeLeft]);

  const startNewGame = () => {
    onButtonPress();
    const shuffled = [...gameWords].sort(() => Math.random() - 0.5);
    setGameWords(shuffled);
    setCurrentWord(shuffled[0]);
    setRevealedBoxes(new Set());
    setCorrectGuesses(0);
    setTotalAttempts(0);
    setGameState('playing');
    startGame();

    // Play the first word sound
    setTimeout(() => playWordSound(shuffled[0]), 1000);
  };

  const playWordSound = useCallback(async (word: GameWord) => {
    setIsPlayingSound(true);
    try {
      // Simulate audio playback
      console.log(`Playing sound for: ${word.word.en}`);
      // In real app: await playAudio(`/audio/${word.voiceFilename.en}`);
      setIsPlayingSound(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlayingSound(false);
    }
  }, [playAudio]);

  const handleBoxClick = useCallback((index: number, word: GameWord) => {
    if (revealedBoxes.has(index) || !currentWord) return;

    onButtonPress();
    setRevealedBoxes(prev => new Set([...prev, index]));
    setTotalAttempts(prev => prev + 1);

    const isCorrect = word.id === currentWord.id;

    if (isCorrect) {
      onSuccess();
      incrementScore(10);
      setCorrectGuesses(prev => prev + 1);
      showToast('太棒了！找到了正确的宝藏！', 'success');

      // Move to next word after a delay
      setTimeout(() => {
        const nextIndex = gameWords.findIndex(w => w.id === currentWord.id) + 1;
        if (nextIndex < gameWords.length) {
          setCurrentWord(gameWords[nextIndex]);
          playWordSound(gameWords[nextIndex]);
        } else {
          handleGameEnd();
        }
      }, 1500);
    } else {
      onError();
      showToast('不是这个哦，再试试别的！', 'error');
    }
  }, [currentWord, revealedBoxes, gameWords, onSuccess, onError, showToast, incrementScore, playWordSound]);

  const handleGameEnd = () => {
    endGame();
    setGameState('result');
  };

  const handleReplaySound = () => {
    if (currentWord) {
      onButtonPress();
      playWordSound(currentWord);
    }
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
            <Icon name="music" />
            声音寻宝
          </GameTitle>
          <div style={{ width: '100px' }} />
        </GameHeader>

        <GameContent>
          <InstructionCard>
            <Icon name="music" size="lg" style={{ fontSize: '64px', marginBottom: theme.spacing.lg }} />
            <h2>声音寻宝游戏</h2>
            <p style={{ color: theme.colors.gray[600], margin: theme.spacing.md 0 }}>
              听声音，找宝藏！<br />
              点击播放按钮听单词发音，<br />
              然后找到对应的图片宝箱。
            </p>
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

  if (gameState === 'playing' && currentWord) {
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
            <Icon name="music" />
            声音寻宝
          </GameTitle>
          <GameStats>
            <StatBadge>
              <Icon name="timer" />
              {timeLeft}秒
            </StatBadge>
            <StatBadge>
              <Icon name="star" />
              {score}分
            </StatBadge>
          </GameStats>
        </GameHeader>

        <GameContent>
          <InstructionCard>
            <h3>听声音找宝藏</h3>
            <p style={{ color: theme.colors.gray[600], margin: theme.spacing.md 0 }}>
              找到 "{currentWord.word.zh}" ({currentWord.word.en}) 对应的宝箱
            </p>
            <ControlButton
              onClick={handleReplaySound}
              disabled={isPlayingSound}
              icon={<Icon name="replay" />}
              size="sm"
            >
              {isPlayingSound ? '播放中...' : '重听声音'}
            </ControlButton>
          </InstructionCard>

          <TreasureGrid>
            {gameWords.map((word, index) => {
              const isRevealed = revealedBoxes.has(index);
              const isCorrect = isRevealed && word.id === currentWord.id;

              return (
                <TreasureBox
                  key={word.id}
                  $revealed={isRevealed}
                  $correct={isCorrect}
                  onClick={() => handleBoxClick(index, word)}
                  whileHover={!isRevealed ? { scale: 1.05 } : {}}
                  whileTap={!isRevealed ? { scale: 0.95 } : {}}
                >
                  <TreasureIcon $revealed={isRevealed}>
                    {isRevealed ? (isCorrect ? '✓' : '✗') : '📦'}
                  </TreasureIcon>
                  <TreasureEmoji
                    $revealed={isRevealed}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: isRevealed ? 1 : 0,
                      scale: isRevealed ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {word.emoji}
                  </TreasureEmoji>

                  {index === gameWords.findIndex(w => w.id === currentWord.id) && !isRevealed && (
                    <SoundIndicator
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Icon name="volume" />
                    </SoundIndicator>
                  )}
                </TreasureBox>
              );
            })}
          </TreasureGrid>
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'result') {
    const accuracy = totalAttempts > 0 ? Math.round((correctGuesses / totalAttempts) * 100) : 0;
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
          <ResultTitle>游戏结束！</ResultTitle>

          <div style={{ fontSize: '48px', margin: theme.spacing.md 0 }}>
            {rating}
          </div>

          <ResultStats>
            <ResultStat>
              <ResultStatValue>{score}</ResultStatValue>
              <ResultStatLabel>总得分</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{correctGuesses}</ResultStatValue>
              <ResultStatLabel>正确数</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{accuracy}%</ResultStatValue>
              <ResultStatLabel>准确率</ResultStatLabel>
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