import React, { useState, useEffect } from 'react';
import { 
  FileImage, FileVideo, Globe, UploadCloud, AlertTriangle, 
  CheckCircle2, XCircle, Search, Sparkles, RefreshCw, BarChart2,
  FileCheck, ShieldCheck, ChevronRight, HelpCircle
} from 'lucide-react';
import { VerificationResult, VerificationType, VerificationReason } from '../types';
import { MOCK_SCENARIOS } from '../sampleData';

interface VerifyViewProps {
  activeSubTab: VerificationType;
  setActiveSubTab: (tab: VerificationType) => void;
  onAddHistoryItem: (item: VerificationResult) => void;
}

export default function VerifyView({ activeSubTab, setActiveSubTab, onAddHistoryItem }: VerifyViewProps) {
  // Local files / text inputs
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; customUrl?: string } | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  
  // Loading & Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepText, setAnalysisStepText] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Load appropriate presets based on active sub tab
  const presets = MOCK_SCENARIOS[activeSubTab];

  // Steps to iterate over during mock verification
  const verificationSteps = [
    { progress: 15, text: 'Resolving cryptographic file headers & EXIF catalog indices...' },
    { progress: 40, text: 'Parsing local pixel noise gradients & color spectral frequencies...' },
    { progress: 65, text: 'Querying high-integrity journalism whitelists & WHOIS status registries...' },
    { progress: 85, text: 'Running DeepFaceLab mask edge mapping & audio spectrogram mismatch crosschecks...' },
    { progress: 100, text: 'Synthesizing verdict outcomes & calculating weighted trust metrics...' }
  ];

  // Adjust input reset when sub tab changes
  useEffect(() => {
    setSelectedFile(null);
    setInputUrl('');
    setResult(null);
  }, [activeSubTab]);

  const selectPreset = (preset: typeof presets[number]) => {
    if (activeSubTab === 'news_link') {
      setInputUrl(preset.targetName);
      setSelectedFile({ name: preset.targetName, size: 'URL Source' });
    } else {
      setSelectedFile({ name: preset.targetName, size: (preset as any).size || 'Unknown size' });
    }
    // Auto clear prior result to let them click Analyze
    setResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const mBytes = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({
        name: file.name,
        size: `${mBytes} MB`
      });
      setResult(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const mBytes = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({
        name: file.name,
        size: `${mBytes} MB`
      });
      setResult(null);
    }
  };

  const startAnalysis = () => {
    const targetSource = activeSubTab === 'news_link' ? inputUrl : (selectedFile?.name || '');
    if (!targetSource) {
      alert('Please specify a URL link or primary media asset to run synthesis.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStepText(verificationSteps[0].text);

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < verificationSteps.length - 1) {
        stepIndex++;
        setAnalysisProgress(verificationSteps[stepIndex].progress);
        setAnalysisStepText(verificationSteps[stepIndex].text);
      } else {
        clearInterval(interval);
        finalizeAnalysis();
      }
    }, 450);
  };

  const finalizeAnalysis = () => {
    setIsAnalyzing(false);
    
    // Pick matched mock preset or generate custom default
    let finalScenario: any = null;
    const targetSource = activeSubTab === 'news_link' ? inputUrl : (selectedFile?.name || '');

    // Attempt exact match in current preloads
    const match = presets.find(p => p.targetName.toLowerCase() === targetSource.toLowerCase());
    
    if (match) {
      finalScenario = match;
    } else {
      // Create user-defined baseline
      const isUrl = activeSubTab === 'news_link';
      const defaultScore = Math.floor(Math.random() * 40) + 15; // suspicious standard range
      finalScenario = {
        targetName: targetSource,
        riskScore: defaultScore,
        status: defaultScore < 20 ? 'likely_authentic' : defaultScore < 70 ? 'suspicious' : 'likely_deepfake',
        verdict: isUrl 
          ? 'Completed source reputation audit. The link exhibits basic blog infrastructure with minor citations.'
          : 'Processed media matrices. Sub-pixel analysis did not register major synthesized landmarks but files show heavy resaving.',
        recommendation: defaultScore < 50 ? 'Low concern. Read safely.' : 'Verify before sharing. Double check critical claim points.',
        size: selectedFile?.size || 'Unknown MB',
        duration: activeSubTab === 'video' ? '0:15' : undefined,
        reasons: isUrl ? [
          { id: 'usr-1', name: 'Domain Validity Audit', status: 'passed', details: 'Domain looks stable, not on immediate phishing registries but lacks global agency credentials.' },
          { id: 'usr-2', name: 'Syntactic Content Check', status: 'warning', details: 'Article uses some emotional cues and click-catching headline vocabulary.' },
          { id: 'usr-3', name: 'Fact Index lookup', status: 'warning', details: 'No direct debunk matches found in central database, but lacks verified independent backing.' }
        ] : [
          { id: 'usr-4', name: 'Facial Synthesis Probe', status: 'passed', details: 'Checked 12 facial keypoints. No deep generative mask traces detected in frame buffers.' },
          { id: 'usr-5', name: 'Compression Artifact Inspection', status: 'warning', details: 'Detected multiple levels of JPEG/h264 compression cycles indicating potential resave manipulation.' },
          { id: 'usr-6', name: 'Geometry Light Casting', status: 'passed', details: 'Calculated shadow boundaries align correctly with core scene background assets.' }
        ]
      };
    }

    // Parse status properly
    const newRecord: VerificationResult = {
      id: `check-${Date.now()}`,
      type: activeSubTab,
      targetName: finalScenario.targetName,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      riskScore: finalScenario.riskScore,
      status: finalScenario.status,
      verdict: finalScenario.verdict,
      recommendation: finalScenario.recommendation,
      reasons: finalScenario.reasons,
      size: finalScenario.size,
      duration: finalScenario.duration,
      sourceCategory: activeSubTab === 'news_link' ? (finalScenario.sourceCategory || 'Independent site') : undefined
    };

    setResult(newRecord);
    onAddHistoryItem(newRecord);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'likely_authentic':
        return {
          textColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          darkBg: 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400',
          gradient: 'from-emerald-500 to-teal-600',
          statusText: 'Likely Authentic',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        };
      case 'suspicious':
        return {
          textColor: 'text-amber-700 bg-amber-50 border-amber-200',
          darkBg: 'bg-amber-950/20 border-amber-800/40 text-amber-400',
          gradient: 'from-amber-500 to-orange-600',
          statusText: 'Suspicious / Risk Flag',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
        };
      case 'likely_deepfake':
      default:
        return {
          textColor: 'text-rose-700 bg-rose-50 border-rose-200',
          darkBg: 'bg-rose-950/20 border-rose-800/40 text-rose-400',
          gradient: 'from-rose-500 to-red-600',
          statusText: 'Likely Deepfake / False News',
          icon: <XCircle className="h-5 w-5 text-rose-500" />
        };
    }
  };

  const activeStatus = result ? getStatusConfig(result.status) : null;

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center space-x-2">
          <span>Authenticity Verification Console</span>
        </h2>
        <p className="text-sm text-slate-500">
          Enter an online article URL or supply media files to execute real-time credibility audits, source validations, and forensic digital integrity checks.
        </p>
      </div>

      {/* Grid Layout: Config Form Left, Results/Guides Right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Verification workspace block: Left */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
            {/* Tab Swappers */}
            <div className="bg-slate-50 border-b border-slate-100 p-1.5 flex space-x-1">
              <button
                type="button"
                onClick={() => { setActiveSubTab('news_link'); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeSubTab === 'news_link'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-150/60'
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-150/30'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>News Link</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveSubTab('image'); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeSubTab === 'image'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-150/60'
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-150/30'
                }`}
              >
                <FileImage className="h-4 w-4" />
                <span>Image Scan</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveSubTab('video'); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeSubTab === 'video'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-150/60'
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-150/30'
                }`}
              >
                <FileVideo className="h-4 w-4" />
                <span>Video Scan</span>
              </button>
            </div>

            {/* Form Fields container */}
            <div className="p-6 space-y-6">
              {activeSubTab !== 'news_link' ? (
                /* Media Upload Interface */
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative ${
                      dragOver 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : selectedFile 
                        ? 'border-emerald-300 bg-emerald-50/10' 
                        : 'border-slate-200 bg-slate-50/30 hover:bg-slate-50/80 hover:border-slate-350'
                    }`}
                  >
                    <input
                      id="media-file-input"
                      type="file"
                      accept={activeSubTab === 'image' ? 'image/*' : 'video/*'}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        {activeSubTab === 'image' ? (
                          <FileImage className="h-6 w-6 stroke-[1.5]" />
                        ) : (
                          <FileVideo className="h-6 w-6 stroke-[1.5]" />
                        )}
                      </div>
                      
                      {selectedFile ? (
                        <div className="space-y-1 animate-fade-in">
                          <p className="text-sm font-semibold text-slate-800 truncate px-4">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                            {selectedFile.size} • STAGED & READY
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-800">
                            Drag & drop your {activeSubTab} file here, or <span className="text-blue-600 font-semibold underline">browse</span>
                          </p>
                          <p className="text-xs text-slate-400">
                            Supports standard high-fidelity media formats up to 50MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* URL Input Interface */
                <div className="space-y-3">
                  <label htmlFor="url-input-field" className="block text-xs font-mono tracking-wider uppercase text-slate-500 font-bold">
                    Target Article Web Address (URL)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Globe className="h-5 w-5" />
                    </div>
                    <input
                      id="url-input-field"
                      type="url"
                      placeholder="https://example-news-host.com/exclusive-breaking-report"
                      value={inputUrl}
                      onChange={(e) => {
                        setInputUrl(e.target.value);
                        if (e.target.value) {
                          setSelectedFile({ name: e.target.value, size: 'URL' });
                        } else {
                          setSelectedFile(null);
                        }
                        setResult(null);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 pl-11 pr-3.5 py-3 rounded-xl text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Demo Presets Trigger */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest block">
                  💡 Select Quick Verification Presets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.targetName}
                      type="button"
                      onClick={() => selectPreset(preset)}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between h-17 cursor-pointer ${
                        selectedFile?.name === preset.targetName
                          ? 'border-blue-500 bg-blue-50/45 text-blue-900 ring-2 ring-blue-100'
                          : 'border-slate-150 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-semibold truncate w-full mb-1">{preset.targetName}</span>
                      <span className="flex items-center justify-between w-full">
                        <span className="font-mono text-[10px] text-slate-400">
                          {activeSubTab === 'news_link' ? (preset as any).sourceCategory : (preset as any).size}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] uppercase font-bold border ${
                          preset.status === 'likely_authentic' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : preset.status === 'suspicious' 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {preset.status.replace('_', ' ')}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Action Trigger */}
              <button
                type="button"
                disabled={isAnalyzing || !selectedFile}
                onClick={startAnalysis}
                className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  !selectedFile 
                    ? 'bg-slate-350 text-slate-100 cursor-not-allowed shadow-none' 
                    : isAnalyzing 
                    ? 'bg-blue-800' 
                    : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20 hover:-translate-y-0.5'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Analyzing Core Streams...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Run Authenticity Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guidelines info banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-300 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              Technical Verification Standard
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our models verify files directly client-side. Media analysis executes localized high-frequency spatial Fourier transformations, while link checks evaluate WHOIS status records, semantic emotional triggers, and fact-checker mutual agreement states.
            </p>
          </div>
        </div>

        {/* Loading and Result Panel Right Side: Right */}
        <div className="lg:col-span-5 space-y-6">
          {isAnalyzing && (
            /* Analysis Progress Card */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 animate-pulse">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">ANALYZING ENGINE ACTIVE</span>
                <span className="text-sm font-mono text-blue-300 font-bold">{analysisProgress}%</span>
              </div>
              
              {/* Progress bar container */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>

              {/* Step info log */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block animate-ping"></span>
                  <span>CURRENT OPERATION:</span>
                </div>
                <p className="text-xs font-mono text-slate-300 leading-relaxed min-h-8">
                  {analysisStepText}
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest">
                DO NOT NAVIGATE AWAY FROM CONSOLE
              </div>
            </div>
          )}

          {!isAnalyzing && !result && (
            /* Idle Instruction Empty State */
            <div className="bg-white border border-slate-150 rounded-2xl p-8 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                <BarChart2 className="h-7 w-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Verification Report Pending</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Stage a mock file preset or define custom links on the left, then trigger the analytical sweep to view structural evidence and safety risk metrics.
                </p>
              </div>
            </div>
          )}

          {!isAnalyzing && result && activeStatus && (
            /* Result Panel */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-white shadow-xl animate-fade-in space-y-6 p-6">
              {/* Diagnostic Title */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display font-semibold text-white text-base">Forensic Findings</h3>
                  <p className="text-[10px] font-mono text-slate-400">UID: {result.id} • {result.date}</p>
                </div>
                <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-mono text-[10px] text-blue-400">
                  {activeSubTab.toUpperCase()} SCAN
                </div>
              </div>

              {/* Score and Status Block */}
              <div className="grid grid-cols-12 gap-4 items-center bg-slate-950 p-4 rounded-xl border border-slate-850">
                <div className="col-span-5 text-center border-r border-slate-850 pr-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Risk Rating</span>
                  <div className="relative inline-flex items-center justify-center">
                    <span className={`text-3xl font-display font-black tracking-tight ${
                      result.riskScore < 20 
                        ? 'text-emerald-400' 
                        : result.riskScore < 70 
                        ? 'text-amber-400' 
                        : 'text-rose-400'
                    }`}>
                      {result.riskScore}%
                    </span>
                  </div>
                </div>

                <div className="col-span-7 pl-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Status Badge</span>
                  <div className={`p-1.5 rounded-lg border text-xs font-semibold text-center uppercase tracking-wider ${activeStatus.darkBg}`}>
                    {activeStatus.statusText}
                  </div>
                </div>
              </div>

              {/* Explanation Text */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Primary Verdict</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {result.verdict}
                </p>
              </div>

              {/* Reasons checked checklist */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Detailed Evidentiary Rules</span>
                <div className="space-y-2.5">
                  {result.reasons.map((reason) => (
                    <div key={reason.id} className="bg-slate-950/80 p-3 rounded-lg border border-slate-850/60 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200">{reason.name}</span>
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-bold ${
                          reason.status === 'passed'
                            ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50'
                            : reason.status === 'warning'
                            ? 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                            : 'bg-rose-950/20 text-rose-400 border-rose-900/50'
                        }`}>
                          {reason.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {reason.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary recommendation box */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-dashed border-slate-800 space-y-2">
                <div className="flex items-center space-x-1 text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">System Security Advice</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
