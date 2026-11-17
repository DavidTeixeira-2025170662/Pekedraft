import React, { useState } from 'react';
import type { DraftPokemon, EvolutionStage, Move, TeamMember } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { EvolutionModal } from './EvolutionModal';
import { MoveSelectorModal } from './MoveSelectorModal';
import { Sparkles, Dna, Shield, X, Flame, Swords } from 'lucide-react';

interface PokemonCardProps {
  member: TeamMember;
  draftPokemon: DraftPokemon;
  index: number;
  onSelectStage: (pokemonIndex: number, stage: EvolutionStage) => void;
  onSaveMoves: (pokemonIndex: number, moves: Move[]) => void;
  onUnassignAbility: (pokemonIndex: number) => void;
  onUnassignItem: (pokemonIndex: number) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  member,
  draftPokemon,
  index,
  onSelectStage,
  onSaveMoves,
  onUnassignAbility,
  onUnassignItem,
}) => {
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const currentStage = member.pokemon;
  const hasMultipleStages = draftPokemon.evolutionStages.length > 1;

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-sm hover:border-slate-700 transition relative">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 w-full mb-1">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
            Slot {index + 1}
          </span>

          <div className="flex items-center gap-1">
            {currentStage.canMega && (
              <span
                title="Pode Mega Evoluir!"
                className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800"
              >
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                MEGA
              </span>
            )}

            {currentStage.canGmax && (
              <span
                title="Pode Gigantamax!"
                className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800"
              >
                <Flame className="w-2.5 h-2.5 text-rose-400" />
                G-MAX
              </span>
            )}
          </div>
        </div>

        {/* Pokémon Sprite & Main View */}
        <div
          onClick={() => hasMultipleStages && setShowEvolutionModal(true)}
          className={`flex flex-col items-center justify-center py-2 rounded-lg transition ${
            hasMultipleStages ? 'cursor-pointer hover:bg-slate-800/40' : 'cursor-default'
          }`}
          title={hasMultipleStages ? 'Clica para escolher estágio evolutivo' : ''}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
            <img
              src={currentStage.sprite}
              alt={currentStage.name}
              className="max-h-16 sm:max-h-20 max-w-16 sm:max-w-20 object-contain drop-shadow"
            />
          </div>

          <span className="text-sm font-bold text-white mt-1 mb-1 tracking-tight">
            {currentStage.name}
          </span>

          <div className="flex gap-1 mb-1">
            {currentStage.types.map((type) => (
              <TypeBadge key={type} type={type} size="sm" />
            ))}
          </div>

          {hasMultipleStages && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowEvolutionModal(true);
              }}
              className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium underline decoration-dotted mt-0.5"
            >
              <Dna className="w-3 h-3" />
              Evoluções ({draftPokemon.evolutionStages.length})
            </button>
          )}
        </div>

        {/* Moves Preview & Edit Trigger */}
        <div className="my-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Moveset (4)</span>
            <button
              onClick={() => setShowMoveModal(true)}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <Swords className="w-2.5 h-2.5" />
              Editar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            {member.moves.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 truncate text-slate-300"
                title={`${m.name} (${m.type} • Poder ${m.power || '--'})`}
              >
                {m.name}
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Ability & Item Slots */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-800/80">
          {/* Ability Slot */}
          <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Shield className="w-3 h-3 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-[9px] text-slate-500 block leading-none">Habilidade</span>
                {member.assignedAbility ? (
                  <span className="font-medium text-slate-200 text-[11px] truncate block">
                    {member.assignedAbility.name}
                  </span>
                ) : (
                  <span className="text-slate-500 italic text-[10px]">Nenhuma</span>
                )}
              </div>
            </div>

            {member.assignedAbility && (
              <button
                onClick={() => onUnassignAbility(index)}
                title="Remover habilidade"
                className="p-0.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Held Item Slot */}
          <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-xs shrink-0">
                {member.assignedItem ? member.assignedItem.icon : '🎒'}
              </span>
              <div className="truncate">
                <span className="text-[9px] text-slate-500 block leading-none">Held Item</span>
                {member.assignedItem ? (
                  <span className="font-medium text-slate-200 text-[11px] truncate block">
                    {member.assignedItem.name}
                  </span>
                ) : (
                  <span className="text-slate-500 italic text-[10px]">Nenhum</span>
                )}
              </div>
            </div>

            {member.assignedItem && (
              <button
                onClick={() => onUnassignItem(index)}
                title="Remover item"
                className="p-0.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Evolution Modal */}
      {showEvolutionModal && (
        <EvolutionModal
          draftPokemon={draftPokemon}
          pokemonIndex={index}
          currentStageId={currentStage.id}
          onSelectStage={(stage) => onSelectStage(index, stage)}
          onClose={() => setShowEvolutionModal(false)}
        />
      )}

      {/* Move Selector Modal */}
      {showMoveModal && (
        <MoveSelectorModal
          stage={currentStage}
          currentMoves={member.moves}
          pokemonIndex={index}
          onSaveMoves={(moves) => onSaveMoves(index, moves)}
          onClose={() => setShowMoveModal(false)}
        />
      )}
    </>
  );
};
