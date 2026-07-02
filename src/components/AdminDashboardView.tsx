import React, { useState } from 'react';
import { 
  Users, BarChart3, Database, ShieldAlert, CheckCircle2, AlertTriangle, 
  Trash2, UserCheck, Shield, Eye, Download, Info, Layers, Search, 
  Ban, TrendingUp, PieChart, ExternalLink, HelpCircle, RefreshCw
} from 'lucide-react';
import { VerificationResult } from '../types';

interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: 'admin' | 'analyst';
  registrationDate: string;
  status: 'Active' | 'Disabled';
}

interface AdminDashboardViewProps {
  historyList: VerificationResult[];
  onViewResult: (id: string) => void;
  onExportReport: (item: VerificationResult) => void;
}

export default function AdminDashboardView({ historyList, onViewResult, onExportReport }: AdminDashboardViewProps) {
  // Mock users list
  const [users, setUsers] = useState<UserAccount[]>([
    { id: 'usr-001', fullName: 'Dr. Alan Brent', username: 'abrent_forensics', email: 'a.brent@cyber-forensics.verify', role: 'admin', registrationDate: '2026-01-20', status: 'Active' },
    { id: 'usr-002', fullName: 'Prof. Carolyn Vance', username: 'vance_metrics', email: 'c.vance@central-news.verify', role: 'analyst', registrationDate: '2026-02-14', status: 'Active' },
    { id: 'usr-003', fullName: 'Marcus Thorne', username: 'thorne_deepintel', email: 'm.thorne@cyber-forensics.verify', role: 'analyst', registrationDate: '2026-03-01', status: 'Active' },
    { id: 'usr-004', fullName: 'Sarah Jenkins', username: 's_jenkins', email: 's.jenkins@journalism-safety.net', role: 'analyst', registrationDate: '2026-04-11', status: 'Disabled' },
    { id: 'usr-055', fullName: 'Dr. Kenji Sato', username: 'sato_verification', email: 'k.sato@global-telemetry.verify', role: 'analyst', registrationDate: '2026-05-18', status: 'Active' }
  ]);

  const [usernameSearch, setUsernameSearch] = useState('');
  const [dashboardNotice, setDashboardNotice] = useState<string | null>(null);
  const [inspectUser, setInspectUser] = useState<UserAccount | null>(null);

  // ------------------ Calculate outstanding requested metrics ------------------
  const totalUsersCount = users.length;
  const totalAnalyses = historyList.length;

  // Split by content type
  const textAnalyses = historyList.filter(h => h.type === 'news_link').length;
  const imageAnalyses = historyList.filter(h => h.type === 'image').length;
  const videoAnalyses = historyList.filter(h => h.type === 'video').length;

  // Split by result alerts and availability
  const deepfakeAlerts = historyList.filter(h => h.status === 'likely_deepfake' && !h.unavailable).length;
  const unavailableLinks = historyList.filter(h => h.unavailable).length;

  // Platform counters
  const fbCount = historyList.filter(h => (h.platform || '').toLowerCase() === 'facebook' || h.targetName.includes('facebook')).length;
  const ytCount = historyList.filter(h => (h.platform || '').toLowerCase() === 'youtube' || h.targetName.includes('youtube')).length;
  const tokCount = historyList.filter(h => (h.platform || '').toLowerCase() === 'tiktok' || h.targetName.includes('tiktok')).length;
  const igCount = historyList.filter(h => (h.platform || '').toLowerCase() === 'instagram' || h.targetName.includes('instagram')).length;
  const xCount = historyList.filter(h => (h.platform || '').toLowerCase() === 'x' || h.targetName.includes('x.com') || h.targetName.includes('twitter')).length;
  const redditCount = historyList.filter(h => (h.platform || '').toLowerCase() === 'reddit' || h.targetName.includes('reddit')).length;
  const otherCount = totalAnalyses - (fbCount + ytCount + tokCount + igCount + xCount + redditCount);

  // Result counters
  const authenticCount = historyList.filter(h => h.status === 'likely_authentic' && !h.unavailable).length;
  const suspiciousCount = historyList.filter(h => h.status === 'suspicious' && !h.unavailable).length;

  const triggerNotice = (msg: string) => {
    setDashboardNotice(msg);
    setTimeout(() => setDashboardNotice(null), 3000);
  };

  const handleEditRole = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'admin' ? 'analyst' : 'admin';
        triggerNotice(`User "${u.fullName}" authorization updated to ${newRole.toUpperCase()}.`);
        return { ...u, role: newRole as 'admin' | 'analyst' };
      }
      return u;
    }));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        triggerNotice(`Status modified: "${u.fullName}" marked ${newStatus}.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (confirm(`Purge profile "${target?.fullName}" from cyber-admin directory?`)) {
      setUsers(users.filter(u => u.id !== userId));
      triggerNotice(`User "${target?.fullName}" permanently erased.`);
    }
  };

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto text-left text-slate-805" id="admin-dashboard">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5 animate-fade-in">
          <div className="inline-flex items-center space-x-1.5 bg-blue-950 border border-blue-900 px-3 py-1 text-[10px] text-blue-400 font-mono rounded">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PORTAL: SECURITY WATCHDOG ONLINE</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            System Admin Security Console
          </h2>
          <p className="text-sm text-slate-500">
            Secure node control panel: administer verify operators, track multi-platform deepfake ratios, and inspect raw index feeds.
          </p>
        </div>

        <div className="text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-mono uppercase font-black shrink-0 w-fit">
          ✓ Authoritative Session
        </div>
      </div>

      {dashboardNotice && (
        <div className="bg-slate-900 text-white border border-slate-800 p-4 rounded-xl flex items-center space-x-3 text-xs font-mono shadow-md animate-fade-in">
          <Info className="h-4 w-4 text-blue-400 shrink-0" />
          <span>{dashboardNotice}</span>
        </div>
      )}

      {/* 1. Seven Outstanding Summary Metrics Cards */}
      <div className="space-y-3.5">
        <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase block">
          📈 Dynamic System Capacity Indicators
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5 text-slate-950">
          
          {/* USERS */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 font-bold block uppercase leading-tight">Total Users</span>
            <div>
              <span className="text-2xl font-black font-display text-slate-905">{totalUsersCount}</span>
              <span className="text-[9px] font-mono text-emerald-600 block">✓ {users.filter(u => u.status === 'Active').length} Active</span>
            </div>
          </div>

          {/* TOTAL ANALYSES */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 font-bold block uppercase leading-tight">Total Scans</span>
            <div>
              <span className="text-2xl font-black font-display text-slate-905">{totalAnalyses}</span>
              <span className="text-[9px] font-mono text-blue-500 block">Audit Logs</span>
            </div>
          </div>

          {/* TEXT ANALYSES */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 font-bold block uppercase leading-tight">Text Scans</span>
            <div>
              <span className="text-2xl font-black font-display text-slate-905">{textAnalyses}</span>
              <span className="text-[9px] font-mono text-slate-400 block">Fact checks</span>
            </div>
          </div>

          {/* IMAGE ANALYSES */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 font-bold block uppercase leading-tight">Image Scans</span>
            <div>
              <span className="text-2xl font-black font-display text-slate-905">{imageAnalyses}</span>
              <span className="text-[9px] font-mono text-slate-400 block">Filters</span>
            </div>
          </div>

          {/* VIDEO ANALYSES */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-blue-600 font-bold block uppercase leading-tight">Video Scans</span>
            <div>
              <span className="text-2xl font-black font-display text-blue-700">{videoAnalyses}</span>
              <span className="text-[9px] font-mono text-blue-500 block">Deepfakes</span>
            </div>
          </div>

          {/* DEEPFAKE ALERTS */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-rose-500 font-bold block uppercase leading-tight">Deepfakes</span>
            <div>
              <span className="text-2xl font-black font-display text-rose-600">{deepfakeAlerts}</span>
              <span className="text-[9px] font-mono text-rose-500 font-bold block">🚨 High Risk</span>
            </div>
          </div>

          {/* UNAVAILABLE LINKS */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-amber-550 font-bold block uppercase leading-tight">Unavailable</span>
            <div>
              <span className="text-2xl font-black font-display text-amber-600">{unavailableLinks}</span>
              <span className="text-[9px] font-mono text-slate-400 block">Inaccessible</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Four custom SVG analytic distribution charts */}
      <div className="space-y-4">
        <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase block">
          📊 Comprehensive Traffic & Model Distributions
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* PLATFORM DISTRIBUTION */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 font-mono uppercase">Platform Distribution</h4>
              <p className="text-[10px] text-slate-500">Breakdown of sources in log registry.</p>
            </div>
            {/* Horizontal mini bar chart representations */}
            <div className="space-y-2.5 text-[11px] font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>TikTok / YouTube</span>
                  <span className="font-bold">{ytCount + tokCount} runs</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${Math.round(((ytCount + tokCount) / (totalAnalyses || 1)) * 100)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>FB / Instagram</span>
                  <span className="font-bold">{fbCount + igCount} runs</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full" style={{ width: `${Math.round(((fbCount + igCount) / (totalAnalyses || 1)) * 100)}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>X / Reddit</span>
                  <span className="font-bold">{xCount + redditCount} runs</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full" style={{ width: `${Math.round(((xCount + redditCount) / (totalAnalyses || 1)) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT TYPE DISTRIBUTION */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-4 text-slate-950">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 font-mono uppercase">Content Type Distribution</h4>
              <p className="text-[10px] text-slate-500">Distribution of routed assets.</p>
            </div>
            {/* Small simple circle sector representations */}
            <div className="flex items-center space-x-4 py-1.5">
              <svg viewBox="0 0 36 36" className="w-16 h-16 shrink-0 -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" 
                  strokeDasharray={`${Math.round((videoAnalyses / (totalAnalyses || 1)) * 100)} ${100 - Math.round((videoAnalyses / (totalAnalyses || 1)) * 100)}`} 
                  strokeDashoffset="0" 
                />
              </svg>
              <div className="space-y-1.5 text-[10px] font-mono leading-tight">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                  <span>Video: {Math.round((videoAnalyses / (totalAnalyses || 1)) * 100)}%</span>
                </div>
                <div>
                  <span className="inline-block w-2 h-2 bg-slate-300 mr-1.5 rounded-full"></span>
                  <span>Others</span>
                </div>
              </div>
            </div>
          </div>

          {/* RESULT DISTRIBUTION */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 font-mono uppercase">Result Distribution</h4>
              <p className="text-[10px] text-slate-500">Scored threat level metrics.</p>
            </div>
            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-1.5 px-2.5 rounded-lg border border-emerald-150">
                <span className="font-bold">✓ Likely Authentic</span>
                <span>{authenticCount} runs</span>
              </div>
              <div className="flex justify-between items-center bg-amber-50 text-amber-800 p-1.5 px-2.5 rounded-lg border border-amber-150">
                <span className="font-bold">⚠️ Suspicious Warnings</span>
                <span>{suspiciousCount} runs</span>
              </div>
              <div className="flex justify-between items-center bg-rose-50 text-rose-800 p-1.5 px-2.5 rounded-lg border border-rose-150">
                <span className="font-bold">🚨 Deepfake / Falsehood</span>
                <span>{deepfakeAlerts} runs</span>
              </div>
            </div>
          </div>

          {/* RISK TRENDS */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 font-mono uppercase">Deepfake Severity Index</h4>
              <p className="text-[10px] text-slate-500">Historical daily warning risk average.</p>
            </div>
            
            <svg viewBox="0 0 100 35" className="w-full h-11 text-blue-600">
              <path 
                d="M 5,28 L 22,23 L 40,30 L 58,15 L 75,10 L 95,4" 
                fill="none" 
                stroke="#3563eb" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
              />
              <path 
                d="M 5,35 L 5,28 L 22,23 L 40,30 L 58,15 L 75,10 L 95,4 L 95,35 Z" 
                fill="#3563eb" 
                opacity="0.08" 
              />
              <circle cx="95" cy="4" r="2" fill="#3563eb" />
            </svg>
            <div className="flex justify-between text-[8px] font-mono text-slate-400">
              <span>Wk 1</span>
              <span>Wk 2</span>
              <span>Wk 3</span>
              <span>Wk 4 (Trend Peak)</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. User Directory list */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-slate-905 text-sm flex items-center space-x-2">
              <Users className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
              <span>Analyst Directory Management</span>
            </h3>
            <span className="text-xs text-slate-450 block">Modify authorization roles, enable/prevent logins, or delete profile references.</span>
          </div>

          <div className="relative w-full md:w-64 text-slate-950">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-405">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search investigator email..."
              value={usernameSearch}
              onChange={(e) => setUsernameSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 pl-9 pr-3 py-1.5 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-slate-950">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">User Reference ID</th>
                <th className="px-5 py-3 font-semibold">Investigator</th>
                <th className="px-5 py-3 font-semibold">Secure Email</th>
                <th className="px-5 py-3 font-semibold">Role Clearance</th>
                <th className="px-5 py-3 font-semibold">Registered</th>
                <th className="px-5 py-3 font-semibold text-center">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.filter(u => u.fullName.toLowerCase().includes(usernameSearch.toLowerCase()) || u.email.toLowerCase().includes(usernameSearch.toLowerCase())).map((u) => {
                const isActive = u.status === 'Active';
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-all">
                    <td className="px-5 py-3 font-mono text-[10px] text-slate-400 font-bold">{u.id}</td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-slate-900 block">{u.fullName}</span>
                      <span className="text-[10px] text-blue-600 block">@{u.username}</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border border-slate-200 bg-slate-100 text-slate-650">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-400 text-[10px]">{u.registrationDate}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-405 border-slate-200'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right space-x-1 whitespace-nowrap">
                      <button onClick={() => setInspectUser(u)} className="p-1 px-2 border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 hover:bg-blue-50/10 rounded transition-all cursor-pointer">
                        Inspect
                      </button>
                      <button onClick={() => handleToggleStatus(u.id)} className="p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 rounded cursor-pointer">
                        {isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 text-white text-left space-y-4">
            <h4 className="font-mono text-xs text-blue-400 uppercase tracking-widest font-black">Investigator Security Identity</h4>
            <div className="space-y-2 text-xs font-mono">
              <p><strong className="text-slate-400">User:</strong> {inspectUser.fullName}</p>
              <p><strong className="text-slate-400">Email:</strong> {inspectUser.email}</p>
              <p><strong className="text-slate-400">Clearance:</strong> {inspectUser.role.toUpperCase()}</p>
              <p><strong className="text-slate-400">UID:</strong> {inspectUser.id}</p>
            </div>
            <button onClick={() => setInspectUser(null)} className="w-full bg-slate-800 hover:bg-slate-700 font-bold py-2 rounded text-xs">
              Dismiss Record
            </button>
          </div>
        </div>
      )}

      {/* 3. Authoritative Pipeline Watchtower table */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-display font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Layers className="h-4.5 w-4.5 text-blue-600" />
            <span>Analytical Pipeline Watchtower Logs</span>
          </h3>
          <p className="text-xs text-slate-500">Live feed monitoring of active forensic sweeps in verification terminals.</p>
        </div>

        <div className="overflow-x-auto text-slate-950">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-450 font-mono text-[9px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">Pipeline ID</th>
                <th className="px-5 py-3 font-semibold">Social Platform</th>
                <th className="px-5 py-3 font-semibold">Content Type</th>
                <th className="px-5 py-3- font-semibold">Prediction Result</th>
                <th className="px-5 py-3 font-semibold text-center">Confidence</th>
                <th className="px-5 py-3 font-semibold text-center">Risk Level</th>
                <th className="px-5 py-3 font-semibold text-right">Option</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyList.map((item, index) => {
                const isAuth = item.status === 'likely_authentic' && !item.unavailable;
                const isSusp = item.status === 'suspicious' && !item.unavailable;
                const platformLabel = item.platform || 'Direct Upl';
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Pipeline ID */}
                    <td className="px-5 py-3 font-mono font-bold text-slate-450 text-[10px]">{item.id}</td>
                    
                    {/* Platform */}
                    <td className="px-5 py-3">
                      <span className="font-bold text-slate-800 font-mono text-[10px] uppercase">
                        {platformLabel}
                      </span>
                    </td>

                    {/* Content Type */}
                    <td className="px-5 py-3 capitalize font-mono text-[10px] text-slate-500">
                      {item.type.replace('_', ' ')}
                    </td>

                    {/* Result */}
                    <td className="px-5 py-3">
                      {item.unavailable ? (
                        <span className="font-semibold text-slate-400 font-mono text-[10px]">INACCESSIBLE</span>
                      ) : (
                        <span className="font-semibold text-slate-950">
                          {item.status === 'likely_deepfake' ? 'AI Synthesized Deepfake' : item.status === 'suspicious' ? 'Suspicious Manipulation' : 'In-Tact Authenticity'}
                        </span>
                      )}
                    </td>

                    {/* Confidence */}
                    <td className="px-5 py-3 text-center font-mono font-bold text-slate-750">
                      {item.unavailable ? '-' : `${100 - item.riskScore}%`}
                    </td>

                    {/* Risk level badge */}
                    <td className="px-5 py-3 text-center">
                      {item.unavailable ? (
                        <span className="px-2 py-0.5 rounded font-mono text-[8px] bg-slate-100 text-slate-405 font-bold uppercase border">
                          NA
                        </span>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide border font-mono ${
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

                    {/* Action */}
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => onViewResult(item.id)} className="px-2 py-1 text-[10px] font-bold border border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 text-slate-650 rounded transition-all cursor-pointer">
                        Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
