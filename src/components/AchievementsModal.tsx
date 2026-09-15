import React from 'react';
import { ArrowLeft, Award, CheckCircle, Lock, Coins } from 'lucide-react';
import { AchievementItem, SupportedLanguage } from '../types';
import { UI_STRINGS } from '../data/translations';
import { ACHIEVEMENT_TEXTS } from '../data/achievements';
import { soundFx } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  achievements: AchievementItem[];
  language: SupportedLanguage;
  onClaim: (id: string, reward: number) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  achievements,
  language,
  onClaim,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl">
                Achievements
              </h2>
              <p className="text-xs text-amber-100">
                Complete quests and claim coin rewards!
              </p>
            </div>
          </div>

          <button
            id="btn-close-achievements"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* List of achievements */}
        <div className="p-4 space-y-3 overflow-y-auto scrollbar-thin">
          {achievements.map((item) => {
            const title =
              ACHIEVEMENT_TEXTS[item.titleKey]?.en ||
              item.id;
            const desc =
              ACHIEVEMENT_TEXTS[item.descKey]?.en ||
              '';

            const percent = Math.min(
              100,
              Math.round((item.progress / item.maxProgress) * 100)
            );

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  item.unlocked
                    ? 'bg-slate-800/90 border-amber-500/40 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-850/50 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-100 truncate">
                      {title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                      {desc}
                    </p>

                    {/* Progress meter */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-24 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.progress}/{item.maxProgress}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  {item.unlocked ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-lg">
                      <Coins className="w-3.5 h-3.5" />
                      <span>+{item.rewardCoins}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
