import React from 'react';
import type { TeamMember, ChaosMechanic, PokemonType } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { RefreshCw, Sparkles, Swords, Zap, Shield, Flame, Lock, RotateCcw } from 'lucide-react';

interface BattleControlsProps {
  activeMember: TeamMember;
  playerTeam: TeamMember[];
  chaosMechanic: ChaosMechanic;
  playerMechanicUsed: boolean;
  playerZMoveUsed?: boolean;
  isProcessingTurn: boolean;
  onExecuteMove: (moveIndex: number) => void;
  onOpenSwitch: () => void;
  onActivateMechanic: () => void;
}

const TYPE_BUTTON_BG: Record<PokemonType, string> = {
  normal: 'hover:border-stone-400 bg-stone-900/90 border-stone-800',
  fire: 'hover:border-orange-500 bg-gradient-to-br from-orange-950/60 to-slate-900/90 border-orange-900/60 shadow-[0_4px_12px_rgba(249,115,22,0.1)]',
  water: 'hover:border-blue-500 bg-gradient-to-br from-blue-950/60 to-slate-900/90 border-blue-900/60 shadow-[0_4px_12px_rgba(59,130,246,0.1)]',
  grass: 'hover:border-emerald-500 bg-gradient-to-br from-emerald-950/60 to-slate-900/90 border-emerald-900/60 shadow-[0_4px_12px_rgba(16,185,129,0.1)]',
  electric: 'hover:border-amber-400 bg-gradient-to-br from-amber-950/60 to-slate-900/90 border-amber-900/60 shadow-[0_4px_12px_rgba(245,158,11,0.1)]',
  ice: 'hover:border-cyan-400 bg-gradient-to-br from-cyan-950/60 to-slate-900/90 border-cyan-900/60 shadow-[0_4px_12px_rgba(6,182,212,0.1)]',
  fighting: 'hover:border-red-500 bg-gradient-to-br from-red-950/60 to-slate-900/90 border-red-900/60 shadow-[0_4px_12px_rgba(239,68,68,0.1)]',
  poison: 'hover:border-purple-500 bg-gradient-to-br from-purple-950/60 to-slate-900/90 border-purple-900/60 shadow-[0_4px_12px_rgba(168,85,247,0.1)]',
  ground: 'hover:border-yellow-600 bg-gradient-to-br from-yellow-950/60 to-slate-900/90 border-yellow-900/60 shadow-[0_4px_12px_rgba(202,138,4,0.1)]',
  flying: 'hover:border-indigo-400 bg-gradient-to-br from-indigo-950/60 to-slate-900/90 border-indigo-900/60 shadow-[0_4px_12px_rgba(99,102,241,0.1)]',
  psychic: 'hover:border-pink-500 bg-gradient-to-br from-pink-950/60 to-slate-900/90 border-pink-900/60 shadow-[0_4px_12px_rgba(236,72,153,0.1)]',
  bug: 'hover:border-lime-500 bg-gradient-to-br from-lime-950/60 to-slate-900/90 border-lime-900/60 shadow-[0_4px_12px_rgba(132,204,22,0.1)]',
  rock: 'hover:border-amber-600 bg-gradient-to-br from-amber-950/60 to-slate-900/90 border-amber-900/60 shadow-[0_4px_12px_rgba(217,119,6,0.1)]',
  ghost: 'hover:border-violet-500 bg-gradient-to-br from-violet-950/60 to-slate-900/90 border-violet-900/60 shadow-[0_4px_12px_rgba(139,92,246,0.1)]',
  dragon: 'hover:border-indigo-500 bg-gradient-to-br from-indigo-950/60 to-slate-900/90 border-indigo-900/60 shadow-[0_4px_12px_rgba(79,70,229,0.1)]',
  dark: 'hover:border-neutral-500 bg-neutral-950/80 border-neutral-800 shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
  steel: 'hover:border-slate-400 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700 shadow-[0_4px_12px_rgba(148,163,184,0.1)]',
  fairy: 'hover:border-rose-400 bg-gradient-to-br from-rose-950/60 to-slate-900/90 border-rose-900/60 shadow-[0_4px_12px_rgba(244,63,94,0.1)]',
};

const CATEGORY_LABEL = {
  physical: { label: 'Físico', icon: '💥', color: 'text-amber-400' },
  special: { label: 'Especial', icon: '🔮', color: 'text-cyan-400' },
  status: { label: 'Estado', icon: '🛡️', color: 'text-emerald-400' },
};

export const BattleControls: React.FC<BattleControlsProps> = ({
  activeMember,
  playerTeam,
  chaosMechanic,
  playerMechanicUsed,
  playerZMoveUsed = false,
  isProcessingTurn,
  onExecuteMove,
  onOpenSwitch,
  onActivateMechanic,
}) => {
  const aliveTeammates = playerTeam.filter((m) => m.currentHp > 0).length;
  const isZMoveLoaded = activeMember.moves.some((m) => m.id.startsWith('z-'));

  // Determine if Chaos Mechanic can be activated on the current active pokemon
  const canActivateMechanic = (() => {
    if (isProcessingTurn) return false;
    if (chaosMechanic === 'None') return false;

    if (chaosMechanic === 'Z-Moves') {
      // Strictly 1 time per battle!
      if (playerZMoveUsed || isZMoveLoaded) return false;
      return true;
    }

    if (playerMechanicUsed) return false;

    if (chaosMechanic === 'Mega Evolution') {
      return (
        activeMember.pokemon.canMega &&
        activeMember.assignedItem?.category === 'megastone'
      );
    }

    return true; // Gigantamax, Terastalization can be activated
  })();

  const getMechanicButtonLabel = () => {
    if (chaosMechanic === 'Z-Moves') {
      if (playerZMoveUsed) return 'Z-Move Esgotado (1/1)';
      if (isZMoveLoaded) return 'Z-Move Pronto no Slot 1!';
      return 'Ativar Poder Z (1x por Batalha)';
    }

    if (playerMechanicUsed) return 'Mecânica Ativada';
    switch (chaosMechanic) {
      case 'Mega Evolution':
        return 'MEGA EVOLUÇÃO';
      case 'Gigantamax':
        return 'GIGANTAMAX';
      case 'Terastalization':
        return 'TERASTALIZAR';
      case 'None':
      default:
        return 'Sem Mecânica';
    }
  };

  const getMechanicIcon = () => {
    switch (chaosMechanic) {
      case 'Mega Evolution':
        return <Sparkles className="w-4 h-4 text-purple-300 animate-spin" />;
      case 'Gigantamax':
        return <Flame className="w-4 h-4 text-pink-300 animate-pulse" />;
      case 'Terastalization':
        return <Zap className="w-4 h-4 text-cyan-300 animate-bounce" />;
      case 'Z-Moves':
        return playerZMoveUsed ? (
          <Lock className="w-4 h-4 text-slate-500" />
        ) : (
          <Swords className="w-4 h-4 text-amber-300 animate-pulse" />
        );
      default:
        return <Shield className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 p-3 sm:p-4 flex flex-col gap-3 rounded-b-2xl shadow-2xl">
      {/* 4 Moves Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {activeMember.moves.slice(0, 4).map((move, idx) => {
          const isZMove = move.id.startsWith('z-');
          const isChoiceLocked = Boolean(activeMember.lockedMoveId && activeMember.lockedMoveId !== move.id);
          const isChoiceSelected = Boolean(activeMember.lockedMoveId && activeMember.lockedMoveId === move.id);
          const isMultiTurnLocked = Boolean(activeMember.multiTurnMoveId && activeMember.multiTurnMoveId !== move.id);
          const isMultiTurnActive = Boolean(activeMember.multiTurnMoveId && activeMember.multiTurnMoveId === move.id);
          const isLocked = isChoiceLocked || isMultiTurnLocked;

          const btnTheme = isZMove
            ? 'bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-amber-950/80 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
            : TYPE_BUTTON_BG[move.type] || 'bg-slate-900 border-slate-700';

          const cat = CATEGORY_LABEL[move.category] || CATEGORY_LABEL.physical;

          return (
            <button
              key={`${move.id}_${idx}`}
              disabled={isProcessingTurn || activeMember.currentHp <= 0 || isLocked}
              onClick={() => onExecuteMove(idx)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 active:scale-98 cursor-pointer disabled:cursor-not-allowed flex items-center justify-between group shadow-lg relative overflow-hidden ${btnTheme} ${
                isLocked ? 'opacity-30 grayscale border-dashed' : 'hover:-translate-y-0.5'
              }`}
            >
              {/* Highlight bar for Z-Move */}
              {isZMove && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 animate-pulse" />
              )}

              <div className="min-w-0 pr-2 flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className={`font-black text-xs sm:text-sm truncate transition ${
                    isZMove ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-white group-hover:text-amber-300'
                  }`}>
                    {move.name}
                  </span>
                  <TypeBadge type={move.type} size="sm" />

                  {isZMove && (
                    <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-950/90 border border-amber-500/80 px-1.5 py-0.2 rounded shadow">
                      ★ 1x Z-MOVE
                    </span>
                  )}
                  {isChoiceSelected && (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-600 px-1 py-0.2 rounded flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Choice Lock
                    </span>
                  )}
                  {isMultiTurnActive && (
                    <span className="text-[9px] font-bold text-purple-300 bg-purple-950/80 border border-purple-600 px-1 py-0.2 rounded flex items-center gap-0.5">
                      <RotateCcw className="w-2.5 h-2.5 animate-spin" /> Fúria ({activeMember.multiTurnCount || 1}/{activeMember.maxMultiTurns || 3})
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[9px] font-bold text-rose-300 bg-rose-950/80 border border-rose-800 px-1 py-0.2 rounded flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Bloqueado
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-300">
                  <span className="flex items-center gap-0.5" title={cat.label}>
                    <span>{cat.icon}</span>
                    <span className={cat.color}>{cat.label}</span>
                  </span>
                  <span>•</span>
                  <span>
                    Poder: <strong className="text-white font-mono">{move.power}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Prec: <strong className="text-white font-mono">{move.accuracy}%</strong>
                  </span>
                </div>
              </div>

              <div className="text-[10px] sm:text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-700/80 shrink-0 shadow-inner">
                PP {move.pp}/{move.maxPp}
              </div>
            </button>
          );
        })}
      </div>

      {/* Auxiliary Action Bar: Switch Button + Glowing Chaos Mechanic Button */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Switch Button */}
        <button
          disabled={isProcessingTurn || aliveTeammates <= 1}
          onClick={onOpenSwitch}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md hover:border-indigo-400"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          <span>Trocar Pokémon ({aliveTeammates}/6)</span>
        </button>

        {/* Chaos Mechanic Button */}
        <button
          disabled={!canActivateMechanic || isProcessingTurn}
          onClick={onActivateMechanic}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95 cursor-pointer disabled:cursor-not-allowed ${
            canActivateMechanic
              ? 'bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500 text-white animate-pulse-glow border border-amber-300 ring-2 ring-amber-400/50 hover:brightness-110 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
              : 'bg-slate-900/80 border border-slate-800 text-slate-500 opacity-60'
          }`}
        >
          {getMechanicIcon()}
          <span>{getMechanicButtonLabel()}</span>
        </button>
      </div>
    </div>
  );
};
