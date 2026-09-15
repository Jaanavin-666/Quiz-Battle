import {
  PlayerProfile,
  PowerUpInventory,
  LevelProgress,
  AchievementItem,
  DailyQuizRecord,
  GameSettings,
  LeaderboardEntry,
} from '../types';
import { LEVEL_CONFIGS } from '../data/levels';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

const STORAGE_KEYS = {
  PROFILE: 'qb_player_profile',
  LEVEL_PROGRESS: 'qb_level_progress',
  POWERUPS: 'qb_powerups',
  COINS: 'qb_coins',
  SETTINGS: 'qb_settings',
  ACHIEVEMENTS: 'qb_achievements',
  DAILY: 'qb_daily_quiz',
  TOTAL_CORRECT: 'qb_total_correct_count',
};

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Quiz Explorer',
  age: 18,
  avatarId: 'tiger',
  createdAt: Date.now(),
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
  darkMode: true,
  language: 'ta', // Default to Tamil as requested with full support, or user switches freely
};

export const DEFAULT_POWERUPS: PowerUpInventory = {
  fiftyFifty: 3,
  extraTime: 3,
  hint: 3,
};

export function getStoredProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {
    // Ignore error
  }
}

export function getStoredSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore error
  }
}

export function getStoredPowerups(): PowerUpInventory {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POWERUPS);
    if (!raw) return DEFAULT_POWERUPS;
    return { ...DEFAULT_POWERUPS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_POWERUPS;
  }
}

export function saveStoredPowerups(powerups: PowerUpInventory): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POWERUPS, JSON.stringify(powerups));
  } catch {
    // Ignore
  }
}

export function getStoredCoins(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COINS);
    if (raw === null) return 150;
    return Number(raw) || 0;
  } catch {
    return 150;
  }
}

export function saveStoredCoins(coins: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COINS, String(coins));
  } catch {
    // Ignore
  }
}

export function getStoredTotalCorrect(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOTAL_CORRECT);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function incrementStoredTotalCorrect(amount: number): number {
  const current = getStoredTotalCorrect() + amount;
  try {
    localStorage.setItem(STORAGE_KEYS.TOTAL_CORRECT, String(current));
  } catch {
    // Ignore
  }
  return current;
}

export function getStoredLevelProgress(): Record<number, LevelProgress> {
  const initialMap: Record<number, LevelProgress> = {};
  LEVEL_CONFIGS.forEach((lvl) => {
    initialMap[lvl.id] = {
      levelId: lvl.id,
      unlocked: lvl.id === 1, // Level 1 is unlocked initially
      completed: false,
      stars: 0,
      highScore: 0,
      bestAccuracy: 0,
      bestStreak: 0,
      timesPlayed: 0,
    };
  });

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEVEL_PROGRESS);
    if (!raw) return initialMap;
    const parsed = JSON.parse(raw);
    return { ...initialMap, ...parsed };
  } catch {
    return initialMap;
  }
}

export function saveStoredLevelProgress(progress: Record<number, LevelProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEVEL_PROGRESS, JSON.stringify(progress));
  } catch {
    // Ignore
  }
}

export function getStoredAchievements(): AchievementItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    const stored = JSON.parse(raw) as AchievementItem[];
    // Merge with defaults in case of new items
    return INITIAL_ACHIEVEMENTS.map((def) => {
      const found = stored.find((s) => s.id === def.id);
      return found ? { ...def, ...found } : def;
    });
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveStoredAchievements(items: AchievementItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(items));
  } catch {
    // Ignore
  }
}

export function getStoredDailyRecord(): DailyQuizRecord {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultRec: DailyQuizRecord = {
    lastDate: '',
    streak: 0,
    completedToday: false,
    scoreToday: 0,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY);
    if (!raw) return defaultRec;
    const parsed: DailyQuizRecord = JSON.parse(raw);
    if (parsed.lastDate !== todayStr) {
      // New day: check if consecutive for streak
      const prevDate = new Date();
      prevDate.setDate(prevDate.getDate() - 1);
      const yesterdayStr = prevDate.toISOString().split('T')[0];
      const isConsecutive = parsed.lastDate === yesterdayStr && parsed.completedToday;
      return {
        lastDate: todayStr,
        streak: isConsecutive ? parsed.streak : 0,
        completedToday: false,
        scoreToday: 0,
      };
    }
    return parsed;
  } catch {
    return defaultRec;
  }
}

export function saveStoredDailyRecord(rec: DailyQuizRecord): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(rec));
  } catch {
    // Ignore
  }
}

export function resetAllGameData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.LEVEL_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.POWERUPS);
    localStorage.removeItem(STORAGE_KEYS.COINS);
    localStorage.removeItem(STORAGE_KEYS.DAILY);
    localStorage.removeItem(STORAGE_KEYS.TOTAL_CORRECT);
  } catch {
    // Ignore
  }
}

export function generateLeaderboard(
  playerName: string,
  playerAvatar: string,
  playerScore: number,
  playerStars: number,
  levelsCleared: number
): LeaderboardEntry[] {
  const baseAdventurers: LeaderboardEntry[] = [
    { id: 'bot_1', name: 'Vikram', avatarId: 'wizard', score: 3840, stars: 29, levelsCleared: 10, countryOrState: 'Tamil Nadu' },
    { id: 'bot_2', name: 'Ananya', avatarId: 'owl', score: 3410, stars: 27, levelsCleared: 9, countryOrState: 'Karnataka' },
    { id: 'bot_3', name: 'Arjun', avatarId: 'astronaut', score: 2950, stars: 24, levelsCleared: 8, countryOrState: 'Kerala' },
    { id: 'bot_4', name: 'Priya', avatarId: 'scientist', score: 2420, stars: 20, levelsCleared: 7, countryOrState: 'Maharashtra' },
    { id: 'bot_5', name: 'Rohan', avatarId: 'ninja', score: 1980, stars: 17, levelsCleared: 6, countryOrState: 'Delhi' },
    { id: 'bot_6', name: 'Kavitha', avatarId: 'fox', score: 1540, stars: 14, levelsCleared: 5, countryOrState: 'Andhra Pradesh' },
    { id: 'bot_7', name: 'Deepak', avatarId: 'knight', score: 1120, stars: 10, levelsCleared: 4, countryOrState: 'West Bengal' },
  ];

  const currentEntry: LeaderboardEntry = {
    id: 'current_player',
    name: playerName || 'You',
    avatarId: playerAvatar || 'tiger',
    score: playerScore,
    stars: playerStars,
    levelsCleared: levelsCleared,
    countryOrState: 'Local Champion',
    isCurrentPlayer: true,
  };

  const all = [...baseAdventurers, currentEntry];
  all.sort((a, b) => b.score - a.score || b.stars - a.stars);
  return all;
}
