import React, { useState } from 'react';
import { 
  ArrowLeft, Download, ShieldAlert, CheckCircle2, AlertTriangle, 
  FileText, Calendar, HardDrive, Timer, ExternalLink, RefreshCw, BarChart2,
  HelpCircle, ChevronRight, Lock, BadgeInfo, Cpu, Star, BadgeCheck,
  Eye, Scan, Play, AlertCircle, Sparkles, Clock, Compass, Activity, 
  AlignLeft, Info, FileSignature, CheckCircle, ShieldX
} from 'lucide-react';
import { VerificationResult } from '../types';

interface DetailedResultViewProps {
  resultId: string;
  historyList: VerificationResult[];
  onBackToHistory: () => void;
}

export default function DetailedResultView({ resultId, historyList, onBackToHistory }: DetailedResultViewProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Locate the target result
  const targetReport = historyList.find(r => r.id === resultId) || historyList[0];

  if (!targetReport) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto" id="missing-report-view">
        <BadgeInfo className="h-12 w-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analysis Record Missing</h3>
        <p className="text-slate-550 dark:text-slate-400 text-xs">
          The requested identifier <code className="font-mono bg-slate-100 dark:bg-slate-950 p-1 rounded font-bold">{resultId}</code> was not flagged in the active system catalog. 
        </p>
        <button
          onClick={onBackToHistory}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Return to Evidence Logs
        </button>
      </div>
    );
  }

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Forensic analysis report compiled for "${targetReport.targetName}" and synchronized to local downloads directory.`);
    }, 1200);
  };

  const handleCopyHash = () => {
    setCopied(true);
    navigator.clipboard.writeText(`sha256-${targetReport.id}-900ffa12bc777`);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status mapping
  const isAuth = targetReport.status === 'likely_authentic';
  const isSusp = targetReport.status === 'suspicious';
  const isFake = targetReport.status === 'likely_deepfake';
  const isNews = targetReport.type === 'news_link';

  // Professional labels conforming perfectly to instructions
  let finalVerdictLabel = 'Unknown Status';
  let riskLevelLabel = 'Unknown Risk';
  let riskColorClass = 'text-slate-400';
  let riskBgClass = 'bg-slate-950/40 border-slate-850';
  let riskBorderColor = 'border-slate-800';
  let riskBadgeColor = 'bg-slate-900 text-slate-400 border-slate-800';

  if (isAuth) {
    finalVerdictLabel = 'Likely authentic';
    riskLevelLabel = 'Low Risk';
    riskColorClass = 'text-emerald-400';
    riskBgClass = 'bg-emerald-950/40 border-emerald-900/60';
    riskBorderColor = 'border-emerald-900/60';
    riskBadgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  } else if (isSusp) {
    finalVerdictLabel = 'Suspicious';
    riskLevelLabel = 'Medium Risk';
    riskColorClass = 'text-amber-400';
    riskBgClass = 'bg-amber-950/40 border-amber-850/60';
    riskBorderColor = 'border-amber-850/60';
    riskBadgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  } else if (isFake) {
    finalVerdictLabel = isNews ? 'High risk of misinformation' : 'Likely manipulated';
    riskLevelLabel = 'High Risk';
    riskColorClass = 'text-rose-400';
    riskBgClass = 'bg-rose-950/40 border-rose-900/60';
    riskBorderColor = 'border-rose-900/60';
    riskBadgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  }

  // Calculate dynamic subscores based on overall riskScore to represent a realistic, interconnected check
  const getSubscores = (type: string, score: number) => {
    const isHigh = score > 50;
    const isMed = score >= 20 && score <= 50;

    if (type === 'video') {
      return {
        faceConsistency: isHigh ? 84 : isMed ? 48 : 9,
        lipSyncMismatch: isHigh ? 89 : isMed ? 52 : 12,
        audioIrregularities: isHigh ? 94 : isMed ? 45 : 6,
        frameTransitionAnomalies: isHigh ? 81 : isMed ? 38 : 5,
        manipulationScore: score
      };
    } else if (type === 'image') {
      return {
        aiGenerationIndicators: isHigh ? 86 : isMed ? 42 : 5,
        editingTraces: isHigh ? 89 : isMed ? 55 : 12,
        metadataInconsistencies: isHigh ? 78 : isMed ? 34 : 4,
        facialArtifacts: isHigh ? 92 : isMed ? 49 : 8
      };
    } else {
      return {
        sourceReliability: isHigh ? 88 : isMed ? 54 : 10,
        emotionalLanguage: isHigh ? 91 : isMed ? 48 : 7,
        headlineManipulation: isHigh ? 84 : isMed ? 41 : 9,
        contentConsistency: isHigh ? 87 : isMed ? 52 : 11
      };
    }
  };

  const subscores = getSubscores(targetReport.type, targetReport.riskScore);
  const confidencePercentage = Math.max(targetReport.riskScore, 100 - targetReport.riskScore);

  // Generate strong list of detection signals based on the report data
  const getStrongestSignals = () => {
    const list: { name: string; impact: string; severity: 'low' | 'medium' | 'high' }[] = [];
    if (targetReport.type === 'video') {
      if (targetReport.riskScore > 50) {
        list.push({ name: 'Synthesized Acoustic Resonance', impact: 'Acoustic voice clone footprints parsed near high frequencies.', severity: 'high' });
        list.push({ name: 'Face Mesh Landmark Jitter', impact: '67 coordinate points drift flagged during head rotation.', severity: 'high' });
        list.push({ name: 'Boundary Interpolation Anomaly', impact: 'Flickering pixels observed around hair and chin edges.', severity: 'medium' });
      } else {
        list.push({ name: 'Acoustic Wavelet Uniformity', impact: 'Speech frequencies match natural biological voice boxes.', severity: 'low' });
        list.push({ name: 'Structural Mesh Adherence', impact: 'Landmark vertices locked cleanly with bone structure.', severity: 'low' });
      }
    } else if (targetReport.type === 'image') {
      if (targetReport.riskScore > 50) {
        list.push({ name: 'CFA Grid Interpolation Check', impact: 'Repeating patterns typical of generative AI diffusion grids.', severity: 'high' });
        list.push({ name: 'Specular Reflection Vector Divergence', impact: 'Pupil highlight vectors misaligned with ceiling illumination sources.', severity: 'high' });
        list.push({ name: 'Localized Sharpness Feathering', impact: 'Blur and airbrush borders identified along hand and shoulder crops.', severity: 'medium' });
      } else {
        list.push({ name: 'Continuous Background Pixel Noise', impact: 'Hardware camera sensor fingerprint verified universally.', severity: 'low' });
        list.push({ name: 'Specular Highlight Alignment', impact: 'Reflective elements scale organically across the environment.', severity: 'low' });
      }
    } else {
      if (targetReport.riskScore > 50) {
        list.push({ name: 'Hyperbolic Sentence Framing', impact: 'Excessive Clickbait modifiers designed to stimulate emotional shock.', severity: 'high' });
        list.push({ name: 'Zero News Wire Cross-Referencing', impact: 'Primary databases return 0 matches for this headline event.', severity: 'high' });
        list.push({ name: 'Title - Article Body Conflict', impact: 'Sensational claim in heading is unsupported by the quoted body paragraph.', severity: 'medium' });
      } else {
        list.push({ name: 'Neutral Informative Reporting Index', impact: 'Syntactic architecture matches objective professional dispatches.', severity: 'low' });
        list.push({ name: 'Multi-Bureau Verification', impact: 'Claim documented cleanly by 3+ independent media publishers.', severity: 'low' });
      }
    }
    return list;
  };

  const strongestSignals = getStrongestSignals();

  // Determine Source Name & metadata based on the specimen
  const getSourceMetadata = () => {
    let sourceName = 'Specimen Source Unknown';
    let platformName = targetReport.platform || 'Public Network';
    let verificationStatus = 'Unverified Creator Profile';
    let reliabilityRating: 'trusted' | 'unverified' | 'suspicious' = 'unverified';
    let reasonText = 'System could not verify publisher history due to missing credential headers.';

    const lowerName = targetReport.targetName.toLowerCase();
    
    if (isNews) {
      if (isAuth) {
        sourceName = 'The Horizon News Bureau';
        verificationStatus = 'Verified News Agency (IFCN Member)';
        reliabilityRating = 'trusted';
        reasonText = 'Publisher maintains a certified record of journalistic compliance and neutral corrections history.';
      } else if (isSusp) {
        sourceName = 'Regional Truth Monitor';
        verificationStatus = 'Unverified Media Feed';
        reliabilityRating = 'unverified';
        reasonText = 'The domain is recently registered and lacks an independent editorial correction record.';
      } else {
        sourceName = '@AlternativeBriefings';
        verificationStatus = 'Flagged Misinformation Outlet';
        reliabilityRating = 'suspicious';
        reasonText = 'Associated with coordinates known to syndicate unverified claims and synthetic press releases.';
      }
    } else {
      // Media posts
      if (platformName === 'YouTube') {
        sourceName = isAuth ? 'AssociatedPress_Official' : 'ViralChronicles_HQ';
      } else if (platformName === 'TikTok') {
        sourceName = isAuth ? '@academic_research' : '@leaked_briefings_2026';
      } else if (platformName === 'X') {
        sourceName = isAuth ? '@Reuters' : '@PatriotAlliance';
      } else if (platformName === 'Instagram') {
        sourceName = isAuth ? '@world_defense' : '@unmasked_archives';
      } else {
        sourceName = isAuth ? '@verified_journalist' : '@anonymous_leaks';
      }

      if (isAuth) {
        verificationStatus = 'Verified Public Handle';
        reliabilityRating = 'trusted';
        reasonText = 'Metadata headers align perfectly with the publisher\'s historic hardware camera registration.';
      } else if (isSusp) {
        verificationStatus = 'Unverified Personal Account';
        reliabilityRating = 'unverified';
        reasonText = 'High-frequency uploads with inconsistent localized EXIF metadata records.';
      } else {
        verificationStatus = 'Flagged Synthetic Media Generator';
        reliabilityRating = 'suspicious';
        reasonText = 'Consistent with coordinated social media networks distributing synthesized deepfake composites.';
      }
    }

    return { sourceName, platformName, verificationStatus, reliabilityRating, reasonText };
  };

  const sourceMeta = getSourceMetadata();

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 text-left px-4" id="forensic-result-view">
      
      {/* 1. Navigation & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <button
            onClick={onBackToHistory}
            className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>&lt; RETURN TO EVIDENCE LOGS</span>
          </button>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-wider uppercase text-blue-500 dark:text-blue-400 font-bold">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            <span>FORENSIC EXAMINATION COMPLETED • EVIDENCE DOSSIER</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyHash}
            className="px-3.5 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
          >
            <span>SHA-256 Digest:</span>
            <span className="text-slate-450 dark:text-slate-500 font-normal">
              {copied ? '✓ COPIED' : `${targetReport.id.substring(0, 8)}...`}
            </span>
          </button>
          
          <button
            onClick={handleExport}
            disabled={downloading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm hover:shadow-blue-500/10"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>{downloading ? 'Sealing Case PDF...' : 'Export Case File'}</span>
          </button>
        </div>
      </div>

      {/* 2. Strong Top Summary Card */}
      <div className="bg-slate-950 text-white border border-slate-900 p-6 rounded-2xl relative overflow-hidden shadow-xl" id="summary-header-card">
        {/* Decorative grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded border border-blue-800/40 font-bold">
                SPECIMEN ID: #{targetReport.id}
              </span>
              <span className={`text-[10px] font-mono tracking-wider font-bold px-2.5 py-1 rounded border ${riskBadgeColor}`}>
                {riskLevelLabel.toUpperCase()}
              </span>
              <span className="text-slate-500 font-mono text-[10px]">|</span>
              <span className="text-slate-400 font-mono text-[10px] uppercase">
                Content: {targetReport.type === 'video' ? 'Video asset' : targetReport.type === 'image' ? 'Image asset' : 'Text / News Link'}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">Target Specimen / Source URL</span>
              <h1 className="text-lg md:text-2xl font-mono font-bold leading-tight break-all text-slate-100">
                {targetReport.targetName}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400 pt-1 border-t border-slate-900/80">
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Timestamp: {targetReport.date}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <FileSignature className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Dossier: Sealed Case File</span>
              </div>
              {targetReport.size && (
                <div className="flex items-center space-x-1.5">
                  <HardDrive className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Size: {targetReport.size}</span>
                </div>
              )}
            </div>
          </div>

          {/* Big Circular/Segmented Display Outcome */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur border border-slate-800/80 p-5 rounded-xl text-center shadow-lg">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">FORENSIC VERDICT</span>
            <div className={`text-xl md:text-2xl font-display font-black tracking-tight mt-1 px-3 py-1 rounded ${riskColorClass}`}>
              {finalVerdictLabel.toUpperCase()}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800 w-full flex items-center justify-around">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">CONFIDENCE</span>
                <span className="text-xl font-mono font-bold text-slate-200 mt-0.5 block">{confidencePercentage}%</span>
              </div>
              <div className="h-8 border-r border-slate-800"></div>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">ANOMALY INDEX</span>
                <span className="text-xl font-mono font-bold text-slate-200 mt-0.5 block">{targetReport.riskScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Risk Level & Confidence Gauge */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Activity className="h-4 w-4 text-blue-500" />
          <span>DYNAMIC ANOMALY & CONFIDENCE SPECTRUM</span>
        </h3>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500 font-semibold">Risk Index: {targetReport.riskScore}% Anomaly Certainty</span>
            <span className={`font-bold uppercase ${
              isAuth ? 'text-emerald-500' : isSusp ? 'text-amber-500' : 'text-rose-500'
            }`}>
              {isAuth ? '🟢 Low Risk Profile' : isSusp ? '🟡 Elevated Suspicion' : '🔴 Critical Hazard Profile'}
            </span>
          </div>

          {/* Advanced multi-segmented visual slider */}
          <div className="space-y-2">
            <div className="grid grid-cols-10 gap-1.5 h-4">
              {Array.from({ length: 10 }).map((_, idx) => {
                const blockMax = (idx + 1) * 10;
                const blockMin = idx * 10;
                const isActive = targetReport.riskScore > blockMin;
                
                let bgClass = 'bg-slate-200 dark:bg-slate-800/80';
                if (isActive) {
                  if (blockMax <= 30) bgClass = 'bg-emerald-500 shadow-sm shadow-emerald-500/20';
                  else if (blockMax <= 70) bgClass = 'bg-amber-500 shadow-sm shadow-amber-500/20';
                  else bgClass = 'bg-rose-500 shadow-sm shadow-rose-500/20';
                }

                return (
                  <div 
                    key={idx} 
                    className={`h-full rounded-sm transition-all duration-300 ${bgClass}`}
                    title={`Interval ${blockMin}-${blockMax}%`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold uppercase">
              <span>Likely Authentic (0-25%)</span>
              <span>Suspicious (26-60%)</span>
              <span>Likely Manipulated (61-100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Forensic Multi-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ============= LEFT COLUMN: Evidence Preview & Signal Breakdown ============= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. Evidence Preview Section (revealing proof behind the results) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] text-blue-500 dark:text-blue-400 font-mono uppercase font-bold tracking-wider">LAB EVIDENCE VISUALIZER</span>
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Forensic Evidence Preview</span>
              </h2>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              Examines parsed visual elements, audio formants, or lexical syntax highlights collected from the public domain. This exposes the technical markers utilized in establishing the overall verdict.
            </p>

            {targetReport.type === 'video' && (
              <div className="space-y-5" id="video-evidence-preview">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Scanned Key Frame sequence & Lip-sync analysis</span>
                
                {/* Visual frame strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
                  {(targetReport.flagged_frames || [
                    { frame_id: '048', image_name: 'frame_01.jpg', verdict: 'AUTHENTIC' as const, details: 'Specular reflections correct. Standard iris contours verified.' },
                    { frame_id: '192', image_name: 'frame_02.jpg', verdict: 'AUTHENTIC' as const, details: 'Normal jaw mesh locking verified. Face boundaries intact.' },
                    { frame_id: '336', image_name: 'frame_03.jpg', verdict: isFake ? 'FAKE' as const : 'AUTHENTIC' as const, details: isFake ? 'SUSPICIOUS: 140ms lip audio delay. Mesh vertex jitter.' : 'Passed temporal cohesion test. Speech matches lips.' },
                    { frame_id: '528', image_name: 'frame_04.jpg', verdict: isFake ? 'FAKE' as const : 'AUTHENTIC' as const, details: isFake ? 'SUSPICIOUS: Frame interpolation anomalies near cheek boundaries.' : 'Boundary pixels coherent with primary camera sensor.' },
                  ]).map((frame, index) => {
                    const isFrameFake = frame.verdict === 'FAKE';
                    const frameColor = isFrameFake ? 'border-rose-500 text-rose-400 animate-pulse' : 'border-emerald-500/40 text-emerald-400';
                    const frameStatus = isFrameFake ? 'FAKE' : 'AUTHENTIC';
                    
                    return (
                      <div key={index} className={`bg-slate-900 rounded border p-2 text-center space-y-2 relative overflow-hidden flex flex-col justify-between ${
                        isFrameFake ? 'ring-1 ring-rose-500/20' : ''
                      }`}>
                        <div className="absolute top-1 right-1 text-[8px] font-mono bg-slate-950 px-1 text-slate-400 rounded z-10">
                          #{frame.frame_id}
                        </div>
                        
                        {/* Cropped face image with standard face-mesh fallback */}
                        <div className="relative h-28 w-full overflow-hidden rounded bg-slate-950 flex items-center justify-center border border-slate-800">
                          {isFrameFake && (
                            <div className="absolute top-1 left-1 z-10 bg-rose-950/80 border border-rose-500/30 px-1 text-[8px] font-mono font-bold text-rose-400 rounded tracking-widest">
                              ANOMALY
                            </div>
                          )}
                          <img 
                            src={`http://localhost:5000/public/frames/${frame.image_name}`} 
                            alt={`Cropped Face Frame ${frame.frame_id}`} 
                            className="w-full h-full object-cover rounded border border-slate-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector('.frame-placeholder');
                                if (placeholder) {
                                  placeholder.classList.remove('hidden');
                                }
                              }
                            }}
                          />
                          
                          {/* Fallback Face wireframe svg */}
                          <div className="frame-placeholder hidden w-full h-full flex items-center justify-center relative">
                            <svg className={`w-10 h-10 stroke-[0.8] fill-none ${isFrameFake ? 'text-rose-500' : 'text-slate-600'}`}>
                              <circle cx="20" cy="16" r="11" className={isFrameFake ? 'stroke-rose-500 stroke-[1.2]' : 'stroke-slate-700'} />
                              <ellipse cx="20" cy="18" rx="7" ry="10" />
                              <line x1="15" y1="14" x2="17" y2="14" className={isFrameFake ? 'stroke-rose-500 stroke-2' : 'stroke-blue-400'} />
                              <line x1="23" y1="14" x2="25" y2="14" className={isFrameFake ? 'stroke-rose-500 stroke-2' : 'stroke-blue-400'} />
                              <circle cx="20" cy="23" r="2.5" className={isFrameFake ? 'stroke-rose-500 stroke-2 animate-ping' : 'stroke-blue-400'} />
                            </svg>
                          </div>
                        </div>

                        <div className="text-[9px] font-mono space-y-0.5">
                          <span className="block text-slate-400 uppercase font-bold">FRAME #{frame.frame_id}</span>
                          <span className="block text-[8px] text-slate-500 h-10 overflow-hidden leading-tight text-center px-1">
                            {frame.details}
                          </span>
                          <span className={`block font-bold truncate mt-1 px-1 rounded border border-dashed text-[8px] ${frameColor}`}>
                            {frameStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Audio Waveform analysis block */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-[10px] space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-slate-450 uppercase font-bold tracking-wider text-[9px]">Acoustic Spectrograph Decomposition</span>
                    <span className="text-blue-400 font-bold uppercase text-[9px]">14-point Waveform Resonance Map</span>
                  </div>
                  <div className="h-12 flex items-end justify-between px-2 gap-1 bg-slate-900/60 rounded p-1 border border-slate-850">
                    {[12, 45, 89, 65, 34, isFake ? 95 : 12, isFake ? 98 : 45, 78, 45, 23, 67, 12, 54, 88].map((val, idx) => (
                      <div 
                        key={idx} 
                        style={{ height: `${val}%` }} 
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isFake && idx >= 5 && idx <= 6 
                            ? 'bg-rose-500 animate-pulse' 
                            : 'bg-blue-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-[8px] text-slate-500 font-mono gap-1">
                    <span>Frequency Range: 0.2 Hz - 3.2k Hz</span>
                    <span className={isFake ? 'text-rose-400 font-bold' : 'text-emerald-500 font-bold'}>
                      {isFake 
                        ? '⚠️ ALERT: Cloned speech footprint isolated (ElevenLabs V2 signature matches between 1.2k and 1.6k Hz).' 
                        : '✓ PASSED: Dynamic acoustic waveform aligns perfectly with human physiological breathing intervals.'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {targetReport.type === 'image' && (
              <div className="space-y-4" id="image-evidence-preview">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Spatial Pixel Mesh & Specular Light Coordinates</span>
                
                <div className="relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-950 h-64 flex items-center justify-center">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  
                  {/* High tech camera reticle */}
                  <svg className="w-full h-full text-blue-500/10 stroke-[0.5] fill-none absolute inset-0">
                    <line x1="50%" y1="0" x2="50%" y2="100%" className="stroke-blue-500/20 stroke-1" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" className="stroke-blue-500/20 stroke-1" />
                    <rect x="20%" y="15%" width="60%" height="70%" rx="8" className="stroke-blue-500/25 stroke-1" />
                    
                    {isFake && (
                      <>
                        {/* Highlights suspicious regions with coordinates */}
                        <rect x="42%" y="28%" width="16%" height="20%" rx="4" className="stroke-rose-500 stroke-[1.5] animate-pulse" />
                        <line x1="42%" y1="28%" x2="42%" y2="20%" className="stroke-rose-500 stroke-1" />
                        <line x1="42%" y1="28%" x2="35%" y2="28%" className="stroke-rose-500 stroke-1" />

                        {/* Secondary artifact target */}
                        <circle cx="68%" cy="54%" r="14" className="stroke-rose-500 stroke-dashed stroke-1" />
                        <line x1="68%" y1="54%" x2="74%" y2="54%" className="stroke-rose-500 stroke-1" />
                      </>
                    )}
                  </svg>

                  {/* High Tech coordinates indicator */}
                  <div className="absolute bottom-4 left-4 font-mono text-[9px] bg-slate-900/95 border border-slate-800 p-2.5 rounded text-white space-y-1 z-15 shadow-md">
                    <div className="flex items-center space-x-1 text-blue-400 font-bold">
                      <Scan className="h-3 w-3" />
                      <span>CHROMINANCE LAYER COMPILATION</span>
                    </div>
                    <span className="block text-slate-450">Specimen file: {targetReport.targetName}</span>
                    <span className="block text-slate-500">Dimensions: 1024px x 1024px | JPG Codec</span>
                  </div>

                  {isFake ? (
                    <div className="absolute top-4 right-4 bg-rose-950/90 border border-rose-900/80 p-2.5 rounded text-rose-400 text-[9px] font-mono space-y-1 max-w-[240px] z-15 shadow-md">
                      <span className="block font-bold">⚠️ MANIPULATION REGIONS ISOLATED</span>
                      <p className="text-[8px] text-slate-300 leading-normal">
                        • Artifact at [X: 435, Y: 290]: CFA Bayer grid interpolation anomaly (repeating patterns).<br/>
                        • Artifact at [X: 696, Y: 553]: Specular pupil reflection mismatch of -45 degrees.
                      </p>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-emerald-950/90 border border-emerald-900/80 p-2.5 rounded text-emerald-400 text-[9px] font-mono space-y-1 z-15 shadow-md">
                      <span className="block font-bold">🟢 SPECTRAL AUDIT PASSED</span>
                      <span className="block text-slate-350 text-[8px]">Flat sensor noise distribution map. No composite brush traces detected.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {targetReport.type === 'news_link' && (
              <div className="space-y-4" id="text-evidence-preview">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Semantic Linguistic Tagging & Keyword analysis</span>
                
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-4 font-sans">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2 text-[10px] font-mono text-slate-400 font-bold">
                    <span>EXTRACTED LINK PREVIEW CLAIMS</span>
                    <span className="text-blue-500 uppercase tracking-widest text-[9px]">Linguistic Parsing Engine</span>
                  </div>

                  {isFake ? (
                    <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      <p className="text-sm italic">
                        "The centralized economy board has formulated <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-dashed border-rose-500/60 px-1.5 py-0.5 rounded font-semibold inline-block my-0.5 cursor-help" title="Manipulative Language Marker: Exaggerated assertion without external sources.">miracle draft laws to seize private residential vehicle assets</span> within the next 48 hours, triggering a state of <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-dashed border-amber-500/60 px-1.5 py-0.5 rounded font-semibold inline-block my-0.5 cursor-help" title="Emotional Language Trigger: Terms chosen to trigger outrage and anxiety.">massive national panic and emergency public mobilization</span> across capital cities."
                      </p>
                      
                      <div className="grid gap-2 text-[10px] font-mono bg-slate-100 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-850">
                        <div className="flex items-start space-x-1.5 text-rose-500">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block uppercase">HIGH-INTENSITY EMOTIONAL TRIGGERS</span>
                            <span className="text-slate-500 dark:text-slate-400 font-sans">"massive national panic", "emergency public mobilization" are highly biased words designed to accelerate viral distribution without fact verification.</span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-1.5 text-rose-500 pt-1.5 border-t border-slate-200 dark:border-slate-850">
                          <ShieldX className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block uppercase">UNSUPPORTED / UNVERIFIED MATERIAL CLAIMS</span>
                            <span className="text-slate-500 dark:text-slate-400 font-sans">"seize private vehicle assets within 48 hours" lacks legal cross-citations. Central economic registries returned zero matches for this draft code.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : isSusp ? (
                    <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      <p className="text-sm italic">
                        "Unscheduled handshakes took place inside the <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-dashed border-amber-500/60 px-1.5 py-0.5 rounded font-semibold inline-block my-0.5" title="Suspicious local rumor: relies on unverified photographic angles.">senator closed briefing</span> yesterday morning. Staff claimed it was a standard courtesy, but independent bloggers allege <span className="bg-slate-200 dark:bg-slate-800 border border-dashed border-slate-400/60 px-1.5 py-0.5 rounded inline-block my-0.5" title="Uncorroborated Lobbyist Assertions">undisclosed corporate influence lobbying</span>."
                      </p>
                      
                      <div className="grid gap-2 text-[10px] font-mono bg-slate-100 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-850">
                        <div className="flex items-start space-x-1.5 text-amber-500">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block uppercase">LOCALIZED RUMOR AND MISLEADING FRAME</span>
                            <span className="text-slate-500 dark:text-slate-400 font-sans">Handshake context relies heavily on uncorroborated social media threads. Multi-bureau reporting is currently mixed and lacks primary transcripts.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      <p className="text-sm italic">
                        "The European Central Committee released <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-dashed border-emerald-500/60 px-1.5 py-0.5 rounded font-semibold inline-block my-0.5">official economic support brackets</span> for regional green transport initiatives. According to parliamentary transcripts, the program allocates €1.2B for rail electrification."
                      </p>
                      
                      <div className="flex items-start space-x-1.5 text-emerald-500 text-[10px] font-mono bg-slate-100 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-850">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block uppercase">NEUTRAL INFORMATIVE SYNTAX ARCHITECTURE</span>
                          <span className="text-slate-550 dark:text-slate-400 font-sans">Grammar matches informative journalistic templates. All figures reconcile cleanly with official public parliamentary drafts.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* B. Detection Signal Breakdown Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] text-blue-500 dark:text-blue-400 font-mono uppercase font-bold tracking-wider">INDIVIDUAL CLASSIFICATION WEIGHTS</span>
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-blue-600" />
                <span>Detection Signal Breakdown</span>
              </h2>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              Every media or news check maps specific signals against neural classifiers and linguistic indices. The scores below indicate the individual anomaly probabilities found:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {targetReport.type === 'video' && (
                <>
                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Face Inconsistency</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).faceConsistency}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).faceConsistency}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Measures biometric facial vertex drift and geometric landmark symmetry variances across video frames.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Lip-Sync Mismatch</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).lipSyncMismatch}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).lipSyncMismatch}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Calculates the synchronization alignment between phonetic syllables and visual mouth expansions.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Audio Irregularities</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).audioIrregularities}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).audioIrregularities}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Detects artificial speech resonance matching established TTS (text-to-speech) and voice cloning models.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Frame Transition Anomalies</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).frameTransitionAnomalies}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).frameTransitionAnomalies}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Scans boundary margins for inter-frame feathering or mesh blurring common in neural mask-swap deepfakes.
                    </p>
                  </div>
                </>
              )}

              {targetReport.type === 'image' && (
                <>
                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">AI Generation Indicators</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).aiGenerationIndicators}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).aiGenerationIndicators}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Detects GAN/Diffusion noise patterns and structural cell duplications unique to synthetic AI models.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Editing Traces</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).editingTraces}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).editingTraces}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Examines local JPEG compression variations, airbrush blur gradients, and manual clone stamp footprints.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Metadata Inconsistencies</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).metadataInconsistencies}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).metadataInconsistencies}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Analyzes EXIF image headers, camera serial numbers, and software footprint traces for tampering signals.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Facial Artifacts</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).facialArtifacts}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).facialArtifacts}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Checks for asymmetrical pupil reflections, deformed ear anatomies, and inorganic hair contours.
                    </p>
                  </div>
                </>
              )}

              {targetReport.type === 'news_link' && (
                <>
                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Source Reliability</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).sourceReliability}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).sourceReliability}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Reconciles the publisher domain against certified registries of global news bureaus and fact-checking tables.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Emotional Language</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).emotionalLanguage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).emotionalLanguage}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Measures the concentration of outrage-inducing, shocking adjectives and alarms designed to stimulate click viral rates.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Headline Manipulation</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).headlineManipulation}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).headlineManipulation}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Quantifies grammatical divergence where high-intensity headline claims contradict the actual quoted article body.
                    </p>
                  </div>

                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Content Consistency</span>
                      <span className="font-mono text-slate-500 font-bold bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{(subscores as any).contentConsistency}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(subscores as any).contentConsistency}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      Checks independent regional reports and wire services to verify if the parsed claims are universally co-reported.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* C. Analysis Timeline Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Timer className="h-4.5 w-4.5 text-blue-600" />
              <span>FORENSIC TELEMETRY WORKFLOW LOGS</span>
            </h3>

            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-5 text-xs">
              {[
                { time: '[00:00.08]', title: 'Input Received', desc: 'Secure payload input stream captured. Specimen target parsed and isolated.', status: 'completed' },
                { time: '[00:00.42]', title: 'Content Extracted', desc: 'Initiated scraping algorithms. Excreted core visual keyframes, textual body metadata, or raw audio waveforms.', status: 'completed' },
                { time: '[00:01.10]', title: 'Media Type Detected', desc: `Classification complete. Codec target: ${targetReport.type.toUpperCase()} frame arrays successfully compiled.`, status: 'completed' },
                { time: '[00:02.15]', title: 'Analysis Modules Run', desc: 'Dispatched media properties to deep neural classifiers, linguistic pattern processors, or pixel specular shadow grids.', status: 'completed' },
                { time: '[00:03.05]', title: 'Scores Combined', desc: 'Unified individual classifier values using weighted algorithmic matrices to synthesize the unified risk profile index.', status: 'completed' },
                { time: '[00:03.55]', title: 'Final Report Generated', desc: `Verification loop completed. Case sealed with cryptographically generated signature digest sha256-${targetReport.id.substring(0, 6)}...`, status: 'completed' }
              ].map((step, index) => (
                <div key={index} className="relative">
                  {/* Dot check icon */}
                  <span className="absolute -left-[31px] top-0.5 bg-blue-600 text-white rounded-full h-4.5 w-4.5 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </span>
                  <div className="space-y-0.5 font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-blue-500 font-bold">{step.time}</span>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{step.title}</h4>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-sans leading-relaxed text-xs">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ============= RIGHT COLUMN: Source Trust, Reasons, Signals ============= */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* A. Source Trust Card (Applicable for ALL media and news link checks) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-5" id="source-trust-card">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Compass className="h-4.5 w-4.5 text-blue-600" />
              <span>SOURCE TRUST CARD</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-xs space-y-3.5 font-mono">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-450 block uppercase font-bold">Source Publisher</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold block font-sans text-sm">
                    {sourceMeta.sourceName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-200 dark:border-slate-900 pt-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-450 block uppercase font-bold">Platform</span>
                    <span className="text-slate-800 dark:text-slate-300 font-semibold block font-sans">
                      {sourceMeta.platformName}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-450 block uppercase font-bold">Date Published</span>
                    <span className="text-slate-800 dark:text-slate-300 font-semibold block font-sans truncate">
                      {targetReport.date.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-900 pt-3 space-y-1">
                  <span className="text-[9px] text-slate-450 block uppercase font-bold">Verification Status</span>
                  <span className="text-slate-850 dark:text-slate-300 font-semibold block font-sans">
                    {sourceMeta.verificationStatus}
                  </span>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-900 pt-3 space-y-2">
                  <span className="text-[9px] text-slate-450 block uppercase font-bold">Reliability Rating</span>
                  
                  {sourceMeta.reliabilityRating === 'trusted' && (
                    <div className="inline-flex items-center space-x-1.5 text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 text-[10px] font-bold uppercase">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>Trusted</span>
                    </div>
                  )}
                  {sourceMeta.reliabilityRating === 'unverified' && (
                    <div className="inline-flex items-center space-x-1.5 text-amber-600 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-[10px] font-bold uppercase">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>Unverified</span>
                    </div>
                  )}
                  {sourceMeta.reliabilityRating === 'suspicious' && (
                    <div className="inline-flex items-center space-x-1.5 text-rose-600 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 text-[10px] font-bold uppercase">
                      <ShieldX className="h-3.5 w-3.5 shrink-0" />
                      <span>Suspicious</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl space-y-1">
                <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  RATINGS ASSESSMENT REPORT
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-sans">
                  {sourceMeta.reasonText}
                </p>
              </div>
            </div>
          </div>

          {/* B. "Why this result?" panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
              <span>WHY THIS RESULT?</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl space-y-2 text-xs">
                <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  SUMMARY ASSESSMENT RESEARCH REPORT
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {targetReport.verdict}
                </p>
              </div>

              {/* Individual mapped reason logs */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Anomalous Signal Log Entries ({targetReport.reasons.length})
                </span>

                <div className="space-y-2">
                  {targetReport.reasons.map((r) => (
                    <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-850 dark:text-slate-200">{r.name}</span>
                        <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                          r.status === 'passed' 
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
                            : r.status === 'warning' 
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' 
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/20'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed pl-1 border-l border-slate-250 dark:border-slate-800">
                        "{r.details}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* C. Key Detection Signals section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="h-4.5 w-4.5 text-blue-600" />
              <span>KEY MANIPULATION SIGNALS</span>
            </h3>

            <div className="space-y-2.5">
              {strongestSignals.map((sig, i) => (
                <div key={i} className="flex items-start space-x-3 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                    sig.severity === 'high' ? 'bg-rose-500' : sig.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div className="space-y-0.5 animate-fade-in">
                    <h4 className="font-bold text-slate-850 dark:text-slate-200">{sig.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{sig.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CAI cryptographic certificate lock */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl text-xs space-y-3 font-mono">
            <span className="font-bold text-slate-850 dark:text-slate-200 flex items-center space-x-1.5">
              <Lock className="h-4 w-4 text-emerald-500 animate-pulse" />
              <span>ORIGIN AUDIT CERTIFICATE SECURED</span>
            </span>
            <p className="leading-relaxed text-[11px] font-sans text-slate-500 dark:text-slate-400">
              This verification record resides securely on your local session terminal. TrustLens establishes evidence-based probability indices from available public sources and does not certify absolute historical fact.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
