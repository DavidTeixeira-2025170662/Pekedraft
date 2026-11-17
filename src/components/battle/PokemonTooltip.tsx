import React from 'react';
import type { TeamMember } from '../../types/pokemon';
import { calculateEffectiveStats } from '../../store/useGameStore';
import { TypeBadge } from '../common/TypeBadge';
import { Shield } from 'lucide-react';

interface PokemonTooltipProps {
  member: TeamMember;
  isPlayer: boolean;
  children: React.ReactNode;
}

export const PokemonTooltip: React.FC<PokemonTooltipProps> = ({
  member,
  isPlayer,
  children,
}) => {
  const [visible, setVisible] = React.useState(false);
  const effStats = calculateEffectiveStats(member);
  const hpPercent = Math.max(0, Math.floor((member.currentHp / member.maxHp) * 100));

  const formatStage = (stage: number) => {
    if (stage > 0) return <span className="text-emerald-400 font-bold font-mono">+{stage}</span>;
    if (stage < 0) return <span className="text-rose-400 font-bold font-mono">{stage}</span>;
    return <span className="text-slate-500 font-mono">0</span>;
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-left text-xs pointer-events-none select-none animate-in fade-in duration-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{member.pokemon.name}</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1 rounded">Lv. 50</span>
              </div>
              <div className="flex gap-1 mt-1">
                {member.pokemon.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-300">
                {isPlayer ? `${member.currentHp}/${member.maxHp}` : `${hpPercent}%`}
              </span>
              <div className="w-16 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full ${
                    hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 20 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats Breakdown (Real-time IRT with modifiers) */}
          <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-800/80 mb-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Stats em Tempo Real</span>
              {isPlayer ? (
                <span className="text-emerald-400">Ativo / Efetivo</span>
              ) : (
                <span className="text-slate-500">Estágios Públicos</span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
              <div>
                <span className="text-slate-500 block">ATK</span>
                <span className="text-white font-bold">{isPlayer ? effStats.attack.effective : '---'}</span>
                <div className="text-[9px]">{formatStage(effStats.attack.stage)}</div>
              </div>
              <div>
                <span className="text-slate-500 block">DEF</span>
                <span className="text-white font-bold">{isPlayer ? effStats.defense.effective : '---'}</span>
                <div className="text-[9px]">{formatStage(effStats.defense.stage)}</div>
              </div>
              <div>
                <span className="text-slate-500 block">SPA</span>
                <span className="text-white font-bold">{isPlayer ? effStats.specialAttack.effective : '---'}</span>
                <div className="text-[9px]">{formatStage(effStats.specialAttack.stage)}</div>
              </div>
              <div>
                <span className="text-slate-500 block">SPD</span>
                <span className="text-white font-bold">{isPlayer ? effStats.specialDefense.effective : '---'}</span>
                <div className="text-[9px]">{formatStage(effStats.specialDefense.stage)}</div>
              </div>
              <div>
                <span className="text-slate-500 block">SPE</span>
                <span className="text-white font-bold">{isPlayer ? effStats.speed.effective : '---'}</span>
                <div className="text-[9px]">{formatStage(effStats.speed.stage)}</div>
              </div>
            </div>
          </div>

          {/* Ability & Held Item Info (With Fog of War on opponent!) */}
          <div className="space-y-1.5 mb-2 text-[11px]">
            {/* Ability */}
            <div className="flex items-start gap-1.5 bg-slate-950/40 p-1.5 rounded border border-slate-800/50">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-400 font-semibold block text-[10px]">Habilidade:</span>
                {isPlayer ? (
                  <span className="text-slate-200 font-medium">
                    {member.assignedAbility?.name || 'Nenhuma'}
                  </span>
                ) : member.revealedAbility ? (
                  <span className="text-amber-300 font-medium">
                    {member.assignedAbility?.name} <span className="text-[9px] text-slate-500">(Anunciada)</span>
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Desconhecida (Não anunciada)</span>
                )}
              </div>
            </div>

            {/* Item */}
            <div className="flex items-start gap-1.5 bg-slate-950/40 p-1.5 rounded border border-slate-800/50">
              <span className="text-xs shrink-0 mt-0.5">
                {isPlayer && member.assignedItem ? member.assignedItem.icon : member.revealedItem ? '🎒' : '❓'}
              </span>
              <div className="min-w-0">
                <span className="text-slate-400 font-semibold block text-[10px]">Held Item:</span>
                {isPlayer ? (
                  <span className="text-slate-200 font-medium">
                    {member.assignedItem?.name || 'Nenhum'}
                  </span>
                ) : member.revealedItem ? (
                  <span className="text-cyan-300 font-medium">
                    {member.assignedItem?.name} <span className="text-[9px] text-slate-500">(Visto em combate)</span>
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Desconhecido (Não visto)</span>
                )}
              </div>
            </div>
          </div>

          {/* Moves List (Only revealed moves for opponent!) */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {isPlayer ? 'Golpes Conhecidos' : 'Golpes Revelados'}
            </span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {member.moves.map((move, idx) => {
                const isRevealed = isPlayer || member.revealedMoveIds.includes(move.id);

                return (
                  <div
                    key={idx}
                    className="p-1 rounded bg-slate-950/60 border border-slate-800 truncate"
                  >
                    {isRevealed ? (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 truncate">{move.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono ml-1">{move.power || '--'}</span>
                      </div>
                    ) : (
                      <span className="text-slate-600 font-mono italic">???</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
