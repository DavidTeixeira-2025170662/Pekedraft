import { create } from 'zustand';
import type {
  Ability,
  ArenaEnvironment,
  AttackAnimationEvent,
  BattleLogEntry,
  ChaosMechanic,
  DraftPokemon,
  EvolutionStage,
  GameMode,
  GameState,
  HeldItem,
  Move,
  PokemonType,
  StatStages,
  TeamMember,
} from '../types/pokemon';
import { generateDraftPool, generateRandomAbilities, generateRandomHeldItems } from '../api/pokeapi';
import { getStatStageMultiplier, getTypeEffectiveness, Z_MOVE_MAP } from '../constants/moves';
import {
  playAttackSound,
  playSuperEffectiveSound,
  playFaintSound,
  playVictorySound,
  playRouletteTickSound,
  playBerryEatSound,
  playShinySparkleSound,
  playZMoveSound,
  startBattleBGM,
  startLobbyBGM,
  stopBGM,
} from '../lib/audio';
import { savePokedexRecord, recordMatchResult, incrementShinyCount } from '../lib/pokedexStore';
import type { DiscordUser } from '../lib/discordSdk';

interface GameStoreState {
  // App & Discord Session
  gameState: GameState;
  gameMode: GameMode;
  discordUser: DiscordUser | null;
  isLoading: boolean;
  loadingMessage: string;

  // Environment & Display Style
  arenaEnvironment: ArenaEnvironment;
  spriteStyle: 'showdown' | 'pixel';

  // Chaos Roulette State
  chaosMechanic: ChaosMechanic;
  isSpinningRoulette: boolean;

  // Draft Phase State
  draftPool: DraftPokemon[];
  availableAbilities: Ability[];
  availableItems: HeldItem[];
  playerTeam: TeamMember[];
  opponentTeam: TeamMember[];

  // Battle Arena State
  activePlayerPokemonIndex: number;
  activeOpponentPokemonIndex: number;
  turnNumber: number;
  turnTimeRemaining: number; // 40-second countdown
  isTimerActive: boolean;
  attackAnimation: AttackAnimationEvent | null;
  battleLogs: BattleLogEntry[];
  isProcessingTurn: boolean;
  playerMechanicUsed: boolean;
  opponentMechanicUsed: boolean;
  playerZMoveUsed: boolean;
  opponentZMoveUsed: boolean;
  winner: 'player' | 'opponent' | null;

  // Actions
  setDiscordUser: (user: DiscordUser) => void;
  setGameMode: (mode: GameMode) => void;
  setArenaEnvironment: (env: ArenaEnvironment) => void;
  toggleSpriteStyle: () => void;

  startRoulettePhase: () => void;
  spinRoulette: () => Promise<ChaosMechanic>;
  proceedToDraft: () => Promise<void>;
  selectPokemonStage: (pokemonIndex: number, stage: EvolutionStage) => void;
  setPokemonMoves: (pokemonIndex: number, moves: Move[]) => void;
  assignAbilityToPokemon: (pokemonIndex: number, ability: Ability) => void;
  unassignAbility: (pokemonIndex: number) => void;
  assignItemToPokemon: (pokemonIndex: number, item: HeldItem) => void;
  unassignItem: (pokemonIndex: number) => void;
  randomizeRemainingAssignments: () => void;
  completeDraftAndStartBattle: () => void;

  // Battle Actions
  executeMove: (moveIndex: number) => Promise<void>;
  switchPokemon: (targetIndex: number) => Promise<void>;
  activateMechanic: () => void;
  forfeitBattle: () => void;
  tickTimer: () => void;
  resetGame: () => void;
}

export const DEFAULT_STAT_STAGES: StatStages = {
  attack: 0,
  defense: 0,
  specialAttack: 0,
  specialDefense: 0,
  speed: 0,
};

export function calculateEffectiveStats(member: TeamMember): {
  hp: { current: number; max: number };
  attack: { raw: number; effective: number; stage: number };
  defense: { raw: number; effective: number; stage: number };
  specialAttack: { raw: number; effective: number; stage: number };
  specialDefense: { raw: number; effective: number; stage: number };
  speed: { raw: number; effective: number; stage: number };
} {
  const base = member.pokemon.stats;

  const rawAtk = Math.floor(0.01 * (2 * base.attack + 31) * 50) + 5;
  const rawDef = Math.floor(0.01 * (2 * base.defense + 31) * 50) + 5;
  const rawSpA = Math.floor(0.01 * (2 * base.specialAttack + 31) * 50) + 5;
  const rawSpD = Math.floor(0.01 * (2 * base.specialDefense + 31) * 50) + 5;
  const rawSpe = Math.floor(0.01 * (2 * base.speed + 31) * 50) + 5;

  let effAtk = Math.floor(rawAtk * getStatStageMultiplier(member.statStages.attack));
  let effDef = Math.floor(rawDef * getStatStageMultiplier(member.statStages.defense));
  let effSpA = Math.floor(rawSpA * getStatStageMultiplier(member.statStages.specialAttack));
  let effSpD = Math.floor(rawSpD * getStatStageMultiplier(member.statStages.specialDefense));
  let effSpe = Math.floor(rawSpe * getStatStageMultiplier(member.statStages.speed));

  if (!member.isItemConsumed) {
    if (member.assignedItem?.id === 'choice-band') effAtk = Math.floor(effAtk * 1.5);
    if (member.assignedItem?.id === 'choice-specs') effSpA = Math.floor(effSpA * 1.5);
    if (member.assignedItem?.id === 'choice-scarf') effSpe = Math.floor(effSpe * 1.5);
    if (member.assignedItem?.id === 'assault-vest') effSpD = Math.floor(effSpD * 1.5);
  }

  if (member.assignedAbility?.id === 'huge-power') effAtk = Math.floor(effAtk * 2.0);
  if (member.assignedAbility?.effect === 'attack_boost') effAtk = Math.floor(effAtk * 1.25);

  if (member.isMegaEvolved) {
    effAtk = Math.floor(effAtk * 1.35);
    effSpA = Math.floor(effSpA * 1.35);
  }

  return {
    hp: { current: member.currentHp, max: member.maxHp },
    attack: { raw: rawAtk, effective: effAtk, stage: member.statStages.attack },
    defense: { raw: rawDef, effective: effDef, stage: member.statStages.defense },
    specialAttack: { raw: rawSpA, effective: effSpA, stage: member.statStages.specialAttack },
    specialDefense: { raw: rawSpD, effective: effSpD, stage: member.statStages.specialDefense },
    speed: { raw: rawSpe, effective: effSpe, stage: member.statStages.speed },
  };
}

function createTeamMember(
  id: string,
  stage: EvolutionStage,
  ability: Ability | null = null,
  item: HeldItem | null = null,
  customMoves?: Move[],
  isShiny = false
): TeamMember {
  const maxHp = Math.floor(0.01 * (2 * stage.stats.hp + 31) * 50) + 60;
  const moves = customMoves && customMoves.length === 4 ? customMoves : stage.defaultMoves.slice(0, 4);

  return {
    id,
    pokemon: stage,
    isShiny,
    assignedAbility: ability,
    assignedItem: item,
    isItemConsumed: false,
    currentHp: maxHp,
    maxHp,
    moves: [...moves],
    isMegaEvolved: false,
    isGigantamaxed: false,
    isTerastallized: false,
    statStages: { ...DEFAULT_STAT_STAGES },
    revealedAbility: false,
    revealedItem: false,
    revealedMoveIds: [],
  };
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameState: 'LOBBY',
  gameMode: 'SOLO',
  discordUser: null,
  isLoading: false,
  loadingMessage: '',

  arenaEnvironment: 'city-day',
  spriteStyle: 'showdown',

  chaosMechanic: 'None',
  isSpinningRoulette: false,

  draftPool: [],
  availableAbilities: [],
  availableItems: [],
  playerTeam: [],
  opponentTeam: [],

  activePlayerPokemonIndex: 0,
  activeOpponentPokemonIndex: 0,
  turnNumber: 1,
  turnTimeRemaining: 40,
  isTimerActive: false,
  attackAnimation: null,
  battleLogs: [],
  isProcessingTurn: false,
  playerMechanicUsed: false,
  opponentMechanicUsed: false,
  playerZMoveUsed: false,
  opponentZMoveUsed: false,
  winner: null,

  setDiscordUser: (user: DiscordUser) => set({ discordUser: user }),
  setGameMode: (mode: GameMode) => set({ gameMode: mode }),
  setArenaEnvironment: (env: ArenaEnvironment) => set({ arenaEnvironment: env }),
  toggleSpriteStyle: () => set((s) => ({ spriteStyle: s.spriteStyle === 'showdown' ? 'pixel' : 'showdown' })),

  startRoulettePhase: () => {
    startLobbyBGM();
    set({
      gameState: 'ROULETTE',
      chaosMechanic: 'None',
      isSpinningRoulette: false,
    });
  },

  spinRoulette: async () => {
    set({ isSpinningRoulette: true });
    playRouletteTickSound();

    const options: ChaosMechanic[] = [
      'None',
      'Terastalization',
      'Z-Moves',
      'Gigantamax',
      'Mega Evolution',
    ];

    const selected = options[Math.floor(Math.random() * options.length)];
    await new Promise((r) => setTimeout(r, 3200));

    set({
      chaosMechanic: selected,
      isSpinningRoulette: false,
    });

    return selected;
  },

  proceedToDraft: async () => {
    const { chaosMechanic } = get();
    set({ isLoading: true, loadingMessage: `A preparar o Teambuilder com [${chaosMechanic}]...` });

    try {
      const playerDraft = await generateDraftPool(chaosMechanic);
      const botDraft = await generateDraftPool(chaosMechanic);

      const abilities = generateRandomAbilities(8);
      const items = generateRandomHeldItems(chaosMechanic, 12);

      const playerMembers: TeamMember[] = playerDraft.map((dp, idx) => {
        const stage = dp.evolutionStages[dp.currentStageIndex];
        const member = createTeamMember(`p_${idx}_${stage.id}`, stage, null, null, undefined, dp.isShiny);

        // Register in Pokédex!
        savePokedexRecord(member);
        if (dp.isShiny) {
          incrementShinyCount();
          playShinySparkleSound();
        }

        return member;
      });

      const botAbilities = generateRandomAbilities(6);
      const botItems = generateRandomHeldItems(chaosMechanic, 6);
      const opponentMembers: TeamMember[] = botDraft.map((dp, idx) => {
        const stage = dp.evolutionStages[dp.currentStageIndex];
        return createTeamMember(
          `bot_${idx}_${stage.id}`,
          stage,
          botAbilities[idx] || null,
          botItems[idx] || null,
          undefined,
          dp.isShiny
        );
      });

      set({
        draftPool: playerDraft,
        availableAbilities: abilities,
        availableItems: items,
        playerTeam: playerMembers,
        opponentTeam: opponentMembers,
        gameState: 'DRAFT',
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed draft generation:', err);
      set({ isLoading: false });
    }
  },

  selectPokemonStage: (pokemonIndex: number, stage: EvolutionStage) => {
    const { draftPool, playerTeam } = get();
    if (pokemonIndex < 0 || pokemonIndex >= playerTeam.length) return;

    const updatedDraftPool = [...draftPool];
    const targetDraft = updatedDraftPool[pokemonIndex];
    if (targetDraft) {
      const stageIdx = targetDraft.evolutionStages.findIndex((s) => s.id === stage.id);
      if (stageIdx !== -1) {
        targetDraft.currentStageIndex = stageIdx;
      }
    }

    const currentMember = playerTeam[pokemonIndex];
    const updatedMember = createTeamMember(
      currentMember.id,
      stage,
      currentMember.assignedAbility,
      currentMember.assignedItem,
      stage.defaultMoves.slice(0, 4),
      currentMember.isShiny
    );

    const updatedTeam = [...playerTeam];
    updatedTeam[pokemonIndex] = updatedMember;

    savePokedexRecord(updatedMember);
    set({ draftPool: updatedDraftPool, playerTeam: updatedTeam });
  },

  setPokemonMoves: (pokemonIndex: number, moves: Move[]) => {
    const { playerTeam } = get();
    if (pokemonIndex < 0 || pokemonIndex >= playerTeam.length) return;

    const updatedTeam = [...playerTeam];
    updatedTeam[pokemonIndex] = {
      ...updatedTeam[pokemonIndex],
      moves: [...moves],
    };

    set({ playerTeam: updatedTeam });
  },

  assignAbilityToPokemon: (pokemonIndex: number, ability: Ability) => {
    const { playerTeam } = get();
    if (pokemonIndex < 0 || pokemonIndex >= playerTeam.length) return;

    const updatedTeam = [...playerTeam];
    for (let i = 0; i < updatedTeam.length; i++) {
      if (updatedTeam[i].assignedAbility?.id === ability.id) {
        updatedTeam[i] = { ...updatedTeam[i], assignedAbility: null };
      }
    }

    updatedTeam[pokemonIndex] = {
      ...updatedTeam[pokemonIndex],
      assignedAbility: ability,
    };

    set({ playerTeam: updatedTeam });
  },

  unassignAbility: (pokemonIndex: number) => {
    const { playerTeam } = get();
    if (pokemonIndex < 0 || pokemonIndex >= playerTeam.length) return;

    const updatedTeam = [...playerTeam];
    updatedTeam[pokemonIndex] = {
      ...updatedTeam[pokemonIndex],
      assignedAbility: null,
    };
    set({ playerTeam: updatedTeam });
  },

  assignItemToPokemon: (pokemonIndex: number, item: HeldItem) => {
    const { playerTeam } = get();
    if (pokemonIndex < 0 || pokemonIndex >= playerTeam.length) return;

    const updatedTeam = [...playerTeam];
    for (let i = 0; i < updatedTeam.length; i++) {
      if (updatedTeam[i].assignedItem?.id === item.id) {
        updatedTeam[i] = { ...updatedTeam[i], assignedItem: null };
      }
    }

    updatedTeam[pokemonIndex] = {
      ...updatedTeam[pokemonIndex],
      assignedItem: item,
      isItemConsumed: false,
    };

    set({ playerTeam: updatedTeam });
  },

  unassignItem: (pokemonIndex: number) => {
    const { playerTeam } = get();
    if (pokemonIndex < 0 || pokemonIndex >= playerTeam.length) return;

    const updatedTeam = [...playerTeam];
    updatedTeam[pokemonIndex] = {
      ...updatedTeam[pokemonIndex],
      assignedItem: null,
      isItemConsumed: false,
    };
    set({ playerTeam: updatedTeam });
  },

  randomizeRemainingAssignments: () => {
    const { playerTeam, availableAbilities, availableItems } = get();
    const updatedTeam = [...playerTeam];

    const usedAbilityIds = new Set(updatedTeam.map((m) => m.assignedAbility?.id).filter(Boolean));
    const freeAbilities = availableAbilities.filter((a) => !usedAbilityIds.has(a.id));

    const usedItemIds = new Set(updatedTeam.map((m) => m.assignedItem?.id).filter(Boolean));
    const freeItems = availableItems.filter((i) => !usedItemIds.has(i.id));

    updatedTeam.forEach((member, i) => {
      if (!member.assignedAbility && freeAbilities.length > 0) {
        member.assignedAbility = freeAbilities.shift()!;
      }
      if (!member.assignedItem && freeItems.length > 0) {
        member.assignedItem = freeItems.shift()!;
      }
      updatedTeam[i] = { ...member };
    });

    set({ playerTeam: updatedTeam });
  },

  completeDraftAndStartBattle: () => {
    get().randomizeRemainingAssignments();

    // Start authentic high-tempo battle chiptune music!
    startBattleBGM();

    const { chaosMechanic, opponentTeam } = get();
    const initialLogs: BattleLogEntry[] = [
      {
        id: `log_init_${Date.now()}`,
        text: `★ Regra de Batalha: [${chaosMechanic.toUpperCase()}] ativa!`,
        type: 'mechanic',
        timestamp: Date.now(),
      },
      {
        id: `log_turn_1`,
        text: `--- Turno 1 ---`,
        type: 'system',
        timestamp: Date.now(),
      },
    ];

    const oppTeam = [...opponentTeam];
    const oppActive = oppTeam[0];
    if (oppActive.assignedAbility?.announcesOnEntry) {
      oppActive.revealedAbility = true;
      initialLogs.push({
        id: `log_opp_ability_entry_${Date.now()}`,
        text: `[Habilidade Oponente] ${oppActive.pokemon.name} ativou ${oppActive.assignedAbility.name}!`,
        type: 'opponent',
        timestamp: Date.now(),
      });
    }

    set({
      gameState: 'BATTLE',
      battleLogs: initialLogs,
      activePlayerPokemonIndex: 0,
      activeOpponentPokemonIndex: 0,
      turnNumber: 1,
      turnTimeRemaining: 40,
      isTimerActive: true,
      playerMechanicUsed: false,
      opponentMechanicUsed: false,
      playerZMoveUsed: false,
      opponentZMoveUsed: false,
      winner: null,
      opponentTeam: oppTeam,
    });
  },

  // Turn Timer tick
  tickTimer: () => {
    const { isTimerActive, turnTimeRemaining, isProcessingTurn, winner, executeMove } = get();
    if (!isTimerActive || isProcessingTurn || winner) return;

    if (turnTimeRemaining <= 1) {
      // Time expired: auto-select move 0!
      set({ turnTimeRemaining: 40 });
      executeMove(0);
    } else {
      set({ turnTimeRemaining: turnTimeRemaining - 1 });
    }
  },

  // Forfeit / Desistir Action
  forfeitBattle: () => {
    const { battleLogs } = get();
    stopBGM();

    const logs: BattleLogEntry[] = [
      ...battleLogs,
      {
        id: `log_forfeit_${Date.now()}`,
        text: `🏳️ Desististe da batalha. O adversário venceu por desistência!`,
        type: 'faint',
        timestamp: Date.now(),
      },
    ];

    recordMatchResult(false);
    set({
      winner: 'opponent',
      gameState: 'GAME_OVER',
      battleLogs: logs,
      isTimerActive: false,
    });
  },

  // Turn Execution with 100% Functional Items, Animations, and Showdown Math
  executeMove: async (moveIndex: number) => {
    const state = get();
    if (state.isProcessingTurn || state.winner) return;

    const playerActive = state.playerTeam[state.activePlayerPokemonIndex];
    const opponentActive = state.opponentTeam[state.activeOpponentPokemonIndex];

    // --- CHOICE ITEM LOCK CHECK ---
    // If player has a Choice item and is locked into a move, they MUST use that move
    const choiceItems = ['choice-band', 'choice-specs', 'choice-scarf'];
    const hasChoiceItem = playerActive.assignedItem && choiceItems.includes(playerActive.assignedItem.id);

    if (hasChoiceItem) {
      if (playerActive.lockedMoveId) {
        // Already locked - verify the selected move matches the locked move
        const lockedMove = playerActive.moves.find(m => m.id === playerActive.lockedMoveId);
        const lockedIndex = lockedMove ? playerActive.moves.indexOf(lockedMove) : -1;
        if (moveIndex !== lockedIndex) {
          // Player tried to use a different move - force use the locked move
          return get().executeMove(lockedIndex);
        }
      } else {
        // First move with Choice item - lock into this move
        const moveToLock = playerActive.moves[moveIndex];
        if (moveToLock) {
          const updatedPlayerTeam = [...state.playerTeam];
          updatedPlayerTeam[state.activePlayerPokemonIndex] = {
            ...playerActive,
            lockedMoveId: moveToLock.id,
          };
          set({ playerTeam: updatedPlayerTeam });
        }
      }
    }

    // --- MULTI-TURN MOVE CHECK (Outrage, Thrash, Petal Dance) ---
    // If already locked into a multi-turn move, must continue using it
    if (playerActive.multiTurnMoveId) {
      const lockedMultiMove = playerActive.moves.find(m => m.id === playerActive.multiTurnMoveId);
      const lockedMultiIndex = lockedMultiMove ? playerActive.moves.indexOf(lockedMultiMove) : -1;
      if (moveIndex !== lockedMultiIndex) {
        // Force continue the multi-turn move
        return get().executeMove(lockedMultiIndex);
      }
    }

    set({ isProcessingTurn: true, isTimerActive: false });

    const playerMove = playerActive.moves[moveIndex];

    const opponentMove =
      opponentActive.moves[Math.floor(Math.random() * opponentActive.moves.length)];

    const playerEff = calculateEffectiveStats(playerActive);
    const opponentEff = calculateEffectiveStats(opponentActive);

    const playerPriority = playerMove.priority || 0;
    const opponentPriority = opponentMove.priority || 0;

    let playerFirst = true;
    if (playerPriority !== opponentPriority) {
      playerFirst = playerPriority > opponentPriority;
    } else {
      playerFirst = playerEff.speed.effective >= opponentEff.speed.effective;
    }

    const logs: BattleLogEntry[] = [...state.battleLogs];

    // Helper: Functional Item Check after taking damage (Berries, Weakness Policy, Focus Sash)
    const checkPostDamageHeldItems = (target: TeamMember, damage: number, effectiveness: number, isTargetPlayer: boolean) => {
      if (target.isItemConsumed || !target.assignedItem || target.currentHp <= 0) return;

      const item = target.assignedItem;

      // 1. Sitrus Berry: triggers when HP < 50%
      if (item.id === 'sitrus-berry' && target.currentHp < target.maxHp * 0.5) {
        const heal = Math.floor(target.maxHp * 0.25);
        target.currentHp = Math.min(target.maxHp, target.currentHp + heal);
        target.isItemConsumed = true;
        if (!isTargetPlayer) target.revealedItem = true;
        playBerryEatSound();

        logs.push({
          id: `log_berry_${Date.now()}`,
          text: `🍊 ${target.pokemon.name} comeu a sua Sitrus Berry e recuperou ${heal} HP!`,
          type: 'info',
          timestamp: Date.now(),
        });
      }

      // 2. Salac Berry: +1 Speed when HP < 25%
      if (item.id === 'salac-berry' && target.currentHp < target.maxHp * 0.25) {
        target.statStages.speed = Math.min(6, target.statStages.speed + 1);
        target.isItemConsumed = true;
        if (!isTargetPlayer) target.revealedItem = true;
        playBerryEatSound();

        logs.push({
          id: `log_salac_${Date.now()}`,
          text: `🍒 ${target.pokemon.name} comeu a sua Salac Berry! Speed aumentada (+1)!`,
          type: 'info',
          timestamp: Date.now(),
        });
      }

      // 3. Liechi Berry: +1 Attack when HP < 25%
      if (item.id === 'liechi-berry' && target.currentHp < target.maxHp * 0.25) {
        target.statStages.attack = Math.min(6, target.statStages.attack + 1);
        target.isItemConsumed = true;
        if (!isTargetPlayer) target.revealedItem = true;
        playBerryEatSound();

        logs.push({
          id: `log_liechi_${Date.now()}`,
          text: `🍑 ${target.pokemon.name} comeu a sua Liechi Berry! Attack aumentado (+1)!`,
          type: 'info',
          timestamp: Date.now(),
        });
      }

      // 4. Petaya Berry: +1 Sp. Atk when HP < 25%
      if (item.id === 'petaya-berry' && target.currentHp < target.maxHp * 0.25) {
        target.statStages.specialAttack = Math.min(6, target.statStages.specialAttack + 1);
        target.isItemConsumed = true;
        if (!isTargetPlayer) target.revealedItem = true;
        playBerryEatSound();

        logs.push({
          id: `log_petaya_${Date.now()}`,
          text: `🍇 ${target.pokemon.name} comeu a sua Petaya Berry! Sp. Atk aumentado (+1)!`,
          type: 'info',
          timestamp: Date.now(),
        });
      }

      // 5. Weakness Policy: +2 Atk and +2 SpA upon receiving super effective damage
      if (item.id === 'weakness-policy' && effectiveness >= 2 && damage > 0) {
        target.statStages.attack = Math.min(6, target.statStages.attack + 2);
        target.statStages.specialAttack = Math.min(6, target.statStages.specialAttack + 2);
        target.isItemConsumed = true;
        if (!isTargetPlayer) target.revealedItem = true;

        logs.push({
          id: `log_wp_${Date.now()}`,
          text: `🛡️ A Weakness Policy de ${target.pokemon.name} foi ativada! Attack e Sp. Atk subiram drasticamente (+2)!`,
          type: 'mechanic',
          timestamp: Date.now(),
        });
      }

      // 6. Air Balloon popped
      if (item.id === 'air-balloon' && damage > 0) {
        target.isItemConsumed = true;
        if (!isTargetPlayer) target.revealedItem = true;

        logs.push({
          id: `log_balloon_${Date.now()}`,
          text: `🎈 O Air Balloon de ${target.pokemon.name} estourou com o golpe!`,
          type: 'info',
          timestamp: Date.now(),
        });
      }
    };

    const calculateDamage = (
      attacker: TeamMember,
      defender: TeamMember,
      move: Move
    ): { damage: number; effectiveness: number; isCrit: boolean } => {
      // Air balloon immunity to ground
      if (!defender.isItemConsumed && defender.assignedItem?.id === 'air-balloon' && move.type === 'ground') {
        return { damage: 0, effectiveness: 0, isCrit: false };
      }

      const isSpecial = move.category === 'special';
      const atkEff = calculateEffectiveStats(attacker);
      const defEff = calculateEffectiveStats(defender);

      const atkStat = isSpecial ? atkEff.specialAttack.effective : atkEff.attack.effective;
      const defStat = isSpecial ? defEff.specialDefense.effective : defEff.defense.effective;

      const isStab = attacker.pokemon.types.includes(move.type);
      let stabMultiplier = isStab ? (attacker.assignedAbility?.id === 'adaptability' ? 2.0 : 1.5) : 1.0;
      if (attacker.isTerastallized) stabMultiplier *= 1.35;

      const effectiveness = getTypeEffectiveness(move.type, defender.pokemon.types);
      const isCrit = Math.random() < 0.08;
      const critMultiplier = isCrit ? 1.5 : 1.0;
      const rngFactor = 0.85 + Math.random() * 0.15;

      // Expert Belt modifier (+20% on super effective)
      let itemDamageMultiplier = 1.0;
      if (!attacker.isItemConsumed && attacker.assignedItem?.id === 'expert-belt' && effectiveness >= 2) {
        itemDamageMultiplier = 1.2;
      }
      if (!attacker.isItemConsumed && attacker.assignedItem?.id === 'life-orb') {
        itemDamageMultiplier = 1.3;
      }

      const baseDamage =
        Math.floor(((2 * 50 / 5 + 2) * move.power * (atkStat / Math.max(1, defStat))) / 50) + 2;

      let finalDamage = Math.max(
        1,
        Math.floor(baseDamage * stabMultiplier * effectiveness * critMultiplier * rngFactor * itemDamageMultiplier)
      );

      // Focus Sash logic (100% HP to survive lethal)
      if (
        !defender.isItemConsumed &&
        defender.assignedItem?.id === 'focus-sash' &&
        defender.currentHp === defender.maxHp &&
        finalDamage >= defender.currentHp
      ) {
        finalDamage = defender.currentHp - 1;
        defender.isItemConsumed = true;
        defender.revealedItem = true;
        logs.push({
          id: `log_sash_${Date.now()}`,
          text: `🥋 ${defender.pokemon.name} resistiu ao golpe fatal com o seu Focus Sash!`,
          type: 'mechanic',
          timestamp: Date.now(),
        });
      }

      return { damage: finalDamage, effectiveness, isCrit };
    };

    const applyStatChanges = (user: TeamMember, target: TeamMember, move: Move, isUserPlayer: boolean) => {
      if (!move.statChanges) return;
      const isSelf = move.statChanges.target === 'self';
      const subject = isSelf ? user : target;

      for (const [stat, change] of Object.entries(move.statChanges.stages)) {
        const statKey = stat as keyof StatStages;
        if (change !== undefined) {
          const currentStage = subject.statStages[statKey] || 0;
          const nextStage = Math.max(-6, Math.min(6, currentStage + change));
          subject.statStages[statKey] = nextStage;

          // White herb item check!
          if (!subject.isItemConsumed && subject.assignedItem?.id === 'white-herb' && change < 0) {
            subject.statStages[statKey] = 0;
            subject.isItemConsumed = true;
            logs.push({
              id: `log_herb_${Date.now()}`,
              text: `🌿 A White Herb de ${subject.pokemon.name} restaurou os seus stats reduzidos!`,
              type: 'info',
              timestamp: Date.now(),
            });
          } else {
            const changeText = change >= 2 ? 'subiu drasticamente (+2)!' : change === 1 ? 'aumentou (+1)!' : change <= -2 ? 'caiu drasticamente (-2)!' : 'diminuiu (-1)!';
            logs.push({
              id: `log_st_${Date.now()}_${Math.random()}`,
              text: `${subject.pokemon.name} teve ${statKey.toUpperCase()} ${changeText}`,
              type: isUserPlayer ? 'player' : 'opponent',
              timestamp: Date.now(),
            });
          }
        }
      }
    };

    const executeAttackStep = async (isPlayer: boolean): Promise<boolean> => {
      const snap = get();
      const attacker = isPlayer
        ? snap.playerTeam[snap.activePlayerPokemonIndex]
        : snap.opponentTeam[snap.activeOpponentPokemonIndex];
      const defender = isPlayer
        ? snap.opponentTeam[snap.activeOpponentPokemonIndex]
        : snap.playerTeam[snap.activePlayerPokemonIndex];
      const move = isPlayer ? playerMove : opponentMove;

      if (attacker.currentHp <= 0) return false;

      if (!isPlayer && !attacker.revealedMoveIds.includes(move.id)) {
        attacker.revealedMoveIds.push(move.id);
      }

      logs.push({
        id: `log_${Date.now()}_${Math.random()}`,
        text: `${isPlayer ? '★ ' : ''}${attacker.pokemon.name} usou ${move.name}!`,
        type: isPlayer ? 'player' : 'opponent',
        timestamp: Date.now(),
      });

      if (move.category === 'status') {
        playAttackSound('status');
        applyStatChanges(attacker, defender, move, isPlayer);

        if (move.healPercent) {
          const healAmount = Math.floor((attacker.maxHp * move.healPercent) / 100);
          attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + healAmount);
          logs.push({
            id: `log_heal_${Date.now()}`,
            text: `${attacker.pokemon.name} recuperou vida!`,
            type: 'info',
            timestamp: Date.now(),
          });
        }

        set({ battleLogs: [...logs] });
        await new Promise((r) => setTimeout(r, 600));
        return false;
      }

      // Offensive moves
      const { damage, effectiveness, isCrit } = calculateDamage(attacker, defender, move);
      const isZMove = move.id.startsWith('z-');

      if (isZMove) {
        playZMoveSound();
      } else if (isCrit || effectiveness >= 2) {
        playSuperEffectiveSound();
      } else {
        playAttackSound(move.category);
      }

      // Trigger Visual Attack FX Overlay & Floating Combat Banner!
      set({
        attackAnimation: {
          id: `anim_${Date.now()}`,
          moveType: move.type,
          category: move.category,
          isPlayerAttacker: isPlayer,
          damage,
          isCrit,
          effectiveness,
          text: isZMove
            ? `★ PODER Z: ${move.name.toUpperCase()}!`
            : isCrit
            ? 'CRÍTICO!'
            : effectiveness >= 2
            ? 'SUPER EFETIVO!'
            : '',
          isZMove,
          zMoveName: move.name,
        },
      });

      // Z-Move consumption: strictly 1 time per battle!
      if (isZMove) {
        if (isPlayer) {
          const currentPTeam = [...get().playerTeam];
          const currMon = currentPTeam[snap.activePlayerPokemonIndex];
          if (currMon && currMon.originalMoveBeforeZ) {
            const restoredMoves = [...currMon.moves];
            restoredMoves[0] = { ...currMon.originalMoveBeforeZ };
            currentPTeam[snap.activePlayerPokemonIndex] = {
              ...currMon,
              moves: restoredMoves,
              originalMoveBeforeZ: undefined,
            };
          }
          set({
            playerTeam: currentPTeam,
            playerZMoveUsed: true,
            playerMechanicUsed: true,
          });
          logs.push({
            id: `log_z_consumed_${Date.now()}`,
            text: `✨ O Cristal Z de ${attacker.pokemon.name} desvaneceu! O ataque voltou ao normal. (Limite atingido: 1x por batalha)`,
            type: 'mechanic',
            timestamp: Date.now(),
          });
        } else {
          set({
            opponentZMoveUsed: true,
            opponentMechanicUsed: true,
          });
          logs.push({
            id: `log_z_opp_consumed_${Date.now()}`,
            text: `✨ O Poder Z do adversário esgotou-se! (1x por batalha)`,
            type: 'mechanic',
            timestamp: Date.now(),
          });
        }
      }

      if (effectiveness === 0) {
        logs.push({
          id: `log_eff_${Date.now()}_${Math.random()}`,
          text: `Não teve efeito contra ${defender.pokemon.name}...`,
          type: 'info',
          timestamp: Date.now(),
        });
      } else {
        if (isCrit) {
          logs.push({ id: `log_crit_${Date.now()}`, text: `Acerto Crítico!`, type: 'damage', timestamp: Date.now() });
        }
        if (effectiveness >= 2) {
          logs.push({ id: `log_sup_${Date.now()}`, text: `É super efetivo!`, type: 'damage', timestamp: Date.now() });
        }

        const newHp = Math.max(0, defender.currentHp - damage);
        defender.currentHp = newHp;

        applyStatChanges(attacker, defender, move, isPlayer);

        // Rocky Helmet recoil against physical contact
        if (!defender.isItemConsumed && defender.assignedItem?.id === 'rocky-helmet' && move.category === 'physical') {
          const helmetDmg = Math.max(1, Math.floor(attacker.maxHp / 6));
          attacker.currentHp = Math.max(0, attacker.currentHp - helmetDmg);
          if (isPlayer) defender.revealedItem = true;
          logs.push({
            id: `log_helmet_${Date.now()}`,
            text: `🪖 ${attacker.pokemon.name} foi ferido pelo Rocky Helmet de ${defender.pokemon.name}!`,
            type: 'damage',
            timestamp: Date.now(),
          });
        }

        // Functional Held Items Trigger (Sitrus Berry, Weakness Policy, Air Balloon)
        checkPostDamageHeldItems(defender, damage, effectiveness, !isPlayer);

        // Life Orb recoil
        if (!attacker.isItemConsumed && attacker.assignedItem?.id === 'life-orb' && damage > 0) {
          const recoil = Math.max(1, Math.floor(attacker.maxHp * 0.1));
          attacker.currentHp = Math.max(0, attacker.currentHp - recoil);
          if (!isPlayer) attacker.revealedItem = true;
          logs.push({
            id: `log_lifeorb_${Date.now()}`,
            text: `🔮 ${attacker.pokemon.name} perdeu HP pelo recuo do Life Orb!`,
            type: 'damage',
            timestamp: Date.now(),
          });
        }

        set({
          playerTeam: [...snap.playerTeam],
          opponentTeam: [...snap.opponentTeam],
          battleLogs: [...logs],
        });

        await new Promise((r) => setTimeout(r, 750));
        set({ attackAnimation: null });

        if (newHp <= 0) {
          playFaintSound();
          logs.push({
            id: `log_faint_${Date.now()}`,
            text: `💀 ${defender.pokemon.name} foi derrotado!`,
            type: 'faint',
            timestamp: Date.now(),
          });
          set({ battleLogs: [...logs] });
          return true;
        }
      }

      return false;
    };

    const targetFaintedFirst = await executeAttackStep(playerFirst);
    if (!targetFaintedFirst) {
      await executeAttackStep(!playerFirst);
    }

    // --- POST-ATTACK EFFECTS: Multi-turn moves & Pivot moves ---
    const snapAfterAttacks = get();
    const playerAfter = snapAfterAttacks.playerTeam[snapAfterAttacks.activePlayerPokemonIndex];
    const playerMoveUsed = playerMove;
    const opponentMoveUsed = opponentMove;

    // --- MULTI-TURN MOVE HANDLING (Player) ---
    if (playerMoveUsed.isMultiTurn && playerAfter.currentHp > 0) {
      const currentCount = playerAfter.multiTurnCount || 0;
      const maxTurns = playerMoveUsed.maxTurns || 3;
      const minTurns = playerMoveUsed.minTurns || 2;
      const newCount = currentCount + 1;

      if (newCount >= maxTurns || (newCount >= minTurns && Math.random() < 0.5)) {
        // Multi-turn move ends - apply confusion if applicable
        const updatedPlayerTeam = [...snapAfterAttacks.playerTeam];
        updatedPlayerTeam[snapAfterAttacks.activePlayerPokemonIndex] = {
          ...playerAfter,
          multiTurnMoveId: undefined,
          multiTurnCount: undefined,
          maxMultiTurns: undefined,
          isConfused: playerMoveUsed.causesConfusion ? true : playerAfter.isConfused,
          confusionTurns: playerMoveUsed.causesConfusion ? 2 + Math.floor(Math.random() * 2) : playerAfter.confusionTurns,
        };
        set({ playerTeam: updatedPlayerTeam });

        if (playerMoveUsed.causesConfusion) {
          logs.push({
            id: `log_confusion_${Date.now()}`,
            text: `😵 ${playerAfter.pokemon.name} ficou confuso pela fúria do ${playerMoveUsed.name}!`,
            type: 'info',
            timestamp: Date.now(),
          });
        } else {
          logs.push({
            id: `log_mt_end_${Date.now()}`,
            text: `${playerAfter.pokemon.name} acalmou-se após o ${playerMoveUsed.name}.`,
            type: 'info',
            timestamp: Date.now(),
          });
        }
      } else {
        // Continue multi-turn move
        const updatedPlayerTeam = [...snapAfterAttacks.playerTeam];
        updatedPlayerTeam[snapAfterAttacks.activePlayerPokemonIndex] = {
          ...playerAfter,
          multiTurnMoveId: playerMoveUsed.id,
          multiTurnCount: newCount,
          maxMultiTurns: maxTurns,
        };
        set({ playerTeam: updatedPlayerTeam });

        logs.push({
          id: `log_mt_cont_${Date.now()}`,
          text: `${playerAfter.pokemon.name} continua furioso com ${playerMoveUsed.name}! (${newCount}/${maxTurns})`,
          type: 'player',
          timestamp: Date.now(),
        });
      }
    }

    // --- MULTI-TURN MOVE HANDLING (Opponent) ---
    const snapForOpp = get();
    const oppAfter2 = snapForOpp.opponentTeam[snapForOpp.activeOpponentPokemonIndex];
    if (opponentMoveUsed.isMultiTurn && oppAfter2.currentHp > 0) {
      const currentCount = oppAfter2.multiTurnCount || 0;
      const maxTurns = opponentMoveUsed.maxTurns || 3;
      const minTurns = opponentMoveUsed.minTurns || 2;
      const newCount = currentCount + 1;

      if (newCount >= maxTurns || (newCount >= minTurns && Math.random() < 0.5)) {
        const updatedOpponentTeam = [...snapForOpp.opponentTeam];
        updatedOpponentTeam[snapForOpp.activeOpponentPokemonIndex] = {
          ...oppAfter2,
          multiTurnMoveId: undefined,
          multiTurnCount: undefined,
          maxMultiTurns: undefined,
          isConfused: opponentMoveUsed.causesConfusion ? true : oppAfter2.isConfused,
          confusionTurns: opponentMoveUsed.causesConfusion ? 2 + Math.floor(Math.random() * 2) : oppAfter2.confusionTurns,
        };
        set({ opponentTeam: updatedOpponentTeam });

        if (opponentMoveUsed.causesConfusion) {
          logs.push({
            id: `log_confusion_opp_${Date.now()}`,
            text: `😵 ${oppAfter2.pokemon.name} ficou confuso pela fúria do ${opponentMoveUsed.name}!`,
            type: 'opponent',
            timestamp: Date.now(),
          });
        }
      } else {
        const updatedOpponentTeam = [...snapForOpp.opponentTeam];
        updatedOpponentTeam[snapForOpp.activeOpponentPokemonIndex] = {
          ...oppAfter2,
          multiTurnMoveId: opponentMoveUsed.id,
          multiTurnCount: newCount,
          maxMultiTurns: maxTurns,
        };
        set({ opponentTeam: updatedOpponentTeam });
      }
    }

    // --- PIVOT MOVE HANDLING (Player) ---
    const snapForPivot = get();
    const playerAfterPivot = snapForPivot.playerTeam[snapForPivot.activePlayerPokemonIndex];
    const isPivotMove = playerMoveUsed.isPivot;
    if (isPivotMove && playerAfterPivot.currentHp > 0 && !targetFaintedFirst) {
      const aliveCount = snapForPivot.playerTeam.filter((m) => m.currentHp > 0).length;
      if (aliveCount > 1) {
        const updatedPlayerTeam = [...snapForPivot.playerTeam];
        updatedPlayerTeam[snapForPivot.activePlayerPokemonIndex] = {
          ...playerAfterPivot,
          mustSwitch: true,
        };
        set({ playerTeam: updatedPlayerTeam });

        logs.push({
          id: `log_pivot_${Date.now()}`,
          text: `⚡ ${playerAfterPivot.pokemon.name} usou ${playerMoveUsed.name} e deve trocar!`,
          type: 'player',
          timestamp: Date.now(),
        });
      }
    }

    // --- PIVOT MOVE HANDLING (Opponent) ---
    const snapForOppPivot = get();
    const oppAfterPivot = snapForOppPivot.opponentTeam[snapForOppPivot.activeOpponentPokemonIndex];
    const isOppPivotMove = opponentMoveUsed.isPivot;
    if (isOppPivotMove && oppAfterPivot.currentHp > 0 && !targetFaintedFirst) {
      const oppAliveCount = snapForOppPivot.opponentTeam.filter((m) => m.currentHp > 0).length;
      if (oppAliveCount > 1) {
        const aliveIndices = snapForOppPivot.opponentTeam
          .map((m, i) => (m.currentHp > 0 ? i : -1))
          .filter((i) => i !== -1 && i !== snapForOppPivot.activeOpponentPokemonIndex);
        if (aliveIndices.length > 0) {
          const newOppIndex = aliveIndices[Math.floor(Math.random() * aliveIndices.length)];
          const newOppMon = snapForOppPivot.opponentTeam[newOppIndex];
          logs.push({
            id: `log_pivot_opp_${Date.now()}`,
            text: `O ${oppAfterPivot.pokemon.name} usou ${opponentMoveUsed.name} e trocou por ${newOppMon.pokemon.name}!`,
            type: 'opponent',
            timestamp: Date.now(),
          });

          if (newOppMon.assignedAbility?.announcesOnEntry) {
            newOppMon.revealedAbility = true;
            logs.push({
              id: `log_entry_ab_${Date.now()}`,
              text: `[Habilidade Oponente] ${newOppMon.pokemon.name} ativou ${newOppMon.assignedAbility.name}!`,
              type: 'opponent',
              timestamp: Date.now(),
            });
          }

          set({ activeOpponentPokemonIndex: newOppIndex });
        }
      }
    }

    // --- CONFUSION CHECK (Player) ---
    const snapForConf = get();
    const playerConf = snapForConf.playerTeam[snapForConf.activePlayerPokemonIndex];
    if (playerConf.isConfused && playerConf.currentHp > 0 && playerMoveUsed.category !== 'status') {
      if (Math.random() < 0.33) {
        const confusionDamage = Math.max(1, Math.floor(playerConf.maxHp / 8));
        playerConf.currentHp = Math.max(0, playerConf.currentHp - confusionDamage);
        playerConf.confusionTurns = (playerConf.confusionTurns || 1) - 1;

        logs.push({
          id: `log_confusion_hit_${Date.now()}`,
          text: `😵 ${playerConf.pokemon.name} feriu-se na sua confusão!`,
          type: 'damage',
          timestamp: Date.now(),
        });

        if (playerConf.confusionTurns <= 0) {
          playerConf.isConfused = false;
          playerConf.confusionTurns = undefined;
          logs.push({
            id: `log_confusion_end_${Date.now()}`,
            text: `${playerConf.pokemon.name} recuperou da confusão!`,
            type: 'info',
            timestamp: Date.now(),
          });
        }

        const updatedPlayerTeam = [...snapForConf.playerTeam];
        updatedPlayerTeam[snapForConf.activePlayerPokemonIndex] = { ...playerConf };
        set({ playerTeam: updatedPlayerTeam });
      } else {
        playerConf.confusionTurns = (playerConf.confusionTurns || 1) - 1;
        if (playerConf.confusionTurns <= 0) {
          playerConf.isConfused = false;
          playerConf.confusionTurns = undefined;
          logs.push({
            id: `log_confusion_end_${Date.now()}`,
            text: `${playerConf.pokemon.name} recuperou da confusão!`,
            type: 'info',
            timestamp: Date.now(),
          });
        }
      }
    }

    // --- CONFUSION CHECK (Opponent) ---
    const snapForOppConf = get();
    const oppConf = snapForOppConf.opponentTeam[snapForOppConf.activeOpponentPokemonIndex];
    if (oppConf.isConfused && oppConf.currentHp > 0 && opponentMoveUsed.category !== 'status') {
      if (Math.random() < 0.33) {
        const confusionDamage = Math.max(1, Math.floor(oppConf.maxHp / 8));
        oppConf.currentHp = Math.max(0, oppConf.currentHp - confusionDamage);
        oppConf.confusionTurns = (oppConf.confusionTurns || 1) - 1;

        logs.push({
          id: `log_confusion_opp_hit_${Date.now()}`,
          text: `😵 ${oppConf.pokemon.name} feriu-se na sua confusão!`,
          type: 'damage',
          timestamp: Date.now(),
        });

        if (oppConf.confusionTurns <= 0) {
          oppConf.isConfused = false;
          oppConf.confusionTurns = undefined;
        }

        const updatedOpponentTeam = [...snapForOppConf.opponentTeam];
        updatedOpponentTeam[snapForOppConf.activeOpponentPokemonIndex] = { ...oppConf };
        set({ opponentTeam: updatedOpponentTeam });
      } else {
        oppConf.confusionTurns = (oppConf.confusionTurns || 1) - 1;
        if (oppConf.confusionTurns <= 0) {
          oppConf.isConfused = false;
          oppConf.confusionTurns = undefined;
        }
      }
    }

    // End-of-Turn effects (Leftovers, Black Sludge, Speed Boost)
    const applyEndTurn = () => {
      const snap = get();
      const pAct = snap.playerTeam[snap.activePlayerPokemonIndex];
      const oAct = snap.opponentTeam[snap.activeOpponentPokemonIndex];

      if (!pAct.isItemConsumed && pAct.assignedItem?.id === 'leftovers' && pAct.currentHp > 0 && pAct.currentHp < pAct.maxHp) {
        const heal = Math.floor(pAct.maxHp / 16);
        pAct.currentHp = Math.min(pAct.maxHp, pAct.currentHp + heal);
        logs.push({ id: `log_left_${Date.now()}`, text: `🍎 ${pAct.pokemon.name} recuperou HP com Leftovers.`, type: 'info', timestamp: Date.now() });
      }

      if (!oAct.isItemConsumed && oAct.assignedItem?.id === 'leftovers' && oAct.currentHp > 0 && oAct.currentHp < oAct.maxHp) {
        const heal = Math.floor(oAct.maxHp / 16);
        oAct.currentHp = Math.min(oAct.maxHp, oAct.currentHp + heal);
        oAct.revealedItem = true;
        logs.push({ id: `log_left_opp_${Date.now()}`, text: `🍎 [Item Oponente] ${oAct.pokemon.name} recuperou HP com Leftovers!`, type: 'opponent', timestamp: Date.now() });
      }

      if (pAct.assignedAbility?.id === 'speed-boost' && pAct.currentHp > 0) {
        pAct.statStages.speed = Math.min(6, pAct.statStages.speed + 1);
        logs.push({ id: `log_sb_p_${Date.now()}`, text: `Speed Boost aumentou a velocidade de ${pAct.pokemon.name}! (+1)`, type: 'player', timestamp: Date.now() });
      }

      if (oAct.assignedAbility?.id === 'speed-boost' && oAct.currentHp > 0) {
        oAct.statStages.speed = Math.min(6, oAct.statStages.speed + 1);
        oAct.revealedAbility = true;
        logs.push({ id: `log_sb_o_${Date.now()}`, text: `[Habilidade Oponente] Speed Boost aumentou a velocidade de ${oAct.pokemon.name}! (+1)`, type: 'opponent', timestamp: Date.now() });
      }
    };

    applyEndTurn();

    const finalState = get();
    const allPlayerFainted = finalState.playerTeam.every((m) => m.currentHp <= 0);
    const allOpponentFainted = finalState.opponentTeam.every((m) => m.currentHp <= 0);

    if (allPlayerFainted) {
      stopBGM();
      recordMatchResult(false);
      logs.push({ id: `log_loss_${Date.now()}`, text: `Derrota! Todos os teus Pokémon desmaiaram.`, type: 'faint', timestamp: Date.now() });
      set({ winner: 'opponent', gameState: 'GAME_OVER', battleLogs: [...logs], isProcessingTurn: false, isTimerActive: false });
      return;
    }

    if (allOpponentFainted) {
      stopBGM();
      playVictorySound();
      recordMatchResult(true);
      logs.push({ id: `log_win_${Date.now()}`, text: `🏆 VITÓRIA! Derrotaste todos os 6 Pokémon do adversário!`, type: 'mechanic', timestamp: Date.now() });
      set({ winner: 'player', gameState: 'GAME_OVER', battleLogs: [...logs], isProcessingTurn: false, isTimerActive: false });
      return;
    }

    // Auto-switch for opponent if fainted
    if (finalState.opponentTeam[finalState.activeOpponentPokemonIndex].currentHp <= 0) {
      const nextOppIndex = finalState.opponentTeam.findIndex((m) => m.currentHp > 0);
      if (nextOppIndex !== -1) {
        const nextOppMon = finalState.opponentTeam[nextOppIndex];
        logs.push({ id: `log_switch_opp_${Date.now()}`, text: `O PC enviou ${nextOppMon.pokemon.name}!`, type: 'opponent', timestamp: Date.now() });

        if (nextOppMon.assignedAbility?.announcesOnEntry) {
          nextOppMon.revealedAbility = true;
          logs.push({ id: `log_entry_ab_${Date.now()}`, text: `[Habilidade Oponente] ${nextOppMon.pokemon.name} ativou ${nextOppMon.assignedAbility.name}!`, type: 'opponent', timestamp: Date.now() });
        }

        set({ activeOpponentPokemonIndex: nextOppIndex });
      }
    }

    logs.push({
      id: `log_turn_${finalState.turnNumber + 1}`,
      text: `--- Turno ${finalState.turnNumber + 1} ---`,
      type: 'system',
      timestamp: Date.now(),
    });

    set({
      turnNumber: finalState.turnNumber + 1,
      turnTimeRemaining: 40,
      isTimerActive: true,
      battleLogs: [...logs],
      isProcessingTurn: false,
    });
  },

  switchPokemon: async (targetIndex: number) => {
    const state = get();
    if (
      state.isProcessingTurn ||
      state.winner ||
      targetIndex === state.activePlayerPokemonIndex ||
      state.playerTeam[targetIndex].currentHp <= 0
    ) {
      return;
    }

    set({ isProcessingTurn: true, isTimerActive: false });

    const currentMember = state.playerTeam[state.activePlayerPokemonIndex];
    const incomingMember = state.playerTeam[targetIndex];

    // Clear locked move / multi-turn lock when switching out; restore Z-move slot if unused
    const currentMoves = [...currentMember.moves];
    if (currentMember.originalMoveBeforeZ) {
      currentMoves[0] = { ...currentMember.originalMoveBeforeZ };
    }

    const updatedPlayerTeam = [...state.playerTeam];
    updatedPlayerTeam[state.activePlayerPokemonIndex] = {
      ...currentMember,
      moves: currentMoves,
      originalMoveBeforeZ: undefined,
      lockedMoveId: undefined,
      multiTurnMoveId: undefined,
      multiTurnCount: undefined,
      maxMultiTurns: undefined,
      mustSwitch: false,
    };
    // Also clear mustSwitch on incoming if any
    updatedPlayerTeam[targetIndex] = {
      ...incomingMember,
      mustSwitch: false,
    };

    const logs: BattleLogEntry[] = [
      ...state.battleLogs,
      {
        id: `log_sw_${Date.now()}`,
        text: `★ Volta, ${currentMember.pokemon.name}! Vai, ${incomingMember.pokemon.name}!`,
        type: 'player',
        timestamp: Date.now(),
      },
    ];

    if (incomingMember.assignedAbility?.id === 'intimidate') {
      const opp = state.opponentTeam[state.activeOpponentPokemonIndex];
      opp.statStages.attack = Math.max(-6, opp.statStages.attack - 1);
      logs.push({
        id: `log_intimidate_${Date.now()}`,
        text: `Intimidate de ${incomingMember.pokemon.name} reduziu o Attack do adversário! (-1)`,
        type: 'player',
        timestamp: Date.now(),
      });
    }

    set({
      playerTeam: updatedPlayerTeam,
      activePlayerPokemonIndex: targetIndex,
      battleLogs: logs,
    });

    await new Promise((r) => setTimeout(r, 550));

    const oppActive = state.opponentTeam[state.activeOpponentPokemonIndex];
    if (oppActive.currentHp > 0 && currentMember.currentHp > 0) {
      const oppMove = oppActive.moves[Math.floor(Math.random() * oppActive.moves.length)];
      if (!oppActive.revealedMoveIds.includes(oppMove.id)) {
        oppActive.revealedMoveIds.push(oppMove.id);
      }

      logs.push({
        id: `log_opp_free_${Date.now()}`,
        text: `${oppActive.pokemon.name} atacou durante a troca com ${oppMove.name}!`,
        type: 'opponent',
        timestamp: Date.now(),
      });

      const isSpecial = oppMove.category === 'special';
      const atkEff = calculateEffectiveStats(oppActive);
      const defEff = calculateEffectiveStats(incomingMember);
      const atk = isSpecial ? atkEff.specialAttack.effective : atkEff.attack.effective;
      const def = isSpecial ? defEff.specialDefense.effective : defEff.defense.effective;
      const eff = getTypeEffectiveness(oppMove.type, incomingMember.pokemon.types);
      const dmg = Math.max(1, Math.floor((((2 * 50 / 5 + 2) * oppMove.power * (atk / Math.max(1, def))) / 50 + 2) * eff * 0.9));

      const newHp = Math.max(0, incomingMember.currentHp - dmg);
      const pTeam = [...get().playerTeam];
      pTeam[targetIndex] = { ...pTeam[targetIndex], currentHp: newHp };

      set({ playerTeam: pTeam, battleLogs: [...logs] });

      if (newHp <= 0) {
        playFaintSound();
        logs.push({
          id: `log_incoming_faint_${Date.now()}`,
          text: `💀 ${incomingMember.pokemon.name} desmaiou ao entrar em campo!`,
          type: 'faint',
          timestamp: Date.now(),
        });
        set({ battleLogs: [...logs] });
      }
    }

    set({ isProcessingTurn: false, isTimerActive: true, turnTimeRemaining: 40 });
  },

  activateMechanic: () => {
    const state = get();
    if (state.playerMechanicUsed || state.isProcessingTurn) return;

    const activeMember = state.playerTeam[state.activePlayerPokemonIndex];
    const logs: BattleLogEntry[] = [...state.battleLogs];
    const updatedTeam = [...state.playerTeam];

    switch (state.chaosMechanic) {
      case 'Mega Evolution': {
        const hasMegaStone = !activeMember.isItemConsumed && activeMember.assignedItem?.category === 'megastone';
        if (!hasMegaStone) {
          logs.push({
            id: `log_no_stone_${Date.now()}`,
            text: `⚠️ Para Mega Evoluir em combate, ${activeMember.pokemon.name} necessita de ter a sua Mega Stone equipada!`,
            type: 'info',
            timestamp: Date.now(),
          });
          set({ battleLogs: logs });
          return;
        }

        const megaName = activeMember.pokemon.megaName || `Mega ${activeMember.pokemon.name}`;
        const megaSprite = activeMember.pokemon.megaSprite || activeMember.pokemon.sprite;

        updatedTeam[state.activePlayerPokemonIndex] = {
          ...activeMember,
          isMegaEvolved: true,
          pokemon: {
            ...activeMember.pokemon,
            name: megaName,
            sprite: megaSprite,
          },
        };

        logs.push({
          id: `log_mega_act_${Date.now()}`,
          text: `🧬 A Mega Stone ressoa! ${activeMember.pokemon.name} Mega Evoluiu para ${megaName}! Stats de combate elevados!`,
          type: 'mechanic',
          timestamp: Date.now(),
        });
        break;
      }

      case 'Gigantamax': {
        const gmaxName = activeMember.pokemon.gmaxName || `${activeMember.pokemon.name} Gigantamax`;
        const gmaxSprite = activeMember.pokemon.gmaxSprite || activeMember.pokemon.sprite;

        updatedTeam[state.activePlayerPokemonIndex] = {
          ...activeMember,
          isGigantamaxed: true,
          maxHp: activeMember.maxHp * 2,
          currentHp: activeMember.currentHp * 2,
          pokemon: {
            ...activeMember.pokemon,
            name: gmaxName,
            sprite: gmaxSprite,
          },
        };

        logs.push({
          id: `log_gmax_act_${Date.now()}`,
          text: `🌪️ Dynamax ativado! ${activeMember.pokemon.name} Gigantamaxou! O HP máximo duplicou!`,
          type: 'mechanic',
          timestamp: Date.now(),
        });
        break;
      }

      case 'Terastalization': {
        const teraType: PokemonType =
          activeMember.pokemon.types[1] || activeMember.pokemon.types[0];

        updatedTeam[state.activePlayerPokemonIndex] = {
          ...activeMember,
          isTerastallized: true,
          teraType,
        };

        logs.push({
          id: `log_tera_act_${Date.now()}`,
          text: `💎 Terastalização! ${activeMember.pokemon.name} cristalizou no tipo ${teraType.toUpperCase()} (+STAB aumentado)!`,
          type: 'mechanic',
          timestamp: Date.now(),
        });
        break;
      }

      case 'Z-Moves': {
        if (state.playerZMoveUsed) {
          logs.push({
            id: `log_z_depleted_${Date.now()}`,
            text: `⚠️ O Z-Move já foi utilizado nesta partida! (Regra: Apenas 1 uso por batalha).`,
            type: 'info',
            timestamp: Date.now(),
          });
          set({ battleLogs: logs });
          return;
        }

        if (activeMember.moves[0]?.id.startsWith('z-')) {
          // Already armed
          return;
        }

        const primaryType = activeMember.pokemon.types[0];
        const zMove = Z_MOVE_MAP[primaryType] || Z_MOVE_MAP.normal;

        const originalMove = activeMember.originalMoveBeforeZ || activeMember.moves[0];
        const updatedMoves = [...activeMember.moves];
        updatedMoves[0] = { ...zMove };

        updatedTeam[state.activePlayerPokemonIndex] = {
          ...activeMember,
          originalMoveBeforeZ: originalMove,
          moves: updatedMoves,
        };

        playZMoveSound();

        logs.push({
          id: `log_z_act_${Date.now()}`,
          text: `⚡ CRISTAL Z RESSOA! [${zMove.name}] pronto no slot 1 (Poder: ${zMove.power})! ATENÇÃO: Apenas 1 Z-Move em toda a batalha!`,
          type: 'mechanic',
          timestamp: Date.now(),
        });
        break;
      }

      case 'None':
      default:
        break;
    }

    set({
      playerTeam: updatedTeam,
      playerMechanicUsed: true,
      battleLogs: logs,
    });
  },

  resetGame: () => {
    stopBGM();
    set({
      gameState: 'LOBBY',
      draftPool: [],
      availableAbilities: [],
      availableItems: [],
      playerTeam: [],
      opponentTeam: [],
      chaosMechanic: 'None',
      battleLogs: [],
      winner: null,
      playerMechanicUsed: false,
      opponentMechanicUsed: false,
      playerZMoveUsed: false,
      opponentZMoveUsed: false,
      turnNumber: 1,
      turnTimeRemaining: 40,
      isTimerActive: false,
      attackAnimation: null,
    });
  },
}));
