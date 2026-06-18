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

n  // Split by content type
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

n        <div className="text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-mono uppercase font-black shrink-0 w-fit">
          ✓ Authoritative Session
        </div>
      </div>

n      {dashboardNotice && (
        <div className="bg-slate-900 text-white border border-slate-800 p-4 rounded-xl flex items-center space-x-3 text-xs font-mono shadow-md animate-fade-in">
          <Info className="h-4 w-4 text-blue-400 shrink-0" />
          <span>{dashboardNotice}</span>
        </div>
      )}

n      {/* 1. Seven Outstanding Summary Metrics Cards */}
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

n          {/* TOTAL ANALYSES */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 font-bold block uppercase leading-tight">Total Scans</span>
            <div>
              <span className="text-2xl font-black font-display text-slate-905">{totalAnalyses}</span>
              <span className="text-[9px] font-mono text-blue-500 block">Audit Logs</span>
            </div>
          </div>

n          {/* TEXT ANALYSES */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 font-bold block uppercase leading-tight">Text Scans</span>
            <div>
              <span className="text-2xl font-black font-display text-slate-905">{textAnalyses}</span>
              <span className="text-[9px] font-mono text-slate-400 block">Fact checks</span>
            </div>
          </div>

n          {/* IMAGE ANALYSES */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 font-bold block uppercase leading-tight">Image Scans</span>
            <div>
              <span className="text-2xl font-black font-display text-slate-905">{imageAnalyses}</span>
              <span className="text-[9px] font-mono text-slate-400 block">Filters</span>
            </div>
          </div>

n          {/* VIDEO ANALYSES */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-blue-600 font-bold block uppercase leading-tight">Video Scans</span>
            <div>
              <span className="text-2xl font-black font-display text-blue-700">{videoAnalyses}</span>
              <span className="text-[9px] font-mono text-blue-500 block">Deepfakes</span>
            </div>
          </div>

n          {/* DEEPFAKE ALERTS */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-rose-500 font-bold block uppercase leading-tight">Deepfakes</span>
            <div>
              <span className="text-2xl font-black font-display text-rose-600">{deepfakeAlerts}</span>
              <span className="text-[9px] font-mono text-rose-500 font-bold block">🚨 High Risk</span>
            </div>
          </div>

n          {/* UNAVAILABLE LINKS */}
          <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1 flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-wider text-amber-550 font-bold block uppercase leading-tight">Unavailable</span>
            <div>
              <span className="text-2xl font-black font-display text-amber-600">{unavailableLinks}</span>
              <span className="text-[9px] font-mono text-slate-400 block">Inaccessible</span>
            </div>
          </div>

n        </div>
      </div>

(continued)