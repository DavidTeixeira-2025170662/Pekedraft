import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CHAOS_MECHANICS, ROULETTE_OPTIONS } from '../../constants/mechanics';
import type { ChaosMechanic } from '../../types/pokemon';
import confetti from 'canvas-confetti';
import { playRouletteTickSound, playVictorySound, playZMoveSound, playClickSound } from '../../lib/audio';
import {
  Dices,
  ArrowRight,
  Dna,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Swords,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';

export const ChaosRoulette: React.FC = () => {
  const { spinRoulette, proceedToDraft, isLoading, loadingMessage, resetGame } = useGameStore();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<ChaosMechanic | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const handleStartSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    let currentIdx = highlightIndex;
    const totalSteps = 30 + Math.floor(Math.random() * 10);
    let stepCount = 0;
    let delay = 45;

    const runStep = (resolve: (selected: ChaosMechanic) => void) => {
      currentIdx = (currentIdx + 1) % ROULETTE_OPTIONS.length;
      setHighlightIndex(currentIdx);
      playRouletteTickSound();
      stepCount++;

      if (stepCount < totalSteps) {
        if (stepCount > totalSteps - 12) {
          delay += 28;
        } else if (stepCount > totalSteps - 5) {
          delay += 55;
        }
        setTimeout(() => runStep(resolve), delay);
      } else {
        const finalOption = ROULETTE_OPTIONS[currentIdx];
        resolve(finalOption);
      }
    };

    const finalSelected = await new Promise<ChaosMechanic>((resolve) => {
      runStep(resolve);
    });

    // Also update the store
    const storeSelected = await spinRoulette();
    const winningMechanic = finalSelected || storeSelected;
    setResult(winningMechanic);
    setSpinning(false);

    if (winningMechanic === 'Z-Moves' || winningMechanic === 'Mega Evolution') {
      playZMoveSound();
    } else {
      playVictorySound();
    }

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
      });
    } catch {
      // ignore
    }
  };

  const selectedDef = result ? CHAOS_MECHANICS[result] : null;

  const getMechanicIconGraphic = (type: ChaosMechanic) => {
    switch (type) {
      case 'Mega Evolution':
        return <Dna className="w-8 h-8 text-purple-400 animate-pulse" />;
      case 'Gigantamax':
        return <Flame className="w-8 h-8 text-pink-400 animate-bounce" />;
      case 'Terastalization':
        return <Zap className="w-8 h-8 text-cyan-300 animate-pulse" />;
      case 'Z-Moves':
        return <Swords className="w-8 h-8 text-amber-300 animate-pulse" />;
      case 'None':
      default:
        return <Shield className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-3 sm:p-5 max-w-4xl mx-auto w-full text-center gap-4">
      {/* Top Breadcrumb & Return to Lobby */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => {
            playClickSound();
            resetGame();
          }}
          disabled={spinning || isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao Lobby</span>
        </button>

        <span className="text-[11px] font-mono font-bold tracking-widest text-amber-300 uppercase bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          PASSO 1 • SORTEIO DA GIMMICK GLOBAL
        </span>
      </div>

      {/* Main Machine Banner */}
      <div className="my-1">
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-400 tracking-tight m-0 drop-shadow">
          ROLETA DO <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">CAOS</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mt-1 leading-relaxed">
          Cada partida de PokéDraft tem uma mecânica sorteada antes do Teambuilder para moldar a tua estratégia de batalha!
        </p>
      </div>

      {/* Futuristic Casino Wheel Carousel Container */}
      <div className="w-full bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Pointer Triangle Indicator */}
        <div className="flex flex-col items-center mb-3">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-bounce" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase mt-0.5">
            INDICADOR DE SELEÇÃO
          </span>
        </div>

        {/* 5 Gimmicks Carousel Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full mb-5">
          {ROULETTE_OPTIONS.map((opt, idx) => {
            const def = CHAOS_MECHANICS[opt];
            const isHighlighted = highlightIndex === idx;
            const isWinner = result === opt && !spinning;

            return (
              <div
                key={opt}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all duration-200 relative overflow-hidden flex flex-col items-center justify-between min-h-[140px] shadow-lg ${
                  isWinner
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-400 ring-4 ring-amber-400/40 scale-105 shadow-[0_0_25px_rgba(251,191,36,0.6)] z-10'
                    : isHighlighted
                    ? 'bg-slate-900 border-indigo-400 ring-2 ring-indigo-400/50 scale-102 z-10'
                    : 'bg-slate-950/70 border-slate-800/90 opacity-60'
                }`}
              >
                {/* Background color accent on winner */}
                {isWinner && (
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
                )}

                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>#{idx + 1}</span>
                  {isWinner && (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-950 border border-amber-600 px-1 rounded flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> ATIVO
                    </span>
                  )}
                </div>

                <div className="my-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
                  {getMechanicIconGraphic(opt)}
                </div>

                <div>
                  <h3 className="text-xs font-black text-white truncate m-0">
                    {def.title}
                  </h3>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {opt}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls or Winning Gimmick Reveal */}
        {!result ? (
          <div className="py-3 flex flex-col items-center gap-2">
            <button
              onClick={handleStartSpin}
              disabled={spinning}
              className={`px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center gap-2.5 cursor-pointer ${
                spinning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed animate-pulse border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white hover:brightness-110 active:scale-95 shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-300 ring-2 ring-amber-400/40'
              }`}
            >
              <Dices className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
              <span>{spinning ? 'A Sortear Mecânica do Caos...' : 'Girar Roleta da Partida!'}</span>
            </button>
            <p className="text-[11px] text-slate-500 font-mono">
              O sorteio é 100% RNG transparente e define as regras do combate
            </p>
          </div>
        ) : (
          <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400/80 text-left shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-amber-400/60 shadow">
                  {getMechanicIconGraphic(result)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white m-0">
                      {selectedDef?.title}
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700 px-2 py-0.5 rounded-full">
                      MECÂNICA CONFIRMADA
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold block mt-0.5">
                    {selectedDef?.subtitle}
                  </span>
                </div>
              </div>

              {/* Reroll Button (Allowed in Solo mode for testing/training) */}
              <button
                onClick={handleStartSpin}
                disabled={spinning || isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer self-start sm:self-auto"
                title="Girar novamente se quiseres treinar outra mecânica"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Girar Novamente</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
              {selectedDef?.description}
            </p>

            {/* Special Instructions by Mechanic */}
            {result === 'Mega Evolution' && (
              <div className="bg-purple-950/40 border border-purple-800/70 p-3 rounded-xl mb-4 flex items-start gap-2.5">
                <Dna className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-purple-200 leading-snug">
                  <strong>Impacto no Teambuilder:</strong> Foi garantido que terás pelo menos 1 Pokémon capaz de Mega Evoluir (ex: Charizard, Lucario, Gengar, Blastoise, Venusaur). As respetivas <strong>Mega Stones</strong> estarão na lista de held items para decidires se as equipas ou não!
                </div>
              </div>
            )}

            {result === 'Gigantamax' && (
              <div className="bg-pink-950/40 border border-pink-800/70 p-3 rounded-xl mb-4 flex items-start gap-2.5">
                <Flame className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-pink-200 leading-snug">
                  <strong>Impacto no Teambuilder:</strong> Pelo menos 1 Pokémon do teu draft terá acesso à forma Gigantamax com HP duplicado e movimentos Max Moves devastadores!
                </div>
              </div>
            )}

            {result === 'Z-Moves' && (
              <div className="bg-amber-950/40 border border-amber-800/70 p-3 rounded-xl mb-4 flex items-start gap-2.5">
                <Swords className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-200 leading-snug">
                  <strong>Regra de Batalha:</strong> Podes ativar <strong>1 único Z-Move por batalha</strong> com 180-200 de poder destrutivo! Escolhe bem o momento ideal para o disparar.
                </div>
              </div>
            )}

            {result === 'Terastalization' && (
              <div className="bg-cyan-950/40 border border-cyan-800/70 p-3 rounded-xl mb-4 flex items-start gap-2.5">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-cyan-200 leading-snug">
                  <strong>Impacto em Combate:</strong> Cristaliza no tipo secundário do teu Pokémon recebendo um multiplicador maciço de STAB aumentado em todos os ataques desse tipo!
                </div>
              </div>
            )}

            {/* Advance to Draft Phase Button */}
            <button
              onClick={proceedToDraft}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl text-sm font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ring-2 ring-emerald-400/40 hover:scale-101"
            >
              <span>{isLoading ? (loadingMessage || 'A gerar pool do Draft...') : 'Avançar para o Teambuilder (Draft) →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Gimmick oficial sincronizada para ambos os jogadores no combate</span>
      </div>
    </div>
  );
};
