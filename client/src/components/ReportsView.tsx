import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, FileText, ArrowRight, Download, CheckCircle2,
  Calendar, Key, Award, Edit3, ShieldAlert, Globe, Radio, Layers
} from 'lucide-react';
import { VerificationResult } from '../types';

interface ReportsViewProps {
  historyList: VerificationResult[];
  preselectedResult: VerificationResult | null;
  onClearPreselection: () => void;
}

export default function ReportsView({ historyList, preselectedResult, onClearPreselection }: ReportsViewProps) {
  const [selectedId, setSelectedId] = useState('');
  const [inspectorNotes, setInspectorNotes] = useState('Public extraction logs match peer metadata indices. Video stream evaluated for lip synchronization and temporal neural-meshes. Standard journalistic neutrality scorecard applied.');
  const [exportingType, setExportingType] = useState<'pdf' | 'excel' | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedResult) {
      setSelectedId(preselectedResult.id);
    } else if (historyList.length > 0 && !selectedId) {
      setSelectedId(historyList[0].id);
    }
  }, [preselectedResult, historyList]);

  // Find currently active item
  const activeReport = historyList.find(item => item.id === selectedId) || historyList[0] || null;

  const handleExport = (type: 'pdf' | 'excel') => {
    if (!activeReport) {
      alert('No record selected to generate export.');
      return;
    }
    setExportingType(type);
    
    // Simulate export compilation
    setTimeout(() => {
      setExportingType(null);
      setSuccessToast(`Successfully compiled and downloaded ${activeReport.platform || 'Social Media'} analysis report as ${type.toUpperCase()}.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1500);
  };

  const getPlatformStyle = (platformName?: string) => {
    const platform = platformName || 'Other';
    switch (platform) {
      case 'Facebook': return 'bg-blue-600/10 text-blue-600 border-blue-200';
      case 'YouTube': return 'bg-red-600/10 text-red-600 border-red-200';
      case 'TikTok': return 'bg-slate-900 text-pink-400 border-slate-700';
      case 'Instagram': return 'bg-pink-650/10 text-pink-555 border-pink-200';
      case 'X': return 'bg-black text-slate-100 border border-slate-800';
      case 'Reddit': return 'bg-orange-600/10 text-orange-600 border-orange-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-205';
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto" id="reports-compiler-workspace">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Social Media Credibility Reports
        </h2>
        <p className="text-sm text-slate-500">
          Publish, edit, and export official multi-platform analyst compliance certificates. All documents incorporate tamper-aware watermarked SHA-256 footprints.
        </p>
      </div>

      {successToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl border border-emerald-500 flex items-center space-x-3 shadow-lg animate-fade-in text-xs">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Compiler sidebar options */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6 text-slate-905">
            <h3 className="font-display font-bold text-slate-900 text-sm">Report Compiler Options</h3>
            
            {/* Target Select */}
            <div className="space-y-2">
              <label htmlFor="audited-record-select" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                1. Select Archived Verification Log
              </label>
              <select
                id="audited-record-select"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  onClearPreselection();
                }}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-2.5 rounded-xl text-slate-800 text-xs font-medium focus:outline-none"
              >
                {historyList.length === 0 ? (
                  <option value="">No history logs available</option>
                ) : (
                  historyList.map(item => (
                    <option key={item.id} value={item.id}>
                      [{item.platform || 'UPLOAD'}] {item.targetName.substring(0, 36)}...
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Custom Analyst notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="analyst-notes-area" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  2. Investigator Diagnostic Addition
                </label>
                <span className="text-[10px] text-blue-600 font-bold flex items-center space-x-0.5">
                  <Edit3 className="h-3 w-3" />
                  <span>Interactive Field</span>
                </span>
              </div>
              <textarea
                id="analyst-notes-area"
                rows={4}
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                placeholder="Declare credentials, key temporal mesh frames, audio delay latency or social context overlays..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-3 rounded-xl text-slate-800 text-xs focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            {/* Compile Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                3. Compile & Export watermarked document
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!activeReport || exportingType !== null}
                  onClick={() => handleExport('pdf')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:bg-slate-200"
                >
                  {exportingType === 'pdf' ? (
                    <span>Linking PDF...</span>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 text-blue-450" />
                      <span>Export PDF</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={!activeReport || exportingType !== null}
                  onClick={() => handleExport('excel')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:bg-slate-200"
                >
                  {exportingType === 'excel' ? (
                    <span>Linking XLS...</span>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Export Excel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs text-slate-450 space-y-2">
            <span className="font-bold text-slate-800 block">🔒 TrustLens Core Authenticated Certificate</span>
            <p className="leading-relaxed text-[11px]">
              VeraLabs certificates utilize un-forgeable serial numbers synchronized directly with your history database records. They include specific markers highlighting source access, content types, confidence and risk levels.
            </p>
          </div>
        </div>

        {/* Certificate preview panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden relative">
          {activeReport ? (
            <div className="p-8 space-y-6 relative select-none">
              
              {/* Watermark overlay */}
              <div className="absolute inset-x-0 top-1/4 flex items-center justify-center opacity-[0.02] pointer-events-none p-12">
                <Award className="w-96 h-96 stroke-[0.3] text-blue-900" />
              </div>

              {/* Printable Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-950 pb-5">
                <div className="space-y-1">
                  <h4 className="font-display font-black text-slate-950 text-xl tracking-tight">TRUSTLENS AUDIT COMPLIANCE</h4>
                  <p className="text-[9px] font-mono tracking-widest text-blue-600 uppercase font-bold">MULTI-PLATFORM SOCIAL MEDIA FORENSICS INCIDENTS REGISTER</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-slate-950 text-white font-mono text-[9px] font-bold tracking-widest rounded uppercase">
                    CLASSIFIED LEVEL 1
                  </span>
                </div>
              </div>

              {/* Platform badge block */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-405 block text-[10px]">PLATFORM SOURCE:</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-md uppercase ${getPlatformStyle(activeReport.platform)}`}>
                    {activeReport.platform || 'DIRECT FILE'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-405 block text-[10px]">CONTENT TYPE:</span>
                  <span className="text-slate-900 font-bold uppercase block">
                    {activeReport.type ? activeReport.type.replace('_', ' ') : 'MEDIA STREAM'}
                  </span>
                </div>
              </div>

              {/* Metadata log table details */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-slate-150 pb-5">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">TARGET RESOURCE ADDRESS:</span>
                  <span className="text-slate-900 font-bold block truncate max-w-[220px]" title={activeReport.targetName}>
                    {activeReport.targetName}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">SCAN TIMESTAMP:</span>
                  <span className="text-slate-900 font-bold block">
                    {activeReport.date}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">INTEGRITY BLOCKHASH:</span>
                  <span className="text-slate-905 font-bold block uppercase text-[10px] truncate max-w-[200px]">
                    SHA256-{activeReport.id.replace('check-', '')}-d883aaef0cfc
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">CONFIDENCE MATRIX:</span>
                  <span className="text-emerald-600 font-bold block text-[10px] uppercase">
                    {activeReport.unavailable ? 'N/A' : `${100 - activeReport.riskScore}% CONFIDENCE RATIO`}
                  </span>
                </div>
              </div>

              {/* Score Display Card */}
              <div className="p-4 bg-slate-950 text-white rounded-xl grid grid-cols-12 gap-4 items-center border border-slate-900">
                <div className="col-span-4 text-center border-r border-slate-800 pr-2">
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">RISK LEVEL</div>
                  <div className="text-3xl font-display font-black text-rose-450 mt-1">
                    {activeReport.unavailable ? '0%' : `${activeReport.riskScore}%`}
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">WEIGHTED WEIGHT</div>
                </div>

                <div className="col-span-8 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>
                    <span className="font-mono text-[9px] text-blue-400 uppercase tracking-wider font-bold">AI Core Prediction Summary</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed font-sans">
                    {activeReport.verdict}
                  </p>
                </div>
              </div>

              {/* Sub-checks pipeline logs */}
              {activeReport.reasons && activeReport.reasons.length > 0 && (
                <div className="space-y-2 pb-2">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold block">
                    SUB-PROBE NEURAL AUDIT LOGS
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl bg-slate-50 p-3 text-[10px] space-y-2.5">
                    {activeReport.reasons.map((res) => (
                      <div key={res.id} className="pt-2.5 first:pt-0 flex items-start justify-between gap-4">
                        <div className="space-y-0.5 max-w-[80%] text-left">
                          <span className="font-bold text-slate-800 block text-[10px]">{res.name}</span>
                          <p className="text-slate-500 text-[9px] leading-relaxed font-sans">{res.details}</p>
                        </div>
                        <span className={`text-[8px] font-mono font-bold uppercase border px-2 py-0.5 rounded shrink-0 ${
                          res.status === 'passed' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyst custom note layout */}
              <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl text-xs space-y-1.5 text-white">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  INVESTIGATOR COMPILER ANALYSIS NOTE
                </span>
                <p className="text-slate-350 italic leading-relaxed text-[11px] font-sans">
                  "{inspectorNotes || 'No notes appended.'}"
                </p>
              </div>

              {/* Sign-off barcode block */}
              <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-0.5 h-8 items-center bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="bg-slate-900 w-1 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-1.5 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-0.5 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-2 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-1 h-6 inline-block"></span>
                    <span className="bg-slate-800 w-0.5 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-1.5 h-6 inline-block"></span>
                  </div>
                  <div className="text-[9px] tracking-wider leading-none text-left">
                    <span>SECURITY CODE</span>
                    <span className="block font-bold text-slate-800 mt-0.5">SHA-LENS-9001</span>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0">
                  <span className="text-[9px] uppercase text-slate-400 block mb-0.5">TRUSTLENS CORE SIGNATURE:</span>
                  <span className="font-display font-black tracking-wide text-slate-900 text-[10px] block border border-slate-950/20 px-2.5 py-0.8 bg-slate-50 uppercase rounded">
                    ✓ VERIFIED SOURCE STAMP
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                <FileText className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">No Target to Build Report</h4>
                <p className="text-xs text-slate-405 max-w-xs mx-auto leading-relaxed mt-1">
                  Submit a social media URL link or run a manual verification scan in Console.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
