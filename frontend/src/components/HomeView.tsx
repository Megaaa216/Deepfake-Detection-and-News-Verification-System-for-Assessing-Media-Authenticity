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
            Detect Deepfakes, AI Images, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-sky-350">
              and Suspicious News.
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            TrustLens analyzes public content from social media platforms, checks for manipulation signals, and returns a risk-based credibility assessment. The system evaluates video deepfake consistency, image manipulation and AI generation traces, and news text credibility.
          </p>

          <p className="text-xs text-blue-400 font-mono tracking-wider">
            PUBLIC CONTENT VERIFICATION • VIDEO, IMAGE, AND NEWS ANALYSIS • RISK-BASED CREDIBILITY SCORING
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
            <span className="text-slate-500 text-[10px] uppercase block">Analysis Protocol</span>
            <span className="text-slate-200 block">TrustLens Verification Core v4.2</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Data Source</span>
            <span className="text-slate-200 block">⚡ Public Social Platforms</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Scope of Capability</span>
            <span className="text-blue-400 block">Videos, Images, & News Text</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Assessment Confidence</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span>Evidence-Based Probability</span>
            </span>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Tri-Tier Verification Protocol
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every analysis queries multi-spectral neural classifiers, parses public social media text for suspicious language indicators, and references accredited journalistic indexes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Video Analysis focus */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between ring-1 ring-blue-500/5 dark:ring-blue-400/5">
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 p-3 rounded-xl w-fit relative">
                <Cpu className="h-6 w-6 stroke-[1.5]" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-mono font-bold px-1 rounded-full uppercase">Main</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Video Analysis</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Checks for face and audio inconsistencies. Analyzes lip-sync alignment frequencies, facial mesh landmark boundaries, and vocal acoustic clones across TikTok, YouTube, and other public video formats.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigateToVerify('video');
                onNavigateToTab('verify');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-750 dark:hover:text-blue-300 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer text-left"
            >
              <span>Scan video assets</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Card 2: News & Text Verification */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 p-3 rounded-xl w-fit">
                <Globe className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">News & Text Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Evaluates source reliability, news credibility, and suspicious language signals. Scans social media headlines, captions, and links for sensationalism, emotional bias, and factual alignment.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigateToVerify('news_link');
                onNavigateToTab('verify');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-750 dark:hover:text-blue-300 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer text-left"
            >
              <span>Validate textual claims</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Card 3: Graphic / Image analysis */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 p-3 rounded-xl w-fit">
                <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Image Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Detects manual editing traces, composite pixel anomalies, and AI generation signals. Scans specular light vectors, JPEG quantization discrepancies, and sensor noise variations.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigateToVerify('image');
                onNavigateToTab('verify');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-750 dark:hover:text-blue-300 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer text-left"
            >
              <span>Deconstruct images</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Workflow & Purpose Grid Section */}
      <div className="grid lg:grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-slate-850">
        {/* Verification Workflow */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span className="text-blue-600 dark:text-blue-400">01 /</span>
            <span>Verification Workflow</span>
          </h3>
          <div className="space-y-4 font-mono">
            {[
              { step: '1', title: 'Submit Evidence', desc: 'Paste a public social media link or mount local image/video files into the workspace.' },
              { step: '2', title: 'Extract Target Layers', desc: 'The system parses public endpoints to extract available text metadata, image keyframes, or audio waves.' },
              { step: '3', title: 'Multi-Spectral Analysis', desc: 'Target media layers are scanned for specialized manipulation traces, AI generation indicators, or credibility flags.' },
              { step: '4', title: 'Generate Risk Report', desc: 'Produces confidence scoring metrics and a detailed reasoning log of all mapped manipulation signals.' },
              { step: '5', title: 'Record Case File', desc: 'The verified case is logged locally into your secure session history file for future comparison.' }
            ].map((w, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs">
                <span className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                  {w.step}
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{w.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-sans leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Purpose */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span className="text-blue-600 dark:text-blue-400">02 /</span>
            <span>Project Objectives & Purpose</span>
          </h3>
          <div className="grid gap-4">
            {[
              {
                title: 'Protect Users from Manipulated Media',
                desc: 'Safeguard users against sophisticated deepfakes and AI-generated social assets by pinpointing specific manipulation signals.'
              },
              {
                title: 'Support Content Verification Research',
                desc: 'Act as an open experimental benchmark and research terminal exploring multi-modal validation metrics on public media.'
              },
              {
                title: 'Mitigate the Spread of Misinformation',
                desc: 'Help journalists and readers screen alarming public posts, unverified headlines, and modified graphics before sharing.'
              }
            ].map((p, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-4 rounded-xl space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span>{p.title}</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans pl-3.5">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Quote / Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl text-center lg:text-left">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Designed for social media media risk screening</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Works exclusively on public social platform URLs. Provides evidence-based indicators to safeguard public narrative integrity without assuring perfect absolute truth.
          </p>
        </div>
        <div className="flex items-center space-x-6 shrink-0 text-slate-400 font-mono text-xs">
          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Factual Integrity</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
            <CheckCircle className="h-4 w-4" />
            <span>Origin Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
