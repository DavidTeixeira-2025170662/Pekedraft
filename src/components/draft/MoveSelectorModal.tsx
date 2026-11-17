import React, { useState } from 'react';
import type { Move, EvolutionStage } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { X, Check, Swords } from 'lucide-react';

interface MoveSelectorModalProps {
  stage: EvolutionStage;
  currentMoves: Move[];
  pokemonIndex: number;
  onSaveMoves: (moves: Move[]) => void;
  onClose: () => void;
}

export const MoveSelectorModal: React.FC<MoveSelectorModalProps> = ({
  stage,
  currentMoves,
  onSaveMoves,
  onClose,
}) => {
  const [selectedMoveIds, setSelectedMoveIds] = useState<string[]>(
    currentMoves.map((m) => m.id)
  );

  const availableMoves = stage.learnset || [];

  const handleToggleMove = (move: Move) => {
    if (selectedMoveIds.includes(move.id)) {
      // Don't unselect if only 1 move left
      if (selectedMoveIds.length > 1) {
        setSelectedMoveIds(selectedMoveIds.filter((id) => id !== move.id));
      }
    } else {
      if (selectedMoveIds.length < 4) {
        setSelectedMoveIds([...selectedMoveIds, move.id]);
      } else {
        // Replace the last move if 4 are already selected
        setSelectedMoveIds([...selectedMoveIds.slice(1), move.id]);
      }
    }
  };

  const handleConfirm = () => {
    const finalMoves = availableMoves.filter((m) => selectedMoveIds.includes(m.id));
    if (finalMoves.length > 0) {
      onSaveMoves(finalMoves);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl p-5 relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white m-0">
                Moveset de {stage.name} (Estilo Pokémon Showdown)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolhe 4 golpes do learnset autêntico deste Pokémon para utilizar em combate.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected moves chips preview */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 mb-3 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Moveset Escolhido ({selectedMoveIds.length}/4)
            </span>
            <span className="text-[10px] text-indigo-400">
              {selectedMoveIds.length === 4 ? 'Pronto' : 'Seleciona 4 golpes'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {selectedMoveIds.map((id) => {
              const move = availableMoves.find((m) => m.id === id);
              if (!move) return null;

              return (
                <div
                  key={id}
                  onClick={() => handleToggleMove(move)}
                  className="bg-indigo-950/40 border border-indigo-500/50 p-2 rounded-lg flex items-center justify-between cursor-pointer hover:border-rose-400 group transition"
                  title="Clica para desmarcar"
                >
                  <div className="truncate mr-1">
                    <span className="text-xs font-bold text-white block truncate">{move.name}</span>
                    <span className="text-[9px] text-slate-400 capitalize">{move.type}</span>
                  </div>
                  <X className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400" />
                </div>
              );
            })}
          </div>
        </div>

        {/* All Available Learnset Moves List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableMoves.map((move) => {
              const isSelected = selectedMoveIds.includes(move.id);

              return (
                <div
                  key={move.id}
                  onClick={() => handleToggleMove(move)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-950/30 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-xs text-white">{move.name}</span>
                      <TypeBadge type={move.type} size="sm" />
                      <span className="text-[10px] text-slate-400 capitalize font-mono">
                        {move.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                      {move.description}
                    </p>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono flex gap-3">
                      <span>Poder: <strong className="text-slate-300">{move.power || '--'}</strong></span>
                      <span>Prec: <strong className="text-slate-300">{move.accuracy}%</strong></span>
                      <span>PP: <strong className="text-slate-300">{move.pp}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-800 pt-3 mt-3 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-950/50"
          >
            Confirmar Moveset ({selectedMoveIds.length}/4)
          </button>
        </div>
      </div>
    </div>
  );
};
