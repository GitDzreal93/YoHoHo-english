import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@styles/index';
import { Card, Button, Icon, Loading } from '@components/index';
import { useGameStore, useUIStore } from '@stores/index';
import { useAudioPlayer, useHapticFeedback } from '@hooks/index';

const GameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
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

const MusicBoxContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.xl};
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: ${theme.spacing.lg};
  width: 100%;
  max-width: 500px;
`;

const AnimalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.md};
  width: 100%;
`;

const AnimalButton = styled(motion.div)<{ $playing: boolean; $disabled: boolean }>`
  background: ${({ $playing, theme }) => $playing ? theme.colors.primary[500] : 'rgba(255, 255, 255, 0.9)'};
  border: 2px solid ${({ $playing, theme }) => $playing ? theme.colors.primary[600] : 'rgba(255, 255, 255, 0.3)'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  transition: all 0.3s ease;
  min-height: 120px;
`;

const AnimalEmoji = styled.div<{ $playing: boolean }>`
  font-size: 48px;
  margin-bottom: ${theme.spacing.sm};
  animation: ${({ $playing }) => $playing ? 'bounce 1s infinite' : 'none'};

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const AnimalName = styled.div<{ $playing: boolean }>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${({ $playing, theme }) => $playing ? 'white' : theme.colors.gray[700]};
  text-align: center;
`;

const SoundWave = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const SoundWaveCircle = styled(motion.div)`
  position: absolute;
  border: 2px solid rgba(74, 144, 226, 0.6);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const QuizCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  padding: ${theme.spacing.xl};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const QuizQuestion = styled.h3`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.lg};
`;

const QuizOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const QuizOption = styled(Button)<{ $selected: boolean; $correct: boolean | null }>`
  background: ${({ $selected, $correct, theme }) => {
    if ($correct === true) return theme.colors.success[500];
    if ($correct === false) return theme.colors.error[500];
    if ($selected) return theme.colors.primary[500];
    return 'rgba(255, 255, 255, 0.9)';
  }};
  color: ${({ $selected, $correct }) => {
    if ($correct !== null) return 'white';
    return $selected ? 'white' : theme.colors.gray[700];
  }};
  border: 2px solid ${({ $selected, $correct, theme }) => {
    if ($correct === true) return theme.colors.success[600];
    if ($correct === false) return theme.colors.error[600];
    if ($selected) return theme.colors.primary[600];
    return 'rgba(255, 255, 255, 0.3)';
  }};
  font-size: ${theme.typography.fontSize.lg};
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
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

interface Animal {
  id: string;
  emoji: string;
  name: { en: string; zh: string };
  sound: string;
  color: string;
}

const ANIMALS: Animal[] = [
  { id: 'cat', emoji: '🐱', name: { en: 'Cat', zh: '猫' }, sound: 'meow', color: '#FF6B6B' },
  { id: 'dog', emoji: '🐕', name: { en: 'Dog', zh: '狗' }, sound: 'woof', color: '#4ECDC4' },
  { id: 'duck', emoji: '🦆', name: { en: 'Duck', zh: '鸭子' }, sound: 'quack', color: '#45B7D1' },
  { id: 'cow', emoji: '🐄', name: { en: 'Cow', zh: '奶牛' }, sound: 'moo', color: '#FFA07A' },
  { id: 'pig', emoji: '🐷', name: { en: 'Pig', zh: '猪' }, sound: 'oink', color: '#98D8C8' },
  { id: 'sheep', emoji: '🐑', name: { en: 'Sheep', zh: '羊' }, sound: 'baa', color: '#F7DC6F' },
  { id: 'horse', emoji: '🐴', name: { en: 'Horse', zh: '马' }, sound: 'neigh', color: '#BB8FCE' },
  { id: 'chicken', emoji: '🐔', name: { en: 'Chicken', zh: '鸡' }, sound: 'cluck', color: '#85C1F2' },
  { id: 'bird', emoji: '🐦', name: { en: 'Bird', zh: '鸟' }, sound: 'tweet', color: '#F8B739' },
];

export const AnimalMusicBox: React.FC = () => {
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
  const { play: playAudio } = useAudioPlayer();
  const { onSuccess, onError, onButtonPress } = useHapticFeedback();

  const [gameState, setGameState] = useState<'menu' | 'learning' | 'quiz' | 'result'>('menu');
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [playedAnimals, setPlayedAnimals] = useState<Set<string>>(new Set());
  const [quizAnimal, setQuizAnimal] = useState<Animal | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Game timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && (gameState === 'learning' || gameState === 'quiz')) {
      const timer = setTimeout(() => {
        updateTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      handleGameEnd();
    }
  }, [isPlaying, timeLeft, gameState]);

  const playAnimalSound = useCallback(async (animal: Animal) => {
    setIsPlayingSound(true);
    setCurrentAnimal(animal);

    try {
      console.log(`Playing ${animal.name.en} sound: ${animal.sound}`);
      // In real app: await playAudio(`/audio/animals/${animal.sound}.wav`);

      // Simulate sound playing duration
      setTimeout(() => {
        setIsPlayingSound(false);
        setCurrentAnimal(null);
      }, 2000);
    } catch (error) {
      console.error('Error playing animal sound:', error);
      setIsPlayingSound(false);
      setCurrentAnimal(null);
    }
  }, []);

  const startLearningMode = () => {
    onButtonPress();
    setGameState('learning');
    startGame();
    setPlayedAnimals(new Set());
  };

  const startQuizMode = () => {
    onButtonPress();
    setGameState('quiz');
    startGame();
    setCorrectAnswers(0);
    setTotalQuestions(0);
    generateNewQuiz();
  };

  const generateNewQuiz = () => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setQuizAnimal(randomAnimal);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTotalQuestions(prev => prev + 1);

    // Auto-play the animal sound
    setTimeout(() => playAnimalSound(randomAnimal), 1000);
  };

  const handleAnimalClick = (animal: Animal) => {
    if (isPlayingSound) return;

    onButtonPress();
    setPlayedAnimals(prev => new Set([...prev, animal.id]));
    playAnimalSound(animal);
  };

  const handleQuizAnswer = (animalId: string) => {
    if (showAnswer || !quizAnimal) return;

    onButtonPress();
    setSelectedAnswer(animalId);
    setShowAnswer(true);

    const isCorrect = animalId === quizAnimal.id;

    if (isCorrect) {
      onSuccess();
      incrementScore(15);
      setCorrectAnswers(prev => prev + 1);
      showToast('太棒了！答对了！', 'success');
    } else {
      onError();
      showToast(`这是 ${ANIMALS.find(a => a.id === animalId)?.name.zh}，不是 ${quizAnimal.name.zh} 哦！`, 'error');
    }

    // Move to next question after delay
    setTimeout(() => {
      if (totalQuestions < 9) { // 10 questions total
        generateNewQuiz();
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

  const handleReplaySound = () => {
    if (quizAnimal && !isPlayingSound) {
      onButtonPress();
      playAnimalSound(quizAnimal);
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
            <Icon name="music" />
            动物音乐盒
          </GameTitle>
          <div style={{ width: '100px' }} />
        </GameHeader>

        <GameContent>
          <InstructionCard>
            <Icon name="music" size="lg" style={{ fontSize: '64px', marginBottom: theme.spacing.lg }} />
            <h2>动物音乐盒</h2>
            <p style={{ color: theme.colors.gray[600], margin: theme.spacing.md + " 0" }}>
              学习动物的英文名称和叫声！<br />
              选择学习模式认识动物，<br />
              或挑战测试模式看看你的掌握程度。
            </p>
            <GameControls>
              <ControlButton
                onClick={startLearningMode}
                icon={<Icon name="book" />}
              >
                学习模式
              </ControlButton>
              <ControlButton
                onClick={startQuizMode}
                icon={<Icon name="quiz" />}
              >
                测试模式
              </ControlButton>
            </GameControls>
          </InstructionCard>
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'learning') {
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
            动物音乐盒 - 学习
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
            <h3>点击动物听叫声</h3>
            <p style={{ color: theme.colors.gray[600] }}>
              已认识 {playedAnimals.size} / {ANIMALS.length} 种动物
            </p>
          </InstructionCard>

          <MusicBoxContainer>
            <AnimalGrid>
              {ANIMALS.map(animal => (
                <AnimalButton
                  key={animal.id}
                  $playing={currentAnimal?.id === animal.id}
                  $disabled={isPlayingSound}
                  onClick={() => handleAnimalClick(animal)}
                  whileHover={!isPlayingSound ? { scale: 1.05 } : {}}
                  whileTap={!isPlayingSound ? { scale: 0.95 } : {}}
                  style={{ position: 'relative' }}
                >
                  <AnimalEmoji $playing={currentAnimal?.id === animal.id}>
                    {animal.emoji}
                  </AnimalEmoji>
                  <AnimalName $playing={currentAnimal?.id === animal.id}>
                    {animal.name.zh} ({animal.name.en})
                  </AnimalName>

                  {currentAnimal?.id === animal.id && (
                    <SoundWave>
                      <SoundWaveCircle
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: [1, 2, 3], opacity: [0.8, 0.4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ width: '60px', height: '60px' }}
                      />
                      <SoundWaveCircle
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: [1, 2, 3], opacity: [0.6, 0.3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                        style={{ width: '60px', height: '60px' }}
                      />
                    </SoundWave>
                  )}
                </AnimalButton>
              ))}
            </AnimalGrid>
          </MusicBoxContainer>

          {playedAnimals.size === ANIMALS.length && (
            <ControlButton
              onClick={handleGameEnd}
              icon={<Icon name="next" />}
            >
              完成学习
            </ControlButton>
          )}
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'quiz' && quizAnimal) {
    const quizOptions = ANIMALS
      .filter(a => a.id !== quizAnimal.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [quizAnimal, ...quizOptions].sort(() => Math.random() - 0.5);

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
            动物音乐盒 - 测试
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
              <Icon name="quiz" />
              {totalQuestions}/10
            </StatBadge>
          </GameStats>
        </GameHeader>

        <GameContent>
          <QuizCard>
            <QuizQuestion>
              第 {totalQuestions} 题：这是哪种动物的叫声？
            </QuizQuestion>

            <div style={{ fontSize: '48px', margin: theme.spacing.md + " 0" }}>
              {quizAnimal.emoji}
            </div>

            <ControlButton
              onClick={handleReplaySound}
              disabled={isPlayingSound}
              icon={<Icon name="replay" />}
              size="sm"
            >
              {isPlayingSound ? '播放中...' : '重听叫声'}
            </ControlButton>

            <QuizOptions>
              {allOptions.map(animal => {
                const isSelected = selectedAnswer === animal.id;
                const isCorrect = showAnswer && animal.id === quizAnimal.id;
                const isWrong = showAnswer && isSelected && animal.id !== quizAnimal.id;

                return (
                  <QuizOption
                    key={animal.id}
                    $selected={isSelected}
                    $correct={isCorrect || (isWrong ? false : null)}
                    onClick={() => handleQuizAnswer(animal.id)}
                    disabled={showAnswer}
                  >
                    {animal.emoji} {animal.name.zh}
                  </QuizOption>
                );
              })}
            </QuizOptions>
          </QuizCard>
        </GameContent>
      </GameContainer>
    );
  }

  if (gameState === 'result') {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const rating = accuracy >= 90 ? '⭐⭐⭐' : accuracy >= 70 ? '⭐⭐' : accuracy >= 50 ? '⭐' : '💪';

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
          <ResultTitle>测试完成！</ResultTitle>

          <div style={{ fontSize: '48px', margin: theme.spacing.md + " 0" }}>
            {rating}
          </div>

          <ResultStats>
            <ResultStat>
              <ResultStatValue>{score}</ResultStatValue>
              <ResultStatLabel>总得分</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{correctAnswers}/{totalQuestions}</ResultStatValue>
              <ResultStatLabel>正确题数</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{accuracy}%</ResultStatValue>
              <ResultStatLabel>正确率</ResultStatLabel>
            </ResultStat>
          </ResultStats>

          <GameControls>
            <ControlButton
              onClick={startQuizMode}
              icon={<Icon name="replay" />}
            >
              再测一次
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