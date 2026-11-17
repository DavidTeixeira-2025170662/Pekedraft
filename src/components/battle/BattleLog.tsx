import React, { useEffect, useRef } from 'react';
import type { BattleLogEntry } from '../../types/pokemon';
import { Terminal } from 'lucide-react';

interface BattleLogProps {
  logs: BattleLogEntry[];
}

export const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogEntryStyle = (type: BattleLogEntry['type']) => {
    switch (type) {
      case 'player':
        return 'text-indigo-300 font-semibold';
      case 'opponent':
        return 'text-rose-300 font-semibold';
      case 'damage':
        return 'text-amber-400 font-bold';
      case 'faint':
        return 'text-red-400 font-black';
      case 'mechanic':
        return 'text-purple-300 font-bold';
      case 'system':
        return 'text-slate-400 italic';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden shadow-inner">
      <div className="bg-slate-900/90 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span>BATTLE LOG (SHOWDOWN ENGINE)</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {logs.length} eventos
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-2.5 overflow-y-auto space-y-1 font-mono text-xs leading-relaxed max-h-[140px] sm:max-h-none"
      >
        {logs.map((entry) => (
          <div key={entry.id} className={getLogEntryStyle(entry.type)}>
            {entry.text}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-500 italic text-center py-2">
            A aguardar pelo primeiro movimento da partida...
          </div>
        )}
      </div>
    </div>
  );
};

