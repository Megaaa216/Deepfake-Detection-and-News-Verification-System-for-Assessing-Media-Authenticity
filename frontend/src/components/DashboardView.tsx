import React, { useState } from 'react';
import { 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, 
  Trash2, Filter, Eye, RefreshCw, Layers, Calendar, ExternalLink,
  Globe, PlayCircle, Image, FileText, CheckCircle
} from 'lucide-react';
import { VerificationResult, Stats } from '../types';

ninterface DashboardViewProps {
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

n    return matchesSearch && matchesType && matchesStatus && matchesPlatform;
  });

  // Calculate dynamic ratios for SVG donut chart based on current historical listing
  const totalInList = historyList.length;
  const authenticCountInList = historyList.filter(h => h.status === 'likely_authentic').length;
  const suspiciousCountInList = historyList.filter(h => h.status === 'suspicious').length;
  const deepfakeCountInList = historyList.filter(h => h.status === 'likely_deepfake').length;

n  const authPct = totalInList ? Math.round((authenticCountInList / totalInList) * 100) : 0;
  const suspPct = totalInList ? Math.round((suspiciousCountInList / totalInList) * 100) : 0;
  const fakePct = totalInList ? Math.round((deepfakeCountInList / totalInList) * 100) : 0;

n  const perimeter = 251.2;
  const authDash = (authPct / 100) * perimeter;
  const suspDash = (suspPct / 100) * perimeter;
  const fakeDash = (fakePct / 100) * perimeter;

n  // Retrieve platform specifications
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

n  return (
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

(continued)