import React from 'react';
import {
  Play,
  Map as MapIcon,
  Calendar,
  Trophy,
  Award,
  Settings as SettingsIcon,
  Globe,
  Flame,
  Star,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { PlayerProfile, SupportedLanguage, LevelProgress, DailyQuizRecord } from '../types';
import { UI_STRINGS, SUPPORTED_LANGUAGES } from '../data/translations';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../utils/audio';

interface HomeScreenProps {
  profile: PlayerProfile;
  language: SupportedLanguage;
  levelProgress: Record<number, LevelProgress>;
  dailyRecord: DailyQuizRecord;
  coins: number;
  totalStars: number;
  onStartAdventure: () => void;
  onOpenMap: () => void;
  onOpenDailyQuiz: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  language,
  levelProgress,
  dailyRecord,
  coins,
  totalStars,
  onStartAdventure,
  onOpenMap,
  onOpenDailyQuiz,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenSettings,
  onChangeLanguage,
}) => {
  const avatar = getAvatarById(profile.avatarId);

  // Determine current active level
  let highestUnlockedLevel = 1;
  let completedCount = 0;
  (Object.values(levelProgress) as LevelProgress[]).forEach((lvl) => {
    if (lvl.completed) completedCount++;
    if (lvl.unlocked && lvl.levelId > highestUnlockedLevel) {
      highestUnlockedLevel = lvl.levelId;
    }
  });

  return (
    <div className="w-full max-w-md mx-auto px-4 py-5 flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border border-indigo-700/50 p-6 shadow-2xl shadow-indigo-950/50 text-white">
        {/* Background glow & accents */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{UI_STRINGS.tagline[language] || 'General Knowledge Quest'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {UI_STRINGS.home[language]}!
            </h2>
            <p className="text-sm text-indigo-200 mt-0.5">
              {UI_STRINGS.player_name[language]}: <span className="font-bold text-amber-300">{profile.name}</span>
            </p>
          </div>

          <button
            id="btn-home-hero-avatar"
            onClick={() => {
              soundFx.playClick();
              onOpenProfile();
            }}
            className="flex-shrink-0 group relative"
            title="Edit Profile"
          >
            <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-4xl shadow-xl border-2 ${avatar.borderColor} ${avatar.bgColor} group-hover:scale-105 transition-transform`}>
              {avatar.emoji}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] text-slate-300 group-hover:text-white">
              ✏️
            </div>
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-indigo-800/60 text-center">
          <div className="bg-slate-900/40 rounded-xl p-2 backdrop-blur-sm border border-indigo-500/10">
            <div className="text-[11px] font-medium text-slate-400">Levels</div>
            <div className="text-base font-extrabold text-white flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{completedCount}/10</span>
            </div>
          </div>
          <div className="bg-slate-900/40 rounded-xl p-2 backdrop-blur-sm border border-indigo-500/10">
            <div className="text-[11px] font-medium text-slate-400">Stars</div>
            <div className="text-base font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{totalStars}/30</span>
            </div>
          </div>
          <div className="bg-slate-900/40 rounded-xl p-2 backdrop-blur-sm border border-indigo-500/10">
            <div className="text-[11px] font-medium text-slate-400">Coins</div>
            <div className="text-base font-extrabold text-yellow-300 flex items-center justify-center gap-1">
              <span>🪙</span>
              <span>{coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Main "Play Adventure" button */}
        <button
          id="btn-home-play"
          onClick={() => {
            soundFx.playLevelStart();
            onStartAdventure();
          }}
          className="w-full relative overflow-hidden py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-black text-lg sm:text-xl shadow-xl shadow-emerald-500/25 flex items-center justify-between group transition-all transform active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
            <div className="text-left">
              <div className="text-xl leading-tight font-extrabold tracking-tight">
                {UI_STRINGS.play[language]}
              </div>
              <div className="text-xs font-semibold text-emerald-100 opacity-90">
                {UI_STRINGS.level[language]} {highestUnlockedLevel}
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </button>

        {/* Level Map Button */}
        <button
          id="btn-home-level-map"
          onClick={() => {
            soundFx.playClick();
            onOpenMap();
          }}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/20 flex items-center justify-between group transition-all active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl group-hover:rotate-6 transition-transform">
              <MapIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-left">
              <div className="font-extrabold">{UI_STRINGS.level_map[language]}</div>
              <div className="text-xs text-indigo-200">10 Adventure Islands & Boss Quizzes</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Daily Quiz Challenge Card */}
        <button
          id="btn-home-daily-quiz"
          onClick={() => {
            soundFx.playClick();
            onOpenDailyQuiz();
          }}
          className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between group transition-all active:scale-98 ${
            dailyRecord.completedToday
              ? 'bg-slate-800/80 border-slate-700/80'
              : 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 border-amber-500/40 shadow-lg shadow-amber-500/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-100">
                  {UI_STRINGS.daily_quiz[language]}
                </span>
                {dailyRecord.streak > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                    <Flame className="w-3 h-3 fill-orange-400" />
                    <span>{dailyRecord.streak}d</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {dailyRecord.completedToday
                  ? 'Completed today! Come back tomorrow'
                  : 'Earn +80 Coins & Keep your streak!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dailyRecord.completedToday ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                ✓ Done
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold shadow-md">
                Play
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Grid Features: Achievements, Leaderboard, Profile, Settings */}
      <div className="grid grid-cols-2 gap-3">
        {/* Achievements */}
        <button
          id="btn-home-achievements"
          onClick={() => {
            soundFx.playClick();
            onOpenAchievements();
          }}
          className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 flex flex-col items-start gap-2 group transition-all active:scale-98"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100">
              {UI_STRINGS.achievements[language]}
            </div>
            <div className="text-[11px] text-slate-400">Trophies & Badges</div>
          </div>
        </button>

        {/* Leaderboard */}
        <button
          id="btn-home-leaderboard"
          onClick={() => {
            soundFx.playClick();
            onOpenLeaderboard();
          }}
          className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 flex flex-col items-start gap-2 group transition-all active:scale-98"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100">
              {UI_STRINGS.leaderboard[language]}
            </div>
            <div className="text-[11px] text-slate-400">Hall of Fame</div>
          </div>
        </button>

        {/* Profile */}
        <button
          id="btn-home-profile"
          onClick={() => {
            soundFx.playClick();
            onOpenProfile();
          }}
          className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 flex flex-col items-start gap-2 group transition-all active:scale-98"
        >
          <div className={`w-10 h-10 rounded-xl ${avatar.bgColor} border ${avatar.borderColor} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
            {avatar.emoji}
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100">
              {UI_STRINGS.profile[language]}
            </div>
            <div className="text-[11px] text-slate-400">Name & Avatar</div>
          </div>
        </button>

        {/* Settings */}
        <button
          id="btn-home-settings"
          onClick={() => {
            soundFx.playClick();
            onOpenSettings();
          }}
          className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 flex flex-col items-start gap-2 group transition-all active:scale-98"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center group-hover:rotate-45 transition-transform">
            <SettingsIcon className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100">
              {UI_STRINGS.settings[language]}
            </div>
            <div className="text-[11px] text-slate-400">Audio & Preferences</div>
          </div>
        </button>
      </div>

      {/* Quiz Language Selection Ribbon */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-3.5 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Quiz Language (Questions & Answers)</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-bold uppercase">
            {language}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-2.5">
          Game interface is in English. Questions change to your chosen language:
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                soundFx.playClick();
                onChangeLanguage(lang.code);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                language === lang.code
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30 scale-102 ring-1 ring-white/40'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
