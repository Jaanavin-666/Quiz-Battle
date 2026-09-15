export interface AvatarItem {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
}

export const AVATARS: AvatarItem[] = [
  { id: 'tiger', name: 'Royal Tiger', emoji: '🐯', bgColor: 'bg-amber-500/20 text-amber-500', borderColor: 'border-amber-500' },
  { id: 'astronaut', name: 'Astro Explorer', emoji: '🧑‍🚀', bgColor: 'bg-sky-500/20 text-sky-400', borderColor: 'border-sky-500' },
  { id: 'owl', name: 'Scholar Owl', emoji: '🦉', bgColor: 'bg-indigo-500/20 text-indigo-400', borderColor: 'border-indigo-500' },
  { id: 'wizard', name: 'Knowledge Mage', emoji: '🧙‍♂️', bgColor: 'bg-purple-500/20 text-purple-400', borderColor: 'border-purple-500' },
  { id: 'ninja', name: 'Speed Ninja', emoji: '🥷', bgColor: 'bg-rose-500/20 text-rose-400', borderColor: 'border-rose-500' },
  { id: 'lion', name: 'Courageous Lion', emoji: '🦁', bgColor: 'bg-yellow-500/20 text-yellow-500', borderColor: 'border-yellow-500' },
  { id: 'robot', name: 'Cyber Brain', emoji: '🤖', bgColor: 'bg-cyan-500/20 text-cyan-400', borderColor: 'border-cyan-500' },
  { id: 'fox', name: 'Clever Fox', emoji: '🦊', bgColor: 'bg-orange-500/20 text-orange-400', borderColor: 'border-orange-500' },
  { id: 'scientist', name: 'Mad Genius', emoji: '👩‍🔬', bgColor: 'bg-emerald-500/20 text-emerald-400', borderColor: 'border-emerald-500' },
  { id: 'knight', name: 'Quiz Knight', emoji: '🛡️', bgColor: 'bg-blue-500/20 text-blue-400', borderColor: 'border-blue-500' },
];

export function getAvatarById(id: string): AvatarItem {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}
