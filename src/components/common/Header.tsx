import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { toggleSound, isSoundEnabled, toggleMusic, isMusicEnabled } from '../../lib/audio';
import { PokedexModal } from './PokedexModal';
import { LeaderboardModal } from './LeaderboardModal';
import { RotateCcw, Volume2, VolumeX, Music, BookOpen, Trophy, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { gameState, chaosMechanic, discordUser, resetGame } = useGameStore();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [musicOn, setMusicOn] = useState(isMusicEnabled());

  const [showPokedex, setShowPokedex] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  const handleToggleMusic = () => {
    const next = toggleMusic();
    setMusicOn(next);
  };

  return (
    <>
      <header className="w-full bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between sticky top-0 z-30 select-none">
        {/* Brand & Mode */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-black text-sm">
            PS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight text-white m-0 p-0 leading-none">
                POKÉDRAFT <span className="text-amber-400">SHOWDOWN</span>
              </h1>
              <span className="text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {gameState}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 m-0 leading-tight font-mono mt-0.5">
              1v1 Competitive Simulator • Discord Activity
            </p>
          </div>
        </div>

        {/* Global Chaos Mechanic Badge (if determined) */}
        {chaosMechanic !== 'None' && gameState === 'BATTLE' && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono text-slate-300">
              Regra: <strong className="text-amber-300">{chaosMechanic}</strong>
            </span>
          </div>
        )}

        {/* Navigation Actions: Pokédex, Leaderboard, Music/SFX, Reset */}
        <div className="flex items-center gap-1.5">
          {/* Pokédex Button */}
          <button
            onClick={() => setShowPokedex(true)}
            title="Abrir Pokédex de Draft"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Pokédex</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => setShowLeaderboard(true)}
            title="Classificação Discord & Perfil 3D"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ranking</span>
          </button>

          {/* Music Toggle */}
          <button
            onClick={handleToggleMusic}
            title={musicOn ? 'Pausar Música Chiptune' : 'Tocar Música Chiptune'}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            <Music className={`w-3.5 h-3.5 ${musicOn ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
          </button>

          {/* Sound SFX Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'Desativar Sons' : 'Ativar Sons'}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Discord User Pill */}
          {discordUser && (
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
              <img
                src={discordUser.avatar || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png'}
                alt={discordUser.username}
                className="w-5 h-5 rounded-full border border-slate-600 object-cover bg-slate-700"
              />
              <span className="text-xs font-medium text-slate-300">
                {discordUser.globalName || discordUser.username}
              </span>
            </div>
          )}

          {gameState !== 'LOBBY' && (
            <button
              onClick={resetGame}
              title="Voltar ao Lobby"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Lobby</span>
            </button>
          )}
        </div>
      </header>

      {/* Pokédex Modal */}
      {showPokedex && (
        <PokedexModal onClose={() => setShowPokedex(false)} />
      )}

      {/* Leaderboard & 3D Trainer Card Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          currentUsername={discordUser?.globalName || discordUser?.username || 'TrainerRed'}
          userAvatar={discordUser?.avatar || null}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </>
  );
};
