import React from 'react';
import { ArrowLeft, Calendar, Flame, Play, CheckCircle2, Coins, Sparkles } from 'lucide-react';
import { DailyQuizRecord, SupportedLanguage } from '../types';
import { UI_STRINGS } from '../data/translations';
import { soundFx } from '../utils/audio';

interface DailyQuizModalProps {
  isOpen: boolean;
  dailyRecord: DailyQuizRecord;
  language: SupportedLanguage;
  onStartDailyQuiz: () => void;
  onClose: () => void;
}

export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({
  isOpen,
  dailyRecord,
  language,
  onStartDailyQuiz,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl">
                {UI_STRINGS.daily_quiz[language]}
              </h2>
              <p className="text-xs text-amber-100">Fresh Daily GK Challenge</p>
            </div>
          </div>

          <button
            id="btn-close-daily-quiz"
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

        {/* Content */}
        <div className="p-5 space-y-5 text-center">
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center text-4xl shadow-inner">
              🔥
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 text-orange-400 font-extrabold text-lg">
              <Flame className="w-5 h-5 fill-orange-400" />
              <span>{dailyRecord.streak} Day Streak!</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Play every day to grow your streak and earn huge bonus coins!
            </p>
          </div>

          {/* Reward Box */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-around">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Today's Reward
              </span>
              <span className="text-base font-extrabold text-yellow-300 flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span>+80 Coins</span>
              </span>
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Questions
              </span>
              <span className="text-base font-extrabold text-slate-200">
                5 Questions
              </span>
            </div>
          </div>

          {dailyRecord.completedToday ? (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 space-y-1">
              <div className="flex items-center justify-center gap-2 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Completed For Today!</span>
              </div>
              <p className="text-xs text-emerald-400/80">
                You've scored {dailyRecord.scoreToday} pts. Check back tomorrow for new questions!
              </p>
            </div>
          ) : (
            <button
              id="btn-start-daily-challenge"
              onClick={() => {
                soundFx.playLevelStart();
                onStartDailyQuiz();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Daily Challenge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
