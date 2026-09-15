import React from 'react';
import { ArrowLeft, Trophy, Star, Medal } from 'lucide-react';
import { LeaderboardEntry, SupportedLanguage } from '../types';
import { UI_STRINGS } from '../data/translations';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  entries: LeaderboardEntry[];
  language: SupportedLanguage;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  entries,
  language,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl">
                Leaderboard
              </h2>
              <p className="text-xs text-indigo-200">
                Top General Knowledge Explorers
              </p>
            </div>
          </div>

          <button
            id="btn-close-leaderboard"
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

        {/* Leaderboard entries */}
        <div className="p-4 space-y-2 overflow-y-auto scrollbar-thin">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const avatar = getAvatarById(entry.avatarId);

            const rankBadge =
              rank === 1 ? (
                <span className="text-xl">🥇</span>
              ) : rank === 2 ? (
                <span className="text-xl">🥈</span>
              ) : rank === 3 ? (
                <span className="text-xl">🥉</span>
              ) : (
                <span className="text-xs font-black text-slate-400 w-5 text-center">
                  #{rank}
                </span>
              );

            return (
              <div
                key={entry.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  entry.isCurrentPlayer
                    ? 'bg-rose-500/15 border-rose-500/60 ring-2 ring-rose-500/40 shadow-lg'
                    : 'bg-slate-855/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 flex items-center justify-center">
                    {rankBadge}
                  </div>

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${avatar.bgColor} border ${avatar.borderColor}`}>
                    {avatar.emoji}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-100 truncate">
                        {entry.name}
                      </h4>
                      {entry.isCurrentPlayer && (
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {entry.countryOrState} • Level {entry.levelsCleared}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-amber-300">
                    {entry.score} pts
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{entry.stars}★</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
