import React from 'react';
import { Volume2, VolumeX, Settings, Star, Coins, Globe } from 'lucide-react';
import { PlayerProfile, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, UI_STRINGS } from '../data/translations';
import { getAvatarById } from '../data/avatars';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  profile: PlayerProfile;
  totalStars: number;
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  totalStars,
  coins,
  soundEnabled,
  onToggleSound,
  currentLanguage,
  onChangeLanguage,
  onOpenProfile,
  onOpenSettings,
  onGoHome,
}) => {
  const avatar = getAvatarById(profile.avatarId);
  const [showLangMenu, setShowLangMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <button
          id="btn-nav-home"
          onClick={() => {
            soundFx.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">⚔️</span>
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent leading-none">
              {UI_STRINGS.app_name[currentLanguage] || 'Quiz Battle'}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">
              {UI_STRINGS.tagline[currentLanguage] || 'GK Adventure'}
            </p>
          </div>
        </button>

        {/* Player Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Stars Pill */}
          <div 
            title="Total Stars"
            className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-400 font-bold text-xs sm:text-sm"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{totalStars}</span>
          </div>

          {/* Coins Pill */}
          <div 
            title="Adventure Coins"
            className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1 rounded-full text-yellow-300 font-bold text-xs sm:text-sm hidden xs:flex"
          >
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{coins}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-nav-language"
              onClick={() => {
                soundFx.playClick();
                setShowLangMenu(!showLangMenu);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold transition-colors"
              title="Change Quiz Language"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span className="uppercase text-[11px] font-extrabold text-sky-300">{currentLanguage}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 p-2.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 mb-1">
                  <div className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider">
                    Quiz Language
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Questions & answers language
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        soundFx.playClick();
                        onChangeLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'text-slate-300 hover:bg-slate-700/70'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      {currentLanguage === lang.code && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-nav-sound"
            onClick={() => {
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Profile Trigger */}
          <button
            id="btn-nav-profile"
            onClick={() => {
              soundFx.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 p-1 sm:px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-all hover:scale-105"
            title="Player Profile"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${avatar.bgColor}`}>
              {avatar.emoji}
            </div>
            <span className="font-bold text-xs text-slate-200 hidden md:inline max-w-[80px] truncate">
              {profile.name}
            </span>
          </button>

          {/* Settings Trigger */}
          <button
            id="btn-nav-settings"
            onClick={() => {
              soundFx.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-slate-400 hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
