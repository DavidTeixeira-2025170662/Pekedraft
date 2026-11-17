import React from 'react';
import type { TeamMember } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { X, RefreshCw, Skull } from 'lucide-react';

interface SwitchModalProps {
  playerTeam: TeamMember[];
  activePokemonIndex: number;
  onSwitchPokemon: (index: number) => void;
  onClose: () => void;
}

export const SwitchModal: React.FC<SwitchModalProps> = ({
  playerTeam,
  activePokemonIndex,
  onSwitchPokemon,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white m-0">
              {playerTeam[activePokemonIndex]?.currentHp <= 0
                ? 'Escolhe o teu próximo Pokémon!'
                : playerTeam[activePokemonIndex]?.mustSwitch
                ? 'Troca Obrigatória (Ataque Pivot)!'
                : 'Trocar Pokémon em Campo'}
            </h3>
          </div>
          {playerTeam[activePokemonIndex]?.currentHp > 0 && !playerTeam[activePokemonIndex]?.mustSwitch && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 6 Pokemon selection list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
          {playerTeam.map((member, idx) => {
            const isActive = idx === activePokemonIndex;
            const isFainted = member.currentHp <= 0;
            const hpPercent = Math.max(0, Math.floor((member.currentHp / member.maxHp) * 100));

            return (
              <button
                key={member.id}
                disabled={isActive || isFainted}
                onClick={() => {
                  onSwitchPokemon(idx);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 relative cursor-pointer disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-400/20'
                    : isFainted
                    ? 'bg-slate-950/40 border-slate-900 opacity-40 grayscale'
                    : 'bg-slate-800/70 border-slate-700 hover:border-indigo-400 hover:bg-slate-800'
                }`}
              >
                {/* Sprite */}
                <div className="w-14 h-14 bg-slate-900/90 rounded-lg border border-slate-700 flex items-center justify-center shrink-0 relative">
                  <img
                    src={member.pokemon.sprite}
                    alt={member.pokemon.name}
                    className="max-h-12 max-w-12 object-contain drop-shadow"
                  />
                  {isFainted && (
                    <div className="absolute inset-0 bg-slate-950/70 rounded-lg flex items-center justify-center">
                      <Skull className="w-5 h-5 text-rose-500" />
                    </div>
                  )}
                </div>

                {/* Details & HP Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-white truncate">
                      {member.pokemon.name}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-indigo-300 bg-indigo-900/80 px-1.5 py-0.2 rounded border border-indigo-700">
                        EM CAMPO
                      </span>
                    )}
                  </div>

                  {/* Types */}
                  <div className="flex gap-1 mb-1.5">
                    {member.pokemon.types.map((t) => (
                      <TypeBadge key={t} type={t} size="sm" />
                    ))}
                  </div>

                  {/* HP Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-300 ${
                        hpPercent > 50
                          ? 'bg-emerald-500'
                          : hpPercent > 20
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>HP: {member.currentHp}/{member.maxHp}</span>
                    <span>{hpPercent}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
