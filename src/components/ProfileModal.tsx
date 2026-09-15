import React, { useState } from 'react';
import { ArrowLeft, Check, User } from 'lucide-react';
import { PlayerProfile, SupportedLanguage } from '../types';
import { AVATARS, getAvatarById } from '../data/avatars';
import { UI_STRINGS } from '../data/translations';
import { soundFx } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  isInitialSetup?: boolean;
  currentProfile: PlayerProfile;
  language: SupportedLanguage;
  onSave: (updated: PlayerProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  isInitialSetup = false,
  currentProfile,
  language,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [age, setAge] = useState(currentProfile.age || 18);
  const [selectedAvatarId, setSelectedAvatarId] = useState(currentProfile.avatarId || 'tiger');

  if (!isOpen) return null;

  const currentAvatar = getAvatarById(selectedAvatarId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPowerUp();
    onSave({
      ...currentProfile,
      name: name.trim() || 'Quiz Adventurer',
      age: Math.max(5, Math.min(120, Number(age) || 18)),
      avatarId: selectedAvatarId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl leading-tight">
                {isInitialSetup ? 'Create Profile' : 'Edit Profile'}
              </h2>
              <p className="text-xs text-indigo-200">
                {isInitialSetup ? 'Choose your hero persona' : 'Customize your adventure avatar'}
              </p>
            </div>
          </div>
          {!isInitialSetup && (
            <button
              id="btn-close-profile"
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Avatar Preview & Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {UI_STRINGS.choose_avatar[language]}
            </label>
            <div className="flex items-center gap-3 mb-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 ${currentAvatar.borderColor} ${currentAvatar.bgColor}`}>
                {currentAvatar.emoji}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-200">{currentAvatar.name}</p>
                <p className="text-xs text-slate-400">Hero Avatar for Level Map</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1 scrollbar-thin">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedAvatarId(av.id);
                  }}
                  className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-center text-2xl transition-all ${
                    selectedAvatarId === av.id
                      ? `ring-2 ring-offset-2 ring-offset-slate-900 ring-rose-500 scale-105 ${av.bgColor}`
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title={av.name}
                >
                  <span>{av.emoji}</span>
                  {selectedAvatarId === av.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {UI_STRINGS.player_name[language]}
            </label>
            <input
              id="input-player-name"
              type="text"
              value={name}
              maxLength={24}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anand, Priya, Vikram..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Age Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {UI_STRINGS.player_age[language]}
            </label>
            <input
              id="input-player-age"
              type="number"
              min={5}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Save Button */}
          <button
            id="btn-save-profile"
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-base shadow-lg shadow-rose-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{UI_STRINGS.save[language]}</span>
            <span>➔</span>
          </button>
        </form>
      </div>
    </div>
  );
};
