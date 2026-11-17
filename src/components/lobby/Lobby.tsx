import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { VoiceCallLobbyModal } from '../multiplayer/VoiceCallLobbyModal';
import { PokedexModal } from '../common/PokedexModal';
import { LeaderboardModal } from '../common/LeaderboardModal';
import { getStoredProfile, getStoredPokedex, getDiscordLeaderboard, TRAINER_AVATARS } from '../../lib/pokedexStore';
import { GENERAL_SPECIES_POOL } from '../../api/pokeapi';
import { CHAOS_MECHANICS } from '../../constants/mechanics';
import { playClickSound } from '../../lib/audio';
import {
  Bot,
  Users,
  Trophy,
  BookOpen,
  Sparkles,
  Flame,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const Lobby: React.FC = () => {
  const { startRoulettePhase, setGameMode, discordUser } = useGameStore();
  const [showVoiceLobby, setShowVoiceLobby] = useState(false);
  const [showPokedex, setShowPokedex] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Live profile & pokedex data
  const profile = getStoredProfile();
  const storedPokedex = getStoredPokedex();
  const currentUsername = discordUser?.globalName || discordUser?.username || 'TrainerRed';
  const currentAvatarUrl =
    discordUser?.avatar || TRAINER_AVATARS[profile.selectedAvatarIndex]?.url || TRAINER_AVATARS[0].url;

  const leaderboard = getDiscordLeaderboard(currentUsername, discordUser?.avatar || null);
  const myRankIndex = leaderboard.findIndex((u) => u.isCurrentUser);

  const allSpeciesCount = Array.from(new Set(GENERAL_SPECIES_POOL)).length;
  const draftedCount = Object.keys(storedPokedex).length;
  const shinyCount = Object.values(storedPokedex).filter((p) => p.hasSeenShiny).length;
  const draftedList = Object.values(storedPokedex).slice(0, 6);

  const handleStartSolo = () => {
    playClickSound();
    setGameMode('SOLO');
    startRoulettePhase();
  };

  const handleStartOnlineMatch = (roomCode: string) => {
    playClickSound();
    setGameMode('MULTIPLAYER');
    console.log('[Multiplayer] Conectando à sala:', roomCode);
    startRoulettePhase();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-3 sm:p-5 max-w-5xl mx-auto w-full text-center gap-5">
      {/* 1. Top Profile Bar with Live Elo & Pokédex Progress */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* User Card */}
        <div
          onClick={() => {
            playClickSound();
            setShowLeaderboard(true);
          }}
          className="flex items-center gap-3 cursor-pointer group hover:bg-slate-800/60 p-1.5 rounded-xl transition"
          title="Ver o teu perfil completo e classificação"
        >
          <div className="relative">
            <img
              src={currentAvatarUrl}
              alt={currentUsername}
              className="w-12 h-12 rounded-xl border-2 border-amber-400/80 object-cover bg-slate-950 shadow group-hover:scale-105 transition"
            />
            <span className="absolute -bottom-1 -right-1 p-0.5 px-1 bg-indigo-600 text-[9px] font-bold text-white rounded">
              Lv.50
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                {currentUsername}
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/80 px-1.5 py-0.2 rounded">
                #{myRankIndex + 1}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Elo: <strong className="text-amber-400 font-bold">{profile.points} PTS</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{profile.wins}V - {profile.losses}D</span>
              {profile.streak > 0 && (
                <span className="text-amber-400 flex items-center font-bold">
                  <Flame className="w-3 h-3" /> {profile.streak}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Access Badges (Pokédex & Leaderboard buttons) */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Pokédex pill */}
          <button
            onClick={() => {
              playClickSound();
              setShowPokedex(true);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 hover:border-rose-500/60 text-slate-200 transition shadow hover:bg-slate-900 cursor-pointer"
          >
            <div className="p-1 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[10px] text-slate-400 uppercase leading-none">Pokédex</div>
              <div className="font-bold text-emerald-400 text-xs">
                {draftedCount}/{allSpeciesCount} <span className="text-amber-300 text-[10px]">({shinyCount}★)</span>
              </div>
            </div>
          </button>

          {/* Ranking pill */}
          <button
            onClick={() => {
              playClickSound();
              setShowLeaderboard(true);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 hover:border-amber-500/60 text-slate-200 transition shadow hover:bg-slate-900 cursor-pointer"
          >
            <div className="p-1 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[10px] text-slate-400 uppercase leading-none">Ranking Elo</div>
              <div className="font-bold text-amber-400 text-xs">
                {profile.points} <span className="text-slate-500 text-[10px]">PTS</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Hero Mascot & Title Section */}
      <div className="relative my-1">
        {/* Ambient Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-r from-purple-600/20 via-amber-500/20 to-indigo-600/20 blur-3xl -z-10 pointer-events-none" />

        <div className="flex items-center justify-center gap-3 mb-2">
          {/* Floating Mascots */}
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif"
            alt="Charizard"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-bounce hidden sm:block"
            style={{ animationDuration: '3s' }}
          />

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono font-bold tracking-widest text-amber-300 uppercase bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-600/60 px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              POKÉMON SHOWDOWN ENGINE • DISCORD ACTIVITY 1V1
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-400 tracking-tight m-0 drop-shadow">
              POKÉDRAFT <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">SHOWDOWN</span>
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mt-2 leading-relaxed">
              Draft dinâmico de 6 Pokémon, mecânicas do caos pré-sorteadas, dano autêntico com stats em tempo real e batalhas na chamada de voz do Discord!
            </p>
          </div>

          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/448.gif"
            alt="Lucario"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-bounce hidden sm:block"
            style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}
          />
        </div>
      </div>

      {/* 3. Primary Game Mode Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {/* Solo Bot Mode */}
        <div
          onClick={handleStartSolo}
          className="relative bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-slate-700/80 hover:border-indigo-400 rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer text-left group shadow-xl hover:-translate-y-1 hover:shadow-indigo-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/80 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition shadow">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700">
              MODO RANQUEADO
            </span>
          </div>

          <h2 className="text-lg font-black text-white group-hover:text-amber-300 transition m-0 flex items-center gap-1.5">
            Batalha Solo vs Bot
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-amber-400" />
          </h2>

          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Enfrenta a inteligência artificial competitiva com turnos de 40s. Ganha vitórias para subir na Leaderboard do servidor Discord!
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> +25 PTS por Vitória
            </span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center gap-1">
              Jogar Agora <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Multiplayer Mode in Discord Voice Call */}
        <div
          onClick={() => {
            playClickSound();
            setShowVoiceLobby(true);
          }}
          className="relative bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border-2 border-slate-700/80 hover:border-emerald-400 rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer text-left group shadow-xl hover:-translate-y-1 hover:shadow-emerald-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/80 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition shadow">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 animate-pulse">
              DISCORD VOICE CALL
            </span>
          </div>

          <h2 className="text-lg font-black text-white group-hover:text-emerald-300 transition m-0 flex items-center gap-1.5">
            Duelo Online 1v1
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-emerald-400" />
          </h2>

          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Convida um amigo presente na chamada de voz do Discord. Ambos entram na mesma sala com o mesmo sorteio da Roleta do Caos!
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              Código de Sala Instantâneo
            </span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1">
              Abrir Sala <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 4. Live Ranking & Pokédex Preview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-4xl text-left">
        {/* Top 3 Discord Server Podium */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 m-0">
                  Top Treinadores do Servidor
                </h3>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setShowLeaderboard(true);
                }}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 cursor-pointer underline"
              >
                Ver Leaderboard Completa
              </button>
            </div>

            <div className="space-y-1.5 mt-2">
              {leaderboard.slice(0, 3).map((user, idx) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 p-2 rounded-xl text-xs font-mono"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-amber-400 w-4 text-center">
                      #{idx + 1}
                    </span>
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-6 h-6 rounded-full border border-slate-700 bg-slate-900 object-cover"
                    />
                    <span className="text-white truncate max-w-[120px] font-bold">
                      {user.displayName}
                    </span>
                  </div>
                  <span className="text-amber-300 font-bold">
                    {user.points} <span className="text-[10px] text-slate-500">PTS</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pokédex Collection Live Thumbnails */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 m-0">
                  Pokédex de Coleção ({draftedCount}/{allSpeciesCount})
                </h3>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setShowPokedex(true);
                }}
                className="text-[10px] font-mono text-rose-400 hover:text-rose-300 cursor-pointer underline"
              >
                Abrir Pokédex
              </button>
            </div>

            {draftedList.length > 0 ? (
              <div className="grid grid-cols-6 gap-1.5 mt-2">
                {draftedList.map((item) => (
                  <div
                    key={item.speciesName}
                    className="p-1 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center relative group"
                    title={`${item.displayName} (${item.timesDrafted}x)`}
                  >
                    <img
                      src={item.hasSeenShiny ? item.shinySprite : item.sprite}
                      alt={item.displayName}
                      className="w-10 h-10 object-contain drop-shadow"
                    />
                    {item.hasSeenShiny && (
                      <Sparkles className="w-2.5 h-2.5 text-amber-400 absolute top-0.5 right-0.5" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500 italic mt-2">
                Ainda não draftaste nenhum Pokémon. Inicia a tua primeira partida para registar!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Chaos Gimmicks Legend Preview */}
      <div className="w-full max-w-4xl bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
          Mecânicas da Roleta:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.values(CHAOS_MECHANICS).map((m) => (
            <span
              key={m.type}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border ${m.badgeBg} text-white shadow-sm`}
            >
              <span>{m.icon}</span>
              <span>{m.title}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showVoiceLobby && (
        <VoiceCallLobbyModal
          onStartOnlineMatch={handleStartOnlineMatch}
          onClose={() => setShowVoiceLobby(false)}
        />
      )}

      {showPokedex && (
        <PokedexModal onClose={() => setShowPokedex(false)} />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          currentUsername={currentUsername}
          userAvatar={discordUser?.avatar || null}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};
