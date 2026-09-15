import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Zap,
  Flame,
  HelpCircle,
  Hourglass,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  LocalizedQuestion,
  SupportedLanguage,
  PowerUpInventory,
  QuizSessionState,
  LevelConfig,
} from '../types';
import { UI_STRINGS } from '../data/translations';
import { soundFx } from '../utils/audio';

interface QuizScreenProps {
  levelConfig: LevelConfig;
  questions: LocalizedQuestion[];
  language: SupportedLanguage;
  powerups: PowerUpInventory;
  onUsePowerup: (type: 'fiftyFifty' | 'extraTime' | 'hint') => boolean;
  onCompleteQuiz: (results: QuizSessionState) => void;
  onExitQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  levelConfig,
  questions,
  language,
  powerups,
  onUsePowerup,
  onCompleteQuiz,
  onExitQuiz,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Per-question states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(levelConfig.timerSeconds);
  const [bonusEarned, setBonusEarned] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQ = questions[currentIdx];
  const timerLimit = levelConfig.timerSeconds || 20;

  // Initialize or reset per question
  useEffect(() => {
    setTimeLeft(timerLimit);
    setSelectedOption(null);
    setIsAnswered(false);
    setEliminatedOptions([]);
    setShowHint(false);
    setBonusEarned(null);
  }, [currentIdx, timerLimit]);

  // Countdown timer loop
  useEffect(() => {
    if (isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 5) {
          soundFx.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnswered, currentIdx]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    soundFx.playWrong();
    setIsAnswered(true);
    setSelectedOption(-1); // Timed out
    setWrongCount((c) => c + 1);
    setStreak(0);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered || eliminatedOptions.includes(index)) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(index);
    setIsAnswered(true);

    const actualCorrect = currentQ.correctIndex;
    const isCorrect = index === actualCorrect;

    if (isCorrect) {
      soundFx.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectCount((c) => c + 1);

      // Score formula: Base 100 + Time Bonus (up to 50) * Streak Multiplier (1x, 1.2x, 1.5x, 2x)
      const multiplier = newStreak >= 4 ? 2.0 : newStreak >= 3 ? 1.5 : newStreak >= 2 ? 1.2 : 1.0;
      const timeBonus = Math.floor(timeLeft * 3.5);
      const earnedPoints = Math.round((100 + timeBonus) * multiplier);
      setBonusEarned(earnedPoints);
      setScore((s) => s + earnedPoints);
    } else {
      soundFx.playWrong();
      setStreak(0);
      setWrongCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finished Quiz
      onCompleteQuiz({
        levelId: levelConfig.id,
        currentQuestionIndex: questions.length,
        score,
        streak,
        maxStreak,
        correctCount,
        wrongCount,
        timeBonusTotal: 0,
        fiftyFiftyUsed: false,
        extraTimeUsed: false,
        hintUsed: false,
        completed: true,
      });
    }
  };

  // Power-up triggers
  const handleFiftyFifty = () => {
    if (isAnswered || eliminatedOptions.length > 0) return;
    const success = onUsePowerup('fiftyFifty');
    if (!success) return;

    soundFx.playPowerUp();
    // Pick 2 wrong answers to eliminate
    const actualCorrect = currentQ.correctIndex;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== actualCorrect);
    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    setEliminatedOptions(shuffled.slice(0, 2));
  };

  const handleExtraTime = () => {
    if (isAnswered) return;
    const success = onUsePowerup('extraTime');
    if (!success) return;

    soundFx.playPowerUp();
    setTimeLeft((prev) => prev + 15);
  };

  const handleHint = () => {
    if (isAnswered || showHint) return;
    const success = onUsePowerup('hint');
    if (!success) return;

    soundFx.playPowerUp();
    setShowHint(true);
  };

  // Safe fallback for language fields
  const questionContent = currentQ.question[language] || currentQ.question.en;
  const optionsContent = currentQ.options[language] || currentQ.options.en;
  const explanationContent = currentQ.explanation[language] || currentQ.explanation.en;
  const hintContent = currentQ.hint[language] || currentQ.hint.en;
  const categoryContent = currentQ.category[language] || currentQ.category.en;

  const timerPercent = (timeLeft / levelConfig.timerSeconds) * 100;
  const timerColor =
    timeLeft <= 4
      ? 'text-rose-500 stroke-rose-500'
      : timeLeft <= 8
      ? 'text-amber-400 stroke-amber-400'
      : 'text-emerald-400 stroke-emerald-400';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col min-h-screen justify-between pb-6 animate-in fade-in duration-300">
      {/* Top Header Navigation & Status */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button
            id="btn-quiz-exit"
            onClick={() => {
              soundFx.playClick();
              if (window.confirm('Are you sure you want to exit the quiz? Current progress will be lost.')) {
                onExitQuiz();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Level / Mode indicator */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-800/90 text-slate-300 text-xs font-bold border border-slate-700/80">
            {levelConfig.id === 999 ? 'Daily Challenge' : `Level ${levelConfig.id}`}
          </div>

          {/* Streak Flame Badge */}
          {streak > 1 ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 font-extrabold text-xs animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>{streak}x Streak</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">
              Q {currentIdx + 1}/{questions.length}
            </div>
          )}

          {/* Current Score */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-sm">
            <span>⭐</span>
            <span>{score}</span>
          </div>
        </div>

        {/* Progress Bar & Timer Header */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Area */}
      <div className="my-auto py-2 space-y-4">
        {/* Category & Timer Pill */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{categoryContent}</span>
          </span>

          {/* Digital Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 font-black text-xs ${timerColor}`}>
            <Clock className="w-3.5 h-3.5 animate-spin duration-1000" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Question Text Box with smooth fade-in motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`question-card-${currentQ.id}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle gradient light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
              {questionContent}
            </h3>

            {/* Hint disclosure box if activated */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{UI_STRINGS.hint[language]}: </span>
                  <span>{hintContent}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 4 Options Grid with slide-out motion when answered */}
        <div className="flex flex-col gap-2.5 overflow-hidden py-1">
          {optionsContent.map((optionText, index) => {
            const isEliminated = eliminatedOptions.includes(index);
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQ.correctIndex;
            const isWrongSelection = selectedOption !== null && selectedOption !== -1 && selectedOption !== currentQ.correctIndex;

            // When selection is made:
            // The unselected wrong options slide out of view.
            // The selected option stays. If user chose incorrectly, the correct answer is also kept visible.
            // If timed out, the correct answer is kept visible.
            // Eliminated options from 50:50 power-up also slide out.
            const shouldSlideOut = isAnswered
              ? (!isSelected && !(isWrongSelection && isCorrect) && !(selectedOption === -1 && isCorrect))
              : isEliminated;

            let buttonStyle = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/80';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-rose-600/90 border-rose-400 text-white shadow-lg shadow-rose-600/30';
              } else {
                buttonStyle = 'bg-slate-800/40 border-slate-850 text-slate-500 opacity-60';
              }
            } else if (isEliminated) {
              buttonStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-600 line-through opacity-30 cursor-not-allowed';
            }

            const optionLetters = ['A', 'B', 'C', 'D'];

            return (
              <motion.button
                key={`option-${currentQ.id}-${index}`}
                id={`btn-quiz-option-${index}`}
                disabled={isAnswered || isEliminated}
                onClick={() => handleSelectOption(index)}
                initial={{ opacity: 0, y: 18, x: 0 }}
                animate={
                  shouldSlideOut
                    ? {
                        x: index % 2 === 0 ? -240 : 240,
                        opacity: 0,
                        scale: 0.9,
                        pointerEvents: 'none' as const,
                        height: 0,
                        marginTop: 0,
                        marginBottom: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderWidth: 0,
                        overflow: 'hidden',
                      }
                    : {
                        x: 0,
                        opacity: 1,
                        scale: isAnswered && isSelected ? 1.02 : 1,
                        pointerEvents: 'auto' as const,
                        height: 'auto',
                        overflow: 'visible',
                      }
                }
                whileHover={!isAnswered && !isEliminated ? { scale: 1.01 } : undefined}
                whileTap={!isAnswered && !isEliminated ? { scale: 0.98 } : undefined}
                transition={{
                  duration: shouldSlideOut ? 0.38 : 0.3,
                  delay: !isAnswered ? index * 0.06 : 0,
                  ease: [0.25, 1, 0.5, 1],
                  opacity: { duration: 0.25 },
                }}
                className={`w-full p-3.5 rounded-2xl border-2 text-left font-semibold text-sm flex items-center justify-between gap-3 shadow-md ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    isAnswered && isCorrect
                      ? 'bg-white text-emerald-700'
                      : isAnswered && isSelected && !isCorrect
                      ? 'bg-white text-rose-700'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {optionLetters[index]}
                  </span>
                  <span className="leading-snug">{optionText}</span>
                </div>

                {isAnswered && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-white" />
                    ) : null}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Answer Feedback / Explanation Sheet */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              key={`feedback-${currentQ.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="p-4 rounded-2xl bg-slate-800/95 border border-slate-700 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedOption === currentQ.correctIndex ? (
                    <span className="text-emerald-400 font-extrabold text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {UI_STRINGS.correct[language]}! {bonusEarned ? `(+${bonusEarned} pts)` : ''}
                    </span>
                  ) : (
                    <span className="text-rose-400 font-extrabold text-sm flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      {selectedOption === -1 ? 'Time Out!' : UI_STRINGS.wrong[language]}
                    </span>
                  )}
                </div>

                {/* Next Question Button */}
                <button
                  id="btn-quiz-next"
                  onClick={handleNext}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1 cursor-pointer transform active:scale-95"
                >
                  <span>{currentIdx + 1 < questions.length ? UI_STRINGS.next[language] : UI_STRINGS.finish[language]}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-700/60 pt-2">
                <span className="font-bold text-amber-300">💡 Did you know: </span>
                {explanationContent}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lifelines / Power-Ups Bar */}
      <div className="pt-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-1.5">
          {UI_STRINGS.lifelines[language]}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* 50:50 */}
          <button
            id="btn-powerup-5050"
            disabled={isAnswered || powerups.fiftyFifty <= 0 || eliminatedOptions.length > 0}
            onClick={handleFiftyFifty}
            className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
              powerups.fiftyFifty > 0 && !isAnswered && eliminatedOptions.length === 0
                ? 'bg-slate-800 hover:bg-slate-700 border-indigo-500/40 text-indigo-300 active:scale-95'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <span className="text-xs font-black">50:50</span>
            <span className="text-[10px] text-slate-400 mt-0.5">({powerups.fiftyFifty})</span>
          </button>

          {/* Extra Time */}
          <button
            id="btn-powerup-extratime"
            disabled={isAnswered || powerups.extraTime <= 0}
            onClick={handleExtraTime}
            className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
              powerups.extraTime > 0 && !isAnswered
                ? 'bg-slate-800 hover:bg-slate-700 border-emerald-500/40 text-emerald-300 active:scale-95'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center gap-1 text-xs font-bold">
              <Hourglass className="w-3 h-3 text-emerald-400" />
              <span>+15s</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">({powerups.extraTime})</span>
          </button>

          {/* Hint */}
          <button
            id="btn-powerup-hint"
            disabled={isAnswered || powerups.hint <= 0 || showHint}
            onClick={handleHint}
            className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
              powerups.hint > 0 && !isAnswered && !showHint
                ? 'bg-slate-800 hover:bg-slate-700 border-amber-500/40 text-amber-300 active:scale-95'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center gap-1 text-xs font-bold">
              <HelpCircle className="w-3 h-3 text-amber-400" />
              <span>{UI_STRINGS.hint[language]}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">({powerups.hint})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
