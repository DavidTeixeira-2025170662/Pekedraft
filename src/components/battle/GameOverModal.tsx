import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Skull, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  winner: 'player' | 'opponent';
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onRestart }) => {
  const isPlayerWinner = winner === 'player';

  useEffect(() => {
    if (isPlayerWinner) {
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }
  }, [isPlayerWinner]);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl p-6 text-center">
        {/* Icon Badge */}
        <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
          {isPlayerWinner ? (
            <div className="w-full h-full rounded-3xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Trophy className="w-9 h-9" />
            </div>
          ) : (
            <div className="w-full h-full rounded-3xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400">
              <Skull className="w-9 h-9" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white m-0">
          {isPlayerWinner ? 'VITÓRIA GLORIOSA!' : 'DERROTA EM BATALHA'}
        </h2>
        <p className="text-xs text-slate-400 mt-2 mb-6 max-w-xs mx-auto">
          {isPlayerWinner
            ? 'Superaste a estratégia do Bot adversário e conquistaste o PokéDraft Showdown!'
            : 'Todos os teus 6 Pokémon foram derrotados. Não desistas, prepara outro draft e volta à carga!'}
        </p>

        {/* Action Button */}
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Jogar Novamente (Novo Draft)</span>
        </button>
      </div>
    </div>
  );
};

