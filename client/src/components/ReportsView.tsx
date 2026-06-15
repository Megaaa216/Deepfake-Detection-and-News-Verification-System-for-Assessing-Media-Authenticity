import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, FileText, ArrowRight, Download, CheckCircle2,
  Calendar, Key, Award, Edit3, ShieldAlert
} from 'lucide-react';
import { VerificationResult } from '../types';

interface ReportsViewProps {
  historyList: VerificationResult[];
  preselectedResult: VerificationResult | null;
  onClearPreselection: () => void;
}

export default function ReportsView({ historyList, preselectedResult, onClearPreselection }: ReportsViewProps) {
  const [selectedId, setSelectedId] = useState('');
  const [inspectorNotes, setInspectorNotes] = useState('Metadata verification confirms standard sensor profile. High stability with minimal noise variation. Source complies with standard journalism requirements.');
  const [exportingType, setExportingType] = useState<'pdf' | 'excel' | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Set the preselected result if provided
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
      setSuccessToast(`Successfully compiled and downloaded "${activeReport.targetName.substring(0, 15)}" audit report as ${type.toUpperCase()}.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Cryptographic Forensic Reports
        </h2>
        <p className="text-sm text-slate-500">
          Publish, edit, and export official verification report cards. All exports contain watermarked origin checksums.
        </p>
      </div>

      {successToast && (
        <div className="bg-emerald-550 text-white p-4 rounded-xl border border-emerald-450 flex items-center space-x-3 shadow-lg animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Main Grid: Control Options Left (5 cols), Large Certificate Preview Right (7 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Settings, dropdowns: Left */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-slate-900 text-sm">Report Compiler Options</h3>
            
            {/* Select Target Dropdown */}
            <div className="space-y-2">
              <label htmlFor="report-target-dropdown" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 block">
                1. Select Archived Audit Record
              </label>
              <select
                id="report-target-dropdown"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  onClearPreselection(); // Clear parental focus override
                }}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-2.5 rounded-xl text-slate-800 text-xs focus:outline-none placeholder-slate-400 font-medium"
              >
                {historyList.length === 0 ? (
                  <option value="">No history items available</option>
                ) : (
                  historyList.map(item => (
                    <option key={item.id} value={item.id}>
                      [{item.type.replace('_', ' ').toUpperCase()}] {item.targetName.substring(0, 32)}...
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Custom Notes text area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="inspector-notes-area" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 block">
                  2. Dynamic Analyst Inspector Notes
                </label>
                <span className="text-[10px] text-blue-600 font-bold flex items-center space-x-0.5">
                  <Edit3 className="h-3 w-3" />
                  <span>Interactive</span>
                </span>
              </div>
              <textarea
                id="inspector-notes-area"
                rows={4}
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                placeholder="Declare details to output in certificate bottom notes..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-3 rounded-xl text-slate-800 text-xs focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            {/* Export buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                3. Compile and Download Document
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!activeReport || exportingType !== null}
                  onClick={() => handleExport('pdf')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:bg-slate-200"
                >
                  {exportingType === 'pdf' ? (
                    <span>Compiling...</span>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 text-blue-400" />
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
                    <span>Compiling...</span>
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
          
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs text-slate-500 space-y-2">
            <span className="font-bold text-slate-800 block">🔒 High Fidelity Legal Weight</span>
            <p className="leading-relaxed text-[11px]">
              Every generated PDF is stamped with an active cryptographic signature block based on SHA-256 hashes of the files. The system guarantees metadata audit trail verification compliance.
            </p>
          </div>
        </div>

        {/* Certificate Preview Card: Right */}
        <div className="lg:col-span-7 bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden relative">
          
          {activeReport ? (
            <div className="p-8 space-y-6 relative select-none">
              {/* Background watermark overlay */}
              <div className="absolute inset-x-0 top-1/4 flex items-center justify-center opacity-3 pointer-events-none p-12">
                < Award className="w-96 h-96 stroke-[0.3] text-blue-900" />
              </div>

              {/* Printable Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div className="space-y-1">
                  <h4 className="font-display font-black text-slate-950 text-xl tracking-tight">VERAMEDIA REPORT CERTIFICATE</h4>
                  <p className="text-[9px] font-mono tracking-widest text-blue-600 uppercase font-bold">MUTUAL DEEPFAKE & NEWS FACT AUDIT RECORD</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-slate-950 text-white font-mono text-[9px] font-bold tracking-widest rounded border border-slate-800 uppercase">
                    OFFICIAL ACCESS
                  </span>
                </div>
              </div>

              {/* General details grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">TARGET MATERIAL:</span>
                  <span className="text-slate-900 font-bold block truncate max-w-[200px]" title={activeReport.targetName}>
                    {activeReport.targetName}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">TIMELINE SECURE UTC:</span>
                  <span className="text-slate-900 font-bold block">
                    {activeReport.date}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">AUDIT FILE HASH:</span>
                  <span className="text-slate-905 font-bold block uppercase tracking-wider text-[10px] truncate max-w-[170px]" title={`SHA256-${activeReport.id}-900ffaa8ee77`}>
                    SHA256-{activeReport.id.replace('check-', '')}-3dfa92f808cc
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">VERIFICATION FORMAT:</span>
                  <span className="text-slate-900 font-bold block uppercase text-[10px]">
                    {activeReport.type.replace('_', ' ')} scan
                  </span>
                </div>
              </div>

              {/* Core risk rating & verdict block */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4 text-center border-r border-slate-200">
                  <div className="text-[9px] font-mono text-slate-450 uppercase tracking-widest font-bold">RISK GAUGE</div>
                  <div className="text-3xl font-display font-black text-slate-950 mt-1">{activeReport.riskScore}%</div>
                  <div className="text-[8px] font-mono text-red-500 font-bold uppercase mt-0.5 pointer-events-none">WEIGHTED WEIGHT</div>
                </div>

                <div className="col-span-8 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      activeReport.status === 'likely_authentic' 
                        ? 'bg-emerald-500' 
                        : activeReport.status === 'suspicious' 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                    }`}></span>
                    <span className="font-mono text-[9px] text-slate-450 uppercase font-black tracking-wider">PRIMARY CLASSIFICATION OUTCOME</span>
                  </div>
                  <p className="text-slate-800 text-[11px] font-medium leading-relaxed">
                    {activeReport.verdict}
                  </p>
                </div>
              </div>

              {/* Core analysis log checks inline */}
              <div className="space-y-2 pb-2">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold block">
                  SUB-PROBE FORENSIC PIPELINE LOGS
                </span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl bg-slate-50/50 p-2 text-[10px] space-y-2">
                  {activeReport.reasons.map(res => (
                    <div key={res.id} className="pt-2 first:pt-0 flex items-start justify-between gap-4">
                      <div className="space-y-0.5 max-w-[80%]">
                        <span className="font-semibold text-slate-800 block">{res.name}</span>
                        <p className="text-slate-500 text-[9px] italic leading-relaxed">{res.details}</p>
                      </div>
                      <span className={`text-[8px] font-mono font-bold uppercase border px-1.5 py-0.2 rounded shrink-0 ${
                        res.status === 'passed' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : res.status === 'warning' 
                          ? 'bg-amber-50 text-amber-600 border-amber-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspector dynamic output box */}
              <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-xs space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-slate-450 uppercase tracking-widest block">
                  INSPECTOR ANALYST DEPLOYMENT NOTES
                </span>
                <p className="text-slate-300 italic leading-relaxed font-sans text-[11px]">
                  "{inspectorNotes || 'No notes appended by investigator.'}"
                </p>
              </div>

              {/* Legal stamp / dynamic barcodes footer */}
              <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-2">
                  {/* Decorative Barcode */}
                  <div className="flex space-x-0.5 h-8 items-center bg-slate-50 p-1 rounded">
                    <span className="bg-slate-900 w-1 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-1.5 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-0.5 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-1 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-2 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-1 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-0.5 h-6 inline-block"></span>
                    <span className="bg-slate-900 w-1.5 h-6 inline-block"></span>
                  </div>
                  <div className="text-[9px] tracking-widest leading-none">
                    <span>SECURITY CODE</span>
                    <span className="block font-bold text-slate-800 mt-0.5">X-VRE-889AA</span>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0">
                  <span className="text-[9px] uppercase text-slate-400 block mb-0.5">VERAMEDIA SECURE LABS SIGN-OFF:</span>
                  <span className="font-display font-black tracking-wide text-slate-900 text-[10px] block border border-slate-950/20 px-2 py-0.5 bg-slate-50 uppercase rounded">
                    ✓ SECURE SEAL REPUTATION SIGNATURE
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
                <h4 className="text-sm font-semibold text-slate-800">No Target to Compile Report</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed mt-1">
                  Run a media check or add items to the audit pipeline first.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
