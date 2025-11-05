import { create } from 'zustand';
import { GameState, GameType } from '@types/index';

interface GameStore extends GameState {
  // Actions
  startGame: (gameId: GameType, totalRounds: number, gameData?: any) => void;
  nextRound: () => void;
  updateScore: (points: number) => void;
  updateTimeElapsed: () => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  endGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentGame: null,
  isPlaying: false,
  currentRound: 0,
  totalRounds: 0,
  score: 0,
  timeElapsed: 0,
  gameData: null,
  difficulty: 'easy',

  // Timer reference
  timer: null as NodeJS.Timeout | null,

  // Actions
  startGame: (gameId, totalRounds, gameData = null) => {
    const existingTimer = get().timer;
    if (existingTimer) {
      clearInterval(existingTimer);
    }

    const timer = setInterval(() => {
      get().updateTimeElapsed();
    }, 1000);

    set({
      currentGame: gameId,
      isPlaying: true,
      currentRound: 0,
      totalRounds,
      score: 0,
      timeElapsed: 0,
      gameData,
      difficulty: 'easy',
      timer,
    });
  },

  nextRound: () => set((state) => ({
    currentRound: Math.min(state.currentRound + 1, state.totalRounds - 1),
  })),

  updateScore: (points) => set((state) => ({
    score: state.score + points,
  })),

  updateTimeElapsed: () => set((state) => ({
    timeElapsed: state.timeElapsed + 1,
  })),

  setDifficulty: (difficulty) => set({ difficulty }),

  endGame: () => {
    const timer = get().timer;
    if (timer) {
      clearInterval(timer);
    }

    set((state) => ({
      isPlaying: false,
      timer: null,
    }));
  },

  resetGame: () => {
    const timer = get().timer;
    if (timer) {
      clearInterval(timer);
    }

    set({
      currentGame: null,
      isPlaying: false,
      currentRound: 0,
      totalRounds: 0,
      score: 0,
      timeElapsed: 0,
      gameData: null,
      difficulty: 'easy',
      timer: null,
    });
  },

  pauseGame: () => {
    const timer = get().timer;
    if (timer) {
      clearInterval(timer);
    }
    set({ isPlaying: false, timer: null });
  },

  resumeGame: () => {
    const timer = setInterval(() => {
      get().updateTimeElapsed();
    }, 1000);

    set({ isPlaying: true, timer });
  },
}));

// Selectors
export const useCurrentGame = () => useGameStore((state) => state.currentGame);
export const useIsGamePlaying = () => useGameStore((state) => state.isPlaying);
export const useGameScore = () => useGameStore((state) => state.score);
export const useGameTimeElapsed = () => useGameStore((state) => state.timeElapsed);
export const useGameProgress = () => {
  const currentRound = useGameStore((state) => state.currentRound);
  const totalRounds = useGameStore((state) => state.totalRounds);
  return totalRounds > 0 ? ((currentRound + 1) / totalRounds) * 100 : 0;
};
export const useGameDifficulty = () => useGameStore((state) => state.difficulty);

// Utility functions
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const calculateGameScore = (
  baseScore: number,
  timeBonus: number,
  difficultyMultiplier: number,
  accuracyMultiplier: number
): number => {
  return Math.round(baseScore * difficultyMultiplier * accuracyMultiplier + timeBonus);
};