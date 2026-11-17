import React, { useState } from 'react';
import { getDiscordLeaderboard, getStoredProfile, TRAINER_AVATARS, saveTrainerAvatarIndex } from '../../lib/pokedexStore';
import { Trophy, Flame, Sparkles, X, Medal, UserCheck } from 'lucide-react';

interface LeaderboardModalProps {
  currentUsername: string;
  userAvatar: string | null;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentUsername,
  userAvatar,
  onClose,
}) => {
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const leaderboard = getDiscordLeaderboard(currentUsername, userAvatar);

  const handleSelectAvatar = (idx: number) => {
    const updated = saveTrainerAvatarIndex(idx);
    setProfile({ ...updated });
    setShowAvatarPicker(false);
  };

  const currentAvatarUrl = userAvatar || TRAINER_AVATARS[profile.selectedAvatarIndex]?.url || TRAINER_AVATARS[0].url;

  const getRankBadgeColor = (rank: number) => {
    if (rank === 0) return 'text-amber-400 bg-amber-950 border-amber-600';
    if (rank === 1) return 'text-slate-300 bg-slate-800 border-slate-600';
    if (rank === 2) return 'text-amber-600 bg-amber-950/60 border-amber-800';
    return 'text-slate-500 bg-slate-900 border-slate-800';
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl p-5 relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-700 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white m-0 leading-tight">
                Leaderboard do Servidor Discord & Perfil 3D
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Classificação Elo dos membros da chamada de voz e histórico competitivo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top: 3D Trainer Card */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950 p-4 rounded-xl border border-indigo-900/60 shadow-lg mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(!showAvatarPicker)} title="Clica para mudar o teu avatar">
              <img
                src={currentAvatarUrl}
                alt={currentUsername}
                className="w-16 h-16 rounded-xl border-2 border-amber-400 object-cover bg-slate-800 shadow-md transform group-hover:scale-105 transition duration-300"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                Lv.50
              </span>
              <div className="absolute inset-0 bg-slate-950/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-[10px] text-amber-300 font-bold">
                Mudar
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white m-0">
                  {currentUsername || 'Treinador Red'}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                  {leaderboard.find((u) => u.isCurrentUser)?.rankTitle || 'Treinador Novato'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Pontuação Elo: <strong className="text-amber-400">{profile.points} PTS</strong>
              </p>
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-mono cursor-pointer mt-0.5 block"
              >
                {showAvatarPicker ? 'Fechar Seleção de Avatar' : 'Personalizar Avatar 3D'}
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs w-full sm:w-auto">
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Vitórias</span>
              <span className="font-bold text-emerald-400">{profile.wins}</span>
            </div>
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Derrotas</span>
              <span className="font-bold text-rose-400">{profile.losses}</span>
            </div>
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Streak</span>
              <span className="font-bold text-amber-300 flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-400" />
                {profile.streak}
              </span>
            </div>
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Shinies</span>
              <span className="font-bold text-purple-300 flex items-center justify-center gap-0.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                {profile.shiniesFound}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar Picker Drawer */}
        {showAvatarPicker && (
          <div className="mb-4 p-3 bg-slate-950 border border-indigo-700/60 rounded-xl animate-in slide-in-from-top-2 duration-150 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-300">Escolhe o teu Avatar de Treinador:</span>
              <span className="text-[10px] text-slate-500">Salva instantaneamente</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TRAINER_AVATARS.map((av, idx) => (
                <button
                  key={av.id}
                  onClick={() => handleSelectAvatar(idx)}
                  className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition cursor-pointer ${
                    profile.selectedAvatarIndex === idx
                      ? 'bg-indigo-950 border-amber-400 ring-2 ring-amber-400/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={av.url} alt={av.name} className="w-12 h-12 object-contain" />
                  <span className="text-[9px] text-slate-300 truncate max-w-full font-mono">{av.name.split(' ')[0]}</span>
                  {profile.selectedAvatarIndex === idx && (
                    <UserCheck className="w-3 h-3 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Discord Server Ranking Table */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0">
          <div className="space-y-1.5">
            {leaderboard.map((user, idx) => {
              const isMe = user.isCurrentUser;

              return (
                <div
                  key={user.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isMe
                      ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Position */}
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-black text-xs shrink-0 ${getRankBadgeColor(
                        idx
                      )}`}
                    >
                      {idx === 0 ? <Medal className="w-4 h-4 text-amber-400" /> : `#${idx + 1}`}
                    </div>

                    {/* Avatar & Name */}
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-slate-800 shrink-0"
                    />

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isMe ? 'text-amber-300' : 'text-white'}`}>
                          {user.displayName}
                        </span>
                        {isMe && (
                          <span className="text-[9px] font-mono px-1 rounded bg-indigo-600 text-white">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {user.rankTitle}
                      </span>
                    </div>
                  </div>

                  {/* Points & Stats */}
                  <div className="flex items-center gap-4 text-right shrink-0 font-mono text-xs">
                    <div className="hidden sm:block text-[11px] text-slate-400">
                      <span className="text-emerald-400">{user.wins}V</span> - <span className="text-rose-400">{user.losses}D</span>
                    </div>
                    <div>
                      <span className="font-bold text-amber-400 text-sm block">
                        {user.points} <span className="text-[10px] text-slate-500">PTS</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database sync note */}
        <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between shrink-0">
          <span>Sincronização com Cloudflare D1 / Firebase Firestore pronta</span>
          <span>Atualizado em tempo real</span>
        </div>
      </div>
    </div>
  );
};
