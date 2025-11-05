import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Button, Icon, Loading } from '@components/index';
import { useGameStore, useUIStore } from '@stores/index';
import { useHapticFeedback } from '@hooks/index';

const GameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

const PuzzleContainer = styled.div`
  position: relative;
  width: 320px;
  height: 320px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.xl};
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: ${theme.spacing.sm};
`;

const PuzzleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  width: 100%;
  height: 100%;
`;

const PuzzlePiece = styled(motion.div)<{ $isEmpty: boolean; $isCorrect: boolean }>`
  background: ${({ $isEmpty, theme }) => $isEmpty ? 'transparent' : 'rgba(255, 255, 255, 0.9)'};
  border: 2px solid ${({ $isCorrect, theme }) => $isCorrect ? theme.colors.success[500] : 'rgba(255, 255, 255, 0.3)'};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  cursor: ${({ $isEmpty }) => $isEmpty ? 'default' : 'pointer'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $isEmpty, theme }) => $isEmpty ? 'transparent' : 'rgba(255, 255, 255, 1)'};
    transform: ${({ $isEmpty }) => $isEmpty ? 'none' : 'scale(1.05)'};
  }
`;

const NumberLabel = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
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

const SuccessAnimation = styled(motion.div)`
  font-size: 80px;
  margin: ${theme.spacing.lg} 0;
`;

interface PuzzlePiece {
  id: number;
  emoji: string;
  position: number;
  word: { en: string; zh: string };
}

const generatePuzzleData = (): PuzzlePiece[] => {
  return [
    { id: 1, emoji: '🐱', position: 0, word: { en: 'Cat', zh: '猫' } },
    { id: 2, emoji: '🐕', position: 1, word: { en: 'Dog', zh: '狗' } },
    { id: 3, emoji: '🍎', position: 2, word: { en: 'Apple', zh: '苹果' } },
    { id: 4, emoji: '🌸', position: 3, word: { en: 'Flower', zh: '花' } },
    { id: 5, emoji: '🌳', position: 4, word: { en: 'Tree', zh: '树' } },
    { id: 6, emoji: '⚽', position: 5, word: { en: 'Ball', zh: '球' } },
    { id: 7, emoji: '🚗', position: 6, word: { en: 'Car', zh: '汽车' } },
    { id: 8, emoji: '📚', position: 7, word: { en: 'Book', zh: '书' } },
    { id: 9, emoji: '⭐', position: 8, word: { en: 'Star', zh: '星星' } },
  ];
};

export const MagicPuzzle: React.FC = () => {
  const {
    score,
    moves,
    isPlaying,
    startGame,
    endGame,
    incrementScore,
    incrementMoves
  } = useGameStore();

  const { showToast } = useUIStore();
  const { onSuccess, onError, onButtonPress } = useHapticFeedback();

  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [currentWord, setCurrentWord] = useState<PuzzlePiece | null>(null);

  // Initialize game
  useEffect(() => {
    const pieces = generatePuzzleData();
    setPuzzlePieces(pieces);
  }, []);

  const shufflePuzzle = useCallback(() => {
    const shuffled = [...puzzlePieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempPosition = shuffled[i].position;
      shuffled[i].position = shuffled[j].position;
      shuffled[j].position = tempPosition;
    }
    return shuffled;
  }, [puzzlePieces]);

  const startNewGame = () => {
    onButtonPress();
    const shuffled = shufflePuzzle();
    setPuzzlePieces(shuffled);
    setSelectedPiece(null);
    setPuzzleCompleted(false);
    setGameState('playing');
    startGame();

    // Select a random word as the target
    const targetPiece = shuffled[Math.floor(Math.random() * shuffled.length)];
    setCurrentWord(targetPiece);
  };

  const handlePieceClick = (pieceId: number) => {
    if (puzzleCompleted || !currentWord) return;

    onButtonPress();
    incrementMoves();

    const clickedPiece = puzzlePieces.find(p => p.id === pieceId);
    if (!clickedPiece) return;

    const isCorrect = clickedPiece.id === currentWord.id;

    if (isCorrect) {
      onSuccess();
      incrementScore(15);
      setPuzzleCompleted(true);
      showToast('太棒了！你找到了正确的拼图！', 'success');

      // After finding the correct piece, show complete puzzle
      setTimeout(() => {
        const completePuzzle = puzzlePieces.map(p => ({
          ...p,
          position: p.id - 1
        }));
        setPuzzlePieces(completePuzzle);
      }, 1000);
    } else {
      onError();
      showToast('不是这个哦，再找找看！', 'error');
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

  const handleShowHint = () => {
    if (currentWord) {
      onButtonPress();
      showToast(`提示：找 "{currentWord.word.zh}" ({currentWord.word.en}) 对应的图片`, 'info');
    }
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
            <Icon name="puzzle" />
            魔法拼图
          </GameTitle>
          <div style={{ width: '100px' }} />
        </GameHeader>

        <GameContent>
          <InstructionCard>
            <Icon name="puzzle" size="lg" style={{ fontSize: '64px', marginBottom: theme.spacing.lg }} />
            <h2>魔法拼图游戏</h2>
            <p style={{ color: theme.colors.gray[600], margin: theme.spacing.md 0 }}>
              根据提示找到正确的拼图块！<br />
              点击包含正确图片的拼图块<br />
              来完成魔法拼图挑战。
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
    const sortedPuzzle = [...puzzlePieces].sort((a, b) => a.position - b.position);

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
            <Icon name="puzzle" />
            魔法拼图
          </GameTitle>
          <GameStats>
            <StatBadge>
              <Icon name="move" />
              {moves}步
            </StatBadge>
            <StatBadge>
              <Icon name="star" />
              {score}分
            </StatBadge>
          </GameStats>
        </GameHeader>

        <GameContent>
          <InstructionCard>
            <h3>找到正确的拼图块</h3>
            <p style={{ color: theme.colors.gray[600], margin: theme.spacing.md 0 }}>
              找到 "{currentWord.word.zh}" ({currentWord.word.en}) 对应的拼图块
            </p>
            <ControlButton
              onClick={handleShowHint}
              icon={<Icon name="hint" />}
              size="sm"
            >
              提示
            </ControlButton>
          </InstructionCard>

          <PuzzleContainer>
            <PuzzleGrid>
              {sortedPuzzle.map((piece) => {
                const isSelected = selectedPiece === piece.id;
                const isCorrectTarget = piece.id === currentWord.id;

                return (
                  <PuzzlePiece
                    key={piece.position}
                    $isEmpty={false}
                    $isCorrect={puzzleCompleted && isCorrectTarget}
                    onClick={() => handlePieceClick(piece.id)}
                    whileHover={!puzzleCompleted ? { scale: 1.05 } : {}}
                    whileTap={!puzzleCompleted ? { scale: 0.95 } : {}}
                    initial={{ scale: 0, rotate: Math.random() * 360 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      border: puzzleCompleted && isCorrectTarget ? `2px solid ${theme.colors.success[500]}` : '2px solid rgba(255, 255, 255, 0.3)'
                    }}
                    transition={{
                      delay: piece.position * 0.1,
                      duration: 0.5
                    }}
                  >
                    <NumberLabel>{piece.position + 1}</NumberLabel>
                    {piece.emoji}
                  </PuzzlePiece>
                );
              })}
            </PuzzleGrid>
          </PuzzleContainer>

          {puzzleCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SuccessAnimation
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                transition={{ duration: 1 }}
              >
                🎉
              </SuccessAnimation>
              <ControlButton
                onClick={handleGameEnd}
                icon={<Icon name="next" />}
              >
                查看结果
              </ControlButton>
            </motion.div>
          )}
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'result') {
    const efficiency = moves > 0 ? Math.max(0, 100 - (moves - 1) * 10) : 100;
    const rating = efficiency >= 80 ? '⭐⭐⭐' : efficiency >= 60 ? '⭐⭐' : efficiency >= 40 ? '⭐' : '💪';

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
          <ResultTitle>拼图完成！</ResultTitle>

          <div style={{ fontSize: '48px', margin: theme.spacing.md 0 }}>
            {rating}
          </div>

          <ResultStats>
            <ResultStat>
              <ResultStatValue>{score}</ResultStatValue>
              <ResultStatLabel>总得分</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{moves}</ResultStatValue>
              <ResultStatLabel>移动步数</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{efficiency}%</ResultStatValue>
              <ResultStatLabel>效率</ResultStatLabel>
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