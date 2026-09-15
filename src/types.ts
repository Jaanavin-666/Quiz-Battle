export type SupportedLanguage = 
  | 'en' 
  | 'ta' 
  | 'hi' 
  | 'te' 
  | 'ml' 
  | 'kn' 
  | 'bn' 
  | 'mr';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export type GKCategory = 
  | 'world'
  | 'india'
  | 'tamil_nadu'
  | 'geography'
  | 'history'
  | 'science'
  | 'sports'
  | 'entertainment'
  | 'technology'
  | 'animals'
  | 'space'
  | 'current_gk';

export interface LocalizedQuestion {
  id: string;
  category: GKCategory;
  question: Record<SupportedLanguage, string>;
  options: Record<SupportedLanguage, string[]>;
  correctIndex: number;
  hint: Record<SupportedLanguage, string>;
  explanation?: Record<SupportedLanguage, string>;
}

export interface LevelConfig {
  id: number;
  titleKey: string;
  descriptionKey: string;
  isBoss: boolean;
  questionIds: string[];
  themeColor: string; // Tailwind color class or hex
  requiredStarsToUnlock: number;
  minCorrectFor1Star: number;
  minCorrectFor2Stars: number;
  minCorrectFor3Stars: number;
  names?: Record<SupportedLanguage, string>;
  descriptions?: Record<SupportedLanguage, string>;
  icon?: string;
  timerSeconds?: number;
}

export interface PlayerProfile {
  name: string;
  age: number;
  avatarId: string;
  createdAt: number;
}

export interface PowerUpInventory {
  fiftyFifty: number;
  extraTime: number;
  hint: number;
}

export interface LevelProgress {
  levelId: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  highScore: number;
  bestAccuracy: number;
  bestStreak: number;
  timesPlayed: number;
}

export interface AchievementItem {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rewardCoins: number;
}

export interface DailyQuizRecord {
  lastDate: string; // YYYY-MM-DD
  streak: number;
  completedToday: boolean;
  scoreToday: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarId: string;
  score: number;
  stars: number;
  levelsCleared: number;
  countryOrState: string;
  isCurrentPlayer?: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  language: SupportedLanguage;
}

export interface QuizSessionState {
  levelId: number;
  isDaily?: boolean;
  questions?: LocalizedQuestion[];
  currentIndex?: number;
  currentQuestionIndex?: number;
  score: number;
  streak: number;
  bestStreak?: number;
  maxStreak: number;
  correctCount: number;
  wrongCount: number;
  timeLeft?: number;
  timePerQuestion?: number;
  timeBonusTotal?: number;
  selectedOptionIndex?: number | null;
  isAnswered?: boolean;
  hiddenOptionIndices?: number[];
  hintUsed?: boolean;
  extraTimeUsed?: boolean;
  fiftyFiftyUsed?: boolean;
  completed?: boolean;
}

export interface QuizResultData {
  levelId: number;
  isDaily: boolean;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  score: number;
  bestStreak: number;
  starsEarned: number;
  isNewBest: boolean;
  unlockedNextLevel: boolean;
  coinsEarned: number;
}
