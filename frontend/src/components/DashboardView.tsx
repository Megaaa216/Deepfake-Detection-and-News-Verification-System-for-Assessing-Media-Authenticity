import React, { useState } from 'react';
import { 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, 
  Trash2, Filter, Eye, RefreshCw, Layers, Calendar, ExternalLink,
  Globe, PlayCircle, Image, FileText, CheckCircle
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
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'likely_authentic' | 'suspicious' | 'likely_deepfake'>('all');

  // Filter mixed records
  const filteredHistory = historyList.filter((item) => {
    const matchesSearch = item.targetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    // Platform detection / matching
    let platformKey = 'Direct Upload';
    if (item.platform) {
      platformKey = item.platform;
    } else {
      const lower = item.targetName.toLowerCase();
      if (lower.includes('facebook') || lower.includes('fb.watch')) platformKey = 'Facebook';
      else if (lower.includes('youtube') || lower.includes('youtu.be')) platformKey = 'YouTube';
      else if (lower.includes('tiktok')) platformKey = 'TikTok';
      else if (lower.includes('instagram')) platformKey = 'Instagram';
      else if (lower.includes('twitter') || lower.includes('x.com')) platformKey = 'X';
      else if (lower.includes('reddit')) platformKey = 'Reddit';
      else if (lower.includes('http')) platformKey = 'Other';
    }

    const matchesPlatform = platformFilter === 'all' || platformKey.toLowerCase() === platformFilter.toLowerCase();

    return matchesSearch && matchesType && matchesStatus && matchesPlatform;
  });

  // Calculate dynamic ratios for SVG donut chart based on current historical listing
  const totalInList = historyList.length;
  const authenticCountInList = historyList.filter(h => h.status === 'likely_authentic').length;
  const suspiciousCountInList = historyList.filter(h => h.status === 'suspicious').length;
  const deepfakeCountInList = historyList.filter(h => h.status === 'likely_deepfake').length;

  const authPct = totalInList ? Math.round((authenticCountInList / totalInList) * 100) : 0;
  const suspPct = totalInList ? Math.round((suspiciousCountInList / totalInList) * 100) : 0;
  const fakePct = totalInList ? Math.round((deepfakeCountInList / totalInList) * 100) : 0;

  const perimeter = 251.2;
  const authDash = (authPct / 100) * perimeter;
  const suspDash = (suspPct / 100) * perimeter;
  const fakeDash = (fakePct / 100) * perimeter;

  // Retrieve platform specifications
  const getPlatformConfig = (url: string, declaredPlatform?: string) => {
    let platform = declaredPlatform || 'Direct Upload';
    
    if (!declaredPlatform && url) {
      const lower = url.toLowerCase();
      if (lower.includes('facebook.com') || lower.includes('fb.watch')) platform = 'Facebook';
      else if (lower.includes('youtube.com') || lower.includes('youtu.be')) platform = 'YouTube';
      else if (lower.includes('tiktok.com')) platform = 'TikTok';
      else if (lower.includes('instagram.com')) platform = 'Instagram';
      else if (lower.includes('x.com') || lower.includes('twitter.com')) platform = 'X';
      else if (lower.includes('reddit.com')) platform = 'Reddit';
      else if (lower.startsWith('http')) platform = 'Other';
    }

    switch (platform) {
      case 'Facebook':
        return { name: 'Facebook', badge: 'bg-blue-600/10 text-blue-600 border-blue-500/20' };
      case 'YouTube':
        return { name: 'YouTube', badge: 'bg-red-650/10 text-red-500 border-red-500/20' };
      case 'TikTok':
        return { name: 'TikTok', badge: 'bg-slate-900 text-pink-400 border-slate-700' };
      case 'Instagram':
        return { name: 'Instagram', badge: 'bg-pink-600/10 text-pink-600 border-pink-500/20' };
      case 'X':
        return { name: 'X', badge: 'bg-slate-950 text-slate-100 border border-slate-800' };
      case 'Reddit':
        return { name: 'Reddit', badge: 'bg-orange-600/10 text-orange-600 border-orange-500/20' };
      case 'Other':
        return { name: 'Other Web', badge: 'bg-slate-600/10 text-slate-600 border-slate-500/20' };
      default:
        return { name: 'Direct File', badge: 'bg-blue-600 text-white border-blue-500' };
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto" id="dashboard-workspace">
      {/* Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            Platform Analytics & Verification Log
          </h2>
          <p className="text-sm text-slate-500">
            Real-time multi-platform verification audit logs, media classification types, and compliance charts.
          </p>
        </div>
        {historyList.length === 0 && (
          <button
            onClick={onResetHistoryList}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white shadow-sm font-semibold rounded-lg text-xs cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Restore Base History</span>
          </button>
        )}
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Checks */}
        <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden text-slate-950">
          <div className="absolute top-0 right-0 p-4 shrink-0 text-slate-100 font-black text-6xl select-none leading-none pointer-events-none">#</div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-450 uppercase block">Total Checks</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-display font-black text-slate-900 leading-none">{stats.totalChecks + historyList.length - 6}</span>
            <span className="text-xs font-mono text-slate-400">runs</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Mixed streams indexed</div>
        </div>

        {/* Trusted Results */}
        <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden text-slate-950">
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 uppercase block">Trusted Content</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-display font-black text-emerald-600 leading-none">{stats.trustedCount + authenticCountInList - 2}</span>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-500 py-0.5 px-2 bg-emerald-50 rounded">Passed</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Authenticity cert intact</div>
        </div>

        {/* Suspicious Results */}
        <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden text-slate-950">
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Suspicious Logs</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-display font-black text-amber-600 leading-none">{stats.suspiciousCount + suspiciousCountInList - 2}</span>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-500 py-0.5 px-2 bg-amber-50 rounded">Warning</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Edits / clickbaits present</div>
        </div>

        {/* High Risk Alerts */}
        <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden text-slate-950">
          <span className="text-[10px] font-mono font-bold tracking-widest text-rose-500 uppercase block">High Risk Alerts</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-display font-black text-rose-600 leading-none">{stats.highRiskCount + deepfakeCountInList - 2}</span>
            <span className="text-[10px] font-mono uppercase font-bold text-rose-500 py-0.5 px-2 bg-rose-50 rounded">Critical</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Synthetic cloning active</div>
        </div>
      </div>

      {/* Charts Section Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Line Chart Area: Left (7 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-slate-900 text-sm">Synthetic Traffic Analytics</h3>
              <p className="text-xs text-slate-500">Breakdown of media integrity tests versus link inspections.</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 inline-block"></span>
                <span className="text-slate-600 font-medium">Media Scan</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-450 inline-block"></span>
                <span className="text-slate-600 font-medium">Link Scan</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <svg viewBox="0 0 600 200" className="w-full h-auto overflow-visible select-none font-mono text-[10px] text-slate-400">
              <line x1="40" y1="20" x2="570" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="570" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="570" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="570" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="570" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />

              <text x="30" y="24" textAnchor="end" fill="#94a3b8">40</text>
              <text x="30" y="64" textAnchor="end" fill="#94a3b8">30</text>
              <text x="30" y="104" textAnchor="end" fill="#94a3b8">20</text>
              <text x="30" y="144" textAnchor="end" fill="#94a3b8">10</text>
              <text x="30" y="174" textAnchor="end" fill="#94a3b8">0</text>

              <path 
                d="M 60,125 L 140,102.5 L 220,65 L 300,87.5 L 380,38.75 L 460,117.5 L 540,98.75" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 60,170 L 60,125 L 140,102.5 L 220,65 L 300,87.5 L 380,38.75 L 460,117.5 L 540,98.75 L 540,170 Z" 
                fill="url(#media-gradient)" 
                opacity="0.1"
              />

              <path 
                d="M 60,113.75 L 140,87.5 L 220,53.75 L 300,98.75 L 380,20 L 460,102.5 L 540,76.25" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 60,170 L 60,113.75 L 140,87.5 L 220,53.75 L 300,98.75 L 380,20 L 460,102.5 L 540,76.25 L 540,170 Z" 
                fill="url(#link-gradient)" 
                opacity="0.1"
              />

              <circle cx="380" cy="38.75" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="380" cy="20" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

              <text x="60" y="190" textAnchor="middle" fill="#64748b">Mon</text>
              <text x="140" y="190" textAnchor="middle" fill="#64748b">Tue</text>
              <text x="220" y="190" textAnchor="middle" fill="#64748b">Wed</text>
              <text x="300" y="190" textAnchor="middle" fill="#64748b">Thu</text>
              <text x="380" y="190" textAnchor="middle" fill="#64748b" className="font-bold">Fri (Peak)</text>
              <text x="460" y="190" textAnchor="middle" fill="#64748b">Sat</text>
              <text x="540" y="190" textAnchor="middle" fill="#64748b">Sun</text>

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
            <h3 className="font-display font-bold text-slate-900 text-sm">Analytical Distribution</h3>
            <p className="text-xs text-slate-550">Representation of scanned items inside the verification log.</p>
          </div>

          {totalInList > 0 ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-4">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />

                  {/* Authentic */}
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

                  {/* Suspicious */}
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

                  {/* Deepfake */}
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

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800 font-display leading-none">{totalInList}</span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">scans</span>
                </div>
              </div>

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
                  <span className="inline-block py-0.5 px-2 bg-rose-50 text-rose-750 rounded-md font-bold text-[10px]">
                    {fakePct}%
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">Deepfake</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 text-slate-400 text-xs text-slate-950">
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
              <Layers className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
              <span>Mixed Verification Audit Log</span>
            </h3>
            
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search link URL or file asset name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 pl-9 pr-3.5 py-1.5 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Filtering Layout */}
          <div className="flex flex-wrap items-center gap-3 text-slate-950">
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150 font-mono">
              <Filter className="h-3.5 w-3.5" />
              <span>Multi-Filters:</span>
            </div>

            {/* Type tab swappers */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['all', 'image', 'video', 'news_link'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-md font-semibold text-[10px] capitalize cursor-pointer transition-all ${
                    typeFilter === type
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type === 'news_link' ? 'Scraped Links' : type}
                </button>
              ))}
            </div>

            {/* Platform tab swappers */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-slate-100 border border-transparent rounded-lg font-semibold text-[10px] py-1.5 px-3 text-slate-700 hover:bg-slate-150 focus:outline-none transition-all cursor-pointer font-mono"
            >
              <option value="all">🌐 All Platforms</option>
              <option value="Facebook">👥 Facebook</option>
              <option value="YouTube">📺 YouTube</option>
              <option value="TikTok">🎵 TikTok</option>
              <option value="Instagram">📸 Instagram</option>
              <option value="X">🐦 X / Twitter</option>
              <option value="Reddit">🤖 Reddit</option>
              <option value="Other">🌐 Other Web</option>
              <option value="Direct Upload">📁 Direct Files</option>
            </select>

            {/* Status tab swappers */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['all', 'likely_authentic', 'suspicious', 'likely_deepfake'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-md font-semibold text-[10px] uppercase tracking-wide cursor-pointer transition-all ${
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

        {/* Responsive Table implementation */}
        <div className="overflow-x-auto">
          {filteredHistory.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse text-slate-950">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-100">
                  <th className="px-5 py-3 font-semibold">File / Target Link</th>
                  <th className="px-5 py-3 font-semibold">Source Platform</th>
                  <th className="px-5 py-3 font-semibold">Verification Date</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold text-center">Score</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => {
                  const isAuth = item.status === 'likely_authentic' && !item.unavailable;
                  const isSusp = item.status === 'suspicious' && !item.unavailable;
                  const platConfig = getPlatformConfig(item.targetName, item.platform);
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                      {/* Name / Link with Icon */}
                      <td className="px-5 py-3.5 max-w-[240px]">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            item.type === 'image' 
                              ? 'bg-blue-50 text-blue-600' 
                              : item.type === 'video' 
                              ? 'bg-purple-50 text-purple-600' 
                              : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {item.type === 'image' && <Image className="h-4 w-4" />}
                            {item.type === 'video' && <PlayCircle className="h-4 w-4" />}
                            {item.type === 'news_link' && <ExternalLink className="h-4 w-4" />}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold block text-slate-900 truncate font-mono text-[11px]" title={item.targetName}>
                              {item.targetName}
                            </span>
                            {item.unavailable && (
                              <span className="text-[9px] text-rose-500 font-mono block uppercase font-bold">
                                🚫 Link Unavailable Status
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Source Platform Badge */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md border ${platConfig.badge}`}>
                          {platConfig.name}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* Type Label */}
                      <td className="px-5 py-3.5">
                        <span className="capitalize font-mono text-[10px] text-slate-500 border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md">
                          {item.type.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Risk Percentage Gauge */}
                      <td className="px-5 py-3.5 text-center">
                        {item.unavailable ? (
                          <span className="text-slate-400 font-mono">-</span>
                        ) : (
                          <span className={`font-mono font-bold text-sm ${
                            isAuth ? 'text-emerald-600' : isSusp ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {item.riskScore}%
                          </span>
                        )}
                      </td>

                      {/* Status Check badge */}
                      <td className="px-5 py-3.5 text-center">
                        {item.unavailable ? (
                          <span className="inline-block py-0.5 px-2 bg-slate-100 text-slate-500 border border-slate-200 rounded font-mono text-[9px] uppercase font-bold">
                            Inaccessible
                          </span>
                        ) : (
                          <span className={`inline-block py-0.5 px-2 rounded-full font-bold text-[9px] uppercase border tracking-wider font-mono ${
                            isAuth 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                              : isSusp 
                              ? 'bg-amber-50 text-amber-700 border-amber-150' 
                              : 'bg-rose-50 text-rose-700 border-rose-150'
                          }`}>
                            {item.status.replace('likely_', '')}
                          </span>
                        )}
                      </td>

                      {/* Audit Review Options */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => onViewReport(item)}
                          title="Generate report review card"
                          className="p-1 px-2 border border-slate-250 hover:border-blue-400 text-slate-600 hover:text-blue-700 hover:bg-blue-50/20 rounded-md transition-all cursor-pointer inline-flex items-center text-[10px] font-semibold space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View Report</span>
                        </button>
                        <button
                          onClick={() => onDeleteHistoryItem(item.id)}
                          title="Delete check segment"
                          className="p-1 border border-transparent hover:border-rose-200 text-slate-405 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all cursor-pointer inline-flex items-center"
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
            <div className="py-20 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                <Search className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-800">No Target History Matches</h4>
                <p className="text-xs text-slate-405 max-w-sm mx-auto leading-relaxed">
                  There are no logs matching your search, platform select, or type filters. Click the restore button above to reload baseline data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
