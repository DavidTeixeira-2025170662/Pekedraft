export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export type StatName = 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed';

export interface Move {
  id: string;
  name: string;
  type: PokemonType;
  category: 'physical' | 'special' | 'status';
  power: number;
  accuracy: number;
  pp: number;
  maxPp: number;
  priority?: number;
  statChanges?: {
    target: 'self' | 'opponent';
    stages: Partial<Record<StatName, number>>;
  };
  healPercent?: number;
  recoilPercent?: number;
  // Multi-turn moves (Outrage, Thrash, Petal Dance)
  isMultiTurn?: boolean;
  minTurns?: number;
  maxTurns?: number;
  // Pivot moves (Volt Switch, U-turn, etc.)
  isPivot?: boolean;
  // Self-confusion after multi-turn
  causesConfusion?: boolean;
  description: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  effect: 'attack_boost' | 'speed_boost' | 'defense_boost' | 'healing' | 'chaos' | 'intimidate' | 'weather' | 'stat_drop';
  announcesOnEntry?: boolean;
}

export type ItemEffectTrigger =
  | 'turn_end'
  | 'hp_threshold_50'
  | 'hp_threshold_25'
  | 'lethal_damage'
  | 'super_effective_hit'
  | 'physical_contact'
  | 'attack_boost'
  | 'speed_boost'
  | 'passive';

export interface HeldItem {
  id: string;
  name: string;
  description: string;
  category: 'competitive' | 'megastone' | 'berry';
  icon: string;
  targetPokemon?: string;
  revealsOnUse?: boolean;
  trigger?: ItemEffectTrigger;
  consumedOnUse?: boolean; // Berries, Focus Sash, Weakness Policy are consumed
}

export interface EvolutionStage {
  id: number;
  name: string;
  speciesName: string;
  stageNumber: number; // 1, 2, 3
  sprite: string;
  backSprite?: string;
  shinySprite: string;
  shinyBackSprite?: string;
  pixelSprite: string;
  pixelBackSprite?: string;
  types: PokemonType[];
  stats: PokemonStats;
  canMega: boolean;
  megaName?: string;
  megaSprite?: string;
  canGmax: boolean;
  gmaxName?: string;
  gmaxSprite?: string;
  learnset: Move[];
  defaultMoves: Move[];
}

export interface DraftPokemon {
  baseId: number;
  speciesName: string;
  evolutionStages: EvolutionStage[];
  currentStageIndex: number;
  canMega: boolean;
  canGmax: boolean;
  isShiny: boolean;
}

export interface StatStages {
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface TeamMember {
  id: string;
  pokemon: EvolutionStage;
  isShiny: boolean;
  assignedAbility: Ability | null;
  assignedItem: HeldItem | null;
  isItemConsumed: boolean;
  // Battle runtime stats
  currentHp: number;
  maxHp: number;
  moves: Move[];
  isMegaEvolved: boolean;
  isGigantamaxed: boolean;
  isTerastallized: boolean;
  teraType?: PokemonType;
  statStages: StatStages;
  // Fog of war
  revealedAbility: boolean;
  revealedItem: boolean;
  revealedMoveIds: string[];
  // Move locking mechanics
  lockedMoveId?: string; // Choice items lock
  multiTurnMoveId?: string; // Outrage/Thrash/Petal Dance lock
  multiTurnCount?: number; // Current turn of multi-turn move
  maxMultiTurns?: number; // Total turns for multi-turn move
  isConfused?: boolean; // Confusion status
  confusionTurns?: number; // Remaining confusion turns
  // Pivot move forced switch
  mustSwitch?: boolean; // Forced switch after pivot move
  originalMoveBeforeZ?: Move; // Restores original move after 1-time Z-Move
}

export type ChaosMechanic =
  | 'None'
  | 'Terastalization'
  | 'Z-Moves'
  | 'Gigantamax'
  | 'Mega Evolution';

export type GameState = 'LOBBY' | 'ROULETTE' | 'DRAFT' | 'BATTLE' | 'GAME_OVER';
export type GameMode = 'SOLO' | 'MULTIPLAYER';

export type ArenaEnvironment =
  | 'city-day'
  | 'city-night'
  | 'sunset'
  | 'ocean'
  | 'meadow'
  | 'beach'
  | 'living-room'
  | 'pokemon-store';

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'info' | 'player' | 'opponent' | 'mechanic' | 'damage' | 'faint' | 'system';
  timestamp: number;
}

export interface AttackAnimationEvent {
  id: string;
  moveType: PokemonType;
  category: 'physical' | 'special' | 'status';
  isPlayerAttacker: boolean;
  damage: number;
  isCrit: boolean;
  effectiveness: number;
  text: string;
  isZMove?: boolean;
  zMoveName?: string;
}

// Pokédex entry for persistent collection
export interface PokedexRecord {
  speciesName: string;
  displayName: string;
  sprite: string;
  shinySprite: string;
  types: PokemonType[];
  timesDrafted: number;
  hasSeenShiny: boolean;
}

// Discord Leaderboard player profile
export interface LeaderboardUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  points: number;
  rankTitle: string;
  wins: number;
  losses: number;
  streak: number;
  shiniesFound: number;
  isCurrentUser?: boolean;
}
