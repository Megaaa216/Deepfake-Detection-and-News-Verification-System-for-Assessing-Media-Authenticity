import { ShieldAlert, Globe, Radio, Cpu, Sparkles, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

interface HomeViewProps {
  onNavigateToVerify: (subTab: 'image' | 'video' | 'news_link') => void;
  onNavigateToTab: (tab: string) => void;
}

export default function HomeView({ onNavigateToVerify, onNavigateToTab }: HomeViewProps) {
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
            <span>AI-Driven Cryptographic & Neural Analysis</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-none text-white">
            Deepfake Detection & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-sky-350">
              News Verification System
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            Assess media authenticity in real-time. Protect your editorial output or research from artificial visual manipulation, synthesized voice injection, and coordinated bad-faith misinformation campaigns.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={() => onNavigateToVerify('news_link')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <Globe className="h-4 w-4 text-blue-300" />
              <span>Validate News Link</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigateToVerify('image')}
              className="bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 font-medium px-6 py-3 rounded-lg border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Upload & Verify Media</span>
            </button>
          </div>
        </div>

        {/* Technical HUD status bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-4 text-slate-400 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Analysis Core</span>
            <span className="text-slate-200 block">VeraNeural v4.2 Stable</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Verification Speed</span>
            <span className="text-slate-200 block">⚡ ~1.8 Seconds per block</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Fact Registry</span>
            <span className="text-slate-200 block">IFCN Hub Synchronized</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Active Auditing</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span>100% Cryptographically Bound</span>
            </span>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Tri-Tier Verification Protocol
          </h2>
          <p className="text-sm text-slate-500">
            Every analysis queries multi-spectral deep fake neural layers, checks source domains, and references accredited journalistic indexes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: News Verification */}
          <div className="bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit">
                <Globe className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">News Verification</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Validates article links against white-listed editorial repositories. Inspects author signatures, domain registration intervals, linguistic neutrality scores, and factual source chains.
              </p>
            </div>
            <button
              onClick={() => onNavigateToVerify('news_link')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer"
            >
              <span>Verify URLs</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Card 2: Deepfake Detection */}
          <div className="bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-50 text-slate-700 p-3 rounded-xl w-fit">
                <Cpu className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">Deepfake Detection</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Processes physical image pixels and audio-video streams. Scrapes files for microscopic visual warp lines, geometric alignment mismatches, irregular blinking frequency, and AI voices.
              </p>
            </div>
            <button
              onClick={() => onNavigateToVerify('image')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer"
            >
              <span>Scan photo/video files</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Card 3: Risk Assessment */}
          <div className="bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-50 text-slate-700 p-3 rounded-xl w-fit">
                <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">Risk Assessment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Applies standard mathematical weights to raw detection counts. Generates clean risk scores, technical warnings, plain-language reports, and sharing advice before content goes viral.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('methods')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer"
            >
              <span>Explore Methods API</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust Quote / Banner */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl text-center lg:text-left">
          <h4 className="text-sm font-semibold text-slate-900">Designed to meet international auditing specifications</h4>
          <p className="text-xs text-slate-500">
            Complies with CAI (Content Authenticity Initiative) standards, utilizing deep cryptographic checks to match authentic camera metadata signatures.
          </p>
        </div>
        <div className="flex items-center space-x-6 shrink-0 text-slate-400 font-mono text-xs">
          <div className="flex items-center space-x-1 text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            <span>Factual Integrity</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600">
            <CheckCircle className="h-4 w-4" />
            <span>Origin Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
