import React from 'react';
import { X, Sparkles, RotateCcw, Check, Copy } from 'lucide-react';

interface SystemInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemInstruction: string;
  setSystemInstruction: (val: string) => void;
  defaultInstruction: string;
}

export const SystemInstructionModal: React.FC<SystemInstructionModalProps> = ({
  isOpen,
  onClose,
  systemInstruction,
  setSystemInstruction,
  defaultInstruction,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(systemInstruction);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToDefault = () => {
    setSystemInstruction(defaultInstruction);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                CIC-IDS2017 Benchmark System Instructions
              </h3>
              <p className="text-xs text-slate-400">
                Baseline classification rules provided to gemini-3.8-flash for CIC-IDS2017 flow triage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Body */}
        <div className="py-4 flex-1 overflow-y-auto">
          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
            The agent uses this tailored DFIR persona to dissect raw logs, map MITRE tactics, compute calibrated confidence scores, and engineer defensive countermeasures. You can tune this instruction dynamically:
          </p>
          <textarea
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            rows={12}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 leading-relaxed resize-y"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
