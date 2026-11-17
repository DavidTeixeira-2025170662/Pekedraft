import React from 'react';
import type { DraftPokemon, EvolutionStage } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { Sparkles, X, Check, Dna } from 'lucide-react';

interface EvolutionModalProps {
  draftPokemon: DraftPokemon;
  pokemonIndex: number;
  currentStageId: number;
  onSelectStage: (stage: EvolutionStage) => void;
  onClose: () => void;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({
  draftPokemon,
  currentStageId,
  onSelectStage,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Dna className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white m-0">
            Linha Evolutiva de {draftPokemon.speciesName.toUpperCase()}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Regra da Evolução Ativa: Escolhe qualquer fase da evolução para utilizar na tua equipa.
        </p>

        {/* Evolution Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {draftPokemon.evolutionStages.map((stage) => {
            const isSelected = stage.id === currentStageId;

            return (
              <div
                key={stage.id}
                onClick={() => {
                  onSelectStage(stage);
                  onClose();
                }}
                className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/50 border-purple-500 shadow-lg shadow-purple-900/30 ring-2 ring-purple-400/20'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                {/* Stage Badge */}
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
                    Estágio {stage.stageNumber}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-900/80 px-2 py-0.5 rounded-full border border-purple-600">
                      <Check className="w-3 h-3 text-purple-300" />
                      Ativo
                    </span>
                  )}
                </div>

                {/* Sprite */}
                <div className="w-24 h-24 flex items-center justify-center my-2 relative">
                  <img
                    src={stage.sprite}
                    alt={stage.name}
                    className="max-h-20 max-w-20 object-contain drop-shadow"
                  />
                  {stage.canMega && (
                    <span
                      title="Compatível com Mega Evolução"
                      className="absolute bottom-0 right-0 p-1 rounded-full bg-purple-600 text-white shadow-md border border-purple-400"
                    >
                      <Sparkles className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Name & Types */}
                <h3 className="text-base font-bold text-white mb-1.5">{stage.name}</h3>
                <div className="flex gap-1 mb-3">
                  {stage.types.map((type) => (
                    <TypeBadge key={type} type={type} size="sm" />
                  ))}
                </div>

                {/* Base Stats Preview */}
                <div className="w-full grid grid-cols-3 gap-1 text-[10px] bg-slate-900/80 p-2 rounded-lg border border-slate-700/60 text-slate-300">
                  <div className="text-center">
                    <span className="text-slate-500 block">HP</span>
                    <strong className="text-slate-200">{stage.stats.hp}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">ATK</span>
                    <strong className="text-amber-300">{stage.stats.attack}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">DEF</span>
                    <strong className="text-cyan-300">{stage.stats.defense}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">SPA</span>
                    <strong className="text-purple-300">{stage.stats.specialAttack}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">SPD</span>
                    <strong className="text-emerald-300">{stage.stats.specialDefense}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">SPE</span>
                    <strong className="text-rose-300">{stage.stats.speed}</strong>
                  </div>
                </div>

                {/* Select button */}
                <button
                  type="button"
                  className={`w-full mt-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {isSelected ? 'Selecionado' : 'Usar Este Estágio'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

