import React, { useState } from 'react';
import { 
  ArrowLeft, Download, ShieldAlert, CheckCircle2, AlertTriangle, 
  FileText, Calendar, HardDrive, Timer, ExternalLink, RefreshCw, BarChart2,
  ListCollapse, HelpCircle, ChevronRight, Lock, BadgeInfo, Cpu, Star, BadgeCheck
} from 'lucide-react';
import { VerificationResult, VerificationReason } from '../types';

interface DetailedResultViewProps {
  resultId: string;
  historyList: VerificationResult[];
  onBackToHistory: () => void;
}

export default function DetailedResultView({ resultId, historyList, onBackToHistory }: DetailedResultViewProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Locate the target result in either user active logs, or mock backends
  const targetReport = historyList.find(r => r.id === resultId) || 
                       historyList[0]; // fallback if not found

  if (!targetReport) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <BadgeInfo className="h-12 w-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Analysis Record Missing</h3>
        <p className="text-gray-500 text-xs text-left">
          The requested identifier <code className="font-mono bg-slate-100 p-1 rounded font-bold">{resultId}</code> was not flagged in the active system catalog. 
        </p>
        <button
          onClick={onBackToHistory}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
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

  // Compute status headers
  const finalStatusLabel = isAuth 
    ? (isNews ? 'Likely Authentic' : 'Authentic') 
    : isSusp 
    ? 'Suspicious' 
    : (isNews ? 'High Risk' : 'Likely Deepfake');

  const statusBadgeColor = isAuth 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
    : isSusp 
    ? 'bg-amber-50 text-amber-700 border-amber-150' 
    : 'bg-rose-50 text-rose-700 border-rose-150';

  const riskFillColor = isAuth 
    ? 'bg-emerald-500' 
    : isSusp 
    ? 'bg-amber-500' 
    : 'bg-rose-500';

  const riskTextColor = isAuth 
    ? 'text-emerald-600' 
    : isSusp 
    ? 'text-amber-600' 
    : 'text-rose-600';

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto text-slate-800 text-left">
      
      {/* Navigation and Actions row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBackToHistory}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Auditable Logs</span>
        </button>

        {/* Global report tools */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyHash}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white rounded-lg text-xs font-mono font-medium transition-all cursor-pointer"
          >
            {copied ? '✓ COPIED HASH' : 'COPY SHA-256'}
          </button>
          
          <button
            onClick={handleExport}
            disabled={downloading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{downloading ? 'Compiling PDF...' : (isNews ? 'Export Report' : 'Download Report')}</span>
          </button>
        </div>
      </div>

      {/* Core Title and Meta row */}
      <div className="bg-slate-900 text-white border border-slate-850 p-6 rounded-2xl relative overflow-hidden shadow-md">
        {/* Backdrop visual */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 -mb-16 w-52 h-52 bg-slate-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-blue-900/40 text-blue-300 font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border border-blue-800/40 font-bold">
              Secure Audit Record : #{targetReport.id}
            </span>
            <h1 className="text-xl md:text-2xl font-display font-black leading-tight break-all">
              {targetReport.targetName}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-450 pt-1">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                <span>Timestamp: {targetReport.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>ECC Verified Signature Log</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center bg-slate-950 p-5 rounded-2xl border border-slate-850 h-32 w-32 border-dashed">
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">Risk Level</span>
            <span className={`text-3xl font-display font-black mt-1 ${riskTextColor}`}>
              {targetReport.riskScore}%
            </span>
            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold mt-1">Weighted Weight</span>
          </div>
        </div>
      </div>

      {/* Visual Outcome Summary Panel */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 cols): Score visualization, preview fields, reasoning */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Card 1: Score bar and outcome card */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-4 flex items-center space-x-2">
              <BarChart2 className="h-4.5 w-4.5 text-blue-600" />
              <span>Authenticity Score Calibration</span>
            </h3>

            <div className="space-y-6">
              {/* Score slider indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-450 font-bold uppercase">SAFE THRESHOLD</span>
                  <span className="text-slate-450 font-bold uppercase">CRITICAL WARNING</span>
                </div>
                {/* Visual Bar progress indicator */}
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                  <div 
                    className={`h-full ${riskFillColor} transition-all duration-500`}
                    style={{ width: `${targetReport.riskScore}%` }}
                  />
                  {/* Threshold mark lines */}
                  <div className="absolute top-0 bottom-0 left-[30%] border-r border-slate-450/40 border-dashed" />
                  <div className="absolute top-0 bottom-0 left-[70%] border-r border-slate-450/40 border-dashed" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0% (Perfect Authenticity)</span>
                  <span className="text-center">Neutral Zone (30% - 70%)</span>
                  <span>100% (Manipulated Falsehood)</span>
                </div>
              </div>

              {/* Status Outcome Block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 font-bold tracking-widest block uppercase">Final Decision Outcome</span>
                  <span className={`inline-block py-0.5 px-3 rounded-full text-xs font-bold uppercase border mt-1 select-none ${statusBadgeColor}`}>
                    {finalStatusLabel}
                  </span>
                  <p className="text-xs text-slate-650 leading-relaxed pt-2">
                    {targetReport.verdict}
                  </p>
                </div>

                <div className="bg-white border border-slate-150 p-3 rounded-lg text-center shrink-0 w-28">
                  <span className="text-[8px] font-mono text-slate-400 uppercase font-black tracking-wide block">Confidence</span>
                  <span className="text-xl font-display font-black text-slate-800 block mt-0.5">
                    {isAuth ? 100 - targetReport.riskScore : targetReport.riskScore}%
                  </span>
                  <span className="text-[8px] font-mono text-slate-450 block uppercase font-bold mt-0.5">Assurance Scale</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Explanations and Reasoning Logs */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-4 flex items-center space-x-2">
              <Cpu className="h-4.5 w-4.5 text-blue-600" />
              <span>AI Analytical Inference and Deep Reasoning</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50/40 border border-blue-105 rounded-xl space-y-2">
                <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider block">
                  TrustLens AI Deep Engine Explanatory Report
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {targetReport.recommendation}
                </p>
              </div>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block pt-2 border-t border-slate-100">
                Detailed Calibration Probe Vectors
              </span>

              {/* Probe listing */}
              <div className="space-y-3.5">
                {targetReport.reasons.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{p.name}</span>
                      <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.2 rounded border ${
                        p.status === 'passed' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-150' 
                          : p.status === 'warning' 
                          ? 'bg-amber-50 text-amber-600 border-amber-150' 
                          : 'bg-rose-50 text-rose-600 border-rose-150'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic leading-relaxed">
                      "{p.details}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 cols): Context block depending on Type */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Conditional widget box: News Verification specific details */}
          {isNews ? (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-4 flex items-center space-x-2">
                <ExternalLink className="h-4.5 w-4.5 text-blue-600" />
                <span>News Article Media Metadata</span>
              </h3>

              <div className="space-y-4 text-xs font-mono">
                {/* News Title */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 font-sans">
                  <span className="text-[9px] font-mono font-bold text-slate-450 uppercase block">Article Verified URL</span>
                  <a 
                    href={targetReport.targetName}
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 font-bold truncate block hover:underline text-xs flex items-center gap-1.5"
                  >
                    <span className="truncate">{targetReport.targetName}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  </a>
                </div>

                {/* Source Credibility score details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-450 text-[9px] font-bold uppercase block">Source Group</span>
                    <span className="text-slate-800 font-bold block text-xs font-sans capitalize">
                      {targetReport.sourceCategory || 'Independent Registry'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-450 text-[9px] font-bold uppercase block">Linguistic Index</span>
                    <span className="text-slate-800 font-bold block text-xs">
                      {isAuth ? '96.2 / 100' : isSusp ? '54.1 / 100' : '15.8 / 100'}
                    </span>
                  </div>
                </div>

                {/* Similar trusted references list */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Equivalent Trusted References Found
                  </span>
                  
                  {isAuth ? (
                    <div className="space-y-2 font-sans text-xs">
                      <div className="p-2.5 bg-emerald-50/40 border border-emerald-100 rounded-lg flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-800">Associated Press (AP) Logs</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Status: Mutually Confirmed Event</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-emerald-50/40 border border-emerald-100 rounded-lg flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-800">Reuters International Dispatch</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Status: Peer Validated Report XML</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 font-sans text-xs">
                      <div className="p-2.5 bg-rose-50/40 border border-rose-100 rounded-lg flex items-start gap-2">
                        <ShieldAlert className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-800">FactCheck.org Registry Dispute</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Status: Active disinformation warning flag</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 text-slate-500">
                        <HelpCircle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold block">AP & Reuters Search returned zero peers</span>
                          <span className="text-[10px] block font-mono">Status: No reliable independent duplicates</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Conditional widget box: Deepfake file preview metadata section */
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-4 flex items-center space-x-2">
                <HardDrive className="h-4.5 w-4.5 text-blue-600" />
                <span>Forensic Media Metadata</span>
              </h3>

              {/* Photo preview placeholder */}
              <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-850 relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-70"></div>
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.8 text-[9px] font-mono text-blue-400 border border-slate-800 rounded font-bold z-20">
                  CAMERA TELEMETRY VERIFIED
                </div>

                {/* Simulated Image check overlay */}
                <div className="absolute bottom-3 left-3 font-mono text-white text-[10px] space-y-0.5 z-20">
                  <span className="block font-sans font-bold text-xs">{targetReport.targetName}</span>
                  <span className="block text-slate-400">{targetReport.size || '3.2 MB'} • Format: {targetReport.type.toUpperCase()}</span>
                </div>

                {/* SVG decorative wireframes */}
                <svg className="w-full h-full text-blue-500/10 stroke-[0.5] fill-none max-w-[280px]">
                  <rect x="10" y="10" width="260" height="150" rx="8" />
                  <line x1="10" y1="85" x2="270" y2="85" />
                  <line x1="140" y1="10" x2="140" y2="160" />
                  <circle cx="140" cy="85" r="30" />
                  <circle cx="140" cy="85" r="5" className="fill-blue-500/20 text-blue-500" />
                </svg>
              </div>

              {/* Metadata parameters display */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Size Parameters</span>
                  <span className="text-slate-800 font-bold block">{targetReport.size || '4.2 MB'}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Scan duration</span>
                  <span className="text-slate-800 font-bold block">{targetReport.duration || '0:14 Seconds'}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Primary Color Space</span>
                  <span className="text-slate-800 font-bold block">sRGB Linear</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-slate-450 text-[10px] uppercase font-bold block">Neural Layers</span>
                  <span className="text-slate-800 font-bold block">128 CNN Conv</span>
                </div>
              </div>
            </div>
          )}

          {/* St Signature Sealed certificate credentials */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs space-y-3 font-sans">
            <span className="font-bold text-slate-800 block flex items-center space-x-1.5">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              <span>CAI Cryptographic Origin Sign-off</span>
            </span>
            <p className="leading-relaxed text-[11px] text-slate-500 text-left">
              This forensic evaluation report represents a formal cryptographic diagnostic check. It holds verification validity indicators tied to central Fact Registers. Authenticated exports will contain secure digital signature watermarks.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
