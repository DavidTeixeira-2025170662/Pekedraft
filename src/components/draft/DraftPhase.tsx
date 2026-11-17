import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PokemonCard } from './PokemonCard';
import { AbilitySelector } from './AbilitySelector';
import { ItemSelector } from './ItemSelector';
import { Sparkles, Dices, ArrowRight, ShieldCheck } from 'lucide-react';

export const DraftPhase: React.FC = () => {
  const {
    draftPool,
    playerTeam,
    availableAbilities,
    availableItems,
    chaosMechanic,
    selectPokemonStage,
    setPokemonMoves,
    assignAbilityToPokemon,
    unassignAbility,
    assignItemToPokemon,
    unassignItem,
    randomizeRemainingAssignments,
    completeDraftAndStartBattle,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'abilities' | 'items'>('abilities');

  const abilitiesAssignedCount = playerTeam.filter((m) => m.assignedAbility).length;
  const itemsAssignedCount = playerTeam.filter((m) => m.assignedItem).length;
  const isTeamReady = abilitiesAssignedCount === 6 && itemsAssignedCount === 6;

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-5 max-w-7xl mx-auto w-full gap-4">
      {/* Top Header Banner with Active Gimmick */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight m-0">
              FASE DE DRAFT: CONSTRUÇÃO DA EQUIPA
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              Gimmick: {chaosMechanic.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {chaosMechanic === 'Mega Evolution'
              ? 'Regra da Mega Ativa: Mega Stones disponíveis no inventário de itens. Decide se equipas a Mega Stone ou outro item!'
              : 'Configura os estágios evolutivos, movesets Showdown, habilidades e held items.'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={randomizeRemainingAssignments}
            title="Preenche aleatoriamente as habilidades e itens ainda livres"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Preencher Restantes</span>
          </button>

          <button
            onClick={completeDraftAndStartBattle}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow cursor-pointer ${
              isTeamReady
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <span>Batalhar (Showdown)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 Draft Pokemon Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider m-0">
              Os Teus 6 Pokémon
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Clica para trocar evolução ou editar moveset
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {playerTeam.map((member, idx) => (
            <PokemonCard
              key={member.id}
              member={member}
              draftPokemon={draftPool[idx]}
              index={idx}
              onSelectStage={selectPokemonStage}
              onSaveMoves={setPokemonMoves}
              onUnassignAbility={unassignAbility}
              onUnassignItem={unassignItem}
            />
          ))}
        </div>
      </div>

      {/* Tabs for Abilities and Held Items */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-2.5">
          <button
            onClick={() => setActiveTab('abilities')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
              activeTab === 'abilities'
                ? 'bg-amber-950/60 border-amber-600/70 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>Habilidades ({abilitiesAssignedCount}/6)</span>
            {abilitiesAssignedCount === 6 && <Sparkles className="w-3 h-3 text-amber-400" />}
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
              activeTab === 'items'
                ? 'bg-cyan-950/60 border-cyan-600/70 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>Held Items ({itemsAssignedCount}/6)</span>
            {itemsAssignedCount === 6 && <Sparkles className="w-3 h-3 text-cyan-400" />}
          </button>
        </div>

        <div className="flex-1">
          {activeTab === 'abilities' ? (
            <AbilitySelector
              abilities={availableAbilities}
              playerTeam={playerTeam}
              onAssignAbility={assignAbilityToPokemon}
            />
          ) : (
            <ItemSelector
              items={availableItems}
              playerTeam={playerTeam}
              onAssignItem={assignItemToPokemon}
            />
          )}
        </div>
      </div>
    </div>
  );
};
