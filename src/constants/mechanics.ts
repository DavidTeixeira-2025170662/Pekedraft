import type { ChaosMechanic } from '../types/pokemon';

export interface MechanicDefinition {
  type: ChaosMechanic;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  icon: string;
  badgeBg: string;
}

export const CHAOS_MECHANICS: Record<ChaosMechanic, MechanicDefinition> = {
  None: {
    type: 'None',
    title: 'Batalha Pura',
    subtitle: 'Sem interferência dimensional',
    description: 'Nenhuma mecânica especial ativa. Apenas tática pura, stats e estratégia de tipos.',
    color: '#94a3b8',
    gradient: 'from-slate-700 to-slate-900',
    icon: '⚔️',
    badgeBg: 'bg-slate-700 border-slate-500',
  },
  Terastalization: {
    type: 'Terastalization',
    title: 'Terastalização',
    subtitle: 'Cristal de Paldea Ativado',
    description: 'Cristaliza o Pokémon com o seu tipo secundário, concedendo STAB aumentado (+100% de dano nos movimentos desse tipo).',
    color: '#38bdf8',
    gradient: 'from-cyan-600 to-sky-900',
    icon: '💎',
    badgeBg: 'bg-sky-600 border-cyan-300',
  },
  'Z-Moves': {
    type: 'Z-Moves',
    title: 'Movimento Z',
    subtitle: 'Poder Máximo de Alola',
    description: 'Desbloqueia um ataque definitivo com 180 de poder base utilizável uma vez por batalha!',
    color: '#facc15',
    gradient: 'from-amber-500 to-yellow-800',
    icon: '⚡',
    badgeBg: 'bg-amber-500 border-yellow-200',
  },
  Gigantamax: {
    type: 'Gigantamax',
    title: 'Gigantamax',
    subtitle: 'Fenómeno Dynamax de Galar',
    description: 'O Pokémon cresce a uma dimensão titânica! O seu HP máximo duplica e os seus golpes tornam-se Max Moves com poder devastador.',
    color: '#ec4899',
    gradient: 'from-pink-600 to-rose-950',
    icon: '🌪️',
    badgeBg: 'bg-pink-600 border-pink-300',
  },
  'Mega Evolution': {
    type: 'Mega Evolution',
    title: 'Mega Evolução',
    subtitle: 'Vínculo Além dos Limites',
    description: 'Liberta o potencial supremo! Substitui automaticamente o item do Pokémon apto pela sua Mega Stone (+50% em Attack e Sp. Atk).',
    color: '#a855f7',
    gradient: 'from-purple-600 to-indigo-950',
    icon: '🧬',
    badgeBg: 'bg-purple-600 border-purple-300',
  },
};

export const ROULETTE_OPTIONS: ChaosMechanic[] = [
  'None',
  'Terastalization',
  'Z-Moves',
  'Gigantamax',
  'Mega Evolution',
];
