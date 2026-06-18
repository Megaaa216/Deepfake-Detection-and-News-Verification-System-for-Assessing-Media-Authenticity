import { ShieldAlert, Globe, Radio, Cpu, Sparkles, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

ninterface HomeViewProps {
  onNavigateToVerify: (subTab: 'image' | 'video' | 'news_link') => void;
  onNavigateToTab: (tab: string) => void;
}

nexport default function HomeView({ onNavigateToVerify, onNavigateToTab }: HomeViewProps) {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-2xl border border-slate-800 p-8 md:p-12 text-white overflow-hidden shadow-xl">
        {/* Glow backdrop decorative */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-900/40 text-blue-300 font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-blue-800/60">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>AI-Based Social Media Content Verification System</span>
          </div>
n
(continued)