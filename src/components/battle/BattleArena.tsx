import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ARENA_ENVIRONMENTS } from '../../constants/environments';
import type { ArenaEnvironment, StatStages } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { BattleControls } from './BattleControls';
import { BattleLog } from './BattleLog';
import { SwitchModal } from './SwitchModal';
import { GameOverModal } from './GameOverModal';
import { PokemonTooltip } from './PokemonTooltip';
import { AttackAnimationOverlay } from './AttackAnimationOverlay';
import { Sparkles, Flame, Zap, CircleDot, Flag, Clock, Image, MapPin } from 'lucide-react';

export const BattleArena: React.FC = () => {
  const {
    playerTeam,
    opponentTeam,
    activePlayerPokemonIndex,
    activeOpponentPokemonIndex,
    chaosMechanic,
    playerMechanicUsed,
    playerZMoveUsed,
    battleLogs,
    isProcessingTurn,
    winner,
    turnTimeRemaining,
    isTimerActive,
    attackAnimation,
    arenaEnvironment,
    spriteStyle,
    executeMove,
    switchPokemon,
    activateMechanic,
    forfeitBattle,
    tickTimer,
    setArenaEnvironment,
    toggleSpriteStyle,
    resetGame,
  } = useGameStore();

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);

  const activePlayer = playerTeam[activePlayerPokemonIndex];
  const activeOpponent = opponentTeam[activeOpponentPokemonIndex];

  // 40-second turn countdown timer ticker
  useEffect(() => {
    if (!isTimerActive || isProcessingTurn || winner) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, isProcessingTurn, winner, tickTimer]);

  const isForcedSwitch = Boolean(
    (!winner && activePlayer && activePlayer.currentHp <= 0) ||
    (!winner && activePlayer && activePlayer.mustSwitch)
  );

  if (!activePlayer || !activeOpponent) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-slate-400 font-mono text-xs">A carregar arena Showdown...</p>
      </div>
    );
  }

  const currentEnv = ARENA_ENVIRONMENTS[arenaEnvironment] || ARENA_ENVIRONMENTS['city-day'];
  const playerHpPercent = Math.max(0, Math.floor((activePlayer.currentHp / activePlayer.maxHp) * 100));
  const oppHpPercent = Math.max(0, Math.floor((activeOpponent.currentHp / activeOpponent.maxHp) * 100));

  const getHpColor = (percent: number) => {
    if (percent > 50) return 'bg-emerald-500';
    if (percent > 20) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const renderActiveStatStageTags = (stages: StatStages) => {
    const activeEntries = Object.entries(stages).filter(([, val]) => val !== 0);
    if (activeEntries.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {activeEntries.map(([stat, val]) => (
          <span
            key={stat}
            className={`text-[9px] font-mono font-bold px-1 rounded ${
              val > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
            }`}
          >
            {val > 0 ? `+${val}` : val} {stat.substring(0, 3).toUpperCase()}
          </span>
        ))}
      </div>
    );
  };

  // Resolve sprite based on pixel style & shiny status
  const getSpriteSrc = (member: typeof activePlayer, isBack = false) => {
    if (spriteStyle === 'pixel') {
      return isBack ? member.pokemon.pixelBackSprite || member.pokemon.pixelSprite : member.pokemon.pixelSprite;
    }
    if (member.isShiny) {
      return isBack ? member.pokemon.shinyBackSprite || member.pokemon.shinySprite : member.pokemon.shinySprite;
    }
    return isBack ? member.pokemon.backSprite || member.pokemon.sprite : member.pokemon.sprite;
  };

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-2 sm:p-4 gap-2.5 relative">
      {/* Top Arena Navigation Bar: Environment Selector, 40s Timer, Pixel Toggle & Forfeit */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
        {/* Environment Selector Dropdown */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 hidden sm:inline">Cenário:</span>
          <select
            value={arenaEnvironment}
            onChange={(e) => setArenaEnvironment(e.target.value as ArenaEnvironment)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            {Object.values(ARENA_ENVIRONMENTS).map((env) => (
              <option key={env.id} value={env.id}>
                {env.icon} {env.name}
              </option>
            ))}
          </select>
        </div>

        {/* 40s Turn Timer Bar */}
        <div className="flex items-center gap-2">
          <Clock className={`w-3.5 h-3.5 ${turnTimeRemaining <= 10 ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
          <span className="text-slate-400">Tempo:</span>
          <span
            className={`font-bold px-1.5 py-0.2 rounded border ${
              turnTimeRemaining <= 10
                ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                : 'bg-slate-950 text-emerald-400 border-slate-700'
            }`}
          >
            {turnTimeRemaining}s
          </span>
        </div>

        {/* Actions: Pixel Toggle & Forfeit */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpriteStyle}
            title="Alternar entre Sprites Showdown Modernos e Pixel Art OG"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Image className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">{spriteStyle === 'pixel' ? 'Modo Pixel OG' : 'Modo 3D'}</span>
          </button>

          <button
            onClick={() => setShowForfeitConfirm(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
          >
            <Flag className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Desistir</span>
          </button>
        </div>
      </div>

      {/* Showdown Stadium Main Field with Atmospheric Backdrop */}
      <div
        className={`w-full border border-slate-800/80 rounded-2xl p-3 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[440px] bg-gradient-to-b ${currentEnv.bgStyle} ${
          attackAnimation?.isZMove || attackAnimation?.isCrit
            ? 'animate-shake-hard'
            : attackAnimation && attackAnimation.effectiveness >= 2
            ? 'animate-shake-soft'
            : ''
        }`}
      >
        {/* Atmosphere Vignette & Lighting */}
        <div
          className="absolute inset-0 pointer-events-none backdrop-blur-[2px]"
          style={{ backgroundColor: currentEnv.lightingColor }}
        />
        {/* Perspective Grid Line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent pointer-events-none" />

        {/* Attack Animation Visual FX Overlay */}
        <AttackAnimationOverlay animEvent={attackAnimation} />

        {/* 1. Opponent Row: Info Box (Left) + Sprite (Right) */}
        <div className="relative z-10 flex items-start justify-between w-full gap-2">
          {/* Opponent Info Box with Fog of War Tooltip */}
          <PokemonTooltip member={activeOpponent} isPlayer={false}>
            <div className="bg-slate-950/92 backdrop-blur-md border border-slate-800/90 rounded-2xl p-2.5 sm:p-3 shadow-xl max-w-[220px] sm:max-w-[280px] w-full cursor-help hover:border-slate-700 transition shrink-0 overflow-hidden">
              <div className="flex items-center justify-between mb-1 gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-bold text-xs sm:text-sm text-white truncate">
                    {activeOpponent.pokemon.name}
                  </span>
                  {activeOpponent.isShiny && (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-950 border border-amber-700 px-1 rounded flex items-center gap-0.5 shrink-0">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      ★
                    </span>
                  )}
                  {activeOpponent.isConfused && (
                    <span className="text-[9px] font-bold text-purple-300 bg-purple-950 border border-purple-700 px-1 rounded shrink-0">
                      😵 Confuso
                    </span>
                  )}
                  <span className="text-[9px] text-slate-400 font-mono bg-slate-900 px-1 py-0.2 rounded border border-slate-800 shrink-0">
                    Lv.50
                  </span>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  {opponentTeam.map((m) => (
                    <CircleDot
                      key={m.id}
                      className={`w-3 h-3 ${
                        m.currentHp > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Types, Known Item & Known Ability */}
              <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                {activeOpponent.pokemon.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}

                <span className="text-[9px] font-mono text-slate-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[90px] sm:max-w-[110px]" title={activeOpponent.revealedItem && activeOpponent.assignedItem ? activeOpponent.assignedItem.name : '???'}>
                  Item: {activeOpponent.revealedItem && activeOpponent.assignedItem ? activeOpponent.assignedItem.name : '???'}
                </span>

                <span className="text-[9px] font-mono text-slate-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[90px] sm:max-w-[110px]" title={activeOpponent.revealedAbility && activeOpponent.assignedAbility ? activeOpponent.assignedAbility.name : '???'}>
                  Hab: {activeOpponent.revealedAbility && activeOpponent.assignedAbility ? activeOpponent.assignedAbility.name : '???'}
                </span>
              </div>

              {/* HP Bar */}
              <div className="w-full bg-slate-900/90 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-400 ${getHpColor(
                    oppHpPercent
                  )}`}
                  style={{ width: `${oppHpPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span className="text-[9px] text-slate-500 italic">Passe o rato p/ inspecionar</span>
                <span>{oppHpPercent}%</span>
              </div>

              {renderActiveStatStageTags(activeOpponent.statStages)}
            </div>
          </PokemonTooltip>

          {/* Opponent Sprite Platform with 3D Ground Ellipse */}
          <div className="flex flex-col items-center justify-center pr-4 sm:pr-14 relative">
            {/* 3D Ground Pedestal */}
            <div className="absolute -bottom-2 w-28 sm:w-36 h-8 sm:h-10 bg-slate-950/60 rounded-[100%] border border-slate-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] -z-0" />

            <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center relative z-10">
              <img
                src={getSpriteSrc(activeOpponent, false)}
                alt={activeOpponent.pokemon.name}
                className={`max-h-24 sm:max-h-32 object-contain drop-shadow-xl transition-transform ${
                  spriteStyle === 'pixel' ? 'image-pixelated scale-125' : ''
                } ${
                  attackAnimation && !attackAnimation.isPlayerAttacker
                    ? 'animate-lunge-opp'
                    : ''
                }`}
              />
              {activeOpponent.isShiny && (
                <div className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow animate-spin">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Player Row: Sprite (Left) + Info Box (Right) */}
        <div className="relative z-10 flex items-end justify-between w-full mt-3 gap-2">
          {/* Player Sprite Platform with 3D Ground Ellipse */}
          <div className="flex flex-col items-center justify-center pl-4 sm:pl-14 relative">
            {/* 3D Ground Pedestal */}
            <div className="absolute -bottom-2 w-32 sm:w-44 h-10 sm:h-12 bg-slate-950/70 rounded-[100%] border border-indigo-500/40 shadow-[0_4px_20px_rgba(99,102,241,0.25)] -z-0" />

            <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center relative z-10">
              <img
                src={getSpriteSrc(activePlayer, true)}
                alt={activePlayer.pokemon.name}
                className={`max-h-28 sm:max-h-36 object-contain drop-shadow-2xl transition-all ${
                  spriteStyle === 'pixel' ? 'image-pixelated scale-125' : ''
                } ${
                  activePlayer.isMegaEvolved || activePlayer.isGigantamaxed
                    ? 'scale-110 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]'
                    : ''
                } ${
                  attackAnimation && attackAnimation.isPlayerAttacker
                    ? 'animate-lunge-player'
                    : ''
                }`}
              />

              {activePlayer.isShiny && (
                <div className="absolute -top-2 -right-2 p-1 rounded-full bg-amber-400 text-slate-950 shadow-md animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              {activePlayer.isMegaEvolved && (
                <div className="absolute -top-1 -left-1 p-1.5 rounded-full bg-purple-600 text-white shadow-lg animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              {activePlayer.isGigantamaxed && (
                <div className="absolute -top-1 -left-1 p-1.5 rounded-full bg-pink-600 text-white shadow-lg animate-pulse">
                  <Flame className="w-3.5 h-3.5" />
                </div>
              )}
              {activePlayer.isTerastallized && (
                <div className="absolute -top-1 -left-1 p-1.5 rounded-full bg-sky-500 text-white shadow-lg animate-pulse">
                  <Zap className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>

          {/* Player Info Box with Full IRT Stats Tooltip */}
          <PokemonTooltip member={activePlayer} isPlayer={true}>
            <div className="bg-slate-950/92 backdrop-blur-md border border-slate-800/90 rounded-2xl p-3 shadow-xl max-w-xs sm:max-w-sm w-full cursor-help hover:border-slate-700 transition shrink-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">
                    {activePlayer.pokemon.name}
                  </span>
                  {activePlayer.isShiny && (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-950 border border-amber-700 px-1 rounded flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      ★ SHINY
                    </span>
                  )}
                  {activePlayer.isConfused && (
                    <span className="text-[9px] font-bold text-purple-300 bg-purple-950 border border-purple-700 px-1 rounded">
                      😵 Confuso
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                    Lv. 50
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {playerTeam.map((m) => (
                    <CircleDot
                      key={m.id}
                      className={`w-3.5 h-3.5 ${
                        m.currentHp > 0 ? 'text-indigo-400 fill-indigo-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Types, Ability & Item */}
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                {activePlayer.pokemon.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
                {activePlayer.assignedAbility && (
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.2 rounded">
                    Hab: {activePlayer.assignedAbility.name}
                  </span>
                )}
                {activePlayer.assignedItem && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${activePlayer.isItemConsumed ? 'line-through text-slate-500 bg-slate-900 border-slate-800' : 'text-cyan-300 bg-cyan-950/60 border-cyan-800/60'}`}>
                    {activePlayer.assignedItem.icon} {activePlayer.assignedItem.name} {activePlayer.isItemConsumed && '(Usado)'}
                  </span>
                )}
              </div>

              {/* HP Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-400 ${getHpColor(
                    playerHpPercent
                  )}`}
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mt-1">
                <span className="text-[9px] text-slate-500 italic">HP em Tempo Real</span>
                <span>
                  {activePlayer.currentHp}/{activePlayer.maxHp} ({playerHpPercent}%)
                </span>
              </div>

              {renderActiveStatStageTags(activePlayer.statStages)}
            </div>
          </PokemonTooltip>
        </div>
      </div>

      {/* Middle/Bottom Split: Battle Log & Battle Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-5 h-44 sm:h-52">
          <BattleLog logs={battleLogs} />
        </div>

        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <BattleControls
            activeMember={activePlayer}
            playerTeam={playerTeam}
            chaosMechanic={chaosMechanic}
            playerMechanicUsed={playerMechanicUsed}
            playerZMoveUsed={playerZMoveUsed}
            isProcessingTurn={isProcessingTurn}
            onExecuteMove={executeMove}
            onOpenSwitch={() => setShowSwitchModal(true)}
            onActivateMechanic={activateMechanic}
          />
        </div>
      </div>

      {/* Switch Team Modal */}
      {(showSwitchModal || isForcedSwitch) && (
        <SwitchModal
          playerTeam={playerTeam}
          activePokemonIndex={activePlayerPokemonIndex}
          onSwitchPokemon={switchPokemon}
          onClose={() => {
            if (activePlayer.currentHp > 0) {
              setShowSwitchModal(false);
            }
          }}
        />
      )}

      {/* Forfeit Confirmation Modal */}
      {showForfeitConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl p-5 shadow-2xl text-center">
            <Flag className="w-10 h-10 text-rose-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white m-0">Desistir da Partida?</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              A vitória será atribuída imediatamente ao oponente e a tua pontuação Elo será reduzida.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForfeitConfirm(false)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                Continuar a Lutar
              </button>
              <button
                onClick={() => {
                  setShowForfeitConfirm(false);
                  forfeitBattle();
                }}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow"
              >
                Sim, Desistir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {winner && (
        <GameOverModal winner={winner} onRestart={resetGame} />
      )}
    </div>
  );
};
