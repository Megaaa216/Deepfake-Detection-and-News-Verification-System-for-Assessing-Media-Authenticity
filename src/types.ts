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

export interface FlaggedFrame {
  frame_id: string;
  image_name: string;
  verdict: 'AUTHENTIC' | 'FAKE';
  details: string;
  score?: number;
  confidence?: number;
  frame_index?: number;
  image_url?: string;
}

export interface ForensicMetrics {
  spatial_coherence_score?: number;
  spatial_artifact_index?: number;
  temporal_variance?: number;
  temporal_coherence?: number;
  frames_processed?: number;
  faces_detected?: number;
  face_coverage_ratio?: number;
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
  sourceCategory?: string;
  platform?: string;
  unavailable?: boolean;
  unavailabilityReason?: string;
  flagged_frames?: FlaggedFrame[];
  gemini_audit?: any;
  analysis_summary?: any;
  summary?: string;
  recommended_action?: string;
  forensic_metrics?: ForensicMetrics;
  asset_type?: string;
  confidence_score?: number;
  thumbnail_url?: string;
  preview_url?: string;
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
