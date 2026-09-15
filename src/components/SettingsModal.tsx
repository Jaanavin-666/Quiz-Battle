import React from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Smartphone,
  Moon,
  Sun,
  Globe,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { GameSettings, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, UI_STRINGS } from '../data/translations';
import { soundFx } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  language: SupportedLanguage;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  language,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleReset = () => {
    soundFx.playWrong();
    if (
      window.confirm(
        '⚠️ Are you sure you want to reset all game data, unlocked levels, stars, and achievements? This cannot be undone!'
      )
    ) {
      onResetProgress();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <h2 className="font-extrabold text-lg sm:text-xl">
              Settings
            </h2>
          </div>

          <button
            id="btn-close-settings"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <div className="font-bold text-sm text-slate-200">
                  {UI_STRINGS.sound_effects[language]}
                </div>
                <div className="text-[11px] text-slate-400">Chimes, bells, and fanfare</div>
              </div>
            </div>

            <button
              id="btn-toggle-sound-switch"
              onClick={() => {
                const next = !settings.soundEnabled;
                onUpdateSettings({ soundEnabled: next });
                soundFx.setEnabled(next);
                if (next) soundFx.playClick();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="font-bold text-sm text-slate-200">
                    Quiz Language
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Language for quiz questions & answers
                  </div>
                </div>
              </div>
              <span className="text-xs uppercase font-extrabold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10">
                {language}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    soundFx.playClick();
                    onUpdateSettings({ language: lang.code });
                  }}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    settings.language === lang.code
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                  {settings.language === lang.code && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Reset All Progress Button */}
          <div className="pt-2">
            <button
              id="btn-reset-all-data"
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Adventure Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
