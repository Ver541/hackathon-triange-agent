export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export interface SeverityAndConfidence {
  severityLevel: SeverityLevel;
  confidenceScore: number;
  confidenceRationale: string;
  threatCategory: string;
  executiveSummary: string;
}

export interface ForensicEvidence {
  sourceAttackerIp: string;
  destinationTarget: string;
  mitreTechnique: string;
  indicatorsOfCompromise: string[];
  timelineObservations: string[];
  rawEvidenceSnippets: string[];
}

export interface RecommendedDefensiveAction {
  immediateContainment: string;
  firewallRuleSyntax: string;
  hostContainmentStep: string;
  detectionSignatureGuidance: string;
}

export interface DefenseExecutionPayload {
  actionTitle: string;
  targetAsset: string;
  executionCommand: string;
  enforcementScope: string;
}

export interface TriageAnalysis {
  severityAndConfidence: SeverityAndConfidence;
  forensicEvidence: ForensicEvidence;
  recommendedDefensiveAction: RecommendedDefensiveAction;
  defenseExecutionPayload: DefenseExecutionPayload;
}

export interface DefenseExecutionResult {
  executionId: string;
  timestamp: string;
  actionTitle: string;
  targetAsset: string;
  executionCommand: string;
  enforcementScope: string;
  status: 'ENFORCED' | 'FAILED';
  verification: string;
}
