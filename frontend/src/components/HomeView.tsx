import { ShieldAlert, Globe, Radio, Cpu, Sparkles, AlertTriangle, ArrowRight, CheckCircle, Video, Eye, Activity } from 'lucide-react';

interface HomeViewProps {
  onNavigateToVerify: (subTab: 'video' | 'news_link') => void;
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
            <span>AI-POWERED DEEPFAKE VIDEO DETECTION SYSTEM</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-none text-white">
            Detect Video Deepfakes <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-sky-350">
              with ResNeXt50 + LSTM Pipeline.
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            TrustLens analyzes public video content from YouTube and Facebook, evaluates spatial facial landmark integrity and temporal sequence coherence, and returns an instant deepfake risk score.
          </p>

          <p className="text-xs text-blue-400 font-mono tracking-wider">
            PUBLIC VIDEO CONTENT VERIFICATION • RESNEXT50+LSTM MODEL • DEEPFAKE RISK SCORING
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={() => onNavigateToTab('verify')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <Video className="h-4 w-4 text-blue-300" />
              <span>Verify Video Link</span>
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
            <span className="text-slate-200 block">ResNeXt50 + Bidirectional LSTM</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Supported Platforms</span>
            <span className="text-slate-200 block">⚡ YouTube & Facebook Videos</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Scope of Capability</span>
            <span className="text-blue-400 block">Deepfake Video Assets Only</span>
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
            Deepfake Video Detection Protocol
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every video evaluation queries spatial ResNeXt50 neural feature maps and temporal LSTM sequence classifiers to isolate face-swaps and visual manipulation anomalies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: Spatial Face-Swap Analysis */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between ring-1 ring-blue-500/5 dark:ring-blue-400/5">
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 p-3 rounded-xl w-fit relative">
                <Cpu className="h-6 w-6 stroke-[1.5]" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-mono font-bold px-1 rounded-full uppercase">Spatial</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Spatial Face & Mesh Analysis</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Evaluates facial crop geometry, spatial landmark boundary jitter, specular light vectors, and localized face-swap compression artifacts across video keyframes.
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

          {/* Card 2: Temporal Sequence & Acoustic Synchrony */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 p-3 rounded-xl w-fit">
                <Activity className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Temporal Sequence & Acoustic Sync</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Tracks frame-to-frame transitional stability using bidirectional LSTM cells and inspects phoneme-viseme lip-sync audio alignment across sequence keyframes.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigateToVerify('video');
                onNavigateToTab('verify');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-750 dark:hover:text-blue-300 flex items-center space-x-1.5 pt-4 group transition-colors cursor-pointer text-left"
            >
              <span>Inspect video keyframes</span>
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
            <span>Video Verification Workflow</span>
          </h3>
          <div className="space-y-4 font-mono">
            {[
              { step: '1', title: 'Submit Video Link', desc: 'Paste a public YouTube or Facebook video URL into the analysis workspace.' },
              { step: '2', title: 'Extract Keyframe Sequences', desc: 'The system extracts 128 keyframes and isolates cropped facial target bounding boxes.' },
              { step: '3', title: 'ResNeXt50 + LSTM Inference', desc: 'Spatial feature backbones and bidirectional LSTM layers compute frame anomaly probabilities.' },
              { step: '4', title: 'Generate Risk Report', desc: 'Produces overall deepfake risk score, model confidence metrics, and top 16 suspicious keyframes.' },
              { step: '5', title: 'Record Case File', desc: 'The verified case is logged locally into your secure session history file for reference.' }
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
                title: 'Protect Users from Deepfake Videos',
                desc: 'Safeguard viewers against synthetic face-swap overlays, deepfake impersonations, and manipulated video clips by pinpointing neural anomaly signals.'
              },
              {
                title: 'Support Deepfake Detection Research',
                desc: 'Act as a research terminal exploring ResNeXt50 + LSTM hybrid model metrics on public social video streams.'
              },
              {
                title: 'Mitigate Synthetic Video Disinformation',
                desc: 'Help analysts, researchers, and readers screen suspicious public video posts before sharing or publishing.'
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
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Designed for social media video screening</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Works exclusively on public YouTube and Facebook video URLs. Provides evidence-based neural model indicators to evaluate video authenticity.
          </p>
        </div>
        <div className="flex items-center space-x-6 shrink-0 text-slate-400 font-mono text-xs">
          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Face Mesh Verified</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
            <CheckCircle className="h-4 w-4" />
            <span>Temporal Coherence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
