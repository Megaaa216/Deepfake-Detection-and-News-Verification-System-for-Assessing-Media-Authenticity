/**
 * TypeScript definitions for the Deepfake Detection and News Verification System.
 */

export type VerificationType = 'image' | 'video' | 'news_link';

export type VerificationStatus = 'likely_authentic' | 'suspicious' | 'likely_deepfake';

export interface VerificationReason {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
}

export interface VerificationResult {
  id: string;
  type: VerificationType;
  targetName: string; // File name or URL
  date: string;
  riskScore: number; // 0 to 100
  status: VerificationStatus;
  verdict: string;
  recommendation: string;
  reasons: VerificationReason[];
  size?: string; // Optional metadata (e.g., 4.2 MB)
  duration?: string; // Optional (e.g., 0:24 for video)
  sourceCategory?: string; // e.g., "Independent blog", "Unverified claims network", "Mainstream news"
}

export interface Stats {
  totalChecks: number;
  trustedCount: number;
  suspiciousCount: number;
  highRiskCount: number;
}

export interface ActivityTrend {
  day: string;
  mediaChecks: number;
  linkChecks: number;
}

export interface DistributionStat {
  name: string;
  value: number;
  color: string;
}
