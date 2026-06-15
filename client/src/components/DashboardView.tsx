import React, { useState } from 'react';
import { 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, 
  Trash2, Filter, Eye, RefreshCw, Layers, Calendar, ExternalLink 
} from 'lucide-react';
import { VerificationResult, Stats } from '../types';

interface DashboardViewProps {
  historyList: VerificationResult[];
  stats: Stats;
  onDeleteHistoryItem: (id: string) => void;
  onResetHistoryList: () => void;
  onViewReport: (item: VerificationResult) => void;
}

export default function DashboardView({ 
  historyList, 
  stats, 
  onDeleteHistoryItem, 
  onResetHistoryList,
  onViewReport
}: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'news_link'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'likely_authentic' | 'suspicious' | 'likely_deepfake'>('all');

  // Filter local state
  const filteredHistory = historyList.filter((item) => {
    const matchesSearch = item.targetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate dynamic ratios for SVG donut chart based on current historical listing
  const totalInList = historyList.length;
  const authenticCountInList = historyList.filter(h => h.status === 'likely_authentic').length;
  const suspiciousCountInList = historyList.filter(h => h.status === 'suspicious').length;
  const deepfakeCountInList = historyList.filter(h => h.status === 'likely_deepfake').length;

  const authPct = totalInList ? Math.round((authenticCountInList / totalInList) * 100) : 0;
  const suspPct = totalInList ? Math.round((suspiciousCountInList / totalInList) * 100) : 0;
  const fakePct = totalInList ? Math.round((deepfakeCountInList / totalInList) * 100) : 0;

  // Render donut SVG path calculations
  // radius = 40, strokeWidth = 10, perimeter = 2 * Math.PI * 40 = 251.2
  const perimeter = 251.2;
  const authOffset = perimeter;
  const authDash = (authPct / 100) * perimeter;
  
  const suspOffset = perimeter - authDash;
  const suspDash = (suspPct / 100) * perimeter;
  
  const fakeOffset = suspOffset - suspDash;
  const fakeDash = (fakePct / 100) * perimeter;

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            Platform Analytics & Verification Log
          </h2>
          <p className="text-sm text-slate-500">
            Real-time verification audit logs, classification distributions, and dynamic risk summaries.
          </p>
        </div>
        {historyList.length === 0 && (
          <button
            onClick={onResetHistoryList}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white shadow-sm font-semibold rounded-lg text-xs cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Restore Base History</span>
          </button>
        )}
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Checks */}
        <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 shrink-0 text-slate-100 font-black text-6xl select-none leading-none pointer-events-none">#</div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block">Total Checks</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl md:text-3xl font-display font-black text-slate-900 leading-none">{stats.totalChecks + historyList.length - 6}</span>
            <span className="text-xs font-mono text-slate-400">runs</span>
          </div>
          <div className="text-[11px] text-slate-500">Combined global volume</div>
        </div>

        {/* Trusted Results */}
        <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 uppercase block">Trusted Content</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl md:text-3xl font-display font-black text-emerald-600 leading-none">{stats.trustedCount + authenticCountInList - 2}</span>
            <span className="text-[11px] font-semibold text-emerald-500 py-0.5 px-2 bg-emerald-50 rounded-full">Passed</span>
          </div>
          <div className="text-[11px] text-slate-500">Zero modification anomalies</div>
        </div>

        {/* Suspicious Results */}
        <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Suspicious Logs</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl md:text-3xl font-display font-black text-amber-600 leading-none">{stats.suspiciousCount + suspiciousCountInList - 2}</span>
            <span className="text-[11px] font-semibold text-amber-500 py-0.5 px-2 bg-amber-50 rounded-full">Warning</span>
          </div>
          <div className="text-[11px] text-slate-500">Manual adjustments present</div>
        </div>

        {/* High Risk Alerts */}
        <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
          <span className="text-[10px] font-mono font-bold tracking-widest text-rose-500 uppercase block">High Risk Alerts</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl md:text-3xl font-display font-black text-rose-600 leading-none">{stats.highRiskCount + deepfakeCountInList - 2}</span>
            <span className="text-[11px] font-semibold text-rose-500 py-0.5 px-2 bg-rose-50 rounded-full">Critical</span>
          </div>
          <div className="text-[11px] text-slate-500">AI Synthesized & Fake claims</div>
        </div>
      </div>

      {/* Charts Section Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Line Chart Area: Left (7 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-slate-900 text-sm">Weekly Activity Trend</h3>
              <p className="text-xs text-slate-550">Breakdown of media integrity tests versus link inspections.</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 inline-block"></span>
                <span className="text-slate-600 font-medium">Media Scan</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 inline-block"></span>
                <span className="text-slate-600 font-medium">Link Scan</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative">
            <svg viewBox="0 0 600 200" className="w-full h-auto overflow-visible select-none font-mono text-[10px] text-slate-400">
              {/* Horizontal Grid lines */}
              <line x1="40" y1="20" x2="570" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="570" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="570" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="570" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="570" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="30" y="24" textAnchor="end" fill="#94a3b8">40</text>
              <text x="30" y="64" textAnchor="end" fill="#94a3b8">30</text>
              <text x="30" y="104" textAnchor="end" fill="#94a3b8">20</text>
              <text x="30" y="144" textAnchor="end" fill="#94a3b8">10</text>
              <text x="30" y="174" textAnchor="end" fill="#94a3b8">0</text>

              {/* Data points mapping calculations:
                  X values mapped from index 0-6 to coordinates (50, 130, 210, 290, 370, 450, 530)
                  Y values mapped from range 0-40 to height coordinates 170 to 20
              */}
              {/* Media Checks Line: [12, 18, 28, 22, 35, 14, 19] 
                  Y points: 170 - (val / 40 * 150)
                  12 -> 125, 18 -> 102.5, 28 -> 65, 22 -> 87.5, 35 -> 38.75, 14 -> 117.5, 19 -> 98.75
              */}
              <path 
                d="M 60,125 L 140,102.5 L 220,65 L 300,87.5 L 380,38.75 L 460,117.5 L 540,98.75" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Media Area under line */}
              <path 
                d="M 60,170 L 60,125 L 140,102.5 L 220,65 L 300,87.5 L 380,38.75 L 460,117.5 L 540,98.75 L 540,170 Z" 
                fill="url(#media-gradient)" 
                opacity="0.1"
              />

              {/* Link Checks Line: [15, 22, 31, 19, 40, 18, 25]
                  15 -> 113.75, 22 -> 87.5, 31 -> 53.75, 19 -> 98.75, 40 -> 20, 18 -> 102.5, 25 -> 76.25
              */}
              <path 
                d="M 60,113.75 L 140,87.5 L 220,53.75 L 300,98.75 L 380,20 L 460,102.5 L 540,76.25" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Link Area under line */}
              <path 
                d="M 60,170 L 60,113.75 L 140,87.5 L 220,53.75 L 300,98.75 L 380,20 L 460,102.5 L 540,76.25 L 540,170 Z" 
                fill="url(#link-gradient)" 
                opacity="0.1"
              />

              {/* Highlight Dot hover anchors */}
              <circle cx="380" cy="38.75" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="380" cy="20" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

              {/* X Axis Labels */}
              <text x="60" y="190" textAnchor="middle" fill="#64748b">Mon</text>
              <text x="140" y="190" textAnchor="middle" fill="#64748b">Tue</text>
              <text x="220" y="190" textAnchor="middle" fill="#64748b">Wed</text>
              <text x="300" y="190" textAnchor="middle" fill="#64748b">Thu</text>
              <text x="380" y="190" textAnchor="middle" fill="#64748b" className="font-bold">Fri (Peak)</text>
              <text x="460" y="190" textAnchor="middle" fill="#64748b">Sat</text>
              <text x="540" y="190" textAnchor="middle" fill="#64748b">Sun</text>

              {/* Gradients */}
              <defs>
                <linearGradient id="media-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="link-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Donut Chart Area: Right (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-slate-900 text-sm">Verdict Distribution</h3>
            <p className="text-xs text-slate-550">Active percentage of scanned items in core database.</p>
          </div>

          {/* SVG Donut */}
          {totalInList > 0 ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-4">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Empty grey circle background */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />

                  {/* Authentic sector */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#10b981" 
                    strokeWidth="10" 
                    strokeDasharray={`${authDash} ${perimeter - authDash}`}
                    strokeDashoffset={0}
                  />

                  {/* Suspicious sector */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#f59e0b" 
                    strokeWidth="10" 
                    strokeDasharray={`${suspDash} ${perimeter - suspDash}`}
                    strokeDashoffset={-authDash}
                  />

                  {/* Deepfake sector */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#f43f5e" 
                    strokeWidth="10" 
                    strokeDasharray={`${fakeDash} ${perimeter - fakeDash}`}
                    strokeDashoffset={-(authDash + suspDash)}
                  />
                </svg>

                {/* Concentric absolute info count */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800 font-display leading-none">{totalInList}</span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">scans</span>
                </div>
              </div>

              {/* Interactive Legend and values */}
              <div className="w-full grid grid-cols-3 gap-2 text-center text-xs">
                <div className="space-y-0.5">
                  <span className="inline-block py-0.5 px-2 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px]">
                    {authPct}%
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">Authentic</span>
                </div>
                <div className="space-y-0.5">
                  <span className="inline-block py-0.5 px-2 bg-amber-50 text-amber-700 rounded-md font-bold text-[10px]">
                    {suspPct}%
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">Suspicious</span>
                </div>
                <div className="space-y-0.5">
                  <span className="inline-block py-0.5 px-2 bg-rose-50 text-rose-700 rounded-md font-bold text-[10px]">
                    {fakePct}%
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">Deepfake</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 text-slate-400 text-xs">
              <span>No statistical distribution data available.</span>
            </div>
          )}
        </div>
      </div>

      {/* Audit History Logs Table Section */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden space-y-4">
        {/* Table Title Block with Search & Filter controls */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
              <Layers className="h-4.5 w-4.5 text-blue-600" />
              <span>Full Auditable Evidence Logs</span>
            </h3>
            
            {/* Quick search */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search file or domain URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 pl-9 pr-3.5 py-1.5 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Type and status filter controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter:</span>
            </div>

            {/* Type tab swappers */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['all', 'image', 'video', 'news_link'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-md font-medium text-[11px] capitalize cursor-pointer transition-all ${
                    typeFilter === type
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  {type === 'news_link' ? 'links' : type}
                </button>
              ))}
            </div>

            {/* Status dropdown selector */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['all', 'likely_authentic', 'suspicious', 'likely_deepfake'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-md font-medium text-[11px] uppercase tracking-wide cursor-pointer transition-all ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  {st === 'all' ? 'All Risks' : st.replace('likely_', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* True Responsive Table implementation */}
        <div className="overflow-x-auto">
          {filteredHistory.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3 font-semibold">File / Target Link</th>
                  <th className="px-5 py-3 font-semibold">Verification Date</th>
                  <th className="px-5 py-3 font-semibold col-span-1">Type</th>
                  <th className="px-5 py-3 font-semibold text-center">Score</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => {
                  const isAuth = item.status === 'likely_authentic';
                  const isSusp = item.status === 'suspicious';
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                      {/* Name / Link with Icon */}
                      <td className="px-5 py-3.5 max-w-[280px]">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            item.type === 'image' 
                              ? 'bg-blue-50 text-blue-600' 
                              : item.type === 'video' 
                              ? 'bg-purple-50 text-purple-600' 
                              : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {item.type === 'image' && <Layers className="h-4 w-4" />}
                            {item.type === 'video' && <Calendar className="h-4 w-4" />}
                            {item.type === 'news_link' && <ExternalLink className="h-4 w-4" />}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold block text-slate-900 truncate" title={item.targetName}>
                              {item.targetName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.type === 'news_link' ? (item.sourceCategory || 'Web Source') : item.size}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* Type Label */}
                      <td className="px-5 py-3.5">
                        <span className="capitalize font-mono text-[10px] text-slate-550 border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md">
                          {item.type.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Risk Percentage Gauge */}
                      <td className="px-5 py-3.5 text-center">
                        <span className={`font-mono font-bold text-sm ${
                          isAuth ? 'text-emerald-600' : isSusp ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {item.riskScore}%
                        </span>
                      </td>

                      {/* Status Check badge */}
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block py-0.8 px-2.5 rounded-full font-semibold text-[10px] uppercase border tracking-wider ${
                          isAuth 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                            : isSusp 
                            ? 'bg-amber-50 text-amber-700 border-amber-150' 
                            : 'bg-rose-50 text-rose-700 border-rose-150'
                        }`}>
                          {item.status.replace('likely_', '')}
                        </span>
                      </td>

                      {/* Audit Review Options */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => onViewReport(item)}
                          title="Generate report review card"
                          className="p-1 px-2 border border-slate-250 hover:border-blue-400 text-slate-600 hover:text-blue-700 hover:bg-blue-50/20 rounded transition-all cursor-pointer inline-flex items-center text-[10px] font-semibold space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Report card</span>
                        </button>
                        <button
                          onClick={() => onDeleteHistoryItem(item.id)}
                          title="Delete check segment"
                          className="p-1 border border-transparent hover:border-rose-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer inline-flex items-center"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Custom Empty State */
            <div className="py-20 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                <Search className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-800">No Historical Records Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  There are no logs matching your search and filter parameters. Run a verify analysis or click the restore button to reload baseline audit logs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
