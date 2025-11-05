import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Button, Icon, Loading } from '@components/index';
import { useGameStore, useUIStore } from '@stores/index';
import { useAudioPlayer, useHapticFeedback } from '@hooks/index';

const GameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  padding: ${theme.spacing.lg} ${theme.spacing.md} calc(${theme.spacing.lg} + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const GameHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  color: white;
  z-index: 10;
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
  position: relative;
`;

const InstructionCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.xl};
  text-align: center;
  max-width: 400px;
  z-index: 10;
`;

const BubbleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: ${theme.borderRadius.xl};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const Bubble = styled(motion.div)<{ $color: string; $size: number }>`
  position: absolute;
  background: ${({ $color }) => $color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => Math.max(20, $size * 0.4)}px;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  user-select: none;
`;

const WordTarget = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
  text-align: center;
  min-width: 200px;
  z-index: 10;
`;

const TargetWord = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
  margin-bottom: ${theme.spacing.sm};
`;

const TargetPinyin = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.gray[600]};
`;

const ScorePopup = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.success[600]};
  pointer-events: none;
  z-index: 100;
`;

const ComboIndicator = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
  z-index: 50;
`;

const GameControls = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  z-index: 10;
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

interface BubbleData {
  id: string;
  word: string;
  emoji: string;
  color: string;
  size: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
}

interface TargetWord {
  word: string;
  pinyin: string;
  emoji: string;
}

const BUBBLE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1F2', '#F8B739', '#52C777'
];

const TARGET_WORDS: TargetWord[] = [
  { word: 'Cat', pinyin: 'māo', emoji: '🐱' },
  { word: 'Dog', pinyin: 'gǒu', emoji: '🐕' },
  { word: 'Apple', pinyin: 'píng guǒ', emoji: '🍎' },
  { word: 'Ball', pinyin: 'qiú', emoji: '⚽' },
  { word: 'Flower', pinyin: 'huā', emoji: '🌸' },
  { word: 'Tree', pinyin: 'shù', emoji: '🌳' },
  { word: 'Car', pinyin: 'qì chē', emoji: '🚗' },
  { word: 'Book', pinyin: 'shū', emoji: '📚' },
  { word: 'Star', pinyin: 'xīng xīng', emoji: '⭐' },
  { word: 'Sun', pinyin: 'tài yáng', emoji: '☀️' },
];

const generateRandomBubble = (containerWidth: number, containerHeight: number): BubbleData => {
  const size = Math.random() * 40 + 60;
  const targetWord = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    word: targetWord.word,
    emoji: targetWord.emoji,
    color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
    size,
    x: Math.random() * (containerWidth - size),
    y: containerHeight + size,
    speedX: (Math.random() - 0.5) * 2,
    speedY: -(Math.random() * 2 + 1),
  };
};

export const RainbowBubbles: React.FC = () => {
  const {
    score,
    combo,
    isPlaying,
    startGame,
    endGame,
    incrementScore,
    incrementCombo,
    resetCombo
  } = useGameStore();

  const { showToast } = useUIStore();
  const { play: playAudio } = useAudioPlayer();
  const { onSuccess, onError, onButtonPress } = useHapticFeedback();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [currentTarget, setCurrentTarget] = useState<TargetWord | null>(null);
  const [correctPops, setCorrectPops] = useState(0);
  const [totalPops, setTotalPops] = useState(0);
  const [scorePopups, setScorePopups] = useState<Array<{ id: string; x: number; y: number; score: number }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Game animation loop
  useEffect(() => {
    if (isPlaying && gameState === 'playing') {
      const animate = () => {
        setBubbles(prevBubbles => {
          return prevBubbles
            .map(bubble => ({
              ...bubble,
              x: bubble.x + bubble.speedX,
              y: bubble.y + bubble.speedY,
            }))
            .filter(bubble => bubble.y > -bubble.size && bubble.x > -bubble.size && bubble.x < (containerRef.current?.offsetWidth || 400) + bubble.size);
        });

        // Generate new bubbles periodically
        if (Math.random() < 0.02) {
          const containerWidth = containerRef.current?.offsetWidth || 400;
          const containerHeight = containerRef.current?.offsetHeight || 400;
          setBubbles(prev => [...prev, generateRandomBubble(containerWidth, containerHeight)]);
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isPlaying, gameState]);

  const startNewGame = () => {
    onButtonPress();
    setBubbles([]);
    setCorrectPops(0);
    setTotalPops(0);
    setScorePopups([]);
    resetCombo();

    const target = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
    setCurrentTarget(target);

    setGameState('playing');
    startGame();

    // Generate initial bubbles
    const containerWidth = containerRef.current?.offsetWidth || 400;
    const containerHeight = containerRef.current?.offsetHeight || 400;
    const initialBubbles = Array.from({ length: 5 }, () => generateRandomBubble(containerWidth, containerHeight));
    setBubbles(initialBubbles);
  };

  const handleBubbleClick = useCallback((bubble: BubbleData, event: React.MouseEvent) => {
    if (!currentTarget || !isPlaying) return;

    onButtonPress();
    setTotalPops(prev => prev + 1);

    const isCorrect = bubble.word.toLowerCase() === currentTarget.word.toLowerCase();
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    if (isCorrect) {
      onSuccess();
      incrementCombo();
      const points = 10 * (combo + 1);
      incrementScore(points);
      setCorrectPops(prev => prev + 1);

      showToast(`太棒了！+${points}分`, 'success');

      // Add score popup
      const popupId = Math.random().toString(36).substr(2, 9);
      setScorePopups(prev => [...prev, {
        id: popupId,
        x: rect.left + rect.width / 2,
        y: rect.top,
        score: points
      }]);

      // Remove popup after animation
      setTimeout(() => {
        setScorePopups(prev => prev.filter(p => p.id !== popupId));
      }, 1000);

      // Select new target
      const availableTargets = TARGET_WORDS.filter(t => t.word !== currentTarget.word);
      const newTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
      setCurrentTarget(newTarget);

      // Play success sound
      try {
        console.log(`Playing success sound for: ${bubble.word}`);
        // await playAudio('/audio/success.wav');
      } catch (error) {
        console.error('Error playing success sound:', error);
      }
    } else {
      onError();
      resetCombo();
      showToast(`这是 ${bubble.emoji}，不是 ${currentTarget.emoji} 哦！`, 'error');
    }

    // Remove the clicked bubble
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
  }, [currentTarget, isPlaying, combo, onSuccess, onError, showToast, incrementCombo, incrementScore, resetCombo]);

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
            <Icon name="bubble" />
            彩虹泡泡
          </GameTitle>
          <div style={{ width: '100px' }} />
        </GameHeader>

        <GameContent>
          <InstructionCard>
            <Icon name="bubble" size="lg" style={{ fontSize: '64px', marginBottom: theme.spacing.lg }} />
            <h2>彩虹泡泡游戏</h2>
            <p style={{ color: theme.colors.gray[600], margin: theme.spacing.md 0 }}>
              点击目标单词对应的泡泡！<br />
              看准目标，快速点击正确的泡泡<br />
              连续正确可以获得连击加分！
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

  if (gameState === 'playing' && currentTarget) {
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
            <Icon name="bubble" />
            彩虹泡泡
          </GameTitle>
          <GameStats>
            <StatBadge>
              <Icon name="star" />
              {score}分
            </StatBadge>
            <StatBadge>
              <Icon name="combo" />
              {combo}连击
            </StatBadge>
          </GameStats>
        </GameHeader>

        <GameContent>
          <WordTarget>
            <TargetWord>{currentTarget.emoji} {currentTarget.word}</TargetWord>
            <TargetPinyin>{currentTarget.pinyin}</TargetPinyin>
          </WordTarget>

          <BubbleContainer ref={containerRef}>
            <AnimatePresence>
              {bubbles.map(bubble => (
                <Bubble
                  key={bubble.id}
                  $color={bubble.color}
                  $size={bubble.size}
                  style={{
                    left: `${bubble.x}px`,
                    top: `${bubble.y}px`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleBubbleClick(bubble, e)}
                >
                  {bubble.emoji}
                </Bubble>
              ))}
            </AnimatePresence>

            {combo > 2 && (
              <ComboIndicator
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring" }}
              >
                🔥 {combo} 连击!
              </ComboIndicator>
            )}
          </BubbleContainer>

          <GameControls>
            <ControlButton
              onClick={handleGameEnd}
              icon={<Icon name="stop" />}
            >
              结束游戏
            </ControlButton>
          </GameControls>
        </GameContent>

        {/* Score popups */}
        <AnimatePresence>
          {scorePopups.map(popup => (
            <ScorePopup
              key={popup.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -30 }}
              exit={{ opacity: 0, y: -60 }}
              style={{
                left: `${popup.x}px`,
                top: `${popup.y}px`,
              }}
            >
              +{popup.score}
            </ScorePopup>
          ))}
        </AnimatePresence>
      </GameContainer>
    );
  }

  if (gameState === 'result') {
    const accuracy = totalPops > 0 ? Math.round((correctPops / totalPops) * 100) : 0;
    const maxCombo = combo;
    const rating = accuracy >= 90 && maxCombo >= 5 ? '⭐⭐⭐' : accuracy >= 70 ? '⭐⭐' : accuracy >= 50 ? '⭐' : '💪';

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
          <ResultTitle>泡泡大战结束！</ResultTitle>

          <div style={{ fontSize: '48px', margin: theme.spacing.md 0 }}>
            {rating}
          </div>

          <ResultStats>
            <ResultStat>
              <ResultStatValue>{score}</ResultStatValue>
              <ResultStatLabel>总得分</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{accuracy}%</ResultStatValue>
              <ResultStatLabel>准确率</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{maxCombo}</ResultStatValue>
              <ResultStatLabel>最高连击</ResultStatLabel>
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