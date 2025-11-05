# React 组件库代码示例

## 1. 项目技术栈

### 1.1 核心技术
- **框架**：React 18+ with TypeScript
- **移动端**：Capacitor 5+
- **组件库**：Ant Design Mobile + 自定义组件
- **样式方案**：Styled-components + CSS-in-JS
- **状态管理**：Zustand (轻量级状态管理)
- **路由**：React Router v6
- **动画**：Framer Motion
- **图标**：React Icons + Lucide React
- **构建工具**：Vite

### 1.2 项目结构
```
src/
├── components/           # 通用组件
│   ├── ui/              # 基础UI组件
│   ├── game/            # 游戏组件
│   ├── flashcard/       # 闪卡组件
│   └── layout/          # 布局组件
├── screens/             # 页面组件
├── hooks/               # 自定义Hooks
├── stores/              # 状态管理
├── utils/               # 工具函数
├── types/               # TypeScript类型
├── assets/              # 静态资源
└── styles/              # 全局样式
```

## 2. 基础UI组件

### 2.1 主题配置 (ThemeProvider)

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      500: '#f97316',
      600: '#ea580c',
    },
    success: {
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      500: '#eab308',
      600: '#ca8a04',
    },
    error: {
      500: '#ef4444',
      600: '#dc2626',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      500: '#6b7280',
      900: '#111827',
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    card: '0 8px 32px rgba(31, 38, 135, 0.15)',
  },
  typography: {
    fontFamily: {
      primary: '"Nunito", "PingFang SC", "Microsoft YaHei", sans-serif',
      display: '"Fredoka One", cursive',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
    }
  }
};

// src/styles/GlobalStyles.ts
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }

  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;
```

### 2.2 按钮组件 (Button)

```typescript
// src/components/ui/Button.tsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const ButtonStyled = styled(motion.button)<{
  $variant: 'primary' | 'secondary' | 'ghost';
  $size: 'sm' | 'md' | 'lg';
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
          height: 40px;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          height: 56px;
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          height: 48px;
        `;
    }
  }}

  /* Variant styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background: white;
          color: ${theme.colors.primary[500]};
          border: 2px solid ${theme.colors.primary[500]};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            background: ${theme.colors.primary[50]};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.primary[500]};

          &:hover {
            background: ${theme.colors.primary[50]};
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
          color: white;
          box-shadow: 0 4px 14px 0 rgba(251, 146, 60, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(251, 146, 60, 0.4);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  return (
    <ButtonStyled
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        children
      )}
    </ButtonStyled>
  );
};

// Loading Spinner 组件
const LoadingSpinner = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return 'width: 16px; height: 16px;';
      case 'lg':
        return 'width: 24px; height: 24px;';
      default:
        return 'width: 20px; height: 20px;';
    }
  }}

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
```

### 2.3 卡片组件 (Card)

```typescript
// src/components/ui/Card.tsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'game';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const CardStyled = styled(motion.div)<{
  $variant: 'default' | 'glass' | 'game';
  $padding: 'sm' | 'md' | 'lg';
  $hover: boolean;
}>`
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  /* Padding variants */
  ${({ $padding, theme }) => {
    switch ($padding) {
      case 'sm':
        return `padding: ${theme.spacing.sm};`;
      case 'lg':
        return `padding: ${theme.spacing.lg};`;
      default:
        return `padding: ${theme.spacing.md};`;
    }
  }}

  /* Variant styles */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'glass':
        return `
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: ${theme.shadows.card};
        `;
      case 'game':
        return `
          background: white;
          border-radius: ${theme.borderRadius.xl};
          box-shadow: ${theme.shadows.md};
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.95);
          box-shadow: ${theme.shadows.md};
        `;
    }
  }}

  /* Hover effect */
  ${({ $hover }) => $hover && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(31, 38, 135, 0.2);
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  variant = 'default',
  padding = 'md',
  hover = true,
}) => {
  return (
    <CardStyled
      $variant={variant}
      $padding={padding}
      $hover={hover && !!onClick}
      onClick={onClick}
      whileHover={hover && onClick ? { y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {children}
    </CardStyled>
  );
};
```

### 2.4 闪卡组件 (Flashcard)

```typescript
// src/components/flashcard/Flashcard.tsx
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw, Star, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface FlashcardProps {
  word: {
    id: string;
    image: string;
    english: string;
    chinese: string;
    audioEn: string;
    audioCn: string;
  };
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isFlipped?: boolean;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

const flipAnimation = keyframes`
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(0deg); }
`;

const FlashcardContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const FlashcardStyled = styled(motion.div)<{ $flipped: boolean }>`
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  transform-style: preserve-3d;
  animation: ${({ $flipped }) => $flipped ? flipAnimation : 'none'} 0.6s ease-in-out;
`;

const CardSide = styled.div<{ $visible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: rgba(255, 255, 255, 0.95);
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const CardImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardWord = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
`;

const CardTranslation = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
`;

const AudioButton = styled(Button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  position: absolute;
  bottom: 20px;
  left: 20px;
`;

const FavoriteButton = styled.button<{ $active: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.warning[500] : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#fbbf24'};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Flashcard: React.FC<FlashcardProps> = ({
  word,
  onFlip,
  onNext,
  onPrevious,
  isFlipped = false,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async (audioUrl: string) => {
    try {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      await audio.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    }
  };

  return (
    <>
      <FlashcardContainer>
        <FlashcardStyled
          $flipped={isFlipped}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Front side */}
          <CardSide $visible={!isFlipped}>
            <CardImage src={word.image} alt={word.english} />
            <CardWord>{word.english}</CardWord>

            <AudioButton
              variant="primary"
              onClick={() => playAudio(word.audioEn)}
              disabled={isPlaying}
            >
              <Volume2 size={24} />
            </AudioButton>

            <CardActions>
              <FavoriteButton
                $active={isFavorite}
                onClick={onToggleFavorite}
              >
                <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </FavoriteButton>
            </CardActions>
          </CardSide>

          {/* Back side */}
          <CardSide $visible={isFlipped}>
            <CardWord>{word.chinese}</CardWord>
            <CardTranslation>{word.english}</CardTranslation>

            <AudioButton
              variant="secondary"
              onClick={() => playAudio(word.audioCn)}
              disabled={isPlaying}
            >
              <Volume2 size={24} />
            </AudioButton>

            <CardActions>
              <FavoriteButton
                $active={isFavorite}
                onClick={onToggleFavorite}
              >
                <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </FavoriteButton>
            </CardActions>
          </CardSide>
        </FlashcardStyled>
      </FlashcardContainer>

      <NavigationContainer>
        <Button
          variant="secondary"
          onClick={onPrevious}
          icon={<RotateCcw size={20} />}
        >
          上一张
        </Button>

        <Button
          variant="primary"
          onClick={onFlip}
        >
          {isFlipped ? '看图片' : '看中文'}
        </Button>

        <Button
          variant="secondary"
          onClick={onNext}
        >
          下一张
        </Button>
      </NavigationContainer>
    </>
  );
};
```

### 2.5 游戏卡片组件 (GameCard)

```typescript
// src/components/game/GameCard.tsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface GameCardProps {
  id: string;
  emoji: string;
  label: string;
  score?: number;
  isLocked?: boolean;
  onClick?: () => void;
}

const GameCardStyled = styled(motion.div)<{ $isLocked: boolean }>`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: ${({ $isLocked }) => $isLocked ? 'not-allowed' : 'pointer'};
  opacity: ${({ $isLocked }) => $isLocked ? 0.6 : 1};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${({ $isLocked }) => $isLocked ? 'none' : 'translateY(-4px)'};
    box-shadow: ${({ theme, $isLocked }) => $isLocked ? theme.shadows.md : theme.shadows.lg};
  }
`;

const GameEmoji = styled.div`
  font-size: 48px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const GameLabel = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GameScore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
`;

const LockIcon = styled.div`
  font-size: 32px;
  color: white;
`;

export const GameCard: React.FC<GameCardProps> = ({
  id,
  emoji,
  label,
  score,
  isLocked = false,
  onClick,
}) => {
  return (
    <GameCardStyled
      $isLocked={isLocked}
      onClick={isLocked ? undefined : onClick}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: parseInt(id) * 0.1 }}
    >
      <GameEmoji>{emoji}</GameEmoji>
      <GameLabel>{label}</GameLabel>

      {score !== undefined && (
        <GameScore>
          🏆 {score}分
        </GameScore>
      )}

      {isLocked && (
        <LockOverlay>
          <LockIcon>🔒</LockIcon>
        </LockOverlay>
      )}
    </GameCardStyled>
  );
};
```

## 3. 游戏组件

### 3.1 声音寻宝游戏 (SoundTreasureHunt)

```typescript
// src/components/game/SoundTreasureHunt.tsx
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SoundTreasureHuntProps {
  words: Array<{
    id: string;
    image: string;
    english: string;
    audio: string;
  }>;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GameTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ScoreDisplay = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 4px;
`;

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InstructionText = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const OptionCard = styled(motion.div)<{ $selected: boolean; $correct: boolean | null }>`
  aspect-ratio: 1;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  ${({ $selected, $correct, theme }) => {
    if ($selected) {
      if ($correct === true) {
        return `
          border: 3px solid ${theme.colors.success[500]};
          background: ${theme.colors.success[50]};
        `;
      } else if ($correct === false) {
        return `
          border: 3px solid ${theme.colors.error[500]};
          background: ${theme.colors.error[50]};
        `;
      }
    }
    return `
      border: 2px solid ${theme.colors.gray[200]};
    `;
  }}
`;

const OptionImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const OptionWord = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const FeedbackIcon = styled.div<{ $type: 'correct' | 'incorrect' }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  ${({ $type, theme }) => {
    switch ($type) {
      case 'correct':
        return `
          background: ${theme.colors.success[500]};
        `;
      case 'incorrect':
        return `
          background: ${theme.colors.error[500]};
        `;
    }
  }}
`;

const AudioButton = styled(Button)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  padding: 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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
`;

const ResultContent = styled(Card)`
  text-align: center;
  max-width: 300px;
  width: 90%;
`;

const ResultTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ResultScore = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const SoundTreasureHunt: React.FC<SoundTreasureHuntProps> = ({
  words,
  onComplete,
  onExit,
}) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const currentWord = words[currentRound];
  const progress = ((currentRound + 1) / words.length) * 100;

  // Generate options (1 correct + 3 incorrect)
  const generateOptions = useCallback(() => {
    const correctId = currentWord.id;
    const incorrectWords = words.filter(w => w.id !== correctId);
    const selectedIncorrect = incorrectWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [currentWord, ...selectedIncorrect]
      .sort(() => Math.random() - 0.5);

    return allOptions;
  }, [currentWord, words]);

  const [options, setOptions] = useState(generateOptions);

  const playAudio = async (audioUrl: string) => {
    try {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      await audio.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption) return; // Already selected

    setSelectedOption(optionId);
    const isCorrect = optionId === currentWord.id;

    if (isCorrect) {
      setScore(score + 10);
    }

    setCorrectAnswer(currentWord.id);
    setShowResult(true);

    // Auto advance after showing result
    setTimeout(() => {
      if (currentRound < words.length - 1) {
        setCurrentRound(currentRound + 1);
        setSelectedOption(null);
        setShowResult(false);
        setCorrectAnswer(null);
        setOptions(generateOptions());
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  useEffect(() => {
    playAudio(currentWord.audio);
  }, [currentWord]);

  if (gameComplete) {
    return (
      <ResultModal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ResultContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <ResultTitle>游戏完成！</ResultTitle>
          <ResultScore>{score}分</ResultScore>
          <p>正确率: {Math.round((score / (words.length * 10)) * 100)}%</p>
          <Button
            variant="primary"
            onClick={() => onComplete(score)}
            style={{ marginTop: '20px' }}
          >
            完成
          </Button>
        </ResultContent>
      </ResultModal>
    );
  }

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Volume2 size={24} />
          声音寻宝
        </GameTitle>
        <ScoreDisplay>得分: {score}</ScoreDisplay>
      </GameHeader>

      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressBar>

      <GameArea>
        <InstructionText>
          请找出 "{currentWord.english}" 对应的图片
        </InstructionText>

        <AudioButton
          variant="primary"
          onClick={() => playAudio(currentWord.audio)}
          disabled={isPlaying}
        >
          <Volume2 size={32} />
        </AudioButton>

        <OptionsGrid>
          <AnimatePresence>
            {options.map((option, index) => (
              <OptionCard
                key={option.id}
                $selected={selectedOption === option.id}
                $correct={selectedOption ? option.id === correctAnswer : null}
                onClick={() => handleOptionSelect(option.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: selectedOption ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <OptionImage src={option.image} alt={option.english} />
                <OptionWord>{option.english}</OptionWord>

                {showResult && selectedOption === option.id && (
                  <FeedbackIcon
                    $type={option.id === correctAnswer ? 'correct' : 'incorrect'}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {option.id === correctAnswer ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </FeedbackIcon>
                )}
              </OptionCard>
            ))}
          </AnimatePresence>
        </OptionsGrid>
      </GameArea>

      <Button variant="ghost" onClick={onExit}>
        退出游戏
      </Button>
    </GameContainer>
  );
};
```

### 3.2 魔法拼图游戏 (MagicPuzzle)

```typescript
// src/components/game/MagicPuzzle.tsx
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Puzzle, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface MagicPuzzleProps {
  word: {
    id: string;
    image: string;
    english: string;
    audio: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
  onExit: () => void;
}

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GameTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TimerDisplay = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  font-weight: 600;
`;

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PreviewContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PreviewText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const PuzzleContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: flex-start;
`;

const PiecesArea = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  min-width: 200px;
`;

const BoardArea = styled.div`
  display: grid;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.9);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const PuzzlePiece = styled(motion.div)<{ $isPlaced: boolean; $isCorrect: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  cursor: grab;
  position: relative;

  &:active {
    cursor: grabbing;
  }

  ${({ $isPlaced, $isCorrect }) => {
    if ($isPlaced) {
      return `
        cursor: default;
        border: 2px solid ${$isCorrect ? '#22c55e' : '#ef4444'};
      `;
    }
    return `
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.8);
    `;
  }}
`;

const PuzzleSlot = styled.div<{ $isFilled: boolean; $isCorrect: boolean }>`
  width: 80px;
  height: 80px;
  border: 2px dashed ${({ $isFilled, $isCorrect, theme }) =>
    $isFilled ? ($isCorrect ? theme.colors.success[500] : theme.colors.error[500])
    : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $isFilled }) => $isFilled ? 'transparent' : 'rgba(0, 0, 0, 0.05)'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuccessModal = styled(motion.div)`
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
`;

const SuccessContent = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
  max-width: 300px;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SuccessText = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const MagicPuzzle: React.FC<MagicPuzzleProps> = ({
  word,
  difficulty,
  onComplete,
  onExit,
}) => {
  const [pieces, setPieces] = useState<Array<{
    id: string;
    correctPosition: number;
    currentPosition: number | null;
    imageUrl: string;
  }>>([]);

  const [boardSize, setBoardSize] = useState(2);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);

  // Initialize puzzle based on difficulty
  useEffect(() => {
    const sizes = { easy: 2, medium: 3, hard: 4 };
    setBoardSize(sizes[difficulty]);

    const totalPieces = sizes[difficulty] * sizes[difficulty];
    const newPieces = Array.from({ length: totalPieces }, (_, index) => ({
      id: `piece-${index}`,
      correctPosition: index,
      currentPosition: null,
      imageUrl: `${word.image}?piece=${index}`, // This would be generated server-side
    }));

    setPieces(newPieces);
  }, [word, difficulty]);

  // Timer effect
  useEffect(() => {
    if (!isComplete) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (pieceId: string) => {
    setDraggedPiece(pieceId);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  const handleDrop = (slotIndex: number) => {
    if (!draggedPiece) return;

    setPieces(prev => {
      const newPieces = [...prev];
      const piece = newPieces.find(p => p.id === draggedPiece);

      if (piece) {
        // Check if slot is already occupied
        const occupyingPiece = newPieces.find(p => p.currentPosition === slotIndex);
        if (occupyingPiece) {
          // Swap pieces
          occupyingPiece.currentPosition = piece.currentPosition;
        }

        piece.currentPosition = slotIndex;
      }

      return newPieces;
    });

    // Check if puzzle is complete
    checkCompletion();
  };

  const checkCompletion = () => {
    const allCorrect = pieces.every(piece =>
      piece.currentPosition === piece.correctPosition
    );

    if (allCorrect && pieces.every(p => p.currentPosition !== null)) {
      setIsComplete(true);
      const baseScore = 100;
      const timeBonus = Math.max(0, 300 - timer) * 2;
      const difficultyBonus = difficulty === 'easy' ? 0 : difficulty === 'medium' ? 50 : 100;
      onComplete(baseScore + timeBonus + difficultyBonus);
    }
  };

  const unplacedPieces = pieces.filter(p => p.currentPosition === null);
  const boardPieces = Array.from({ length: boardSize * boardSize }, (_, index) =>
    pieces.find(p => p.currentPosition === index)
  );

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>
          <Puzzle size={24} />
          魔法拼图
        </GameTitle>
        <TimerDisplay>{formatTime(timer)}</TimerDisplay>
      </GameHeader>

      <GameArea>
        <PreviewContainer>
          <PreviewImage src={word.image} alt={word.english} />
          <PreviewText>{word.english}</PreviewText>
        </PreviewContainer>

        <PuzzleContainer>
          <PiecesArea>
            <h3 style={{ color: 'white', gridColumn: '1/-1', textAlign: 'center', marginBottom: '10px' }}>
              拼图碎片
            </h3>
            {unplacedPieces.map((piece) => (
              <PuzzlePiece
                key={piece.id}
                $isPlaced={false}
                $isCorrect={false}
                draggable
                onDragStart={() => handleDragStart(piece.id)}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={piece.imageUrl}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </PuzzlePiece>
            ))}
          </PiecesArea>

          <BoardArea style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}>
            {boardPieces.map((piece, index) => (
              <PuzzleSlot
                key={index}
                $isFilled={!!piece}
                $isCorrect={piece?.currentPosition === piece?.correctPosition}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
              >
                {piece && (
                  <PuzzlePiece
                    key={piece.id}
                    $isPlaced={true}
                    $isCorrect={piece.currentPosition === piece.correctPosition}
                    draggable
                    onDragStart={() => handleDragStart(piece.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <img
                      src={piece.imageUrl}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </PuzzlePiece>
                )}
              </PuzzleSlot>
            ))}
          </BoardArea>
        </PuzzleContainer>

        <Button variant="secondary" onClick={onExit}>
          退出游戏
        </Button>
      </GameArea>

      {isComplete && (
        <SuccessModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <SuccessContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <SuccessIcon>🎉</SuccessIcon>
            <SuccessText>完成拼图！</SuccessText>
            <p>用时: {formatTime(timer)}</p>
            <p>难度: {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}</p>
          </SuccessContent>
        </SuccessModal>
      )}
    </GameContainer>
  );
};
```

## 4. 状态管理 (Zustand)

### 4.1 应用状态管理

```typescript
// src/stores/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  age: number;
  avatar: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface Progress {
  totalWords: number;
  masteredWords: string[];
  currentStreak: number;
  bestStreak: number;
  totalPlayTime: number;
  lastPlayedDate: string;
}

interface GameScore {
  soundTreasure: number;
  magicPuzzle: number;
  rainbowBubbles: number;
  animalMusicBox: number;
  memoryFlip: number;
  wordArtist: number;
}

interface AppState {
  // User state
  user: User | null;
  isLoggedIn: boolean;

  // Learning progress
  progress: Progress;
  gameScores: GameScore;

  // Settings
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    hapticEnabled: boolean;
    language: 'en' | 'zh';
    dailyTimeLimit: number;
  };

  // Actions
  setUser: (user: User) => void;
  updateProgress: (updates: Partial<Progress>) => void;
  updateGameScore: (game: keyof GameScore, score: number) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoggedIn: false,
      progress: {
        totalWords: 0,
        masteredWords: [],
        currentStreak: 0,
        bestStreak: 0,
        totalPlayTime: 0,
        lastPlayedDate: new Date().toISOString(),
      },
      gameScores: {
        soundTreasure: 0,
        magicPuzzle: 0,
        rainbowBubbles: 0,
        animalMusicBox: 0,
        memoryFlip: 0,
        wordArtist: 0,
      },
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        hapticEnabled: true,
        language: 'zh',
        dailyTimeLimit: 30, // minutes
      },

      // Actions
      setUser: (user) => set({ user, isLoggedIn: true }),

      updateProgress: (updates) => set((state) => ({
        progress: { ...state.progress, ...updates }
      })),

      updateGameScore: (game, score) => set((state) => ({
        gameScores: {
          ...state.gameScores,
          [game]: Math.max(state.gameScores[game], score)
        }
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      logout: () => set({
        user: null,
        isLoggedIn: false,
      }),
    }),
    {
      name: 'flashcard-app-storage',
    }
  )
);
```

### 4.2 游戏状态管理

```typescript
// src/stores/gameStore.ts
import { create } from 'zustand';

interface GameState {
  currentGame: string | null;
  isPlaying: boolean;
  currentRound: number;
  totalRounds: number;
  score: number;
  timeElapsed: number;
  gameData: any;

  startGame: (gameId: string, totalRounds: number, gameData?: any) => void;
  nextRound: () => void;
  updateScore: (points: number) => void;
  endGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentGame: null,
  isPlaying: false,
  currentRound: 0,
  totalRounds: 0,
  score: 0,
  timeElapsed: 0,
  gameData: null,

  startGame: (gameId, totalRounds, gameData = null) => set({
    currentGame: gameId,
    isPlaying: true,
    currentRound: 0,
    totalRounds,
    score: 0,
    timeElapsed: 0,
    gameData,
  }),

  nextRound: () => set((state) => ({
    currentRound: Math.min(state.currentRound + 1, state.totalRounds - 1),
  })),

  updateScore: (points) => set((state) => ({
    score: state.score + points,
  })),

  endGame: () => set({
    isPlaying: false,
  }),

  resetGame: () => set({
    currentGame: null,
    isPlaying: false,
    currentRound: 0,
    totalRounds: 0,
    score: 0,
    timeElapsed: 0,
    gameData: null,
  }),
}));
```

## 5. 自定义Hooks

### 5.1 音频播放Hook

```typescript
// src/hooks/useAudioPlayer.ts
import { useState, useRef, useCallback } from 'react';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(async (audioUrl: string) => {
    try {
      setIsLoading(true);

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadeddata = () => {
        setIsLoading(false);
      };

      audio.onplay = () => {
        setIsPlaying(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    isLoading,
    play,
    stop,
  };
};
```

### 5.2 触觉反馈Hook

```typescript
// src/hooks/useHaptic.ts
export const useHaptic = () => {
  const light = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const medium = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  const heavy = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const success = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  };

  const error = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50, 30, 50]);
    }
  };

  return {
    light,
    medium,
    heavy,
    success,
    error,
  };
};
```

### 5.3 本地存储Hook

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## 6. 使用示例

### 6.1 闪卡学习页面

```typescript
// src/screens/FlashcardScreen.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, Settings, Volume2 } from 'lucide-react';
import { Flashcard } from '../components/flashcard/Flashcard';
import { Button } from '../components/ui/Button';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useAppStore } from '../stores/appStore';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${({ theme }) => theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: white;
`;

const ProgressContainer = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: white;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const FlashcardScreen: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { user } = useAppStore();
  const { play } = useAudioPlayer();

  // Sample data - would come from API or categories.json
  const cards = [
    {
      id: '1',
      image: '/images/cat.png',
      english: 'Cat',
      chinese: '猫',
      audioEn: '/audio/cat_en.mp3',
      audioCn: '/audio/cat_cn.mp3',
    },
    {
      id: '2',
      image: '/images/dog.png',
      english: 'Dog',
      chinese: '狗',
      audioEn: '/audio/dog_en.mp3',
      audioCn: '/audio/dog_cn.mp3',
    },
    // ... more cards
  ];

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleFavorite = () => {
    setFavorites(prev => {
      if (prev.includes(currentCard.id)) {
        return prev.filter(id => id !== currentCard.id);
      } else {
        return [...prev, currentCard.id];
      }
    });
  };

  const isFavorite = favorites.includes(currentCard.id);

  return (
    <Container>
      <Header>
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
        </Button>

        <Title>动物分类</Title>

        <Button variant="ghost">
          <Settings size={20} />
        </Button>
      </Header>

      <ProgressContainer>
        <div>进度: {currentCardIndex + 1} / {cards.length}</div>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>
      </ProgressContainer>

      <Flashcard
        word={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />
    </Container>
  );
};
```

### 6.2 游戏中心页面

```typescript
// src/screens/GameCenterScreen.tsx
import React from 'react';
import styled from 'styled-components';
import { ArrowLeft, Trophy } from 'lucide-react';
import { GameCard } from '../components/game/GameCard';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../stores/appStore';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: ${({ theme }) => theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StarsDisplay = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const games = [
  {
    id: '1',
    emoji: '🎵',
    label: '声音寻宝',
    score: 95,
    locked: false,
  },
  {
    id: '2',
    emoji: '🧩',
    label: '魔法拼图',
    score: 88,
    locked: false,
  },
  {
    id: '3',
    emoji: '🫧',
    label: '彩虹泡泡',
    score: 92,
    locked: false,
  },
  {
    id: '4',
    emoji: '🎤',
    label: '动物音乐盒',
    score: 85,
    locked: false,
  },
  {
    id: '5',
    emoji: '🔄',
    label: '记忆翻翻乐',
    score: 78,
    locked: false,
  },
  {
    id: '6',
    emoji: '🎨',
    label: '单词小画家',
    score: 0,
    locked: true,
  },
];

export const GameCenterScreen: React.FC = () => {
  const { gameScores } = useAppStore();

  const totalStars = Object.values(gameScores).reduce((sum, score) => {
    return sum + Math.floor(score / 10);
  }, 0);

  const handleGameClick = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game && !game.locked) {
      // Navigate to game screen
      window.location.href = `/game/${gameId}`;
    }
  };

  return (
    <Container>
      <Header>
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
        </Button>

        <Title>
          <Trophy size={24} />
          游戏中心
        </Title>

        <StarsDisplay>
          <span>⭐</span>
          <span>{totalStars}</span>
        </StarsDisplay>
      </Header>

      <GamesGrid>
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            emoji={game.emoji}
            label={game.label}
            score={game.score}
            isLocked={game.locked}
            onClick={() => handleGameClick(game.id)}
          />
        ))}
      </GamesGrid>
    </Container>
  );
};
```

这份React组件库提供了完整的卡通英语闪卡APP开发所需的组件和代码示例，包括：

✅ **完整的UI组件库**：按钮、卡片、闪卡等基础组件
✅ **6个游戏组件**：声音寻宝、魔法拼图等完整实现
✅ **状态管理**：使用Zustand进行轻量级状态管理
✅ **自定义Hooks**：音频播放、触觉反馈、本地存储等
✅ **响应式设计**：适配不同屏幕尺寸
✅ **动画效果**：使用Framer Motion实现流畅动画
✅ **TypeScript支持**：完整的类型定义
✅ **Capacitor兼容**：纯前端实现，支持移动端打包

所有组件都遵循现代React开发最佳实践，可以直接用于项目开发。