import React from 'react';
import type { AttackAnimationEvent, PokemonType } from '../../types/pokemon';
import { Flame, Droplets, Zap, Leaf, Snowflake, Skull, Swords, Sparkles, ShieldAlert } from 'lucide-react';

interface AttackAnimationOverlayProps {
  animEvent: AttackAnimationEvent | null;
  onAnimationEnd?: () => void;
}

export const AttackAnimationOverlay: React.FC<AttackAnimationOverlayProps> = ({ animEvent }) => {
  if (!animEvent) return null;

  const { moveType, damage, isCrit, effectiveness, isPlayerAttacker, isZMove, zMoveName } = animEvent;

  const renderEffectGraphic = (type: PokemonType) => {
    switch (type) {
      case 'fire':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-orange-500/30 blur-xl animate-pulse" />
            <Flame className="w-24 h-24 sm:w-32 sm:h-32 text-orange-400 drop-shadow-[0_0_35px_rgba(249,115,22,1)] animate-bounce" />
            <div className="absolute inset-0 border-2 border-amber-400/50 rounded-full animate-ping pointer-events-none" />
          </div>
        );
      case 'water':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-blue-500/30 blur-xl animate-pulse" />
            <Droplets className="w-24 h-24 sm:w-32 sm:h-32 text-cyan-400 drop-shadow-[0_0_35px_rgba(59,130,246,1)] animate-pulse" />
            <div className="absolute inset-0 border-2 border-cyan-400/60 rounded-full animate-ping pointer-events-none" />
          </div>
        );
      case 'electric':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-yellow-400/30 blur-xl animate-ping" />
            <Zap className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-300 drop-shadow-[0_0_35px_rgba(253,224,71,1)] animate-pulse" />
            <div className="absolute -inset-2 border-2 border-yellow-300 rounded-full animate-ping pointer-events-none" />
          </div>
        );
      case 'grass':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-emerald-500/30 blur-xl animate-pulse" />
            <Leaf className="w-24 h-24 sm:w-32 sm:h-32 text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,1)] animate-spin" />
            <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-full animate-ping pointer-events-none" />
          </div>
        );
      case 'ice':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-cyan-400/30 blur-xl animate-pulse" />
            <Snowflake className="w-24 h-24 sm:w-32 sm:h-32 text-cyan-200 drop-shadow-[0_0_35px_rgba(165,243,252,1)] animate-pulse" />
            <div className="absolute inset-0 border-2 border-cyan-200/60 rounded-full animate-ping pointer-events-none" />
          </div>
        );
      case 'ghost':
      case 'dark':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-purple-700/40 blur-xl animate-pulse" />
            <Skull className="w-24 h-24 sm:w-32 sm:h-32 text-purple-400 drop-shadow-[0_0_35px_rgba(192,132,252,1)] animate-pulse" />
            <div className="absolute inset-0 border-2 border-purple-400/40 rounded-full animate-ping pointer-events-none" />
          </div>
        );
      case 'dragon':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-36 h-36 rounded-full bg-indigo-600/40 blur-2xl animate-pulse" />
            <Swords className="w-24 h-24 sm:w-32 sm:h-32 text-indigo-300 drop-shadow-[0_0_35px_rgba(99,102,241,1)] animate-bounce" />
            <div className="absolute -inset-3 border-2 border-indigo-400/70 rounded-full animate-ping pointer-events-none" />
          </div>
        );
      case 'fairy':
      case 'psychic':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-pink-500/30 blur-xl animate-pulse" />
            <Sparkles className="w-24 h-24 sm:w-32 sm:h-32 text-pink-300 drop-shadow-[0_0_35px_rgba(244,114,182,1)] animate-bounce" />
            <div className="absolute inset-0 border-2 border-pink-400/60 rounded-full animate-ping pointer-events-none" />
          </div>
        );
      case 'fighting':
      case 'ground':
      case 'rock':
      case 'steel':
      default:
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-amber-600/30 blur-xl animate-pulse" />
            <Swords className="w-24 h-24 sm:w-32 sm:h-32 text-amber-300 drop-shadow-[0_0_35px_rgba(251,191,36,1)] animate-bounce" />
            <div className="absolute inset-0 border-2 border-amber-400/60 rounded-full animate-ping pointer-events-none" />
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* CINEMATIC FULL-SCREEN OVERLAY FOR Z-MOVE */}
      {isZMove && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px] flex flex-col items-center justify-center z-40 animate-in fade-in duration-200">
          {/* Radial light burst */}
          <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-amber-400/30 via-purple-600/40 to-pink-500/30 blur-3xl animate-pulse" />

          {/* Golden Z-Crystal Animation */}
          <div className="relative flex flex-col items-center justify-center animate-z-burst">
            <div className="relative p-6 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-purple-800 shadow-[0_0_60px_rgba(251,191,36,0.9)] border-4 border-amber-300">
              <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-white animate-spin drop-shadow" />
            </div>

            <div className="mt-4 flex flex-col items-center">
              <span className="text-[11px] font-black tracking-widest text-amber-300 uppercase bg-amber-950/90 px-3 py-1 rounded-full border border-amber-500 shadow-md">
                PODER Z MÁXIMO • 1x POR BATALHA
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 drop-shadow-[0_2px_12px_rgba(251,191,36,0.8)] mt-1 tracking-tight">
                {zMoveName || 'Z-MOVE'}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Target positioning based on who is attacking:
          If player is attacking -> defender is opponent (top right)
          If opponent is attacking -> defender is player (bottom left) */}
      <div
        className={`absolute transition-all duration-300 z-35 ${
          isPlayerAttacker
            ? 'top-12 right-12 sm:right-24'
            : 'bottom-16 left-12 sm:left-24'
        }`}
      >
        <div className="relative flex flex-col items-center justify-center">
          {renderEffectGraphic(moveType)}

          {/* Floating Damage & Combat Banner */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center whitespace-nowrap animate-damage-float z-40">
            {damage > 0 && (
              <span className="text-3xl sm:text-4xl font-black font-mono text-rose-400 drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)] tracking-tight">
                -{damage} HP
              </span>
            )}

            {isCrit && (
              <span className="text-xs font-black uppercase text-amber-200 bg-gradient-to-r from-amber-900 via-rose-900 to-amber-900 px-2.5 py-0.5 rounded-full border border-amber-400 shadow-lg mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                ACERTO CRÍTICO!
              </span>
            )}

            {effectiveness >= 2 && (
              <span className="text-xs font-black uppercase text-emerald-200 bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-400 shadow-lg mt-0.5 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-emerald-300" />
                SUPER EFETIVO!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
