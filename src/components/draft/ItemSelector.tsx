import React from 'react';
import type { HeldItem, TeamMember } from '../../types/pokemon';
import { Package, Check } from 'lucide-react';

interface ItemSelectorProps {
  items: HeldItem[];
  playerTeam: TeamMember[];
  onAssignItem: (pokemonIndex: number, item: HeldItem) => void;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({
  items,
  playerTeam,
  onAssignItem,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">
            Held Items Competitivos ({items.length})
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {playerTeam.filter((m) => m.assignedItem).length} / 6 atribuídos
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mb-3">
        Gera 12 itens competitivos. Atribui 6 deles aos teus Pokémon:
      </p>

      {/* Grid of 12 items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[360px] pr-1">
        {items.map((item) => {
          // Find which pokemon has this item assigned
          const assignedMemberIndex = playerTeam.findIndex(
            (m) => m.assignedItem?.id === item.id
          );
          const isAssigned = assignedMemberIndex !== -1;
          const assignedMember = isAssigned ? playerTeam[assignedMemberIndex] : null;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isAssigned
                  ? 'bg-cyan-950/20 border-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-100">{item.name}</span>
                  </div>
                  {isAssigned && (
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-900/60 px-2 py-0.5 rounded-full flex items-center gap-1 border border-cyan-700/60">
                      <Check className="w-3 h-3" />
                      {assignedMember?.pokemon.name}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {item.description}
                </p>
              </div>

              {/* Assignment controls */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">Atribuir a:</span>
                <div className="flex items-center gap-1">
                  {playerTeam.map((member, idx) => (
                    <button
                      key={member.id}
                      onClick={() => onAssignItem(idx, item)}
                      title={`Atribuir a ${member.pokemon.name}`}
                      className={`w-6 h-6 rounded-md text-[10px] font-bold transition flex items-center justify-center ${
                        member.assignedItem?.id === item.id
                          ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

