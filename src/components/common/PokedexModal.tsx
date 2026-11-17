import React, { useState } from 'react';
import { getStoredPokedex } from '../../lib/pokedexStore';
import { GENERAL_SPECIES_POOL } from '../../api/pokeapi';
import { TypeBadge } from './TypeBadge';
import { playShinySparkleSound, playClickSound } from '../../lib/audio';
import { X, BookOpen, Sparkles, CheckCircle2, Search } from 'lucide-react';

interface PokedexModalProps {
  onClose: () => void;
}

export const PokedexModal: React.FC<PokedexModalProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<'all' | 'drafted' | 'shiny'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingSpecies, setInspectingSpecies] = useState<string | null>(null);
  const stored = getStoredPokedex();

  const allSpecies = Array.from(new Set(GENERAL_SPECIES_POOL));
  const draftedSpeciesCount = Object.keys(stored).length;
  const shinyCount = Object.values(stored).filter((p) => p.hasSeenShiny).length;

  const filteredSpecies = allSpecies.filter((species) => {
    const record = stored[species.toLowerCase()];
    if (searchQuery.trim() && !species.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter === 'drafted') return Boolean(record && record.timesDrafted > 0);
    if (filter === 'shiny') return Boolean(record && record.hasSeenShiny);
    return true;
  });

  const handleCardClick = (species: string) => {
    const record = stored[species.toLowerCase()];
    if (record?.hasSeenShiny) {
      playShinySparkleSound();
    } else {
      playClickSound();
    }
    setInspectingSpecies(inspectingSpecies === species ? null : species);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl p-5 relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white m-0 leading-tight">
                Pokédex Nacional de Draft
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Registo de todos os Pokémon já convocados para a tua equipa e shinies descobertos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                Registados: <strong className="text-emerald-400">{draftedSpeciesCount}</strong> / {allSpecies.length}
              </span>
              <span className="bg-amber-950/60 px-2.5 py-1 rounded border border-amber-700/60 text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Shinies: <strong>{shinyCount}</strong>
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3 shrink-0">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition border cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-800 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({allSpecies.length})
            </button>
            <button
              onClick={() => setFilter('drafted')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition border cursor-pointer ${
                filter === 'drafted'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Na Equipa ({draftedSpeciesCount})
            </button>
            <button
              onClick={() => setFilter('shiny')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition border flex items-center gap-1 cursor-pointer ${
                filter === 'shiny'
                  ? 'bg-amber-950 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Shinies ({shinyCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Grid of Pokemon */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 min-h-0">
          {filteredSpecies.map((species) => {
            const record = stored[species.toLowerCase()];
            const isDrafted = Boolean(record && record.timesDrafted > 0);
            const isShinyFound = Boolean(record && record.hasSeenShiny);
            const isSelected = inspectingSpecies === species;

            const displayName = species.charAt(0).toUpperCase() + species.slice(1);
            const spriteUrl = isShinyFound && record?.shinySprite
              ? record.shinySprite
              : record?.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species}.png`;

            return (
              <div
                key={species}
                onClick={() => handleCardClick(species)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                  isDrafted
                    ? isShinyFound
                      ? 'bg-gradient-to-b from-amber-950/30 to-slate-950 border-amber-500/70 shadow-sm hover:scale-102 ring-1 ring-amber-400/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:scale-102'
                    : 'bg-slate-950/30 border-slate-900 opacity-40 grayscale hover:opacity-70'
                } ${isSelected ? 'ring-2 ring-indigo-400 scale-105' : ''}`}
              >
                {/* Shiny Badge */}
                <div className="w-full flex items-center justify-between mb-1">
                  {isShinyFound ? (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-950 border border-amber-700 px-1 rounded flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      SHINY
                    </span>
                  ) : <span />}

                  {isDrafted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>

                {/* Sprite */}
                <div className="w-16 h-16 flex items-center justify-center my-1">
                  <img
                    src={spriteUrl}
                    alt={displayName}
                    className="max-h-16 max-w-16 object-contain drop-shadow transition-transform hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Name */}
                <span className="text-xs font-bold text-white truncate max-w-full block">
                  {displayName}
                </span>

                {/* Types */}
                {record?.types && (
                  <div className="flex gap-1 mt-1 justify-center">
                    {record.types.map((t) => (
                      <TypeBadge key={t} type={t} size="sm" />
                    ))}
                  </div>
                )}

                {/* Draft count info */}
                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  {isDrafted ? `${record.timesDrafted}x na equipa` : 'Não obtido'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

