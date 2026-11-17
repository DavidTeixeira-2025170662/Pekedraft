import React from 'react';
import type { PokemonType } from '../../types/pokemon';

const TYPE_COLORS: Record<PokemonType, { bg: string; text: string; border: string }> = {
  normal: { bg: 'bg-stone-500/80', text: 'text-stone-100', border: 'border-stone-400' },
  fire: { bg: 'bg-orange-600/90', text: 'text-orange-50', border: 'border-orange-400' },
  water: { bg: 'bg-blue-600/90', text: 'text-blue-50', border: 'border-blue-400' },
  grass: { bg: 'bg-emerald-600/90', text: 'text-emerald-50', border: 'border-emerald-400' },
  electric: { bg: 'bg-amber-500/90', text: 'text-amber-950 font-bold', border: 'border-amber-300' },
  ice: { bg: 'bg-cyan-500/90', text: 'text-cyan-950 font-bold', border: 'border-cyan-300' },
  fighting: { bg: 'bg-red-700/90', text: 'text-red-50', border: 'border-red-500' },
  poison: { bg: 'bg-purple-700/90', text: 'text-purple-50', border: 'border-purple-400' },
  ground: { bg: 'bg-yellow-700/90', text: 'text-yellow-50', border: 'border-yellow-500' },
  flying: { bg: 'bg-indigo-500/90', text: 'text-indigo-50', border: 'border-indigo-300' },
  psychic: { bg: 'bg-pink-600/90', text: 'text-pink-50', border: 'border-pink-300' },
  bug: { bg: 'bg-lime-600/90', text: 'text-lime-50', border: 'border-lime-400' },
  rock: { bg: 'bg-amber-800/90', text: 'text-amber-50', border: 'border-amber-600' },
  ghost: { bg: 'bg-violet-800/90', text: 'text-violet-50', border: 'border-violet-500' },
  dragon: { bg: 'bg-indigo-800/90', text: 'text-indigo-50', border: 'border-indigo-400' },
  dark: { bg: 'bg-neutral-800/90', text: 'text-neutral-100', border: 'border-neutral-600' },
  steel: { bg: 'bg-slate-500/90', text: 'text-slate-100', border: 'border-slate-300' },
  fairy: { bg: 'bg-rose-400/90', text: 'text-rose-950 font-bold', border: 'border-rose-200' },
};

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'md' }) => {
  const styling = TYPE_COLORS[type] || TYPE_COLORS.normal;
  
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded',
    md: 'text-xs px-2.5 py-0.5 rounded-md font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1 rounded-lg font-bold tracking-wider',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center uppercase shadow-sm border ${styling.bg} ${styling.text} ${styling.border} ${sizeClasses}`}
    >
      {type}
    </span>
  );
};

