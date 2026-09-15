import React, { useState } from 'react';
import {
  Lock,
  Star,
  Play,
  X,
  Trophy,
  Skull,
  Crown,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { LevelConfig, LevelProgress, SupportedLanguage, PlayerProfile } from '../types';
import { LEVEL_CONFIGS } from '../data/levels';
import { UI_STRINGS } from '../data/translations';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../utils/audio';

interface LevelMapProps {
  profile: PlayerProfile;
  language: SupportedLanguage;
  levelProgress: Record<number, LevelProgress>;
  totalStars: number;
  onSelectLevel: (levelId: number) => void;
  onBackToHome: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  profile,
  language,
  levelProgress,
  totalStars,
  onSelectLevel,
  onBackToHome,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const avatar = getAvatarById(profile.avatarId);

  // Find the player's active level (the first unlocked but uncompleted level, or highest unlocked)
  let activeLevelId = 1;
  for (const lvl of LEVEL_CONFIGS) {
    const prog = levelProgress[lvl.id];
    if (prog?.unlocked) {
      activeLevelId = lvl.id;
    }
  }

  const handleNodeClick = (level: LevelConfig) => {
    soundFx.playClick();
    setSelectedLevel(level);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col min-h-screen pb-20 animate-in fade-in duration-300">
      {/* Map Header */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
        <button
          id="btn-map-back-home"
          onClick={() => {
            soundFx.playClick();
            onBackToHome();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="text-base font-extrabold text-white leading-tight">
            Level Map
          </h2>
          <p className="text-[11px] text-indigo-300">10 Adventure Milestones</p>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-extrabold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{totalStars}/30</span>
        </div>
      </div>

      {/* Map Journey Container */}
      <div className="relative py-6 px-2 flex flex-col items-center">
        {/* SVG Path connecting the levels */}
        <div className="absolute inset-0 pointer-events-none flex justify-center">
          <svg className="w-full h-full max-w-[340px]" viewBox="0 0 340 1400" fill="none">
            <path
              d="
                M 170, 70
                C 70, 140 70, 240 170, 270
                C 270, 300 270, 400 170, 440
                C 70, 480 70, 580 170, 610
                C 270, 650 270, 750 170, 780
                C 70, 820 70, 920 170, 950
                C 270, 990 270, 1090 170, 1120
                C 70, 1160 70, 1260 170, 1290
              "
              stroke="rgba(99, 102, 241, 0.25)"
              strokeWidth="10"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Level Nodes rendered in order 1 to 10 */}
        <div className="w-full space-y-12 relative z-10">
          {LEVEL_CONFIGS.map((level, idx) => {
            const progress = levelProgress[level.id] || {
              levelId: level.id,
              unlocked: level.id === 1,
              completed: false,
              stars: 0,
              highScore: 0,
            };

            const isUnlocked = progress.unlocked;
            const isCompleted = progress.completed;
            const isCurrent = activeLevelId === level.id;
            const stars = progress.stars || 0;

            // Offset zig-zag: center, left, center, right...
            const offsets = [
              'justify-center',
              'justify-start pl-6',
              'justify-end pr-6',
              'justify-start pl-4',
              'justify-center', // Boss 5 center
              'justify-end pr-4',
              'justify-start pl-6',
              'justify-end pr-6',
              'justify-start pl-4',
              'justify-center', // Boss 10 center
            ];
            const alignment = offsets[idx % offsets.length];

            return (
              <div key={level.id} className={`w-full flex ${alignment} items-center`}>
                <div className="flex flex-col items-center group relative">
                  {/* Avatar bouncing badge over current active level */}
                  {isCurrent && (
                    <div className="absolute -top-12 flex flex-col items-center animate-bounce z-20 pointer-events-none">
                      <div className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-md mb-0.5">
                        YOU
                      </div>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-lg border-2 border-white ${avatar.bgColor}`}>
                        {avatar.emoji}
                      </div>
                    </div>
                  )}

                  {/* Level Button Node */}
                  <button
                    id={`btn-level-node-${level.id}`}
                    onClick={() => handleNodeClick(level)}
                    className={`relative rounded-3xl p-1 transition-all transform active:scale-95 duration-200 ${
                      level.isBoss
                        ? 'w-22 h-22 sm:w-24 sm:h-24'
                        : 'w-18 h-18 sm:w-20 sm:h-20'
                    } flex items-center justify-center shadow-xl ${
                      !isUnlocked
                        ? 'bg-slate-800/80 border-2 border-slate-700/60 opacity-70 grayscale cursor-not-allowed'
                        : level.isBoss
                        ? 'bg-gradient-to-tr from-rose-600 via-amber-600 to-red-600 border-4 border-amber-300 ring-4 ring-rose-500/30'
                        : isCompleted
                        ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 border-2 border-emerald-400 shadow-emerald-600/30'
                        : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-600 border-2 border-indigo-400 shadow-indigo-600/30 animate-pulse'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      {!isUnlocked ? (
                        <Lock className="w-6 h-6 text-slate-400" />
                      ) : level.isBoss ? (
                        <div className="flex flex-col items-center">
                          {level.id === 10 ? (
                            <Crown className="w-8 h-8 text-amber-300 animate-spin duration-1000" />
                          ) : (
                            <Skull className="w-7 h-7 text-amber-200" />
                          )}
                          <span className="text-[10px] font-black text-amber-200 tracking-wider">
                            BOSS
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="text-xl font-black text-white leading-none">
                            {level.id}
                          </span>
                          <span className="text-[10px] font-bold text-white/80 mt-0.5">
                            {level.icon}
                          </span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Stars Underneath Node */}
                  <div className="flex items-center gap-1 mt-1.5 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Level Name Label */}
                  <div className="mt-1 text-center max-w-[120px]">
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {level.names?.en || `Level ${level.id}`}
                    </p>
                    {level.isBoss && (
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-tight">
                        {UI_STRINGS.boss_quiz[language]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Info Sheet Modal */}
      {selectedLevel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className={`p-5 text-white relative overflow-hidden ${
              selectedLevel.isBoss
                ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
                    {selectedLevel.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                      {UI_STRINGS.level[language]} {selectedLevel.id}
                      {selectedLevel.isBoss && ` • ${UI_STRINGS.boss_quiz[language]}`}
                    </span>
                    <h3 className="text-lg font-black leading-tight text-white">
                      {selectedLevel.names?.en || `Level ${selectedLevel.id}`}
                    </h3>
                  </div>
                </div>

                <button
                  id="btn-close-level-info"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedLevel(null);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-300">
                {selectedLevel.descriptions?.en || ''}
              </p>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-center">
                <div className="bg-slate-800/60 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Questions</span>
                  <span className="text-sm font-bold text-white">
                    {selectedLevel.questionIds.length} Qs
                  </span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Timer</span>
                  <span className="text-sm font-bold text-white">
                    {selectedLevel.timerSeconds}s
                  </span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Stars</span>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= (levelProgress[selectedLevel.id]?.stars || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Lock Status / Play Action */}
              {levelProgress[selectedLevel.id]?.unlocked ? (
                <button
                  id="btn-start-level-play"
                  onClick={() => {
                    soundFx.playLevelStart();
                    onSelectLevel(selectedLevel.id);
                    setSelectedLevel(null);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{UI_STRINGS.play[language]}</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
                  <p className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    <span>{UI_STRINGS.locked[language]}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Complete Level {selectedLevel.id - 1} with at least 1 star to unlock this island!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
