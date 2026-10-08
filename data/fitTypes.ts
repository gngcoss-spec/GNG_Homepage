export interface FitAnswers {
  site: string;
  problem: string;
  scale: string;
  system: string;
  goal: string;
  timing: string;
}

export interface FitQuestion {
  key: keyof FitAnswers;
  label: string;
  options: { value: string; label: string }[];
}

export interface FitProduct {
  id: string;
  name: string;
  role: string;
  statusLabel: string;
}

export interface FitRecommendation {
  status: 'candidate' | 'review' | 'clarify';
  title: string;
  reason: string;
  firstStep: string;
  products: FitProduct[];
  extensions: string[];
  checks: string[];
  metrics: string[];
  costFactors: string[];
  notes: string[];
  nextStep: string;
}

export interface FitInquiryDetail {
  summary: string;
  solutionNames: string[];
  ruleVersion: string;
}

export const FIT_INQUIRY_EVENT = 'fit-inquiry-selected';
export const FIT_INVALIDATE_EVENT = 'fit-inquiry-invalidated';
export const FIT_RULE_VERSION = '2026-10-01.v1';
