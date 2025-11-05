import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LearningProgress, GameScore, AppSettings, Achievement } from '@types/index';

interface AppState {
  // User state
  user: User | null;
  isLoggedIn: boolean;

  // Learning progress
  progress: LearningProgress;
  gameScores: GameScore;
  achievements: Achievement[];

  // Settings
  settings: AppSettings;

  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProgress: (updates: Partial<LearningProgress>) => void;
  updateGameScore: (game: keyof GameScore, score: number) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  unlockAchievement: (achievementId: string) => void;
  logout: () => void;
  resetProgress: () => void;
}

const defaultProgress: LearningProgress = {
  totalWords: 0,
  masteredWords: [],
  currentStreak: 0,
  bestStreak: 0,
  totalPlayTime: 0,
  lastPlayedDate: new Date().toISOString(),
  weeklyStats: [],
  categoryProgress: {},
};

const defaultSettings: AppSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticEnabled: true,
  language: 'zh',
  dailyTimeLimit: 30,
  darkMode: false,
  autoPlayAudio: true,
  showHints: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoggedIn: false,
      progress: defaultProgress,
      gameScores: {
        soundTreasure: 0,
        magicPuzzle: 0,
        rainbowBubbles: 0,
        animalMusicBox: 0,
        memoryFlip: 0,
        wordArtist: 0,
      },
      achievements: [],
      settings: defaultSettings,

      // Actions
      setUser: (user) => set({ user, isLoggedIn: true }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),

      updateProgress: (updates) => set((state) => {
        const newProgress = { ...state.progress, ...updates };

        // 更新最佳连续记录
        if (updates.currentStreak && updates.currentStreak > state.progress.bestStreak) {
          newProgress.bestStreak = updates.currentStreak;
        }

        return { progress: newProgress };
      }),

      updateGameScore: (game, score) => set((state) => ({
        gameScores: {
          ...state.gameScores,
          [game]: Math.max(state.gameScores[game], score),
        },
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),

      unlockAchievement: (achievementId) => set((state) => {
        const achievement = state.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
          return {
            achievements: state.achievements.map(a =>
              a.id === achievementId
                ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
                : a
            ),
          };
        }
        return state;
      }),

      logout: () => set({
        user: null,
        isLoggedIn: false,
      }),

      resetProgress: () => set({
        progress: defaultProgress,
        gameScores: {
          soundTreasure: 0,
          magicPuzzle: 0,
          rainbowBubbles: 0,
          animalMusicBox: 0,
          memoryFlip: 0,
          wordArtist: 0,
        },
        achievements: [],
      }),
    }),
    {
      name: 'flashcard-app-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        progress: state.progress,
        gameScores: state.gameScores,
        achievements: state.achievements,
        settings: state.settings,
      }),
    }
  )
);

// Selectors
export const useUser = () => useAppStore((state) => state.user);
export const useProgress = () => useAppStore((state) => state.progress);
export const useGameScores = () => useAppStore((state) => state.gameScores);
export const useSettings = () => useAppStore((state) => state.settings);
export const useAchievements = () => useAppStore((state) => state.achievements);

// Derived values
export const useTotalStars = () => {
  const gameScores = useGameScores();
  return Object.values(gameScores).reduce((sum, score) => sum + Math.floor(score / 10), 0);
};

export const useMasteredWordsCount = () => {
  const progress = useProgress();
  return progress.masteredWords.length;
};

export const useCurrentStreak = () => {
  const progress = useProgress();
  return progress.currentStreak;
};