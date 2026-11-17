import React, { useState } from 'react';
import { getDiscordSdk } from '../../lib/discordSdk';
import { PhoneCall, Copy, Check, Swords, X } from 'lucide-react';

interface VoiceCallLobbyModalProps {
  onStartOnlineMatch: (roomCode: string) => void;
  onClose: () => void;
}

export const VoiceCallLobbyModal: React.FC<VoiceCallLobbyModalProps> = ({
  onStartOnlineMatch,
  onClose,
}) => {
  const [roomCode] = useState(() => `PKMN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');

  const discordSdk = getDiscordSdk();
  const channelName = discordSdk?.channelId ? `Canal #${discordSdk.channelId.slice(-4)}` : 'Chamada de Voz Geral';

  // Mock voice call peers detected in current Discord Activity session
  const voiceMembers = [
    { id: 'mem_1', name: 'AshKetchum', avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png', inGame: false },
    { id: 'mem_2', name: 'Misty_Cerulean', avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/4.png', inGame: false },
    { id: 'mem_3', name: 'Steven_Champion', avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/15.png', inGame: true },
  ];

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700 flex items-center justify-center text-indigo-400">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white m-0 leading-tight">
                Modo Online • Chamada de Voz Discord
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {channelName} • Jogadores conectados na mesma chamada
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

        {/* Room Code Card */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            O Teu Código da Sala de Duelo
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-xl font-black text-amber-400 tracking-wider">
              {roomCode}
            </span>
            <button
              onClick={handleCopyCode}
              title="Copiar Código"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Partilha este código no chat de voz para um amigo entrar instantaneamente na tua partida.
          </p>
        </div>

        {/* Join by Code */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Introduzir código de amigo (ex: PKMN-1234)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={() => {
              if (inputCode.trim()) {
                onStartOnlineMatch(inputCode.trim());
                onClose();
              }
            }}
            disabled={!inputCode.trim()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Entrar na Sala</span>
          </button>
        </div>

        {/* Members in Voice Call */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Treinadores na Chamada de Voz ({voiceMembers.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Voz Ativa
            </span>
          </div>

          <div className="space-y-1.5">
            {voiceMembers.map((mem) => (
              <div
                key={mem.id}
                className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={mem.avatar}
                    alt={mem.name}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-slate-800"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{mem.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {mem.inGame ? 'Em combate...' : 'Disponível para jogar'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onStartOnlineMatch(roomCode);
                    onClose();
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition flex items-center gap-1"
                >
                  <Swords className="w-3 h-3 text-amber-400" />
                  <span>Desafiar</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
