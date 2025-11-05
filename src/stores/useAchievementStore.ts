import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'learning' | 'gaming' | 'streak' | 'social' | 'milestone';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  points: number;
  requirements: {
    type: 'study_time' | 'words_learned' | 'streak_days' | 'game_score' | 'accuracy' | 'category_completion';
    value: number;
    operator?: 'exact' | 'at_least' | 'at_most';
  }[];
}

interface AchievementState {
  achievements: Achievement[];
  totalPoints: number;
  newUnlocks: string[];
  // Actions
  unlockAchievement: (achievementId: string) => void;
  updateProgress: (achievementId: string, progress: number) => void;
  checkAchievements: (stats: UserStats) => void;
  markAsViewed: (achievementId: string) => void;
  resetAchievements: () => void;
}

interface UserStats {
  totalStudyTime: number;
  wordsLearned: number;
  streakDays: number;
  highScores: Record<string, number>;
  averageAccuracy: number;
  categoryProgress: Record<string, number>;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // 学习类成就
  {
    id: 'first_word',
    title: '初学者',
    description: '学会第一个单词',
    icon: '🌱',
    rarity: 'common',
    category: 'learning',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 10,
    requirements: [
      { type: 'words_learned', value: 1, operator: 'at_least' }
    ]
  },
  {
    id: 'word_collector_10',
    title: '单词收集者',
    description: '学会10个单词',
    icon: '📚',
    rarity: 'common',
    category: 'learning',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    points: 25,
    requirements: [
      { type: 'words_learned', value: 10, operator: 'at_least' }
    ]
  },
  {
    id: 'word_collector_50',
    title: '词汇大师',
    description: '学会50个单词',
    icon: '🎓',
    rarity: 'rare',
    category: 'learning',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    points: 100,
    requirements: [
      { type: 'words_learned', value: 50, operator: 'at_least' }
    ]
  },
  {
    id: 'word_collector_100',
    title: '词汇专家',
    description: '学会100个单词',
    icon: '👨‍🏫',
    rarity: 'epic',
    category: 'learning',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    points: 200,
    requirements: [
      { type: 'words_learned', value: 100, operator: 'at_least' }
    ]
  },

  // 学习时间成就
  {
    id: 'study_30min',
    title: '开始学习',
    description: '累计学习30分钟',
    icon: '⏰',
    rarity: 'common',
    category: 'learning',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    points: 15,
    requirements: [
      { type: 'study_time', value: 30, operator: 'at_least' }
    ]
  },
  {
    id: 'study_2hours',
    title: '勤奋学习',
    description: '累计学习2小时',
    icon: '📖',
    rarity: 'rare',
    category: 'learning',
    unlocked: false,
    progress: 0,
    maxProgress: 120,
    points: 50,
    requirements: [
      { type: 'study_time', value: 120, operator: 'at_least' }
    ]
  },
  {
    id: 'study_10hours',
    title: '学习达人',
    description: '累计学习10小时',
    icon: '🏆',
    rarity: 'epic',
    category: 'learning',
    unlocked: false,
    progress: 0,
    maxProgress: 600,
    points: 150,
    requirements: [
      { type: 'study_time', value: 600, operator: 'at_least' }
    ]
  },

  // 连续学习成就
  {
    id: 'streak_3',
    title: '坚持3天',
    description: '连续学习3天',
    icon: '🔥',
    rarity: 'common',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    points: 20,
    requirements: [
      { type: 'streak_days', value: 3, operator: 'at_least' }
    ]
  },
  {
    id: 'streak_7',
    title: '一周坚持',
    description: '连续学习7天',
    icon: '💪',
    rarity: 'rare',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    points: 75,
    requirements: [
      { type: 'streak_days', value: 7, operator: 'at_least' }
    ]
  },
  {
    id: 'streak_30',
    title: '月度冠军',
    description: '连续学习30天',
    icon: '👑',
    rarity: 'legendary',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    points: 300,
    requirements: [
      { type: 'streak_days', value: 30, operator: 'at_least' }
    ]
  },

  // 游戏类成就
  {
    id: 'first_game',
    title: '游戏初体验',
    description: '完成第一个游戏',
    icon: '🎮',
    rarity: 'common',
    category: 'gaming',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 15,
    requirements: [
      { type: 'game_score', value: 1, operator: 'at_least' }
    ]
  },
  {
    id: 'high_scorer',
    title: '高分玩家',
    description: '在任意游戏中获得500分',
    icon: '⭐',
    rarity: 'rare',
    category: 'gaming',
    unlocked: false,
    progress: 0,
    maxProgress: 500,
    points: 60,
    requirements: [
      { type: 'game_score', value: 500, operator: 'at_least' }
    ]
  },
  {
    id: 'perfect_accuracy',
    title: '完美表现',
    description: '在任意游戏中达到100%正确率',
    icon: '🎯',
    rarity: 'epic',
    category: 'gaming',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    points: 120,
    requirements: [
      { type: 'accuracy', value: 100, operator: 'at_least' }
    ]
  },

  // 分类完成成就
  {
    id: 'category_complete_animals',
    title: '动物专家',
    description: '完成动物分类的学习',
    icon: '🐾',
    rarity: 'rare',
    category: 'milestone',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    points: 80,
    requirements: [
      { type: 'category_completion', value: 'animals', operator: 'exact' }
    ]
  },
  {
    id: 'category_complete_all',
    title: '全能学霸',
    description: '完成所有分类的学习',
    icon: '🌟',
    rarity: 'legendary',
    category: 'milestone',
    unlocked: false,
    progress: 0,
    maxProgress: 22,
    points: 500,
    requirements: [
      { type: 'category_completion', value: 22, operator: 'at_least' }
    ]
  }
];

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: INITIAL_ACHIEVEMENTS,
      totalPoints: 0,
      newUnlocks: [],

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          const achievementIndex = state.achievements.findIndex(a => a.id === achievementId);
          if (achievementIndex === -1 || state.achievements[achievementIndex].unlocked) {
            return state;
          }

          const updatedAchievements = [...state.achievements];
          updatedAchievements[achievementIndex] = {
            ...updatedAchievements[achievementIndex],
            unlocked: true,
            unlockedAt: new Date().toISOString(),
            progress: updatedAchievements[achievementIndex].maxProgress
          };

          const newPoints = state.totalPoints + updatedAchievements[achievementIndex].points;

          return {
            achievements: updatedAchievements,
            totalPoints: newPoints,
            newUnlocks: [...state.newUnlocks, achievementId]
          };
        });
      },

      updateProgress: (achievementId: string, progress: number) => {
        set((state) => {
          const achievementIndex = state.achievements.findIndex(a => a.id === achievementId);
          if (achievementIndex === -1 || state.achievements[achievementIndex].unlocked) {
            return state;
          }

          const updatedAchievements = [...state.achievements];
          const achievement = updatedAchievements[achievementIndex];
          const newProgress = Math.min(progress, achievement.maxProgress);

          updatedAchievements[achievementIndex] = {
            ...achievement,
            progress: newProgress
          };

          // Check if achievement should be unlocked
          if (newProgress >= achievement.maxProgress && !achievement.unlocked) {
            updatedAchievements[achievementIndex] = {
              ...updatedAchievements[achievementIndex],
              unlocked: true,
              unlockedAt: new Date().toISOString()
            };

            const newPoints = state.totalPoints + achievement.points;

            return {
              achievements: updatedAchievements,
              totalPoints: newPoints,
              newUnlocks: [...state.newUnlocks, achievementId]
            };
          }

          return { achievements: updatedAchievements };
        });
      },

      checkAchievements: (stats: UserStats) => {
        const { achievements } = get();

        achievements.forEach((achievement) => {
          if (achievement.unlocked) return;

          let shouldUnlock = false;
          let progress = 0;

          achievement.requirements.forEach((req) => {
            let currentValue = 0;

            switch (req.type) {
              case 'study_time':
                currentValue = stats.totalStudyTime;
                break;
              case 'words_learned':
                currentValue = stats.wordsLearned;
                break;
              case 'streak_days':
                currentValue = stats.streakDays;
                break;
              case 'game_score':
                currentValue = Math.max(...Object.values(stats.highScores));
                break;
              case 'accuracy':
                currentValue = stats.averageAccuracy;
                break;
              case 'category_completion':
                currentValue = Object.values(stats.categoryProgress).filter(p => p >= 100).length;
                break;
            }

            progress = Math.max(progress, currentValue);

            if (req.operator === 'exact') {
              shouldUnlock = shouldUnlock || currentValue === req.value;
            } else if (req.operator === 'at_least') {
              shouldUnlock = shouldUnlock || currentValue >= req.value;
            } else if (req.operator === 'at_most') {
              shouldUnlock = shouldUnlock || currentValue <= req.value;
            } else {
              shouldUnlock = shouldUnlock || currentValue >= req.value;
            }
          });

          if (shouldUnlock) {
            get().unlockAchievement(achievement.id);
          } else if (progress > 0) {
            get().updateProgress(achievement.id, progress);
          }
        });
      },

      markAsViewed: (achievementId: string) => {
        set((state) => ({
          newUnlocks: state.newUnlocks.filter(id => id !== achievementId)
        }));
      },

      resetAchievements: () => {
        set({
          achievements: INITIAL_ACHIEVEMENTS,
          totalPoints: 0,
          newUnlocks: []
        });
      }
    }),
    {
      name: 'achievement-store',
      partialize: (state) => ({
        achievements: state.achievements,
        totalPoints: state.totalPoints,
        newUnlocks: state.newUnlocks
      })
    }
  )
);