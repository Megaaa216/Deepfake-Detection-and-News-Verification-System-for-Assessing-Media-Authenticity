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

n  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Forensic analysis report compiled for "${targetReport.targetName}" and synchronized to local downloads directory.`);
    }, 1200);
  };

n  const handleCopyHash = () => {
    setCopied(true);
    navigator.clipboard.writeText(`sha256-${targetReport.id}-900ffa12bc777`);
    setTimeout(() => setCopied(false), 2000);
  };

n  // Status mapping
  const isAuth = targetReport.status === 'likely_authentic';
  const isSusp = targetReport.status === 'suspicious';
  const isFake = targetReport.status === 'likely_deepfake';

n  const isNews = targetReport.type === 'news_link';

n  // Compute status headers
  const finalStatusLabel = isAuth 
    ? (isNews ? 'Likely Authentic' : 'Authentic') 
    : isSusp 
    ? 'Suspicious' 
    : (isNews ? 'High Risk' : 'Likely Deepfake');

n  const statusBadgeColor = isAuth 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
    : isSusp 
    ? 'bg-amber-50 text-amber-700 border-amber-150' 
    : 'bg-rose-50 text-rose-700 border-rose-150';

n  const riskFillColor = isAuth 
    ? 'bg-emerald-500' 
    : isSusp 
    ? 'bg-amber-500' 
    : 'bg-rose-500';

n  const riskTextColor = isAuth 
    ? 'text-emerald-600' 
    : isSusp 
    ? 'text-amber-600' 
    : 'text-rose-600';

n  return (
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

(continued)