import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Button, Icon, Loading } from '@components/index';
import { useGameStore, useUIStore } from '@stores/index';
import { useHapticFeedback } from '@hooks/index';

const GameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
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

const DrawingCanvas = styled.canvas`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  cursor: crosshair;
  touch-action: none;
  max-width: 100%;
  max-height: 400px;
`;

const DrawingTools = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.9);
  border-radius: ${theme.borderRadius.xl};
  backdrop-filter: blur(10px);
`;

const ColorPalette = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: center;
  flex-wrap: wrap;
`;

const ColorButton = styled(motion.div)<{ $selected: boolean; $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 3px solid ${({ $selected, theme }) => $selected ? theme.colors.primary[600] : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const BrushSizeSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
`;

const BrushSizeButton = styled(motion.div)<{ $selected: boolean; $size: number }>`
  width: ${({ $size }) => Math.max(20, $size)}px;
  height: ${({ $size }) => Math.max(20, $size)}px;
  border-radius: 50%;
  background: ${({ $selected, theme }) => $selected ? theme.colors.primary[600] : theme.colors.gray[600]};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ToolButton = styled(Button)<{ $active: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.colors.primary[500] : 'rgba(255, 255, 255, 0.9)'};
  color: ${({ $active }) => $active ? 'white' : theme.colors.primary[600]};
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 50px;
  padding: ${theme.spacing.sm};
`;

const WordPrompt = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.lg};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const WordDisplay = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
  margin-bottom: ${theme.spacing.sm};
`;

const WordTranslation = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.md};
`;

const WordEmoji = styled.div`
  font-size: 64px;
  margin: ${theme.spacing.md} 0;
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

const DrawingPreview = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin: ${theme.spacing.md} 0;
  border: 2px solid ${theme.colors.gray[200]};
  max-width: 300px;
  max-height: 200px;
  overflow: hidden;
`;

interface Word {
  id: string;
  word: { en: string; zh: string };
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const WORDS: Word[] = [
  { id: 'sun', word: { en: 'Sun', zh: '太阳' }, emoji: '☀️', difficulty: 'easy' },
  { id: 'moon', word: { en: 'Moon', zh: '月亮' }, emoji: '🌙', difficulty: 'easy' },
  { id: 'star', word: { en: 'Star', zh: '星星' }, emoji: '⭐', difficulty: 'easy' },
  { id: 'house', word: { en: 'House', zh: '房子' }, emoji: '🏠', difficulty: 'easy' },
  { id: 'tree', word: { en: 'Tree', zh: '树' }, emoji: '🌳', difficulty: 'easy' },
  { id: 'flower', word: { en: 'Flower', zh: '花' }, emoji: '🌸', difficulty: 'medium' },
  { id: 'car', word: { en: 'Car', zh: '汽车' }, emoji: '🚗', difficulty: 'medium' },
  { id: 'cat', word: { en: 'Cat', zh: '猫' }, emoji: '🐱', difficulty: 'medium' },
  { id: 'dog', word: { en: 'Dog', zh: '狗' }, emoji: '🐕', difficulty: 'medium' },
  { id: 'butterfly', word: { en: 'Butterfly', zh: '蝴蝶' }, emoji: '🦋', difficulty: 'hard' },
  { id: 'rainbow', word: { en: 'Rainbow', zh: '彩虹' }, emoji: '🌈', difficulty: 'hard' },
  { id: 'mountain', word: { en: 'Mountain', zh: '山' }, emoji: '⛰️', difficulty: 'hard' },
];

const COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB',
  '#A52A2A', '#808080', '#FFFFFF'
];

const BRUSH_SIZES = [3, 6, 10, 15, 20];

export const WordArtist: React.FC = () => {
  const {
    score,
    timeLeft,
    isPlaying,
    startGame,
    endGame,
    incrementScore,
    updateTimeLeft
  } = useGameStore();

  const { showToast } = useUIStore();
  const { onSuccess, onError, onButtonPress } = useHapticFeedback();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'drawing' | 'result'>('menu');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedBrushSize, setSelectedBrushSize] = useState(6);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [drawingData, setDrawingData] = useState<string>('');
  const [completedWords, setCompletedWords] = useState<Word[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Game timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && gameState === 'drawing') {
      const timer = setTimeout(() => {
        updateTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      handleGameEnd();
    }
  }, [isPlaying, timeLeft, gameState]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startNewGame = () => {
    onButtonPress();

    // Filter words by difficulty and select random one
    const filteredWords = WORDS.filter(w => w.difficulty === selectedDifficulty);
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setCurrentWord(randomWord);

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    setDrawingData('');
    setGameState('drawing');
    startGame();

    // Set time limit based on difficulty
    const timeLimits = { easy: 180, medium: 240, hard: 300 };
    updateTimeLeft(timeLimits[selectedDifficulty]);
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;

    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.lineWidth = selectedBrushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [isDrawing, selectedColor, selectedBrushSize, tool]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = () => {
    onButtonPress();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const saveDrawing = () => {
    if (!canvasRef.current || !currentWord) return;

    onButtonPress();
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setDrawingData(dataUrl);
    setCompletedWords(prev => [...prev, currentWord]);

    // Award points based on difficulty
    const points = { easy: 20, medium: 30, hard: 50 };
    incrementScore(points[currentWord.difficulty]);
    onSuccess();
    showToast(`完成了 ${currentWord.word.zh} 的绘画！+${points[currentWord.difficulty]}分`, 'success');

    // Move to next word
    setTimeout(() => {
      const filteredWords = WORDS.filter(w => w.difficulty === selectedDifficulty);
      const availableWords = filteredWords.filter(w => !completedWords.find(c => c.id === w.id));

      if (availableWords.length > 0) {
        const nextWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        setCurrentWord(nextWord);
        clearCanvas();
      } else {
        handleGameEnd();
      }
    }, 2000);
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
            <Icon name="brush" />
            单词画家
          </GameTitle>
          <div style={{ width: '100px' }} />
        </GameHeader>

        <GameContent>
          <InstructionCard>
            <Icon name="brush" size="lg" style={{ fontSize: '64px', marginBottom: theme.spacing.lg }} />
            <h2>单词画家游戏</h2>
            <p style={{ color: theme.colors.gray[600], margin: theme.spacing.md + " 0" }}>
              根据单词提示画出图案！<br />
              选择难度开始创作，<br />
              用画笔展现你的艺术天赋。
            </p>

            <div style={{ margin: theme.spacing.lg + ' 0' }}>
              <h4>选择难度：</h4>
              <GameControls>
                <ControlButton
                  onClick={() => setSelectedDifficulty('easy')}
                  icon={<Icon name="star" />}
                >
                  简单
                </ControlButton>
                <ControlButton
                  onClick={() => setSelectedDifficulty('medium')}
                  icon={<Icon name="star" />}
                >
                  中等
                </ControlButton>
                <ControlButton
                  onClick={() => setSelectedDifficulty('hard')}
                  icon={<Icon name="star" />}
                >
                  困难
                </ControlButton>
              </GameControls>
            </div>

            <ControlButton
              onClick={startNewGame}
              icon={<Icon name="play" />}
            >
              开始画画
            </ControlButton>
          </InstructionCard>
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'drawing' && currentWord) {
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
            <Icon name="brush" />
            单词画家
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
            <StatBadge>
              <Icon name="art" />
              {completedWords.length + 1}
            </StatBadge>
          </GameStats>
        </GameHeader>

        <GameContent>
          <WordPrompt>
            <WordDisplay>{currentWord.word.en}</WordDisplay>
            <WordTranslation>{currentWord.word.zh}</WordTranslation>
            <WordEmoji>{currentWord.emoji}</WordEmoji>
          </WordPrompt>

          <DrawingCanvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          <DrawingTools>
            <div>
              <h4 style={{ textAlign: 'center', margin: `${theme.spacing.sm} 0` }}>颜色</h4>
              <ColorPalette>
                {COLORS.map(color => (
                  <ColorButton
                    key={color}
                    $selected={selectedColor === color && tool === 'pen'}
                    $color={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setTool('pen');
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </ColorPalette>
            </div>

            <div>
              <h4 style={{ textAlign: 'center', margin: `${theme.spacing.sm} 0` }}>画笔大小</h4>
              <BrushSizeSelector>
                {BRUSH_SIZES.map(size => (
                  <BrushSizeButton
                    key={size}
                    $selected={selectedBrushSize === size}
                    $size={size}
                    onClick={() => setSelectedBrushSize(size)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </BrushSizeSelector>
            </div>

            <div>
              <h4 style={{ textAlign: 'center', margin: `${theme.spacing.sm} 0` }}>工具</h4>
              <GameControls>
                <ToolButton
                  $active={tool === 'pen'}
                  onClick={() => setTool('pen')}
                  icon={<Icon name="pen" />}
                >
                  画笔
                </ToolButton>
                <ToolButton
                  $active={tool === 'eraser'}
                  onClick={() => setTool('eraser')}
                  icon={<Icon name="eraser" />}
                >
                  橡皮
                </ToolButton>
              </GameControls>
            </div>
          </DrawingTools>

          <GameControls>
            <ControlButton
              onClick={clearCanvas}
              icon={<Icon name="trash" />}
            >
              清空画布
            </ControlButton>
            <ControlButton
              onClick={saveDrawing}
              icon={<Icon name="save" />}
            >
              完成作品
            </ControlButton>
            <ControlButton
              onClick={handleGameEnd}
              icon={<Icon name="stop" />}
            >
              结束游戏
            </ControlButton>
          </GameControls>
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'result') {
    const totalWords = completedWords.length;
    const avgScore = totalWords > 0 ? Math.round(score / totalWords) : 0;
    const rating = totalWords >= 8 ? '⭐⭐⭐' : totalWords >= 5 ? '⭐⭐' : totalWords >= 3 ? '⭐' : '💪';

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
          <ResultTitle>创作完成！</ResultTitle>

          <div style={{ fontSize: '48px', margin: theme.spacing.md + " 0" }}>
            {rating}
          </div>

          <ResultStats>
            <ResultStat>
              <ResultStatValue>{score}</ResultStatValue>
              <ResultStatLabel>总得分</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{totalWords}</ResultStatValue>
              <ResultStatLabel>完成作品</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{avgScore}</ResultStatValue>
              <ResultStatLabel>平均得分</ResultStatLabel>
            </ResultStat>
          </ResultStats>

          {drawingData && (
            <div>
              <h4>你的作品：</h4>
              <DrawingPreview>
                <img src={drawingData} alt="Your drawing" style={{ width: '100%', height: 'auto' }} />
              </DrawingPreview>
            </div>
          )}

          <GameControls>
            <ControlButton
              onClick={startNewGame}
              icon={<Icon name="replay" />}
            >
              再画一次
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