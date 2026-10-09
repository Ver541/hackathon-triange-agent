import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Activity,
  ArrowRight,
  Server,
  Zap,
  Lock,
  Search,
  ExternalLink,
} from 'lucide-react';
import { TriageAnalysis, DefenseExecutionResult, SeverityLevel } from '../types.ts';

interface TriageResultCardProps {
  analysis: TriageAnalysis;
  onExecuteDefense: () => Promise<void>;
  isExecutingDefense: boolean;
  defenseResult: DefenseExecutionResult | null;
  onResetDefense: () => void;
}

export const TriageResultCard: React.FC<TriageResultCardProps> = ({
  analysis,
  onExecuteDefense,
  isExecutingDefense,
  defenseResult,
  onResetDefense,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const {
    severityAndConfidence,
    forensicEvidence,
    recommendedDefensiveAction,
    defenseExecutionPayload,
  } = analysis;

  const severityStyles: Record<SeverityLevel, { text: string; bg: string; border: string; bar: string }> = {
    CRITICAL: {
      text: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      bar: 'bg-red-500',
    },
    HIGH: {
      text: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      bar: 'bg-orange-500',
    },
    MEDIUM: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      bar: 'bg-amber-500',
    },
    LOW: {
      text: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30',
      bar: 'bg-teal-500',
    },
    INFORMATIONAL: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      bar: 'bg-emerald-500',
    },
  };

  const currentSeverityStyle =
    severityStyles[severityAndConfidence.severityLevel] || severityStyles.HIGH;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl divide-y divide-slate-800/80 shadow-2xl overflow-hidden">
      {/* ========================================================= */}
      {/* SECTION 1: SEVERITY & CONFIDENCE                          */}
      {/* ========================================================= */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              01
            </span>
            <span className="text-xs text-slate-500 font-mono">/</span>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
              Severity & Confidence Assessment
            </h3>
          </div>

          {/* Clean unboxed metadata separator per constitution */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Threat: {severityAndConfidence.threatCategory}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Automated L3 Assessment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Severity & Gauge Block */}
          <div className="lg:col-span-5 bg-slate-950/70 border border-slate-850 rounded-lg p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Assigned Severity
                </span>
                <div className="flex items-center gap-2.5">
                  <span className={`text-2xl font-bold font-mono tracking-tight ${currentSeverityStyle.text}`}>
                    {severityAndConfidence.severityLevel}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${currentSeverityStyle.bar}`} />
                </div>
              </div>

              {/* Confidence Gauge */}
              <div className="text-right">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Confidence Score
                </span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {severityAndConfidence.confidenceScore}%
                </span>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-850">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${currentSeverityStyle.bar} transition-all duration-700`}
                  style={{ width: `${severityAndConfidence.confidenceScore}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                <strong className="text-slate-300 font-medium">Confidence Rationale: </strong>
                {severityAndConfidence.confidenceRationale}
              </p>
            </div>
          </div>

          {/* Executive Summary Block */}
          <div className="lg:col-span-7 bg-slate-950/70 border border-slate-850 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Incident Executive Summary
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(severityAndConfidence.executiveSummary, 'exec-summary')
                  }
                  className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  title="Copy executive summary"
                >
                  {copiedKey === 'exec-summary' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[11px]">Copy</span>
                </button>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {severityAndConfidence.executiveSummary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Category: <span className="text-slate-300">{severityAndConfidence.threatCategory}</span></span>
              <span className="font-mono">
                Status:{' '}
                {severityAndConfidence.severityLevel === 'INFORMATIONAL' ||
                severityAndConfidence.severityLevel === 'LOW' ? (
                  <span className="text-emerald-400 font-medium">BENIGN Flow · Adheres to Baseline</span>
                ) : (
                  <span className="text-amber-400 font-medium">ANOMALOUS Flow · Action Required</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: FORENSIC EVIDENCE                              */}
      {/* ========================================================= */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              02
            </span>
            <span className="text-xs text-slate-500 font-mono">/</span>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
              Forensic Evidence & Threat Attribution
            </h3>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            MITRE ATT&CK: <span className="text-emerald-400 font-medium">{forensicEvidence.mitreTechnique}</span>
          </div>
        </div>

        {/* Primary Forensic Identifiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-950/70 border border-slate-850 rounded-lg p-3.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Attacker Source
            </span>
            <div className="font-mono text-xs text-red-400 font-semibold break-all flex items-center justify-between">
              <span>{forensicEvidence.sourceAttackerIp}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(forensicEvidence.sourceAttackerIp, 'attacker-ip')}
                className="text-slate-500 hover:text-slate-300 ml-2"
                title="Copy source IP"
              >
                {copiedKey === 'attacker-ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-850 rounded-lg p-3.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Targeted Asset
            </span>
            <div className="font-mono text-xs text-slate-200 font-medium break-all">
              {forensicEvidence.destinationTarget}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-850 rounded-lg p-3.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              MITRE Technique
            </span>
            <div className="font-mono text-xs text-emerald-400 font-medium break-all">
              {forensicEvidence.mitreTechnique}
            </div>
          </div>
        </div>

        {/* Indicators of Compromise (IOCs) */}
        {forensicEvidence.indicatorsOfCompromise.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Extracted Indicators of Compromise (IOCs)
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    forensicEvidence.indicatorsOfCompromise.join('\n'),
                    'all-iocs'
                  )
                }
                className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'all-iocs' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="text-[11px]">Copy All IOCs</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {forensicEvidence.indicatorsOfCompromise.map((ioc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs"
                >
                  <span className="text-red-400/80">▪</span>
                  <span>{ioc}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ioc, `ioc-${idx}`)}
                    className="text-slate-600 hover:text-slate-300 ml-1"
                    title="Copy IOC"
                  >
                    {copiedKey === `ioc-${idx}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline & Chronological Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-3">
              Forensic Timeline of Events
            </span>
            <ul className="space-y-2">
              {forensicEvidence.timelineObservations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-500 font-mono mt-0.5 select-none">{idx + 1}.</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Raw Evidence Snippets */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Verbatim Log Artifacts
              </span>
              <span className="text-[10px] font-mono text-slate-500">Log Tokens</span>
            </div>
            <div className="space-y-1.5">
              {forensicEvidence.rawEvidenceSnippets.map((snippet, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-black/60 border border-slate-900 font-mono text-[11px] text-amber-300/90 break-all select-all leading-normal"
                >
                  {snippet}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: RECOMMENDED DEFENSIVE ACTION                    */}
      {/* ========================================================= */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              03
            </span>
            <span className="text-xs text-slate-500 font-mono">/</span>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
              Recommended Defensive Action
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Countermeasure Protocol</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Immediate Containment Callout */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-2 font-medium text-emerald-300 mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Immediate Containment Objective</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {recommendedDefensiveAction.immediateContainment}
            </p>
          </div>

          {/* Firewall / ACL Command Syntax */}
          <div className="bg-slate-950/70 border border-slate-850 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Firewall / Perimeter ACL Rule Syntax</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    recommendedDefensiveAction.firewallRuleSyntax,
                    'firewall-rule'
                  )
                }
                className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1 transition-colors"
                title="Copy firewall command"
              >
                {copiedKey === 'firewall-rule' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px]">Copy Syntax</span>
              </button>
            </div>
            <pre className="p-3 rounded bg-black/80 border border-slate-900 font-mono text-xs text-emerald-300 overflow-x-auto selection:bg-emerald-900">
              <code>{recommendedDefensiveAction.firewallRuleSyntax}</code>
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Host Containment Step */}
            <div className="bg-slate-950/70 border border-slate-850 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Host & Identity Containment</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {recommendedDefensiveAction.hostContainmentStep}
              </p>
            </div>

            {/* SIEM / Detection Signature Guidance */}
            <div className="bg-slate-950/70 border border-slate-850 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Sigma / SIEM Detection Guidance</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {recommendedDefensiveAction.detectionSignatureGuidance}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 4: APPROVE & EXECUTE DEFENSE                      */}
      {/* ========================================================= */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-slate-900/30 to-slate-950/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              04
            </span>
            <span className="text-xs text-slate-500 font-mono">/</span>
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
              Defense Approval & Playbook Execution
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>SOAR Orchestration</span>
          </div>
        </div>

        {/* If defense has NOT been executed yet */}
        {!defenseResult ? (
          <div className="border border-slate-800 bg-slate-950/80 rounded-xl p-5 md:p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Stage Ready for Human Authorization
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {defenseExecutionPayload.actionTitle}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Target: <span className="font-mono text-slate-200">{defenseExecutionPayload.targetAsset}</span> · Boundary: <span className="text-slate-300">{defenseExecutionPayload.enforcementScope}</span>
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-black/70 border border-slate-850 font-mono text-xs text-amber-300/90 overflow-x-auto">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Payload to dispatch:
                  </div>
                  <code>{defenseExecutionPayload.executionCommand}</code>
                </div>
              </div>

              {/* Execution CTA button */}
              <div className="lg:w-72 flex flex-col items-stretch gap-2.5">
                <button
                  type="button"
                  onClick={onExecuteDefense}
                  disabled={isExecutingDefense}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xl shadow-emerald-950/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExecutingDefense ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Dispatching SOAR Playbook...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve & Execute Defense</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-normal">
                  Requires L2/L3 authorization. Dispatches automated containment across connected edge boundaries.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* SUCCESS STATE CONFIRMATION MESSAGE */
          <div className="border border-emerald-500/40 bg-emerald-950/20 rounded-xl p-6 shadow-2xl relative overflow-hidden transition-all duration-500">
            {/* Top decorative glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-white tracking-tight">
                      Defense Countermeasure Successfully Enforced
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {defenseResult.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {defenseResult.verification}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 font-mono text-xs text-slate-400">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Execution ID</span>
                      <span className="text-slate-200">{defenseResult.executionId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Timestamp</span>
                      <span className="text-slate-200">
                        {new Date(defenseResult.timestamp).toLocaleTimeString()} UTC
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Boundary</span>
                      <span className="text-slate-200">{defenseResult.enforcementScope}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `Execution ID: ${defenseResult.executionId}\nAction: ${defenseResult.actionTitle}\nTarget: ${defenseResult.targetAsset}\nStatus: ${defenseResult.status}\nCommand: ${defenseResult.executionCommand}\nTime: ${defenseResult.timestamp}`,
                      'audit-log'
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'audit-log' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Audit Record</span>
                </button>

                <button
                  type="button"
                  onClick={onResetDefense}
                  className="px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
                >
                  Modify / Re-execute
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
