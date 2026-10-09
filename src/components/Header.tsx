import React from 'react';
import { ShieldAlert, Settings2, RefreshCw, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenPolicy: () => void;
  onReset: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPolicy, onReset, isAnalyzing }) => {
  return (
    <header className="border-b border-slate-850 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">CIC-IDS2017 SOC Triage Agent</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                CIC-IDS2017 Baseline
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Benchmark Flow Triage: Port Scan/DoS · Benign Web (80/443) · Exfiltration/Brute Force
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPolicy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
            title="View configured CIC-IDS2017 benchmark prompt"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Benchmark Rules</span>
          </button>

          <button
            onClick={onReset}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
            title="Reset workspace"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
