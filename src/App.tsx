import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { LogInputSection } from './components/LogInputSection.tsx';
import { TriageResultCard } from './components/TriageResultCard.tsx';
import { SystemInstructionModal } from './components/SystemInstructionModal.tsx';
import { SAMPLE_LOGS, SampleLog } from './data/sampleLogs.ts';
import { TriageAnalysis, DefenseExecutionResult } from './types.ts';
import { DEFAULT_SYSTEM_INSTRUCTION } from './constants.ts';
import { parseCicIds2017Heuristic, simulateDefenseExecution } from './utils/cicIdsEngine.ts';
import { ShieldCheck, AlertCircle, Terminal, Cpu, ArrowDown } from 'lucide-react';

export default function App() {
  const [logText, setLogText] = useState<string>(SAMPLE_LOGS[0].rawLog);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(SAMPLE_LOGS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<TriageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeEngineName, setActiveEngineName] = useState<string>('gemini-3.8-flash');

  // SOAR Defense Execution State
  const [isExecutingDefense, setIsExecutingDefense] = useState<boolean>(false);
  const [defenseResult, setDefenseResult] = useState<DefenseExecutionResult | null>(null);

  // System Instruction Modal State
  const [systemInstruction, setSystemInstruction] = useState<string>(DEFAULT_SYSTEM_INSTRUCTION);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);

  // Dynamic triage loading steps for presentation impact
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const loadingSteps = [
    'Parsing CIC-IDS2017 flow record & TCP flag distribution...',
    'Checking SYN frequency & flow duration against DoS/PortScan baseline...',
    'Evaluating destination port behavior & byte volume thresholds...',
    'Correlating findings with CIC-IDS2017 benchmark & synthesizing defense...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleSelectSample = (sample: SampleLog) => {
    setSelectedSampleId(sample.id);
    setLogText(sample.rawLog);
    setAnalysis(null);
    setDefenseResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!logText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setDefenseResult(null);

    try {
      let analysisResult: TriageAnalysis | null = null;
      let engineUsed = 'gemini-3.8-flash';

      // 1. Try full-stack Express API first (AI Studio dev/prod environment)
      try {
        const response = await fetch('/api/triage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            logText: logText.trim(),
            customInstruction: systemInstruction,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && data.analysis) {
            analysisResult = data.analysis;
            engineUsed = data.model || 'gemini-3.8-flash';
          }
        }
      } catch (networkErr) {
        // Expected when running purely client-side or statically hosted on GitHub Pages
        console.info('Backend API unavailable (static environment); falling back to client-side engine.');
      }

      // 2. If backend is not available (e.g. GitHub Pages static hosting or offline)
      if (!analysisResult) {
        analysisResult = parseCicIds2017Heuristic(logText.trim());
        engineUsed = 'CIC-IDS2017 Baseline Engine (Static Mode)';
      }

      setAnalysis(analysisResult);
      setActiveEngineName(engineUsed);

      // Scroll smoothly down to the result card for presentation focus
      setTimeout(() => {
        const resultElement = document.getElementById('triage-results');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Triage error:', err);
      setError(err?.message || 'An unexpected error occurred while analyzing the log.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExecuteDefense = async () => {
    if (!analysis || isExecutingDefense) return;

    setIsExecutingDefense(true);

    try {
      let resultData: DefenseExecutionResult | null = null;

      // 1. Try backend SOAR API endpoint
      try {
        const response = await fetch('/api/execute-defense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analysis.defenseExecutionPayload),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            resultData = data;
          }
        }
      } catch (err) {
        console.info('Backend defense execution unavailable; using client-side simulator.');
      }

      // 2. Fallback to client-side simulation for GitHub Pages static hosting
      if (!resultData) {
        resultData = simulateDefenseExecution(analysis.defenseExecutionPayload);
      }

      setDefenseResult(resultData);
    } catch (err: any) {
      console.error('Execute error:', err);
      alert(`Defense execution failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsExecutingDefense(false);
    }
  };

  const handleReset = () => {
    setLogText(SAMPLE_LOGS[0].rawLog);
    setSelectedSampleId(SAMPLE_LOGS[0].id);
    setAnalysis(null);
    setDefenseResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-200">
      {/* Top Navigation */}
      <Header
        onOpenPolicy={() => setIsPolicyModalOpen(true)}
        onReset={handleReset}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Hero Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>CIC-IDS2017 BENCHMARK BASELINE ENGINE</span>
              <span aria-hidden="true">·</span>
              <span>POWERED BY GEMINI 3.8 FLASH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CIC-IDS2017 SOC Triage & Countermeasure Agent
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Autonomous Level-3 triage specialized for CIC-IDS2017 network flow records. Detects High SYN/short duration <span className="text-red-400 font-medium">Port Scan & DoS</span>, verifies <span className="text-emerald-400 font-medium">Benign web flows</span> (Port 80/443), and flags unusual ports with high byte count for <span className="text-amber-400 font-medium">Exfiltration / Brute Force</span>.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>CICFlowMeter Protocol Ready</span>
            </div>
          </div>
        </div>

        {/* Section 1: Raw Log Input */}
        <section aria-label="Log Input">
          <LogInputSection
            logText={logText}
            setLogText={(text) => {
              setLogText(text);
              setSelectedSampleId(null);
            }}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            selectedSampleId={selectedSampleId}
            onSelectSample={handleSelectSample}
          />
        </section>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Analysis Failed</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State Animation */}
        {isAnalyzing && (
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                <Cpu className="w-6 h-6 animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Agent Triage in Progress
              </h3>
              <p className="text-xs font-mono text-emerald-400 mt-1 transition-all duration-300">
                {loadingSteps[loadingStep]}
              </p>
            </div>
            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Section 2: Structured Output Card (4 Sections) */}
        {analysis && (
          <section id="triage-results" className="pt-2" aria-label="Triage Analysis Results">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Forensic Triage Report Generated
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {activeEngineName} · 4-Phase Output
              </span>
            </div>

            <TriageResultCard
              analysis={analysis}
              onExecuteDefense={handleExecuteDefense}
              isExecutingDefense={isExecutingDefense}
              defenseResult={defenseResult}
              onResetDefense={() => setDefenseResult(null)}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <span>SOC Triage Agent</span>
            <span aria-hidden="true">·</span>
            <span>Hackathon Presentation Build</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Strict Human-in-the-Loop SOAR Governance</span>
            <span aria-hidden="true">·</span>
            <span>MITRE ATT&CK Matrix v14</span>
          </div>
        </div>
      </footer>

      {/* System Prompt & Triage Policy Modal */}
      <SystemInstructionModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        systemInstruction={systemInstruction}
        setSystemInstruction={setSystemInstruction}
        defaultInstruction={DEFAULT_SYSTEM_INSTRUCTION}
      />
    </div>
  );
}
