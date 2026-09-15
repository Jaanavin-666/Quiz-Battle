import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight, ArrowLeft, Map as MapIcon, Trophy, Flame, Coins, CheckCircle, XCircle } from 'lucide-react';
import { LevelConfig, QuizSessionState, SupportedLanguage } from '../types';
import { soundFx } from '../utils/audio';

interface ResultsModalProps {
  levelConfig: LevelConfig;
  session: QuizSessionState;
  language: SupportedLanguage;
  coinsEarned: number;
  unlockedNext: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onReturnToMap: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  levelConfig,
  session,
  language,
  coinsEarned,
  unlockedNext,
  onNextLevel,
  onReplay,
  onReturnToMap,
}) => {
  const totalQuestions = session.correctCount + session.wrongCount || 1;
  const accuracy = Math.round((session.correctCount / totalQuestions) * 100);

  // Star calculation logic
  let stars = 0;
  if (accuracy >= 90) {
    stars = 3;
  } else if (accuracy >= 65) {
    stars = 2;
  } else if (accuracy >= 40) {
    stars = 1;
  }

  const isPassed = stars >= 1;

  useEffect(() => {
    if (isPassed) {
      soundFx.playLevelWin();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'],
        });
      } catch {
        // Ignore confetti if canvas context is restricted
      }
    } else {
      soundFx.playLevelFail();
    }
  }, [isPassed]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
        {/* Header Header Status Banner */}
        <div className={`p-6 text-center text-white relative overflow-hidden ${
          isPassed
            ? 'bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600'
            : 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900'
        }`}>
          {/* Top-left Back button to return to previous screen */}
          <button
            id="btn-results-back"
            onClick={() => {
              soundFx.playClick();
              onReturnToMap();
            }}
            className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/30 hover:bg-black/50 text-white/90 text-xs font-bold backdrop-blur-sm transition-colors border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="text-4xl mb-1 pt-4">
            {isPassed ? (stars === 3 ? '👑' : '🎉') : '💔'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {isPassed ? 'Level Completed!' : 'Level Failed!'}
          </h2>
          <p className="text-xs text-white/80 font-medium mt-0.5">
            {levelConfig.names?.en || `Level ${levelConfig.id}`}
          </p>

          {/* 3 Stars Stamp */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`transform transition-transform ${
                  starIdx <= stars
                    ? 'scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-bounce'
                    : 'opacity-40 grayscale'
                }`}
                style={{ animationDelay: `${starIdx * 150}ms` }}
              >
                <Star
                  className={`w-10 h-10 ${
                    starIdx <= stars
                      ? 'fill-amber-300 text-amber-300'
                      : 'fill-slate-600 text-slate-500'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Results Metrics Breakdown */}
        <div className="p-5 space-y-4">
          {/* Main Score & Coins */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Score
              </span>
              <span className="text-xl font-black text-amber-300">
                {session.score}
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Coins Won
              </span>
              <span className="text-xl font-black text-yellow-400 flex items-center justify-center gap-1">
                <span>🪙</span>
                <span>+{coinsEarned}</span>
              </span>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Accuracy</span>
              <span className="font-extrabold text-white">{accuracy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Correct / Wrong</span>
              <span className="font-bold text-slate-200">
                <span className="text-emerald-400">{session.correctCount}</span> / <span className="text-rose-400">{session.wrongCount}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Best Streak</span>
              <span className="font-extrabold text-orange-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span>{session.maxStreak} in a row</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Play Again & Continue */}
          <div className="space-y-2.5 pt-1">
            {/* Continue Button */}
            <button
              id="btn-results-continue"
              onClick={() => {
                soundFx.playClick();
                if (isPassed && levelConfig.id < 10) {
                  onNextLevel();
                } else {
                  onReturnToMap();
                }
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Play Again Button (Restarts same level with fresh questions) */}
            <button
              id="btn-results-play-again"
              onClick={() => {
                soundFx.playClick();
                onReplay();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              <span>Play Again</span>
            </button>

            {/* Back to Level Map */}
            <button
              id="btn-results-return-map"
              onClick={() => {
                soundFx.playClick();
                onReturnToMap();
              }}
              className="w-full py-2 px-4 rounded-2xl bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Level Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

