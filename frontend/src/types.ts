/**
 * TypeScript definitions for the Deepfake Detection and News Verification System.
 */

export type VerificationType = 'video' | 'news_link';

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
  frame_index?: number;
  image_url?: string;
}

export interface SignalLog {
  title: string;
  status: 'PASSED' | 'FLAGGED';
  quote: string;
}

export interface SubScores {
  face_inconsistency?: number;
  lipsync_mismatch?: number;
  audio_irregularities?: number;
  frame_transition?: number;
  [key: string]: number | undefined;
}

export interface ForensicCategories {
  spatial_boundary_artifacts?: string;
  temporal_consistency?: string;
  lighting_and_shadow_geometry?: string;
  audio_visual_indicators?: string;
  [key: string]: string | undefined;
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
  platform?: string; // e.g., "Facebook", "YouTube", "TikTok", "Instagram", "X", "Reddit", "Other"
  unavailable?: boolean; // If content cannot be accessed technically or legally
  unavailabilityReason?: string; // e.g., "Private content", "Restricted content", "Unsupported platform"
  flagged_frames?: FlaggedFrame[];
  summary_text?: string;
  sub_scores?: SubScores;
  signal_logs?: SignalLog[];
  forensic_categories?: ForensicCategories;
  gemini_audit?: any;
  analysis_summary?: any;
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
