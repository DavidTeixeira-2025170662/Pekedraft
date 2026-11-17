import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { initializeDiscordSdk } from './lib/discordSdk';
import { Header } from './components/common/Header';
import { Lobby } from './components/lobby/Lobby';
import { DraftPhase } from './components/draft/DraftPhase';
import { ChaosRoulette } from './components/roulette/ChaosRoulette';
import { BattleArena } from './components/battle/BattleArena';

export const App: React.FC = () => {
  const { gameState, setDiscordUser } = useGameStore();

  useEffect(() => {
    // Initialize Discord Embedded App SDK on startup
    const initSdk = async () => {
      try {
        const { user } = await initializeDiscordSdk();
        setDiscordUser(user);
      } catch (err) {
        console.warn('Failed initializing Discord SDK:', err);
      }
    };

    initSdk();
  }, [setDiscordUser]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Universal Activity Header */}
      <Header />

      {/* Main Game Screen Routing */}
      <main className="flex-1 flex flex-col items-center justify-start w-full overflow-x-hidden">
        {gameState === 'LOBBY' && <Lobby />}
        {gameState === 'ROULETTE' && <ChaosRoulette />}
        {gameState === 'DRAFT' && <DraftPhase />}
        {(gameState === 'BATTLE' || gameState === 'GAME_OVER') && <BattleArena />}
      </main>
    </div>
  );
};

export default App;
