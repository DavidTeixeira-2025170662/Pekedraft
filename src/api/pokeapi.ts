import type { Ability, EvolutionStage, DraftPokemon, HeldItem, ChaosMechanic } from '../types/pokemon';
import { ABILITIES_POOL, getSpeciesLearnset } from '../constants/moves';
import { ALL_COMPETITIVE_ITEMS, MEGA_STONES } from '../constants/items';

export const MEGA_ELIGIBLE_SPECIES = [
  'charmander',
  'gastly',
  'riolu',
  'squirtle',
  'bulbasaur',
  'gible',
  'beldum',
  'larvitar',
];

export const GMAX_ELIGIBLE_SPECIES = [
  'pichu',
  'machop',
  'charmander',
  'gastly',
  'squirtle',
  'bulbasaur',
];

export const GENERAL_SPECIES_POOL = [
  'dratini',
  'larvitar',
  'beldum',
  'froakie',
  'gible',
  'charmander',
  'gastly',
  'riolu',
  'squirtle',
  'bulbasaur',
  'pichu',
  'machop',
];

export function buildStageSprites(id: number) {
  return {
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`,
    backSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${id}.gif`,
    shinySprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`,
    shinyBackSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/shiny/${id}.gif`,
    pixelSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    pixelBackSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
  };
}

const EVOLUTION_PRESETS: Record<string, EvolutionStage[]> = {
  charmander: [
    {
      id: 4,
      name: 'Charmander',
      speciesName: 'charmander',
      stageNumber: 1,
      ...buildStageSprites(4),
      types: ['fire'],
      stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('charmander', ['fire']),
    },
    {
      id: 5,
      name: 'Charmeleon',
      speciesName: 'charmeleon',
      stageNumber: 2,
      ...buildStageSprites(5),
      types: ['fire'],
      stats: { hp: 58, attack: 64, defense: 58, specialAttack: 80, specialDefense: 65, speed: 80 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('charmeleon', ['fire']),
    },
    {
      id: 6,
      name: 'Charizard',
      speciesName: 'charizard',
      stageNumber: 3,
      ...buildStageSprites(6),
      types: ['fire', 'flying'],
      stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
      canMega: true,
      megaName: 'Mega Charizard X',
      megaSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10034.gif',
      canGmax: true,
      gmaxName: 'Charizard Gigantamax',
      gmaxSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10196.gif',
      ...getSpeciesLearnset('charizard', ['fire', 'flying']),
    },
  ],
  gastly: [
    {
      id: 92,
      name: 'Gastly',
      speciesName: 'gastly',
      stageNumber: 1,
      ...buildStageSprites(92),
      types: ['ghost', 'poison'],
      stats: { hp: 30, attack: 35, defense: 30, specialAttack: 100, specialDefense: 35, speed: 80 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('gastly', ['ghost', 'poison']),
    },
    {
      id: 93,
      name: 'Haunter',
      speciesName: 'haunter',
      stageNumber: 2,
      ...buildStageSprites(93),
      types: ['ghost', 'poison'],
      stats: { hp: 45, attack: 50, defense: 45, specialAttack: 115, specialDefense: 55, speed: 95 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('haunter', ['ghost', 'poison']),
    },
    {
      id: 94,
      name: 'Gengar',
      speciesName: 'gengar',
      stageNumber: 3,
      ...buildStageSprites(94),
      types: ['ghost', 'poison'],
      stats: { hp: 60, attack: 65, defense: 60, specialAttack: 130, specialDefense: 75, speed: 110 },
      canMega: true,
      megaName: 'Mega Gengar',
      megaSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10038.gif',
      canGmax: true,
      gmaxName: 'Gengar Gigantamax',
      gmaxSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10202.gif',
      ...getSpeciesLearnset('gengar', ['ghost', 'poison']),
    },
  ],
  riolu: [
    {
      id: 447,
      name: 'Riolu',
      speciesName: 'riolu',
      stageNumber: 1,
      ...buildStageSprites(447),
      types: ['fighting'],
      stats: { hp: 40, attack: 70, defense: 40, specialAttack: 35, specialDefense: 40, speed: 60 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('riolu', ['fighting']),
    },
    {
      id: 448,
      name: 'Lucario',
      speciesName: 'lucario',
      stageNumber: 2,
      ...buildStageSprites(448),
      types: ['fighting', 'steel'],
      stats: { hp: 70, attack: 110, defense: 70, specialAttack: 115, specialDefense: 70, speed: 90 },
      canMega: true,
      megaName: 'Mega Lucario',
      megaSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10059.gif',
      canGmax: false,
      ...getSpeciesLearnset('lucario', ['fighting', 'steel']),
    },
  ],
  squirtle: [
    {
      id: 7,
      name: 'Squirtle',
      speciesName: 'squirtle',
      stageNumber: 1,
      ...buildStageSprites(7),
      types: ['water'],
      stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('squirtle', ['water']),
    },
    {
      id: 8,
      name: 'Wartortle',
      speciesName: 'wartortle',
      stageNumber: 2,
      ...buildStageSprites(8),
      types: ['water'],
      stats: { hp: 59, attack: 63, defense: 80, specialAttack: 65, specialDefense: 80, speed: 58 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('wartortle', ['water']),
    },
    {
      id: 9,
      name: 'Blastoise',
      speciesName: 'blastoise',
      stageNumber: 3,
      ...buildStageSprites(9),
      types: ['water'],
      stats: { hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78 },
      canMega: true,
      megaName: 'Mega Blastoise',
      megaSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10036.gif',
      canGmax: true,
      gmaxName: 'Blastoise Gigantamax',
      gmaxSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10198.gif',
      ...getSpeciesLearnset('blastoise', ['water']),
    },
  ],
  bulbasaur: [
    {
      id: 1,
      name: 'Bulbasaur',
      speciesName: 'bulbasaur',
      stageNumber: 1,
      ...buildStageSprites(1),
      types: ['grass', 'poison'],
      stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('bulbasaur', ['grass', 'poison']),
    },
    {
      id: 2,
      name: 'Ivysaur',
      speciesName: 'ivysaur',
      stageNumber: 2,
      ...buildStageSprites(2),
      types: ['grass', 'poison'],
      stats: { hp: 60, attack: 62, defense: 63, specialAttack: 80, specialDefense: 80, speed: 60 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('ivysaur', ['grass', 'poison']),
    },
    {
      id: 3,
      name: 'Venusaur',
      speciesName: 'venusaur',
      stageNumber: 3,
      ...buildStageSprites(3),
      types: ['grass', 'poison'],
      stats: { hp: 80, attack: 82, defense: 83, specialAttack: 100, specialDefense: 100, speed: 80 },
      canMega: true,
      megaName: 'Mega Venusaur',
      megaSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10033.gif',
      canGmax: true,
      gmaxName: 'Venusaur Gigantamax',
      gmaxSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10197.gif',
      ...getSpeciesLearnset('venusaur', ['grass', 'poison']),
    },
  ],
  pichu: [
    {
      id: 172,
      name: 'Pichu',
      speciesName: 'pichu',
      stageNumber: 1,
      ...buildStageSprites(172),
      types: ['electric'],
      stats: { hp: 20, attack: 40, defense: 15, specialAttack: 35, specialDefense: 35, speed: 60 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('pichu', ['electric']),
    },
    {
      id: 25,
      name: 'Pikachu',
      speciesName: 'pikachu',
      stageNumber: 2,
      ...buildStageSprites(25),
      types: ['electric'],
      stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
      canMega: false,
      canGmax: true,
      gmaxName: 'Pikachu Gigantamax',
      gmaxSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10199.gif',
      ...getSpeciesLearnset('pikachu', ['electric']),
    },
    {
      id: 26,
      name: 'Raichu',
      speciesName: 'raichu',
      stageNumber: 3,
      ...buildStageSprites(26),
      types: ['electric'],
      stats: { hp: 60, attack: 90, defense: 55, specialAttack: 90, specialDefense: 80, speed: 110 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('raichu', ['electric']),
    },
  ],
  machop: [
    {
      id: 66,
      name: 'Machop',
      speciesName: 'machop',
      stageNumber: 1,
      ...buildStageSprites(66),
      types: ['fighting'],
      stats: { hp: 70, attack: 80, defense: 50, specialAttack: 35, specialDefense: 35, speed: 35 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('machop', ['fighting']),
    },
    {
      id: 67,
      name: 'Machoke',
      speciesName: 'machoke',
      stageNumber: 2,
      ...buildStageSprites(67),
      types: ['fighting'],
      stats: { hp: 80, attack: 100, defense: 70, specialAttack: 50, specialDefense: 60, speed: 45 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('machoke', ['fighting']),
    },
    {
      id: 68,
      name: 'Machamp',
      speciesName: 'machamp',
      stageNumber: 3,
      ...buildStageSprites(68),
      types: ['fighting'],
      stats: { hp: 90, attack: 130, defense: 80, specialAttack: 65, specialDefense: 85, speed: 55 },
      canMega: false,
      canGmax: true,
      gmaxName: 'Machamp Gigantamax',
      gmaxSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10201.gif',
      ...getSpeciesLearnset('machamp', ['fighting']),
    },
  ],
  gible: [
    {
      id: 443,
      name: 'Gible',
      speciesName: 'gible',
      stageNumber: 1,
      ...buildStageSprites(443),
      types: ['dragon', 'ground'],
      stats: { hp: 58, attack: 70, defense: 45, specialAttack: 40, specialDefense: 45, speed: 42 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('gible', ['dragon', 'ground']),
    },
    {
      id: 444,
      name: 'Gabite',
      speciesName: 'gabite',
      stageNumber: 2,
      ...buildStageSprites(444),
      types: ['dragon', 'ground'],
      stats: { hp: 68, attack: 90, defense: 65, specialAttack: 50, specialDefense: 55, speed: 82 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('gabite', ['dragon', 'ground']),
    },
    {
      id: 445,
      name: 'Garchomp',
      speciesName: 'garchomp',
      stageNumber: 3,
      ...buildStageSprites(445),
      types: ['dragon', 'ground'],
      stats: { hp: 108, attack: 130, defense: 95, specialAttack: 80, specialDefense: 85, speed: 102 },
      canMega: true,
      megaName: 'Mega Garchomp',
      megaSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10058.gif',
      canGmax: false,
      ...getSpeciesLearnset('garchomp', ['dragon', 'ground']),
    },
  ],
  dratini: [
    {
      id: 147,
      name: 'Dratini',
      speciesName: 'dratini',
      stageNumber: 1,
      ...buildStageSprites(147),
      types: ['dragon'],
      stats: { hp: 41, attack: 64, defense: 45, specialAttack: 50, specialDefense: 50, speed: 50 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('dratini', ['dragon']),
    },
    {
      id: 148,
      name: 'Dragonair',
      speciesName: 'dragonair',
      stageNumber: 2,
      ...buildStageSprites(148),
      types: ['dragon'],
      stats: { hp: 61, attack: 84, defense: 65, specialAttack: 70, specialDefense: 70, speed: 70 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('dragonair', ['dragon']),
    },
    {
      id: 149,
      name: 'Dragonite',
      speciesName: 'dragonite',
      stageNumber: 3,
      ...buildStageSprites(149),
      types: ['dragon', 'flying'],
      stats: { hp: 91, attack: 134, defense: 95, specialAttack: 100, specialDefense: 100, speed: 80 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('dragonite', ['dragon', 'flying']),
    },
  ],
  larvitar: [
    {
      id: 246,
      name: 'Larvitar',
      speciesName: 'larvitar',
      stageNumber: 1,
      ...buildStageSprites(246),
      types: ['rock', 'ground'],
      stats: { hp: 50, attack: 64, defense: 50, specialAttack: 45, specialDefense: 50, speed: 41 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('larvitar', ['rock', 'ground']),
    },
    {
      id: 247,
      name: 'Pupitar',
      speciesName: 'pupitar',
      stageNumber: 2,
      ...buildStageSprites(247),
      types: ['rock', 'ground'],
      stats: { hp: 70, attack: 84, defense: 70, specialAttack: 65, specialDefense: 70, speed: 51 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('pupitar', ['rock', 'ground']),
    },
    {
      id: 248,
      name: 'Tyranitar',
      speciesName: 'tyranitar',
      stageNumber: 3,
      ...buildStageSprites(248),
      types: ['rock', 'dark'],
      stats: { hp: 100, attack: 134, defense: 110, specialAttack: 95, specialDefense: 100, speed: 61 },
      canMega: true,
      megaName: 'Mega Tyranitar',
      megaSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10049.gif',
      canGmax: false,
      ...getSpeciesLearnset('tyranitar', ['rock', 'dark']),
    },
  ],
  froakie: [
    {
      id: 656,
      name: 'Froakie',
      speciesName: 'froakie',
      stageNumber: 1,
      ...buildStageSprites(656),
      types: ['water'],
      stats: { hp: 41, attack: 56, defense: 40, specialAttack: 62, specialDefense: 44, speed: 71 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('froakie', ['water']),
    },
    {
      id: 657,
      name: 'Frogadier',
      speciesName: 'frogadier',
      stageNumber: 2,
      ...buildStageSprites(657),
      types: ['water'],
      stats: { hp: 54, attack: 63, defense: 52, specialAttack: 83, specialDefense: 56, speed: 97 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('frogadier', ['water']),
    },
    {
      id: 658,
      name: 'Greninja',
      speciesName: 'greninja',
      stageNumber: 3,
      ...buildStageSprites(658),
      types: ['water', 'dark'],
      stats: { hp: 72, attack: 95, defense: 67, specialAttack: 103, specialDefense: 71, speed: 122 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('greninja', ['water', 'dark']),
    },
  ],
  beldum: [
    {
      id: 374,
      name: 'Beldum',
      speciesName: 'beldum',
      stageNumber: 1,
      ...buildStageSprites(374),
      types: ['steel', 'psychic'],
      stats: { hp: 40, attack: 55, defense: 80, specialAttack: 35, specialDefense: 60, speed: 30 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('beldum', ['steel', 'psychic']),
    },
    {
      id: 375,
      name: 'Metang',
      speciesName: 'metang',
      stageNumber: 2,
      ...buildStageSprites(375),
      types: ['steel', 'psychic'],
      stats: { hp: 60, attack: 75, defense: 100, specialAttack: 55, specialDefense: 80, speed: 50 },
      canMega: false,
      canGmax: false,
      ...getSpeciesLearnset('metang', ['steel', 'psychic']),
    },
    {
      id: 376,
      name: 'Metagross',
      speciesName: 'metagross',
      stageNumber: 3,
      ...buildStageSprites(376),
      types: ['steel', 'psychic'],
      stats: { hp: 80, attack: 135, defense: 130, specialAttack: 95, specialDefense: 90, speed: 70 },
      canMega: true,
      megaName: 'Mega Metagross',
      megaSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10076.gif',
      canGmax: false,
      ...getSpeciesLearnset('metagross', ['steel', 'psychic']),
    },
  ],
};

export async function fetchPokemonEvolutionChain(speciesName: string): Promise<EvolutionStage[]> {
  const normalized = speciesName.toLowerCase().trim();
  if (EVOLUTION_PRESETS[normalized]) {
    return EVOLUTION_PRESETS[normalized];
  }

  const learnsetData = getSpeciesLearnset(normalized, ['normal']);
  return [
    {
      id: 25,
      name: normalized.charAt(0).toUpperCase() + normalized.slice(1),
      speciesName: normalized,
      stageNumber: 1,
      ...buildStageSprites(25),
      types: ['normal'],
      stats: { hp: 60, attack: 75, defense: 60, specialAttack: 75, specialDefense: 60, speed: 90 },
      canMega: false,
      canGmax: false,
      learnset: learnsetData.learnset,
      defaultMoves: learnsetData.defaultMoves,
    },
  ];
}

// Generates 6 Draft Pokemon with 1/4096 Shiny Chance!
export async function generateDraftPool(chaosMechanic: ChaosMechanic): Promise<DraftPokemon[]> {
  const chosenSpecies: string[] = [];

  if (chaosMechanic === 'Mega Evolution') {
    const megaOptions = [...MEGA_ELIGIBLE_SPECIES].sort(() => 0.5 - Math.random());
    chosenSpecies.push(megaOptions[0]);
  } else if (chaosMechanic === 'Gigantamax') {
    const gmaxOptions = [...GMAX_ELIGIBLE_SPECIES].sort(() => 0.5 - Math.random());
    chosenSpecies.push(gmaxOptions[0]);
  }

  const candidates = [...GENERAL_SPECIES_POOL].sort(() => 0.5 - Math.random());
  while (chosenSpecies.length < 6 && candidates.length > 0) {
    const next = candidates.pop()!;
    if (!chosenSpecies.includes(next)) {
      chosenSpecies.push(next);
    }
  }

  const allPossible = Object.keys(EVOLUTION_PRESETS);
  while (chosenSpecies.length < 6) {
    const next = allPossible[Math.floor(Math.random() * allPossible.length)];
    if (!chosenSpecies.includes(next)) {
      chosenSpecies.push(next);
    }
  }

  chosenSpecies.sort(() => 0.5 - Math.random());

  const promises = chosenSpecies.map(async (species) => {
    const stages = await fetchPokemonEvolutionChain(species);
    const highestStageIdx = stages.length - 1;
    const canMega = stages.some((st) => st.canMega);
    const canGmax = stages.some((st) => st.canGmax);

    // 1 in 4096 Shiny Probability! (Or boosted if lucky roll)
    const isShiny = Math.random() < (1 / 4096) || Math.random() < 0.05; // 5% base demo rate for user delight, standard 1/4096 base

    return {
      baseId: stages[0].id,
      speciesName: species,
      evolutionStages: stages,
      currentStageIndex: highestStageIdx,
      canMega,
      canGmax,
      isShiny,
    };
  });

  return Promise.all(promises);
}

export function generateRandomAbilities(count = 8): Ability[] {
  return [...ABILITIES_POOL].sort(() => 0.5 - Math.random()).slice(0, count);
}

// Generates 12 distinct held items from ALL_COMPETITIVE_ITEMS + Mega Stones if Mega Gimmick
export function generateRandomHeldItems(chaosMechanic: ChaosMechanic, count = 12): HeldItem[] {
  const items: HeldItem[] = [];

  if (chaosMechanic === 'Mega Evolution') {
    const stones = Object.values(MEGA_STONES);
    stones.sort(() => 0.5 - Math.random());
    items.push(...stones.slice(0, 3));
  }

  const competitivePool = [...ALL_COMPETITIVE_ITEMS].sort(() => 0.5 - Math.random());
  for (const item of competitivePool) {
    if (items.length >= count) break;
    if (!items.some((i) => i.id === item.id)) {
      items.push(item);
    }
  }

  return items;
}
