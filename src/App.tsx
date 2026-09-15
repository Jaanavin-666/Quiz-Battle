/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PlayerProfile,
  GameSettings,
  LevelProgress,
  PowerUpInventory,
  AchievementItem,
  DailyQuizRecord,
  SupportedLanguage,
  LevelConfig,
  LocalizedQuestion,
  QuizSessionState,
} from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredSettings,
  saveStoredSettings,
  getStoredLevelProgress,
  saveStoredLevelProgress,
  getStoredCoins,
  saveStoredCoins,
  getStoredPowerups,
  saveStoredPowerups,
  getStoredAchievements,
  saveStoredAchievements,
  getStoredDailyRecord,
  saveStoredDailyRecord,
  incrementStoredTotalCorrect,
  resetAllGameData,
  generateLeaderboard,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  DEFAULT_POWERUPS,
} from './utils/storage';
import { LEVEL_CONFIGS } from './data/levels';
import { getQuestionsForLevel, getDailyQuestions } from './data/questions';
import { soundFx } from './utils/audio';

import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { LevelMap } from './components/LevelMap';
import { QuizScreen } from './components/QuizScreen';
import { ResultsModal } from './components/ResultsModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { DailyQuizModal } from './components/DailyQuizModal';

export default function App() {
  // Persistence state
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    return getStoredProfile() || DEFAULT_PROFILE;
  });
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    return getStoredProfile() === null;
  });

  const [settings, setSettings] = useState<GameSettings>(() => getStoredSettings());
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelProgress>>(() =>
    getStoredLevelProgress()
  );
  const [coins, setCoins] = useState<number>(() => getStoredCoins());
  const [powerups, setPowerups] = useState<PowerUpInventory>(() => getStoredPowerups());
  const [achievements, setAchievements] = useState<AchievementItem[]>(() =>
    getStoredAchievements()
  );
  const [dailyRecord, setDailyRecord] = useState<DailyQuizRecord>(() => getStoredDailyRecord());

  // Navigation & View state
  const [currentView, setCurrentView] = useState<'home' | 'map' | 'quiz'>('home');
  const [activeLevelConfig, setActiveLevelConfig] = useState<LevelConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<LocalizedQuestion[]>([]);
  const [activeSessionResult, setActiveSessionResult] = useState<QuizSessionState | null>(null);
  const [lastCoinsEarned, setLastCoinsEarned] = useState<number>(0);
  const [unlockedNextLevelFlag, setUnlockedNextLevelFlag] = useState<boolean>(false);
  const [isDailySession, setIsDailySession] = useState<boolean>(false);

  // Modal UI Visibility
  const [showProfileModal, setShowProfileModal] = useState<boolean>(isFirstVisit);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);

  // Sync sound controller with settings
  useEffect(() => {
    soundFx.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Save profile changes
  const handleSaveProfile = (updated: PlayerProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
    setShowProfileModal(false);
    setIsFirstVisit(false);
  };

  // Save settings changes
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    saveStoredSettings(merged);
  };

  // Change language
  const handleChangeLanguage = (lang: SupportedLanguage) => {
    handleUpdateSettings({ language: lang });
  };

  // Calculate total stars
  const progressList = Object.values(levelProgress) as LevelProgress[];
  const totalStars: number = progressList.reduce((acc: number, l: LevelProgress) => acc + (l.stars || 0), 0);
  const totalLevelsCleared: number = progressList.filter((l: LevelProgress) => l.completed).length;

  // Start specific level
  const handleStartLevel = (levelId: number, isReplay = false) => {
    const config = LEVEL_CONFIGS.find((l) => l.id === levelId);
    if (!config) return;

    // If replaying the same level, exclude previously seen questions to ensure a fresh set!
    const excludeIds = isReplay && activeLevelConfig?.id === levelId
      ? activeQuestions.map((q) => q.id)
      : [];

    const questions = getQuestionsForLevel(levelId, excludeIds);
    if (questions.length === 0) return;

    setActiveLevelConfig(config);
    setActiveQuestions(questions);
    setIsDailySession(false);
    setCurrentView('quiz');
  };

  // Start highest unlocked level directly from Home Play button
  const handleStartAdventure = () => {
    let highestUnlocked = 1;
    for (const lvl of LEVEL_CONFIGS) {
      if (levelProgress[lvl.id]?.unlocked) {
        highestUnlocked = lvl.id;
      }
    }
    handleStartLevel(highestUnlocked);
  };

  // Start Daily Challenge
  const handleStartDailyChallenge = () => {
    const questions = getDailyQuestions();
    const dailyConfig: LevelConfig = {
      id: 999,
      titleKey: 'daily_quiz',
      descriptionKey: 'daily_quiz',
      themeColor: 'from-amber-500 to-rose-600',
      requiredStarsToUnlock: 0,
      minCorrectFor1Star: 2,
      minCorrectFor2Stars: 3,
      minCorrectFor3Stars: 5,
      names: {
        en: 'Daily Challenge',
        ta: 'தினசரி சவால்',
        hi: 'दैनिक चुनौती',
        te: 'రోజువారీ సవాలు',
        ml: 'ദിനചര്യ വെല്ലുവിളി',
        kn: 'ದೈನಂದಿನ ಸವಾಲು',
        bn: 'দৈনিক চ্যালেঞ্জ',
        mr: 'दैनिक आव्हान',
      },
      descriptions: {
        en: 'Daily 5-question test for bonus coins and adventure streak!',
        ta: 'கூடுதல் நாணயங்கள் மற்றும் தொடர் வெற்றிக்கான 5 கேள்விகள்!',
        hi: 'बोनस सिक्के और रोमांचकारी स्ट्रीक के लिए 5 प्रश्न!',
        te: 'బోనస్ నాణేల కోసం 5 ప్రశ్నలు!',
        ml: 'ബോണസ് നാണയങ്ങൾക്കായുള്ള 5 ചോദ്യങ്ങൾ!',
        kn: 'ಬೋನಸ್ ನಾಣ್ಯಗಳಿಗಾಗಿ 5 ಪ್ರಶ್ನೆಗಳು!',
        bn: 'বোনাস কয়েনের জন্য ৫টি প্রশ্ন!',
        mr: 'बोनस नाण्यांसाठी ५ प्रश्न!',
      },
      icon: '🔥',
      questionIds: questions.map((q) => q.id),
      timerSeconds: 15,
      isBoss: false,
    };

    setActiveLevelConfig(dailyConfig);
    setActiveQuestions(questions);
    setIsDailySession(true);
    setShowDailyModal(false);
    setCurrentView('quiz');
  };

  // Powerup consumption
  const handleUsePowerup = (type: 'fiftyFifty' | 'extraTime' | 'hint'): boolean => {
    if (powerups[type] <= 0) return false;
    const updated = {
      ...powerups,
      [type]: powerups[type] - 1,
    };
    setPowerups(updated);
    saveStoredPowerups(updated);
    return true;
  };

  // Complete Quiz & update progress, stars, achievements, coins
  const handleCompleteQuiz = (results: QuizSessionState) => {
    setActiveSessionResult(results);

    const totalQ = results.correctCount + results.wrongCount || 1;
    const accuracy = Math.round((results.correctCount / totalQ) * 100);

    let stars = 0;
    if (accuracy >= 90) stars = 3;
    else if (accuracy >= 65) stars = 2;
    else if (accuracy >= 40) stars = 1;

    const isPassed = stars >= 1;
    let earnedCoins = 0;
    let willUnlockNext = false;

    if (isDailySession) {
      // Daily Quiz Rewards
      earnedCoins = 80 + Math.floor(results.score / 20);
      const newDailyRecord: DailyQuizRecord = {
        lastDate: new Date().toISOString().split('T')[0],
        streak: dailyRecord.streak + 1,
        completedToday: true,
        scoreToday: results.score,
      };
      setDailyRecord(newDailyRecord);
      saveStoredDailyRecord(newDailyRecord);
    } else if (activeLevelConfig) {
      const lvlId = activeLevelConfig.id;
      const prevProg = levelProgress[lvlId];
      const prevStars = prevProg?.stars || 0;

      // Base coins
      earnedCoins = isPassed ? 40 + stars * 20 + Math.floor(results.score / 30) : 10;

      // Check level unlock
      const updatedMap = { ...levelProgress };
      const newStars = Math.max(prevStars, stars);
      const newHighScore = Math.max(prevProg?.highScore || 0, results.score);

      updatedMap[lvlId] = {
        levelId: lvlId,
        unlocked: true,
        completed: isPassed || prevProg?.completed || false,
        stars: newStars,
        highScore: newHighScore,
        bestAccuracy: Math.max(prevProg?.bestAccuracy || 0, accuracy),
        bestStreak: Math.max(prevProg?.bestStreak || 0, results.maxStreak),
        timesPlayed: (prevProg?.timesPlayed || 0) + 1,
      };

      if (isPassed && lvlId < 10) {
        if (!updatedMap[lvlId + 1]?.unlocked) {
          willUnlockNext = true;
          updatedMap[lvlId + 1] = {
            ...updatedMap[lvlId + 1],
            levelId: lvlId + 1,
            unlocked: true,
          };
        }
      }

      setLevelProgress(updatedMap);
      saveStoredLevelProgress(updatedMap);
    }

    // Award coins
    const newCoins = coins + earnedCoins;
    setCoins(newCoins);
    saveStoredCoins(newCoins);
    setLastCoinsEarned(earnedCoins);
    setUnlockedNextLevelFlag(willUnlockNext);

    // Update global correct questions count & achievements
    const totalCorrect = incrementStoredTotalCorrect(results.correctCount);
    updateAchievementsProgress({
      completedAny: true,
      totalCorrect,
      streak: results.maxStreak,
      perfectAccuracy: accuracy === 100,
      totalStarsAfter: totalStars + (stars > (levelProgress[activeLevelConfig?.id || 1]?.stars || 0) ? stars - (levelProgress[activeLevelConfig?.id || 1]?.stars || 0) : 0),
      isDaily: isDailySession,
    });

    setShowResultsModal(true);
  };

  // Evaluate & trigger achievements
  const updateAchievementsProgress = (params: {
    completedAny: boolean;
    totalCorrect: number;
    streak: number;
    perfectAccuracy: boolean;
    totalStarsAfter: number;
    isDaily: boolean;
  }) => {
    let coinGains = 0;
    const updated = achievements.map((ach) => {
      let nextProgress = ach.progress;
      let isUnlocked = ach.unlocked;

      if (ach.id === 'first_quiz' && params.completedAny) {
        nextProgress = 1;
        if (!isUnlocked) {
          isUnlocked = true;
          coinGains += ach.rewardCoins;
        }
      } else if (ach.id === 'correct_10') {
        nextProgress = Math.min(ach.maxProgress, params.totalCorrect);
        if (nextProgress >= ach.maxProgress && !isUnlocked) {
          isUnlocked = true;
          coinGains += ach.rewardCoins;
        }
      } else if (ach.id === 'streak_5') {
        nextProgress = Math.max(ach.progress, Math.min(ach.maxProgress, params.streak));
        if (nextProgress >= ach.maxProgress && !isUnlocked) {
          isUnlocked = true;
          coinGains += ach.rewardCoins;
        }
      } else if (ach.id === 'perfect_level' && params.perfectAccuracy) {
        nextProgress = 1;
        if (!isUnlocked) {
          isUnlocked = true;
          coinGains += ach.rewardCoins;
        }
      } else if (ach.id === 'ten_levels') {
        const cleared = (Object.values(levelProgress) as LevelProgress[]).filter((l) => l.completed).length;
        nextProgress = Math.min(ach.maxProgress, cleared);
        if (nextProgress >= ach.maxProgress && !isUnlocked) {
          isUnlocked = true;
          coinGains += ach.rewardCoins;
        }
      } else if (ach.id === 'gk_master') {
        nextProgress = Math.min(ach.maxProgress, params.totalStarsAfter);
        if (nextProgress >= ach.maxProgress && !isUnlocked) {
          isUnlocked = true;
          coinGains += ach.rewardCoins;
        }
      } else if (ach.id === 'daily_champ' && params.isDaily) {
        nextProgress = 1;
        if (!isUnlocked) {
          isUnlocked = true;
          coinGains += ach.rewardCoins;
        }
      }

      return {
        ...ach,
        progress: nextProgress,
        unlocked: isUnlocked,
      };
    });

    if (coinGains > 0) {
      setCoins((c) => {
        const nc = c + coinGains;
        saveStoredCoins(nc);
        return nc;
      });
    }
    setAchievements(updated);
    saveStoredAchievements(updated);
  };

  // Reset progress handler
  const handleResetProgress = () => {
    resetAllGameData();
    setProfile(DEFAULT_PROFILE);
    setSettings(DEFAULT_SETTINGS);
    setLevelProgress(getStoredLevelProgress());
    setCoins(150);
    setPowerups(DEFAULT_POWERUPS);
    setAchievements(getStoredAchievements());
    setDailyRecord(getStoredDailyRecord());
    setCurrentView('home');
  };

  // Leaderboard data
  const totalScore: number = (Object.values(levelProgress) as LevelProgress[]).reduce(
    (acc: number, l: LevelProgress) => acc + (l.highScore || 0),
    0
  );
  const leaderboardList = generateLeaderboard(
    profile.name,
    profile.avatarId,
    totalScore,
    totalStars,
    totalLevelsCleared
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white font-sans">
      {/* Top Universal Navbar */}
      <Navbar
        profile={profile}
        totalStars={totalStars}
        coins={coins}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          handleUpdateSettings({ soundEnabled: !settings.soundEnabled });
        }}
        currentLanguage={settings.language}
        onChangeLanguage={handleChangeLanguage}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onGoHome={() => {
          if (currentView === 'quiz') {
            if (window.confirm('Leave active quiz?')) {
              setCurrentView('home');
            }
          } else {
            setCurrentView('home');
          }
        }}
      />

      {/* Main Screen Views */}
      <main className="flex-1 flex flex-col justify-start">
        {currentView === 'home' && (
          <HomeScreen
            profile={profile}
            language={settings.language}
            levelProgress={levelProgress}
            dailyRecord={dailyRecord}
            coins={coins}
            totalStars={totalStars}
            onStartAdventure={handleStartAdventure}
            onOpenMap={() => setCurrentView('map')}
            onOpenDailyQuiz={() => setShowDailyModal(true)}
            onOpenAchievements={() => setShowAchievementsModal(true)}
            onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onChangeLanguage={handleChangeLanguage}
          />
        )}

        {currentView === 'map' && (
          <LevelMap
            profile={profile}
            language={settings.language}
            levelProgress={levelProgress}
            totalStars={totalStars}
            onSelectLevel={handleStartLevel}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'quiz' && activeLevelConfig && (
          <QuizScreen
            levelConfig={activeLevelConfig}
            questions={activeQuestions}
            language={settings.language}
            powerups={powerups}
            onUsePowerup={handleUsePowerup}
            onCompleteQuiz={handleCompleteQuiz}
            onExitQuiz={() => {
              if (isDailySession) {
                setCurrentView('home');
              } else {
                setCurrentView('map');
              }
            }}
          />
        )}
      </main>

      {/* Level Completion / Results Celebration Modal */}
      {showResultsModal && activeLevelConfig && activeSessionResult && (
        <ResultsModal
          levelConfig={activeLevelConfig}
          session={activeSessionResult}
          language={settings.language}
          coinsEarned={lastCoinsEarned}
          unlockedNext={unlockedNextLevelFlag}
          onNextLevel={() => {
            setShowResultsModal(false);
            if (activeLevelConfig.id < 10 && !isDailySession) {
              handleStartLevel(activeLevelConfig.id + 1);
            } else {
              setCurrentView('map');
            }
          }}
          onReplay={() => {
            setShowResultsModal(false);
            if (isDailySession) {
              handleStartDailyChallenge();
            } else {
              handleStartLevel(activeLevelConfig.id, true);
            }
          }}
          onReturnToMap={() => {
            setShowResultsModal(false);
            setCurrentView('map');
          }}
        />
      )}

      {/* Profile Creation / Edit Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        isInitialSetup={isFirstVisit}
        currentProfile={profile}
        language={settings.language}
        onSave={handleSaveProfile}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        settings={settings}
        language={settings.language}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        achievements={achievements}
        language={settings.language}
        onClaim={(id, reward) => {
          // Future claim bonus
        }}
        onClose={() => setShowAchievementsModal(false)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        entries={leaderboardList}
        language={settings.language}
        onClose={() => setShowLeaderboardModal(false)}
      />

      {/* Daily Challenge Modal */}
      <DailyQuizModal
        isOpen={showDailyModal}
        dailyRecord={dailyRecord}
        language={settings.language}
        onStartDailyQuiz={handleStartDailyChallenge}
        onClose={() => setShowDailyModal(false)}
      />
    </div>
  );
}
