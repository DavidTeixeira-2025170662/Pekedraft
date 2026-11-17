import type { Ability, Move, PokemonType } from '../types/pokemon';

// Type Effectiveness Matrix (Showdown standard)
export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export function getTypeEffectiveness(attackerType: PokemonType, defenderTypes: PokemonType[]): number {
  let multiplier = 1;
  const attackDef = TYPE_CHART[attackerType] || {};

  for (const defType of defenderTypes) {
    if (attackDef[defType] !== undefined) {
      multiplier *= attackDef[defType]!;
    }
  }

  return multiplier;
}

// Stage Multiplier standard:
// +1 = 1.5, +2 = 2.0, +3 = 2.5, +4 = 3.0, +5 = 3.5, +6 = 4.0
// -1 = 2/3 (0.667), -2 = 2/4 (0.5), -3 = 2/5 (0.4), -4 = 2/6 (0.333), -5 = 2/7 (0.286), -6 = 2/8 (0.25)
export function getStatStageMultiplier(stage: number): number {
  const clamped = Math.max(-6, Math.min(6, stage));
  if (clamped >= 0) {
    return (2 + clamped) / 2;
  }
  return 2 / (2 - clamped);
}

// Comprehensive Competitive Moves Database
export const MASTER_MOVES: Record<string, Move> = {
  // Fire
  flamethrower: { id: 'flamethrower', name: 'Flamethrower', type: 'fire', category: 'special', power: 90, accuracy: 100, pp: 15, maxPp: 15, description: 'Dispara uma rajada intensa de fogo.' },
  fireblast: { id: 'fireblast', name: 'Fire Blast', type: 'fire', category: 'special', power: 110, accuracy: 85, pp: 5, maxPp: 5, description: 'Uma explosão colossal de chamas incandescentes.' },
  flareblitz: { id: 'flareblitz', name: 'Flare Blitz', type: 'fire', category: 'physical', power: 120, accuracy: 100, pp: 15, maxPp: 15, recoilPercent: 33, description: 'Investida abrasadora com alto dano de impacto e recuo.' },
  overheat: { id: 'overheat', name: 'Overheat', type: 'fire', category: 'special', power: 130, accuracy: 90, pp: 5, maxPp: 5, statChanges: { target: 'self', stages: { specialAttack: -2 } }, description: 'Ataque em fúria máxima; reduz o Sp. Atk do usuário em 2 níveis.' },
  firepunch: { id: 'firepunch', name: 'Fire Punch', type: 'fire', category: 'physical', power: 75, accuracy: 100, pp: 15, maxPp: 15, description: 'Soco de fogo concentrado.' },
  willowisp: { id: 'willowisp', name: 'Will-O-Wisp', type: 'fire', category: 'status', power: 0, accuracy: 85, pp: 15, maxPp: 15, description: 'Chamas fantasmagóricas que queimam o adversário.' },

  // Water
  surf: { id: 'surf', name: 'Surf', type: 'water', category: 'special', power: 90, accuracy: 100, pp: 15, maxPp: 15, description: 'Onda gigante inunda a arena com precisão perfeita.' },
  hydropump: { id: 'hydropump', name: 'Hydro Pump', type: 'water', category: 'special', power: 110, accuracy: 80, pp: 5, maxPp: 5, description: 'Dispara um canhão de água sob altíssima pressão.' },
  waterfall: { id: 'waterfall', name: 'Waterfall', type: 'water', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, description: 'Investida aquática contra a correnteza.' },
  liquidation: { id: 'liquidation', name: 'Liquidation', type: 'water', category: 'physical', power: 85, accuracy: 100, pp: 10, maxPp: 10, statChanges: { target: 'opponent', stages: { defense: -1 } }, description: 'Golpe de água sob pressão que pode reduzir a Defesa.' },
  watershuriken: { id: 'watershuriken', name: 'Water Shuriken', type: 'water', category: 'special', power: 60, accuracy: 100, pp: 20, maxPp: 20, priority: 1, description: 'Shurikens de água velozes com prioridade.' },
  scald: { id: 'scald', name: 'Scald', type: 'water', category: 'special', power: 80, accuracy: 100, pp: 15, maxPp: 15, description: 'Dispara água fervente que pode causar queimadura.' },

  // Grass
  energyball: { id: 'energyball', name: 'Energy Ball', type: 'grass', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, description: 'Esfera condensada da natureza.' },
  leafblade: { id: 'leafblade', name: 'Leaf Blade', type: 'grass', category: 'physical', power: 90, accuracy: 100, pp: 15, maxPp: 15, description: 'Cortes com lâminas afiadas de folhas.' },
  gigadrain: { id: 'gigadrain', name: 'Giga Drain', type: 'grass', category: 'special', power: 75, accuracy: 100, pp: 10, maxPp: 10, healPercent: 50, description: 'Drena o HP do adversário recuperando 50% do dano.' },
  powerwhip: { id: 'powerwhip', name: 'Power Whip', type: 'grass', category: 'physical', power: 120, accuracy: 85, pp: 10, maxPp: 10, description: 'Chicote violento de videiras colossais.' },
  solarbeam: { id: 'solarbeam', name: 'Solar Beam', type: 'grass', category: 'special', power: 125, accuracy: 100, pp: 10, maxPp: 10, description: 'Feixe solar concentrado com poder devastador.' },

  // Electric
  thunderbolt: { id: 'thunderbolt', name: 'Thunderbolt', type: 'electric', category: 'special', power: 90, accuracy: 100, pp: 15, maxPp: 15, description: 'Raio elétrico clássico e consistente.' },
  thunder: { id: 'thunder', name: 'Thunder', type: 'electric', category: 'special', power: 110, accuracy: 70, pp: 10, maxPp: 10, description: 'Trovão violento conjurado das nuvens de tempestade.' },
  voltswitch: { id: 'voltswitch', name: 'Volt Switch', type: 'electric', category: 'special', power: 70, accuracy: 100, pp: 20, maxPp: 20, isPivot: true, description: 'Ataque veloz com troca tática de campo.' },
  wildcharge: { id: 'wildcharge', name: 'Wild Charge', type: 'electric', category: 'physical', power: 90, accuracy: 100, pp: 15, maxPp: 15, recoilPercent: 25, description: 'Investida de alta voltagem com leve recuo.' },
  thunderpunch: { id: 'thunderpunch', name: 'Thunder Punch', type: 'electric', category: 'physical', power: 75, accuracy: 100, pp: 15, maxPp: 15, description: 'Soco eletrificado.' },

  // Ice
  icebeam: { id: 'icebeam', name: 'Ice Beam', type: 'ice', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, description: 'Raio de gelo cortante do zero absoluto.' },
  blizzard: { id: 'blizzard', name: 'Blizzard', type: 'ice', category: 'special', power: 110, accuracy: 70, pp: 5, maxPp: 5, description: 'Tempestade de neve devastadora.' },
  iciclecrash: { id: 'iciclecrash', name: 'Icicle Crash', type: 'ice', category: 'physical', power: 85, accuracy: 90, pp: 10, maxPp: 10, description: 'Estalactites de gelo pesadas caem sobre o inimigo.' },
  icepunch: { id: 'icepunch', name: 'Ice Punch', type: 'ice', category: 'physical', power: 75, accuracy: 100, pp: 15, maxPp: 15, description: 'Soco gélido congelante.' },
  icespinner: { id: 'icespinner', name: 'Ice Spinner', type: 'ice', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, description: 'Giro no chão com pés congelados, destruindo terrenos.' },

  // Fighting
  closecombat: { id: 'closecombat', name: 'Close Combat', type: 'fighting', category: 'physical', power: 120, accuracy: 100, pp: 5, maxPp: 5, statChanges: { target: 'self', stages: { defense: -1, specialDefense: -1 } }, description: 'Sequência brutal que reduz a Defesa e Sp. Def do usuário.' },
  aurasphere: { id: 'aurasphere', name: 'Aura Sphere', type: 'fighting', category: 'special', power: 80, accuracy: 100, pp: 20, maxPp: 20, description: 'Esfera de aura espiritual que nunca erra o alvo.' },
  focusblast: { id: 'focusblast', name: 'Focus Blast', type: 'fighting', category: 'special', power: 120, accuracy: 70, pp: 5, maxPp: 5, description: 'Projétil condensado de pura força mental.' },
  drainpunch: { id: 'drainpunch', name: 'Drain Punch', type: 'fighting', category: 'physical', power: 75, accuracy: 100, pp: 10, maxPp: 10, healPercent: 50, description: 'Soco que absorve 50% do dano em HP.' },
  bulkup: { id: 'bulkup', name: 'Bulk Up', type: 'fighting', category: 'status', power: 0, accuracy: 100, pp: 20, maxPp: 20, statChanges: { target: 'self', stages: { attack: 1, defense: 1 } }, description: 'Aumenta Attack e Defense em 1 nível.' },

  // Ground
  earthquake: { id: 'earthquake', name: 'Earthquake', type: 'ground', category: 'physical', power: 100, accuracy: 100, pp: 10, maxPp: 10, description: 'Terramoto devastador que abala a arena inteira.' },
  earthpower: { id: 'earthpower', name: 'Earth Power', type: 'ground', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, statChanges: { target: 'opponent', stages: { specialDefense: -1 } }, description: 'Erupção de rocha e magma que pode baixar a Sp. Def.' },

  // Flying
  bravebird: { id: 'bravebird', name: 'Brave Bird', type: 'flying', category: 'physical', power: 120, accuracy: 100, pp: 15, maxPp: 15, recoilPercent: 33, description: 'Mergulho heroico supersónico com dano de recuo.' },
  airslash: { id: 'airslash', name: 'Air Slash', type: 'flying', category: 'special', power: 75, accuracy: 95, pp: 15, maxPp: 15, description: 'Lâminas de ar comprimido cortantes.' },
  roost: { id: 'roost', name: 'Roost', type: 'flying', category: 'status', power: 0, accuracy: 100, pp: 10, maxPp: 10, healPercent: 50, description: 'Pousa no chão para recuperar 50% do HP máximo.' },
  hurricane: { id: 'hurricane', name: 'Hurricane', type: 'flying', category: 'special', power: 110, accuracy: 70, pp: 10, maxPp: 10, description: 'Tufão violento que pode deixar o inimigo confuso.' },

  // Psychic
  psychic: { id: 'psychic', name: 'Psychic', type: 'psychic', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, statChanges: { target: 'opponent', stages: { specialDefense: -1 } }, description: 'Onda telecinética com chance de reduzir a Sp. Def.' },
  psyshock: { id: 'psyshock', name: 'Psyshock', type: 'psychic', category: 'special', power: 80, accuracy: 100, pp: 10, maxPp: 10, description: 'Ataque especial que calcula dano na Defesa física do alvo.' },
  zenheadbutt: { id: 'zenheadbutt', name: 'Zen Headbutt', type: 'psychic', category: 'physical', power: 80, accuracy: 90, pp: 15, maxPp: 15, description: 'Cabeçada fortalecida por concentração zen.' },
  calmmind: { id: 'calmmind', name: 'Calm Mind', type: 'psychic', category: 'status', power: 0, accuracy: 100, pp: 20, maxPp: 20, statChanges: { target: 'self', stages: { specialAttack: 1, specialDefense: 1 } }, description: 'Aumenta Sp. Atk e Sp. Def em 1 nível.' },

  // Ghost
  shadowball: { id: 'shadowball', name: 'Shadow Ball', type: 'ghost', category: 'special', power: 80, accuracy: 100, pp: 15, maxPp: 15, statChanges: { target: 'opponent', stages: { specialDefense: -1 } }, description: 'Esfera espectral condensada que pode baixar a Sp. Def.' },
  shadowclaw: { id: 'shadowclaw', name: 'Shadow Claw', type: 'ghost', category: 'physical', power: 70, accuracy: 100, pp: 15, maxPp: 15, description: 'Garras envoltas em trevas com alta taxa de acerto crítico.' },

  // Dragon
  dracometeor: { id: 'dracometeor', name: 'Draco Meteor', type: 'dragon', category: 'special', power: 130, accuracy: 90, pp: 5, maxPp: 5, statChanges: { target: 'self', stages: { specialAttack: -2 } }, description: 'Cometas draconianos colossais; reduz o Sp. Atk em 2 níveis.' },
  dragonclaw: { id: 'dragonclaw', name: 'Dragon Claw', type: 'dragon', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, description: 'Corte afiado com garras de dragão.' },
  dragondance: { id: 'dragondance', name: 'Dragon Dance', type: 'dragon', category: 'status', power: 0, accuracy: 100, pp: 20, maxPp: 20, statChanges: { target: 'self', stages: { attack: 1, speed: 1 } }, description: 'Dança mística ancestral; aumenta Attack e Speed em 1 nível.' },
  outrage: { id: 'outrage', name: 'Outrage', type: 'dragon', category: 'physical', power: 120, accuracy: 100, pp: 10, maxPp: 10, isMultiTurn: true, minTurns: 2, maxTurns: 3, causesConfusion: true, description: 'Fúria dracónica incontrolável por 2-3 turnos; confunde o usuário no final.' },
  dragonpulse: { id: 'dragonpulse', name: 'Dragon Pulse', type: 'dragon', category: 'special', power: 85, accuracy: 100, pp: 10, maxPp: 10, description: 'Rajada de choque com a aura de um dragão mítico.' },

  // Dark
  darkpulse: { id: 'darkpulse', name: 'Dark Pulse', type: 'dark', category: 'special', power: 80, accuracy: 100, pp: 15, maxPp: 15, description: 'Irradia ondas sombrias nocivas.' },
  crunch: { id: 'crunch', name: 'Crunch', type: 'dark', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, statChanges: { target: 'opponent', stages: { defense: -1 } }, description: 'Mordida esmagadora com chance de reduzir a Defesa.' },
  knockoff: { id: 'knockoff', name: 'Knock Off', type: 'dark', category: 'physical', power: 65, accuracy: 100, pp: 20, maxPp: 20, description: 'Desfere um golpe seco que arremessa e anula o item inimigo.' },
  nastyplot: { id: 'nastyplot', name: 'Nasty Plot', type: 'dark', category: 'status', power: 0, accuracy: 100, pp: 20, maxPp: 20, statChanges: { target: 'self', stages: { specialAttack: 2 } }, description: 'Conspira pensamentos maquiavélicos; aumenta Sp. Atk em 2 níveis!' },

  // Steel
  meteormash: { id: 'meteormash', name: 'Meteor Mash', type: 'steel', category: 'physical', power: 90, accuracy: 90, pp: 10, maxPp: 10, statChanges: { target: 'self', stages: { attack: 1 } }, description: 'Soco de impacto meteórico com chance de subir o Attack.' },
  flashcannon: { id: 'flashcannon', name: 'Flash Cannon', type: 'steel', category: 'special', power: 80, accuracy: 100, pp: 10, maxPp: 10, statChanges: { target: 'opponent', stages: { specialDefense: -1 } }, description: 'Canhão de luz metálica com chance de baixar a Sp. Def.' },
  ironhead: { id: 'ironhead', name: 'Iron Head', type: 'steel', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, description: 'Cabeçada de puro aço temperado.' },
  bulletpunch: { id: 'bulletpunch', name: 'Bullet Punch', type: 'steel', category: 'physical', power: 40, accuracy: 100, pp: 30, maxPp: 30, priority: 1, description: 'Soco metálico disparado como bala veloz com prioridade.' },

  // Fairy
  moonblast: { id: 'moonblast', name: 'Moonblast', type: 'fairy', category: 'special', power: 95, accuracy: 100, pp: 15, maxPp: 15, statChanges: { target: 'opponent', stages: { specialAttack: -1 } }, description: 'Poder místico lunar com chance de reduzir o Sp. Atk inimigo.' },
  playrough: { id: 'playrough', name: 'Play Rough', type: 'fairy', category: 'physical', power: 90, accuracy: 90, pp: 10, maxPp: 10, statChanges: { target: 'opponent', stages: { attack: -1 } }, description: 'Brincadeira ríspida com chance de reduzir o Attack.' },
  dazzlinggleam: { id: 'dazzlinggleam', name: 'Dazzling Gleam', type: 'fairy', category: 'special', power: 80, accuracy: 100, pp: 10, maxPp: 10, description: 'Explosão de luz cintilante e ofuscante.' },

  // Rock
  stoneedge: { id: 'stoneedge', name: 'Stone Edge', type: 'rock', category: 'physical', power: 100, accuracy: 80, pp: 5, maxPp: 5, description: 'Lança rochas pontiagudas com alto índice crítico.' },
  rockslide: { id: 'rockslide', name: 'Rock Slide', type: 'rock', category: 'physical', power: 75, accuracy: 90, pp: 10, maxPp: 10, description: 'Avalanche de pedras sobre o alvo.' },

  // Poison
  sludgebomb: { id: 'sludgebomb', name: 'Sludge Bomb', type: 'poison', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, description: 'Bombardeio de lodo tóxico corrosivo.' },
  gunkshot: { id: 'gunkshot', name: 'Gunk Shot', type: 'poison', category: 'physical', power: 120, accuracy: 80, pp: 5, maxPp: 5, description: 'Arremesso massivo de detritos tóxicos.' },

  // Normal / Setup
  extremespeed: { id: 'extremespeed', name: 'Extreme Speed', type: 'normal', category: 'physical', power: 80, accuracy: 100, pp: 5, maxPp: 5, priority: 2, description: 'Ataque em velocidade extrema com alta prioridade.' },
  swordsdance: { id: 'swordsdance', name: 'Swords Dance', type: 'normal', category: 'status', power: 0, accuracy: 100, pp: 20, maxPp: 20, statChanges: { target: 'self', stages: { attack: 2 } }, description: 'Dança bélica de espadas; aumenta o Attack em 2 níveis!' },
  bodyslam: { id: 'bodyslam', name: 'Body Slam', type: 'normal', category: 'physical', power: 85, accuracy: 100, pp: 15, maxPp: 15, description: 'Investida corporal com chance de paralisar.' },
  hypervoice: { id: 'hypervoice', name: 'Hyper Voice', type: 'normal', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, description: 'Onda sonora de alta frequência.' },

  // Pivot Moves
  uturn: { id: 'uturn', name: 'U-turn', type: 'bug', category: 'physical', power: 70, accuracy: 100, pp: 20, maxPp: 20, isPivot: true, description: 'Golpe rápido seguido de troca tática.' },
  flipturn: { id: 'flipturn', name: 'Flip Turn', type: 'water', category: 'physical', power: 60, accuracy: 100, pp: 20, maxPp: 20, isPivot: true, description: 'Investida aquática com recuo estratégico.' },
  batonpass: { id: 'batonpass', name: 'Baton Pass', type: 'normal', category: 'status', power: 0, accuracy: 100, pp: 40, maxPp: 40, isPivot: true, description: 'Passar o turno para um aliado mantendo alterações de stats.' },
  partingshot: { id: 'partingshot', name: 'Parting Shot', type: 'dark', category: 'status', power: 0, accuracy: 100, pp: 20, maxPp: 20, isPivot: true, statChanges: { target: 'opponent', stages: { attack: -1, specialAttack: -1 } }, description: 'Insulto final que reduz o Attack e Sp. Atk do inimigo antes de trocar.' },

  // Multi-turn moves (Outrage, Thrash, Petal Dance)
  thrash: { id: 'thrash', name: 'Thrash', type: 'normal', category: 'physical', power: 120, accuracy: 100, pp: 10, maxPp: 10, isMultiTurn: true, minTurns: 2, maxTurns: 3, causesConfusion: true, description: 'Investida frenética por 2-3 turnos; confunde o usuário no final.' },
  petaldance: { id: 'petaldance', name: 'Petal Dance', type: 'grass', category: 'special', power: 120, accuracy: 100, pp: 10, maxPp: 10, isMultiTurn: true, minTurns: 2, maxTurns: 3, causesConfusion: true, description: 'Dança de pétalas destrutiva por 2-3 turnos; confunde o usuário no final.' },
};

// Authentic Showdown competitive learnsets per species
export const SPECIES_LEARNSETS: Record<string, { learnset: Move[]; defaultMoves: Move[] }> = {
  // Charizard Line
  charizard: {
    learnset: [
      MASTER_MOVES.flamethrower,
      MASTER_MOVES.fireblast,
      MASTER_MOVES.airslash,
      MASTER_MOVES.solarbeam,
      MASTER_MOVES.dragonclaw,
      MASTER_MOVES.roost,
      MASTER_MOVES.focusblast,
      MASTER_MOVES.dragondance,
      MASTER_MOVES.earthquake,
      MASTER_MOVES.flareblitz,
      MASTER_MOVES.willowisp,
      MASTER_MOVES.overheat,
    ],
    defaultMoves: [MASTER_MOVES.flamethrower, MASTER_MOVES.airslash, MASTER_MOVES.solarbeam, MASTER_MOVES.roost],
  },
  charmeleon: {
    learnset: [MASTER_MOVES.flamethrower, MASTER_MOVES.fireblast, MASTER_MOVES.dragonclaw, MASTER_MOVES.swordsdance, MASTER_MOVES.bodyslam],
    defaultMoves: [MASTER_MOVES.flamethrower, MASTER_MOVES.dragonclaw, MASTER_MOVES.fireblast, MASTER_MOVES.bodyslam],
  },
  charmander: {
    learnset: [MASTER_MOVES.flamethrower, MASTER_MOVES.dragonclaw, MASTER_MOVES.bodyslam, MASTER_MOVES.swordsdance],
    defaultMoves: [MASTER_MOVES.flamethrower, MASTER_MOVES.dragonclaw, MASTER_MOVES.bodyslam, MASTER_MOVES.swordsdance],
  },

  // Gengar Line
  gengar: {
    learnset: [
      MASTER_MOVES.shadowball,
      MASTER_MOVES.sludgebomb,
      MASTER_MOVES.focusblast,
      MASTER_MOVES.thunderbolt,
      MASTER_MOVES.dazzlinggleam,
      MASTER_MOVES.nastyplot,
      MASTER_MOVES.willowisp,
      MASTER_MOVES.energyball,
      MASTER_MOVES.psychic,
      MASTER_MOVES.darkpulse,
    ],
    defaultMoves: [MASTER_MOVES.shadowball, MASTER_MOVES.sludgebomb, MASTER_MOVES.focusblast, MASTER_MOVES.nastyplot],
  },
  haunter: {
    learnset: [MASTER_MOVES.shadowball, MASTER_MOVES.sludgebomb, MASTER_MOVES.thunderbolt, MASTER_MOVES.dazzlinggleam, MASTER_MOVES.nastyplot],
    defaultMoves: [MASTER_MOVES.shadowball, MASTER_MOVES.sludgebomb, MASTER_MOVES.thunderbolt, MASTER_MOVES.dazzlinggleam],
  },
  gastly: {
    learnset: [MASTER_MOVES.shadowball, MASTER_MOVES.sludgebomb, MASTER_MOVES.thunderbolt, MASTER_MOVES.willowisp],
    defaultMoves: [MASTER_MOVES.shadowball, MASTER_MOVES.sludgebomb, MASTER_MOVES.thunderbolt, MASTER_MOVES.willowisp],
  },

  // Lucario Line
  lucario: {
    learnset: [
      MASTER_MOVES.closecombat,
      MASTER_MOVES.aurasphere,
      MASTER_MOVES.meteormash,
      MASTER_MOVES.extremespeed,
      MASTER_MOVES.flashcannon,
      MASTER_MOVES.swordsdance,
      MASTER_MOVES.bulletpunch,
      MASTER_MOVES.darkpulse,
      MASTER_MOVES.earthquake,
      MASTER_MOVES.stoneedge,
    ],
    defaultMoves: [MASTER_MOVES.closecombat, MASTER_MOVES.meteormash, MASTER_MOVES.extremespeed, MASTER_MOVES.swordsdance],
  },
  riolu: {
    learnset: [MASTER_MOVES.closecombat, MASTER_MOVES.bulletpunch, MASTER_MOVES.drainpunch, MASTER_MOVES.swordsdance],
    defaultMoves: [MASTER_MOVES.closecombat, MASTER_MOVES.bulletpunch, MASTER_MOVES.drainpunch, MASTER_MOVES.swordsdance],
  },

  // Blastoise Line
  blastoise: {
    learnset: [
      MASTER_MOVES.hydropump,
      MASTER_MOVES.surf,
      MASTER_MOVES.icebeam,
      MASTER_MOVES.darkpulse,
      MASTER_MOVES.aurasphere,
      MASTER_MOVES.scald,
      MASTER_MOVES.earthquake,
      MASTER_MOVES.flashcannon,
    ],
    defaultMoves: [MASTER_MOVES.hydropump, MASTER_MOVES.icebeam, MASTER_MOVES.aurasphere, MASTER_MOVES.darkpulse],
  },
  wartortle: {
    learnset: [MASTER_MOVES.surf, MASTER_MOVES.icebeam, MASTER_MOVES.scald, MASTER_MOVES.bodyslam],
    defaultMoves: [MASTER_MOVES.surf, MASTER_MOVES.icebeam, MASTER_MOVES.scald, MASTER_MOVES.bodyslam],
  },
  squirtle: {
    learnset: [MASTER_MOVES.surf, MASTER_MOVES.icebeam, MASTER_MOVES.bodyslam],
    defaultMoves: [MASTER_MOVES.surf, MASTER_MOVES.icebeam, MASTER_MOVES.bodyslam, MASTER_MOVES.hydropump],
  },

  // Venusaur Line
  venusaur: {
    learnset: [
      MASTER_MOVES.sludgebomb,
      MASTER_MOVES.gigadrain,
      MASTER_MOVES.energyball,
      MASTER_MOVES.earthpower,
      MASTER_MOVES.solarbeam,
      MASTER_MOVES.roost,
      MASTER_MOVES.knockoff,
      MASTER_MOVES.petaldance,
    ],
    defaultMoves: [MASTER_MOVES.gigadrain, MASTER_MOVES.sludgebomb, MASTER_MOVES.earthpower, MASTER_MOVES.energyball],
  },
  ivysaur: {
    learnset: [MASTER_MOVES.gigadrain, MASTER_MOVES.sludgebomb, MASTER_MOVES.energyball, MASTER_MOVES.bodyslam],
    defaultMoves: [MASTER_MOVES.gigadrain, MASTER_MOVES.sludgebomb, MASTER_MOVES.energyball, MASTER_MOVES.bodyslam],
  },
  bulbasaur: {
    learnset: [MASTER_MOVES.gigadrain, MASTER_MOVES.sludgebomb, MASTER_MOVES.energyball, MASTER_MOVES.bodyslam],
    defaultMoves: [MASTER_MOVES.gigadrain, MASTER_MOVES.sludgebomb, MASTER_MOVES.energyball, MASTER_MOVES.bodyslam],
  },

  // Pikachu / Raichu Line
  raichu: {
    learnset: [
      MASTER_MOVES.thunderbolt,
      MASTER_MOVES.voltswitch,
      MASTER_MOVES.surf,
      MASTER_MOVES.focusblast,
      MASTER_MOVES.nastyplot,
      MASTER_MOVES.extremespeed,
      MASTER_MOVES.thunder,
      MASTER_MOVES.uturn,
    ],
    defaultMoves: [MASTER_MOVES.thunderbolt, MASTER_MOVES.surf, MASTER_MOVES.voltswitch, MASTER_MOVES.nastyplot],
  },
  pikachu: {
    learnset: [MASTER_MOVES.thunderbolt, MASTER_MOVES.voltswitch, MASTER_MOVES.surf, MASTER_MOVES.extremespeed, MASTER_MOVES.nastyplot, MASTER_MOVES.uturn],
    defaultMoves: [MASTER_MOVES.thunderbolt, MASTER_MOVES.surf, MASTER_MOVES.voltswitch, MASTER_MOVES.extremespeed],
  },
  pichu: {
    learnset: [MASTER_MOVES.thunderbolt, MASTER_MOVES.voltswitch, MASTER_MOVES.nastyplot, MASTER_MOVES.uturn],
    defaultMoves: [MASTER_MOVES.thunderbolt, MASTER_MOVES.voltswitch, MASTER_MOVES.nastyplot, MASTER_MOVES.surf],
  },

  // Garchomp Line
  garchomp: {
    learnset: [
      MASTER_MOVES.earthquake,
      MASTER_MOVES.dragonclaw,
      MASTER_MOVES.outrage,
      MASTER_MOVES.stoneedge,
      MASTER_MOVES.swordsdance,
      MASTER_MOVES.ironhead,
      MASTER_MOVES.fireblast,
      MASTER_MOVES.dracometeor,
    ],
    defaultMoves: [MASTER_MOVES.earthquake, MASTER_MOVES.dragonclaw, MASTER_MOVES.stoneedge, MASTER_MOVES.swordsdance],
  },
  gabite: {
    learnset: [MASTER_MOVES.earthquake, MASTER_MOVES.dragonclaw, MASTER_MOVES.rockslide, MASTER_MOVES.swordsdance],
    defaultMoves: [MASTER_MOVES.earthquake, MASTER_MOVES.dragonclaw, MASTER_MOVES.rockslide, MASTER_MOVES.swordsdance],
  },
  gible: {
    learnset: [MASTER_MOVES.earthquake, MASTER_MOVES.dragonclaw, MASTER_MOVES.bodyslam, MASTER_MOVES.swordsdance],
    defaultMoves: [MASTER_MOVES.earthquake, MASTER_MOVES.dragonclaw, MASTER_MOVES.bodyslam, MASTER_MOVES.swordsdance],
  },

  // Dragonite Line
  dragonite: {
    learnset: [
      MASTER_MOVES.dragondance,
      MASTER_MOVES.outrage,
      MASTER_MOVES.extremespeed,
      MASTER_MOVES.earthquake,
      MASTER_MOVES.icespinner,
      MASTER_MOVES.roost,
      MASTER_MOVES.firepunch,
      MASTER_MOVES.thunderpunch,
      MASTER_MOVES.hurricane,
    ],
    defaultMoves: [MASTER_MOVES.dragondance, MASTER_MOVES.outrage, MASTER_MOVES.extremespeed, MASTER_MOVES.earthquake],
  },
  dragonair: {
    learnset: [MASTER_MOVES.dragondance, MASTER_MOVES.outrage, MASTER_MOVES.surf, MASTER_MOVES.icebeam],
    defaultMoves: [MASTER_MOVES.dragondance, MASTER_MOVES.outrage, MASTER_MOVES.surf, MASTER_MOVES.icebeam],
  },
  dratini: {
    learnset: [MASTER_MOVES.dragonclaw, MASTER_MOVES.surf, MASTER_MOVES.thunderbolt, MASTER_MOVES.dragondance],
    defaultMoves: [MASTER_MOVES.dragonclaw, MASTER_MOVES.surf, MASTER_MOVES.thunderbolt, MASTER_MOVES.dragondance],
  },

  // Tyranitar Line
  tyranitar: {
    learnset: [
      MASTER_MOVES.stoneedge,
      MASTER_MOVES.crunch,
      MASTER_MOVES.earthquake,
      MASTER_MOVES.icebeam,
      MASTER_MOVES.fireblast,
      MASTER_MOVES.dragondance,
      MASTER_MOVES.ironhead,
      MASTER_MOVES.rockslide,
    ],
    defaultMoves: [MASTER_MOVES.stoneedge, MASTER_MOVES.crunch, MASTER_MOVES.earthquake, MASTER_MOVES.dragondance],
  },
  pupitar: {
    learnset: [MASTER_MOVES.rockslide, MASTER_MOVES.crunch, MASTER_MOVES.earthquake, MASTER_MOVES.dragondance],
    defaultMoves: [MASTER_MOVES.rockslide, MASTER_MOVES.crunch, MASTER_MOVES.earthquake, MASTER_MOVES.dragondance],
  },
  larvitar: {
    learnset: [MASTER_MOVES.rockslide, MASTER_MOVES.crunch, MASTER_MOVES.earthquake, MASTER_MOVES.dragondance],
    defaultMoves: [MASTER_MOVES.rockslide, MASTER_MOVES.crunch, MASTER_MOVES.earthquake, MASTER_MOVES.dragondance],
  },

  // Metagross Line
  metagross: {
    learnset: [
      MASTER_MOVES.meteormash,
      MASTER_MOVES.bulletpunch,
      MASTER_MOVES.earthquake,
      MASTER_MOVES.zenheadbutt,
      MASTER_MOVES.icepunch,
      MASTER_MOVES.thunderpunch,
      MASTER_MOVES.flashcannon,
    ],
    defaultMoves: [MASTER_MOVES.meteormash, MASTER_MOVES.bulletpunch, MASTER_MOVES.earthquake, MASTER_MOVES.zenheadbutt],
  },
  metang: {
    learnset: [MASTER_MOVES.meteormash, MASTER_MOVES.bulletpunch, MASTER_MOVES.zenheadbutt, MASTER_MOVES.flashcannon],
    defaultMoves: [MASTER_MOVES.meteormash, MASTER_MOVES.bulletpunch, MASTER_MOVES.zenheadbutt, MASTER_MOVES.flashcannon],
  },
  beldum: {
    learnset: [MASTER_MOVES.ironhead, MASTER_MOVES.zenheadbutt, MASTER_MOVES.bodyslam],
    defaultMoves: [MASTER_MOVES.ironhead, MASTER_MOVES.zenheadbutt, MASTER_MOVES.bodyslam, MASTER_MOVES.ironhead],
  },

  // Greninja Line
  greninja: {
    learnset: [
      MASTER_MOVES.hydropump,
      MASTER_MOVES.darkpulse,
      MASTER_MOVES.icebeam,
      MASTER_MOVES.watershuriken,
      MASTER_MOVES.gunkshot,
      MASTER_MOVES.surf,
      MASTER_MOVES.uturn,
      MASTER_MOVES.flipturn,
    ],
    defaultMoves: [MASTER_MOVES.hydropump, MASTER_MOVES.darkpulse, MASTER_MOVES.icebeam, MASTER_MOVES.watershuriken],
  },
  frogadier: {
    learnset: [MASTER_MOVES.surf, MASTER_MOVES.darkpulse, MASTER_MOVES.icebeam, MASTER_MOVES.watershuriken],
    defaultMoves: [MASTER_MOVES.surf, MASTER_MOVES.darkpulse, MASTER_MOVES.icebeam, MASTER_MOVES.watershuriken],
  },
  froakie: {
    learnset: [MASTER_MOVES.surf, MASTER_MOVES.icebeam, MASTER_MOVES.darkpulse, MASTER_MOVES.watershuriken],
    defaultMoves: [MASTER_MOVES.surf, MASTER_MOVES.icebeam, MASTER_MOVES.darkpulse, MASTER_MOVES.watershuriken],
  },

  // Machamp Line
  machamp: {
    learnset: [
      MASTER_MOVES.closecombat,
      MASTER_MOVES.knockoff,
      MASTER_MOVES.stoneedge,
      MASTER_MOVES.icepunch,
      MASTER_MOVES.bulletpunch,
      MASTER_MOVES.earthquake,
      MASTER_MOVES.bulkup,
    ],
    defaultMoves: [MASTER_MOVES.closecombat, MASTER_MOVES.knockoff, MASTER_MOVES.stoneedge, MASTER_MOVES.bulletpunch],
  },
  machoke: {
    learnset: [MASTER_MOVES.closecombat, MASTER_MOVES.knockoff, MASTER_MOVES.icepunch, MASTER_MOVES.bulkup],
    defaultMoves: [MASTER_MOVES.closecombat, MASTER_MOVES.knockoff, MASTER_MOVES.icepunch, MASTER_MOVES.bulkup],
  },
  machop: {
    learnset: [MASTER_MOVES.closecombat, MASTER_MOVES.knockoff, MASTER_MOVES.bulkup],
    defaultMoves: [MASTER_MOVES.closecombat, MASTER_MOVES.knockoff, MASTER_MOVES.bulkup, MASTER_MOVES.icepunch],
  },
};

// Generates or retrieves authentic learnset and 4 default moves for a Pokemon
export function getSpeciesLearnset(speciesName: string, types: PokemonType[]): { learnset: Move[]; defaultMoves: Move[] } {
  const normalized = speciesName.toLowerCase().trim();
  if (SPECIES_LEARNSETS[normalized]) {
    return SPECIES_LEARNSETS[normalized];
  }

  // If species not explicitly listed, construct rich learnset from its primary and secondary types + universal competitive moves
  const primaryType = types[0] || 'normal';
  const secondaryType = types[1] || null;

  const typeMoves = Object.values(MASTER_MOVES).filter(
    (m) => m.type === primaryType || (secondaryType && m.type === secondaryType)
  );

  const coverageMoves = [
    MASTER_MOVES.earthquake,
    MASTER_MOVES.icebeam,
    MASTER_MOVES.closecombat,
    MASTER_MOVES.knockoff,
    MASTER_MOVES.thunderbolt,
    MASTER_MOVES.swordsdance,
  ];

  const fullPool = Array.from(new Set([...typeMoves, ...coverageMoves]));
  const default4 = fullPool.slice(0, 4);

  return {
    learnset: fullPool,
    defaultMoves: default4.length === 4 ? default4 : [MASTER_MOVES.bodyslam, MASTER_MOVES.flamethrower, MASTER_MOVES.surf, MASTER_MOVES.earthquake],
  };
}

// Special Chaos Moves (Z-Moves)
export const Z_MOVE_MAP: Record<PokemonType, Move> = {
  normal: { id: 'z-breakneck', name: 'Breakneck Blitz', type: 'normal', category: 'physical', power: 180, accuracy: 100, pp: 1, maxPp: 1, description: 'Z-Move colossal devastador.' },
  fire: { id: 'z-inferno', name: 'Inferno Overdrive', type: 'fire', category: 'special', power: 190, accuracy: 100, pp: 1, maxPp: 1, description: 'Z-Move ardente que incinera tudo.' },
  water: { id: 'z-hydro', name: 'Hydro Vortex', type: 'water', category: 'special', power: 185, accuracy: 100, pp: 1, maxPp: 1, description: 'Vórtice aquático gigante de Alola.' },
  grass: { id: 'z-bloom', name: 'Bloom Doom', type: 'grass', category: 'special', power: 185, accuracy: 100, pp: 1, maxPp: 1, description: 'Explosão floral de energia pura.' },
  electric: { id: 'z-gigavolt', name: 'Gigavolt Havoc', type: 'electric', category: 'special', power: 190, accuracy: 100, pp: 1, maxPp: 1, description: 'Raio de um milhão de volts do Cristal Z.' },
  ice: { id: 'z-subzero', name: 'Subzero Slammer', type: 'ice', category: 'special', power: 180, accuracy: 100, pp: 1, maxPp: 1, description: 'Meteoro glacial do zero absoluto.' },
  fighting: { id: 'z-allout', name: 'All-Out Pummeling', type: 'fighting', category: 'physical', power: 195, accuracy: 100, pp: 1, maxPp: 1, description: 'Centenas de socos ultrassónicos ininterruptos.' },
  poison: { id: 'z-acid', name: 'Acid Downpour', type: 'poison', category: 'special', power: 180, accuracy: 100, pp: 1, maxPp: 1, description: 'Dilúvio ácido tóxico e corrosivo.' },
  ground: { id: 'z-tectonic', name: 'Tectonic Rage', type: 'ground', category: 'physical', power: 190, accuracy: 100, pp: 1, maxPp: 1, description: 'Fendas tectónicas engolem o inimigo.' },
  flying: { id: 'z-supersonic', name: 'Supersonic Skystrike', type: 'flying', category: 'physical', power: 185, accuracy: 100, pp: 1, maxPp: 1, description: 'Bombardeio supersónico celestial.' },
  psychic: { id: 'z-shattered', name: 'Shattered Psyche', type: 'psychic', category: 'special', power: 185, accuracy: 100, pp: 1, maxPp: 1, description: 'Colapso mental quântico esmagador.' },
  bug: { id: 'z-savage', name: 'Savage Spin-Out', type: 'bug', category: 'physical', power: 180, accuracy: 100, pp: 1, maxPp: 1, description: 'Teia espiral feroz de impacto.' },
  rock: { id: 'z-continental', name: 'Continental Crush', type: 'rock', category: 'physical', power: 190, accuracy: 100, pp: 1, maxPp: 1, description: 'Queda de um continente de rochas estelares.' },
  ghost: { id: 'z-neverending', name: 'Never-Ending Nightmare', type: 'ghost', category: 'special', power: 180, accuracy: 100, pp: 1, maxPp: 1, description: 'Pesadelo sem fim das sombras eternas.' },
  dragon: { id: 'z-devastating', name: 'Devastating Drake', type: 'dragon', category: 'physical', power: 200, accuracy: 100, pp: 1, maxPp: 1, description: 'A ira pura e destruidora dos dragões ancestrais.' },
  dark: { id: 'z-blackhole', name: 'Black Hole Eclipse', type: 'dark', category: 'special', power: 190, accuracy: 100, pp: 1, maxPp: 1, description: 'Buraco negro dimensional engole o adversário.' },
  steel: { id: 'z-corkscrew', name: 'Corkscrew Crash', type: 'steel', category: 'physical', power: 185, accuracy: 100, pp: 1, maxPp: 1, description: 'Broca de metal divino perfurante.' },
  fairy: { id: 'z-twinkle', name: 'Twinkle Tackle', type: 'fairy', category: 'physical', power: 185, accuracy: 100, pp: 1, maxPp: 1, description: 'Investida cintilante das fadas estelares.' },
};

// Competitive Abilities Catalog with Announcement flags
export const ABILITIES_POOL: Ability[] = [
  {
    id: 'intimidate',
    name: 'Intimidate',
    description: 'Ao entrar em campo, intimida o oponente, reduzindo o seu Attack em 1 nível (-33%).',
    effect: 'intimidate',
    announcesOnEntry: true,
  },
  {
    id: 'speed-boost',
    name: 'Speed Boost',
    description: 'A velocidade aumenta em 1 nível (+50%) no final de cada turno que passa na batalha.',
    effect: 'speed_boost',
  },
  {
    id: 'huge-power',
    name: 'Huge Power',
    description: 'Duplica a força física bruta (Attack x2 efetivo em combate).',
    effect: 'attack_boost',
  },
  {
    id: 'beast-boost',
    name: 'Beast Boost',
    description: 'Ao derrotar um oponente, o seu stat mais alto recebe um aumento de +1 nível.',
    effect: 'attack_boost',
  },
  {
    id: 'regenerator',
    name: 'Regenerator',
    description: 'Recupera 33% do HP máximo sempre que é trocado de volta para a equipa.',
    effect: 'healing',
  },
  {
    id: 'magic-guard',
    name: 'Magic Guard',
    description: 'Só recebe dano de ataques diretos. Imune a veneno, queimadura e danos residuais.',
    effect: 'defense_boost',
  },
  {
    id: 'moxie',
    name: 'Moxie',
    description: 'Aumenta o Attack em 1 nível (+50%) a cada nocaute realizado.',
    effect: 'attack_boost',
  },
  {
    id: 'sheer-force',
    name: 'Sheer Force',
    description: 'Remove efeitos secundários dos ataques em troca de +30% de poder bruto.',
    effect: 'attack_boost',
  },
  {
    id: 'multiscale',
    name: 'Multiscale',
    description: 'Reduz o dano sofrido em 50% quando o Pokémon estiver com HP cheio.',
    effect: 'defense_boost',
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    description: 'Aumenta o multiplicador de STAB do Pokémon de 1.5x para 2.0x!',
    effect: 'attack_boost',
  },
  {
    id: 'drought',
    name: 'Drought',
    description: 'Ao entrar em campo, invoca sol intenso, aumentando ataques de Fogo em 50%.',
    effect: 'weather',
    announcesOnEntry: true,
  },
  {
    id: 'drizzle',
    name: 'Drizzle',
    description: 'Ao entrar em campo, invoca chuva forte, aumentando ataques de Água em 50%.',
    effect: 'weather',
    announcesOnEntry: true,
  },
];
