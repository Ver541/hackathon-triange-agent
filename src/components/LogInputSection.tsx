import React, { useEffect, useRef } from 'react';
import { Play, FileText, X, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { SAMPLE_LOGS, SampleLog } from '../data/sampleLogs.ts';

interface LogInputSectionProps {
  logText: string;
  setLogText: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  selectedSampleId: string | null;
  onSelectSample: (sample: SampleLog) => void;
}

export const LogInputSection: React.FC<LogInputSectionProps> = ({
  logText,
  setLogText,
  onAnalyze,
  isAnalyzing,
  selectedSampleId,
  onSelectSample,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + Enter to trigger analysis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!isAnalyzing && logText.trim()) {
          e.preventDefault();
          onAnalyze();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnalyzing, logText, onAnalyze]);

  const lineCount = logText ? logText.split('\n').length : 0;
  const byteSize = new Blob([logText]).size;
  const currentSample = SAMPLE_LOGS.find((s) => s.id === selectedSampleId);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
      {/* Benchmark Rules Quick Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-950/80 border border-slate-850 text-xs">
        <div className="flex items-start gap-2 text-slate-300">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-medium">1. Port Scan / DoS (Critical)</strong>
            <span className="text-slate-400 text-[11px]">High SYN flag count · Short flow duration</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-medium">2. Benign Flow (Informational)</strong>
            <span className="text-slate-400 text-[11px]">Standard Port 80/443 · Balanced payload</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-medium">3. Exfiltration / Brute Force</strong>
            <span className="text-slate-400 text-[11px]">Unusual port · High byte volume</span>
          </div>
        </div>
      </div>

      {/* Header and Quick Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            CIC-IDS2017 Flow Log Input
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste CICFlowMeter feature metrics, CSV line, or choose a benchmark baseline test case below:
          </p>
        </div>

        {/* Quick Sample Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap mr-1">
            Presets:
          </span>
          {SAMPLE_LOGS.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
                title={sample.benchmarkRule}
              >
                {sample.name.split('·')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Benchmark description banner for active preset */}
      {currentSample && (
        <div className="px-3 py-2 rounded bg-slate-950/50 border border-slate-850 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-400">
            <strong className="text-slate-300 font-medium">{currentSample.name}: </strong>
            {currentSample.description}
          </span>
          <span className="text-[11px] font-mono text-emerald-400/90 shrink-0 hidden md:inline">
            {currentSample.benchmarkRule.split('->')[0]}
          </span>
        </div>
      )}

      {/* Textarea container */}
      <div className="relative rounded-lg border border-slate-800 bg-slate-950/90 focus-within:border-emerald-500/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          placeholder={`Paste CIC-IDS2017 flow log here...\nExample format:\nFlow ID: 172.16.0.1-192.168.10.50-49210-80-6\nSource IP: 172.16.0.1\nDestination Port: 80\nFlow Duration: 48\nSYN Flag Count: 2\nTotal Fwd Packets: 2...`}
          rows={9}
          spellCheck={false}
          className="w-full bg-transparent px-4 py-3 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-y leading-relaxed"
        />

        {logText && (
          <button
            type="button"
            onClick={() => setLogText('')}
            className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
            title="Clear log"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Footer bar with meta stats & Action CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>{byteSize} bytes</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-slate-400">Target: <span className="text-slate-300">CIC-IDS2017 Format</span></span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="hidden md:inline text-slate-500">Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">⌘+Enter</kbd></span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing || !logText.trim()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-xs tracking-wide transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating CIC-IDS2017 Baseline...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Analyze CIC-IDS2017 Log</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
