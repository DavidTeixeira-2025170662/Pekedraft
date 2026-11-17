import { DiscordSDK } from '@discord/embedded-app-sdk';

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  globalName?: string;
}

let discordSdkInstance: DiscordSDK | null = null;
let isDiscordEnvironment = false;

// Attempt to detect if running inside Discord iframe
export function checkIsDiscord(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('frame_id') || !!window.parent && window.parent !== window;
}

export async function initializeDiscordSdk(): Promise<{
  isReady: boolean;
  user: DiscordUser;
}> {
  const fallbackUser: DiscordUser = {
    id: 'user_trainer_red',
    username: 'TrainerRed',
    discriminator: '0001',
    avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png',
    globalName: 'Mestre Pokémon',
  };

  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID || '123456789012345678';
  isDiscordEnvironment = checkIsDiscord();

  if (!isDiscordEnvironment) {
    console.log('[DiscordSDK] Running outside Discord Activity frame. Mocking session for dev.');
    return {
      isReady: true,
      user: fallbackUser,
    };
  }

  try {
    discordSdkInstance = new DiscordSDK(clientId);
    await discordSdkInstance.ready();
    console.log('[DiscordSDK] Discord SDK initialized successfully!');

    return {
      isReady: true,
      user: fallbackUser,
    };
  } catch (err) {
    console.warn('[DiscordSDK] Discord SDK failed to connect, falling back to standalone mode:', err);
    return {
      isReady: true,
      user: fallbackUser,
    };
  }
}

export function getDiscordSdk() {
  return discordSdkInstance;
}

