import type { ArenaEnvironment } from '../types/pokemon';

export interface EnvironmentConfig {
  id: ArenaEnvironment;
  name: string;
  subtitle: string;
  icon: string;
  bgStyle: string; // Tailwind background & atmosphere
  lightingColor: string;
}

export const ARENA_ENVIRONMENTS: Record<ArenaEnvironment, EnvironmentConfig> = {
  'city-day': {
    id: 'city-day',
    name: 'Cidade de Dia',
    subtitle: 'Metrópole Pokémon • Céu Aberto',
    icon: '🏙️',
    bgStyle: 'from-sky-900/60 via-slate-900/80 to-slate-950',
    lightingColor: 'rgba(56, 189, 248, 0.15)',
  },
  'city-night': {
    id: 'city-night',
    name: 'Cidade de Noite',
    subtitle: 'Neo-Saffron • Luzes Neon e Arranha-Céus',
    icon: '🌃',
    bgStyle: 'from-purple-950/70 via-indigo-950/80 to-slate-950',
    lightingColor: 'rgba(168, 85, 247, 0.2)',
  },
  sunset: {
    id: 'sunset',
    name: 'Pôr do Sol Místico',
    subtitle: 'Golden Hour • Céu Laranja e Púrpura',
    icon: '🌅',
    bgStyle: 'from-amber-950/60 via-rose-950/80 to-slate-950',
    lightingColor: 'rgba(251, 146, 60, 0.2)',
  },
  ocean: {
    id: 'ocean',
    name: 'Mar Aberto',
    subtitle: 'Oceano Profundo de Hoenn • Ondas e Salmoura',
    icon: '🌊',
    bgStyle: 'from-blue-950/70 via-cyan-950/80 to-slate-950',
    lightingColor: 'rgba(34, 211, 238, 0.18)',
  },
  meadow: {
    id: 'meadow',
    name: 'Campo Verdejante',
    subtitle: 'Planícies de Pallet • Brisa e Relva Alta',
    icon: '🌿',
    bgStyle: 'from-emerald-950/60 via-teal-950/80 to-slate-950',
    lightingColor: 'rgba(52, 211, 153, 0.15)',
  },
  beach: {
    id: 'beach',
    name: 'Praia Tropical',
    subtitle: 'Costas de Alola • Areia Branca e Mar Turquesa',
    icon: '🏖️',
    bgStyle: 'from-teal-950/60 via-yellow-950/60 to-slate-950',
    lightingColor: 'rgba(20, 184, 166, 0.2)',
  },
  'living-room': {
    id: 'living-room',
    name: 'Sala de Estar Gamer',
    subtitle: 'Lounge Confortável • LED RGB e Consolas',
    icon: '🛋️',
    bgStyle: 'from-slate-900 via-indigo-950/60 to-slate-950',
    lightingColor: 'rgba(99, 102, 241, 0.18)',
  },
  'pokemon-store': {
    id: 'pokemon-store',
    name: 'Loja Pokémon / PokéCenter',
    subtitle: 'Poké Mart Oficial • Estantes e Neon Vermelho',
    icon: '🏬',
    bgStyle: 'from-rose-950/60 via-slate-900/80 to-slate-950',
    lightingColor: 'rgba(244, 63, 94, 0.2)',
  },
};

