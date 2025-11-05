export interface User {
  id: string;
  name: string;
  age: number;
  avatar: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  lastLoginAt: string;
}

export interface Category {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  count: number;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Word {
  id: string;
  filename: string;
  word: {
    en: string;
    zh: string;
  };
  voiceFilename: {
    en: string;
    zh: string;
  };
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  mastered?: boolean;
  lastReviewed?: string;
  reviewCount?: number;
  correctCount?: number;
}

export interface LearningProgress {
  totalWords: number;
  masteredWords: string[];
  currentStreak: number;
  bestStreak: number;
  totalPlayTime: number;
  lastPlayedDate: string;
  weeklyStats: {
    date: string;
    wordsLearned: number;
    timeSpent: number;
    gamesPlayed: number;
  }[];
  categoryProgress: Record<string, {
    total: number;
    mastered: number;
    lastStudied: string;
  }>;
}

export interface GameScore {
  soundTreasure: number;
  magicPuzzle: number;
  rainbowBubbles: number;
  animalMusicBox: number;
  memoryFlip: number;
  wordArtist: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'streak' | 'words' | 'games' | 'time';
  condition: {
    type: string;
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  language: 'en' | 'zh';
  dailyTimeLimit: number;
  parentPassword?: string;
  darkMode: boolean;
  autoPlayAudio: boolean;
  showHints: boolean;
}

export interface GameState {
  currentGame: string | null;
  isPlaying: boolean;
  currentRound: number;
  totalRounds: number;
  score: number;
  timeElapsed: number;
  gameData?: any;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FlashcardState {
  currentIndex: number;
  isFlipped: boolean;
  isAutoPlay: boolean;
  playSpeed: number;
  showTranslation: boolean;
  favorites: string[];
  reviewMode: boolean;
}

export interface UIState {
  loading: boolean;
  activeModal: string | null;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
  sidebarOpen: boolean;
  currentScreen: string;
}

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  minAge: number;
  maxAge: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  unlocked: boolean;
  bestScore: number;
}

export type GameType =
  | 'sound-treasure'
  | 'magic-puzzle'
  | 'rainbow-bubbles'
  | 'animal-music-box'
  | 'memory-flip'
  | 'word-artist';

export interface AudioFile {
  id: string;
  url: string;
  language: 'en' | 'zh';
  word: string;
  duration: number;
}

export interface StudySession {
  id: string;
  startTime: string;
  endTime?: string;
  wordsStudied: string[];
  gamesPlayed: GameType[];
  score: number;
  accuracy: number;
  timeSpent: number;
}

export interface ParentReport {
  childId: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  summary: {
    totalWordsLearned: number;
    timeSpent: number;
    gamesPlayed: number;
    accuracy: number;
    improvement: number;
  };
  details: {
    categoryProgress: Record<string, number>;
    gameScores: Partial<GameScore>;
    dailyActivity: Array<{
      date: string;
      words: number;
      time: number;
      games: number;
    }>;
  };
  recommendations: string[];
  generatedAt: string;
}