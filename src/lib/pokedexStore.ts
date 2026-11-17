import type { LeaderboardUser, PokedexRecord, TeamMember } from '../types/pokemon';

const POKEDEX_STORAGE_KEY = 'pokedraft_pokedex_v1';
const PROFILE_STORAGE_KEY = 'pokedraft_profile_v1';

export function getStoredPokedex(): Record<string, PokedexRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(POKEDEX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePokedexRecord(member: TeamMember) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredPokedex();
    const species = member.pokemon.speciesName.toLowerCase();

    const existing = current[species] || {
      speciesName: species,
      displayName: member.pokemon.name,
      sprite: member.pokemon.sprite,
      shinySprite: member.pokemon.shinySprite || member.pokemon.sprite,
      types: member.pokemon.types,
      timesDrafted: 0,
      hasSeenShiny: false,
    };

    existing.timesDrafted += 1;
    if (member.isShiny) {
      existing.hasSeenShiny = true;
    }

    current[species] = existing;
    localStorage.setItem(POKEDEX_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

export interface TrainerProfile {
  points: number; // Elo
  wins: number;
  losses: number;
  streak: number;
  shiniesFound: number;
  selectedAvatarIndex: number;
}

export function getStoredProfile(): TrainerProfile {
  const defaultProfile: TrainerProfile = {
    points: 1000,
    wins: 0,
    losses: 0,
    streak: 0,
    shiniesFound: 0,
    selectedAvatarIndex: 0,
  };

  if (typeof window === 'undefined') return defaultProfile;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function recordMatchResult(isWin: boolean): TrainerProfile {
  const profile = getStoredProfile();

  if (isWin) {
    profile.wins += 1;
    profile.streak += 1;
    profile.points += 25 + Math.min(15, profile.streak * 3); // Win bonus
  } else {
    profile.losses += 1;
    profile.streak = 0;
    profile.points = Math.max(800, profile.points - 18);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  return profile;
}

export function incrementShinyCount(): TrainerProfile {
  const profile = getStoredProfile();
  profile.shiniesFound += 1;
  profile.points += 50; // Shiny discovery reward!
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }
  return profile;
}

export const TRAINER_AVATARS = [
  { id: 'red', name: 'Red (Kanto Champion)', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png' },
  { id: 'blue', name: 'Blue (Rival)', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png' },
  { id: 'cynthia', name: 'Cynthia (Sinnoh Champ)', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/10.png' },
  { id: 'steven', name: 'Steven (Hoenn Champ)', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/15.png' },
  { id: 'lance', name: 'Lance (Dragon Master)', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/20.png' },
  { id: 'dawn', name: 'Dawn (Diamond Master)', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/26.png' },
];

export function saveTrainerAvatarIndex(index: number): TrainerProfile {
  const profile = getStoredProfile();
  profile.selectedAvatarIndex = Math.max(0, Math.min(TRAINER_AVATARS.length - 1, index));
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }
  return profile;
}

export function getRankTitle(points: number): string {
  if (points >= 1500) return 'Mestre Supremo da Liga';
  if (points >= 1350) return 'Elite Four de Kanto';
  if (points >= 1200) return 'Líder de Ginásio';
  if (points >= 1080) return 'Veterano das Rotas';
  return 'Treinador Novato';
}

// Generate Discord Group Leaderboard with current player ranked among server friends
export function getDiscordLeaderboard(currentUsername: string, userAvatar: string | null): LeaderboardUser[] {
  const profile = getStoredProfile();

  const mockServerPeers: LeaderboardUser[] = [
    {
      id: 'usr_cynthia',
      username: 'Cynthia_Sinnoh',
      displayName: 'Cynthia 🏆',
      avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/10.png',
      points: 1580,
      rankTitle: 'Mestre Supremo da Liga',
      wins: 48,
      losses: 6,
      streak: 9,
      shiniesFound: 3,
    },
    {
      id: 'usr_steven',
      username: 'StevenStone',
      displayName: 'Steven Stone',
      avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/15.png',
      points: 1420,
      rankTitle: 'Elite Four de Kanto',
      wins: 35,
      losses: 12,
      streak: 4,
      shiniesFound: 2,
    },
    {
      id: 'usr_lance',
      username: 'DragonMasterLance',
      displayName: 'Lance (Dragões)',
      avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/20.png',
      points: 1310,
      rankTitle: 'Líder de Ginásio',
      wins: 29,
      losses: 15,
      streak: 2,
      shiniesFound: 1,
    },
    {
      id: 'usr_blue',
      username: 'GaryOak_01',
      displayName: 'Blue / Gary',
      avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png',
      points: 1190,
      rankTitle: 'Veterano das Rotas',
      wins: 22,
      losses: 18,
      streak: 0,
      shiniesFound: 0,
    },
    {
      id: 'usr_brock',
      username: 'PewterBrock',
      displayName: 'Brock (Pewter Gym)',
      avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png',
      points: 980,
      rankTitle: 'Treinador Novato',
      wins: 11,
      losses: 16,
      streak: 1,
      shiniesFound: 0,
    },
  ];

  const selectedAvatarUrl = TRAINER_AVATARS[profile.selectedAvatarIndex]?.url || TRAINER_AVATARS[0].url;

  const currentUserEntry: LeaderboardUser = {
    id: 'current_user',
    username: currentUsername || 'TrainerRed',
    displayName: currentUsername || 'Você (Mestre Pokémon)',
    avatar: userAvatar || selectedAvatarUrl,
    points: profile.points,
    rankTitle: getRankTitle(profile.points),
    wins: profile.wins,
    losses: profile.losses,
    streak: profile.streak,
    shiniesFound: profile.shiniesFound,
    isCurrentUser: true,
  };

  const fullList = [...mockServerPeers, currentUserEntry];
  fullList.sort((a, b) => b.points - a.points);

  return fullList;
}

