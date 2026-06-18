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
            <span>AI-POWERED DEEPFAKE DETECTION & SOCIAL MEDIA VERIFICATION</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-none text-white">
            Detect Deepfakes. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-sky-350">
              Verify Media Authenticity.
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            TrustLens analyzes public social media content from <strong>Facebook, YouTube, TikTok, Instagram, X, Reddit</strong>, and more. Detect deepfake videos, AI-generated images, and suspicious news using advanced AI credibility assessment.
          </p>

          <p className="text-xs text-blue-400 font-mono tracking-wider">
            DEEPFAKE FOCUS • MULTI-PLATFORM SUPPORT • AI RISK ANALYSIS
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={() => onNavigateToTab('verify')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <Globe className="h-4 w-4 text-blue-300" />
              <span>Verify Social Media Link</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigateToTab('methods')}
              className="bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 font-medium px-6 py-3 rounded-lg border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>View Verification Methods</span>
            </button>
          </div>
        </div>

        {/* Technical HUD status bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-4 text-slate-400 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Analysis Core</span>
            <span className="text-slate-200 block">TrustLens Deep Engine v4.2 Stable</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Scraper Module</span>
            <span className="text-slate-200 block">⚡ Public Extractor Multi-SDK</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Main Focus Area</span>
            <span className="text-blue-400 block">Video & Deepfake Synthesis</span>
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
            Every analysis queries multi-spectral deepfake neural layers, parses public social media text for fake news indicators, and references accredited journalistic indexes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Main Deepfake Detection focus */}
          <div className="bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between ring-1 ring-blue-550/20">
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit relative">
                <Cpu className="h-6 w-6 stroke-[1.5]" />
                <span className="absolute -top-1 -right-1 bg-blue-650 text-white text-[8px] font-mono font-bold px-1 rounded-full uppercase">Main</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900 flex items-center space-x-2">
                <span>Video & Deepfake</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Processes physical image pixels and audio-video streams from TikTok, YouTube, and more. Scrapes files for microscopic visual warp lines, geometric alignment, and AI vocal clones.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('verify')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer"
            >
              <span>Scan video assets</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Card 2: News & Text Verification */}
          <div className="bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-50 text-slate-700 p-3 rounded-xl w-fit">
                <Globe className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">Text & Claims credibility</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Extracts captions or linked articles from X, Reddit, and Facebook. Analyzes text against whitelisted editorial indexes, assessing clickbait risk and linguistic neutrality scores.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('verify')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer"
            >
              <span>Validate textual claims</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Card 3: Graphic / Image analysis */}
          <div className="bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-50 text-slate-700 p-3 rounded-xl w-fit">
                <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">Image manipulation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Evaluates shared image posts on Instagram and Facebook. Scans for structural boundaries anomalies, sensor noise variance, shadow light inconsistencies and metadata edits.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('verify')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer"
            >
              <span>Deconstruct images</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust Quote / Banner */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl text-center lg:text-left">
          <h4 className="text-sm font-semibold text-slate-900">Designed to meet international media auditing specifications</h4>
          <p className="text-xs text-slate-500">
            Works exclusively on public social platform URLs. Complies with CAI (Content Authenticity Initiative) standards to safeguard public narrative integrity.
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
