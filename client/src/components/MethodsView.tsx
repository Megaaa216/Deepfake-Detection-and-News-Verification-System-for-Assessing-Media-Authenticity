import React from 'react';
import { 
  Globe, Cpu, FileCheck, Shield, ChevronRight, HelpCircle, 
  ArrowRight, Search, FileText, Image, Video, ShieldAlert,
  MessageSquare, Anchor, Database, Layers, CheckCircle
} from 'lucide-react';

export default function MethodsView() {
  const steps = [
    { num: '01', title: 'User Pastes Link', desc: 'Securely copies public social media URL into scanner.' },
    { num: '02', title: 'Link Validation', desc: 'System confirms syntax and verifies connection status.' },
    { num: '03', title: 'Platform ID', desc: 'Detects platform profiles (Facebook, YouTube, TikTok, X, Reddit, etc.)' },
    { num: '04', title: 'Public Extraction', desc: 'Extracts public captions, image blobs, or clip segments.' },
    { num: '05', title: 'AI Model Analysis', desc: 'Parallel execution of Text, Image, and Deepfake neural classifiers.' },
    { num: '06', title: 'Credibility Score', desc: 'Applies weighted matrix algorithms to compute final Risk.' },
    { num: '07', title: 'Save to History', desc: 'Logs outcomes securely to analyst verification history.' },
  ];

  const modules = [
    {
      id: 'mod-vid',
      title: '🎥 Video Detection Module (Core Focus)',
      subtitle: 'DEEPFAKE VIDEO DETECTION & SPEECH AUDIO CLONING AUDITING',
      isFeatured: true,
      description: 'The absolute core capability of the TrustLens system. Analyzes temporal consistency, movement mechanics, and voice cloning spectra to identify artificial synthesis.',
      bulletTitle: 'Primary Algorithmic Layers:',
      bullets: [
        { label: 'Deepfake Video Detection', text: 'Scans face-mesh keypoints across frame sequences to track digital mask boundaries, pixel interpolation drift, and edge blending halos.' },
        { label: 'Frame-by-Frame Motion Analysis', text: 'Identifies biological lapses like anomalous eye-blinking rates (saccades mismatch) and spatial face-to-neck texture inconsistencies.' },
        { label: 'Acoustic Temporal Consistency', text: 'Inspects raw speech WAV frequencies for synthetic formant artifacts, cloning resonance signatures, and lip synchronization delays.' }
      ]
    },
    {
      id: 'mod-txt',
      title: '🔤 Text Detection Module',
      subtitle: 'FAKE NEWS CLASSIFICATION & SEMANTIC UNDERSTANDING',
      isFeatured: false,
      description: 'Extracts captions, articles, and short-texts to evaluate facts and rhetorical agendas.',
      bulletTitle: 'Key Systems:',
      bullets: [
        { label: 'Fake News Classification', text: 'Cross-checks statements against active global IFCN journalistic databases and fact registries.' },
        { label: 'Semantic Core Matching', text: 'Measures alignment of context claims against primary citation records to identify spin.' },
        { label: 'Emotion & Title Auditing', text: 'Highlights sensational click-catching adjectival density ("SHOCKING", "BANNED") and rhetoric triggers.' }
      ]
    },
    {
      id: 'mod-img',
      title: '🖼️ Image Detection Module',
      subtitle: 'FAI / GAN CLASSIFIERS & CONTOUR FRAUD ANALYSIS',
      isFeatured: false,
      description: 'Inspects shared graphics to highlight localized digital manipulations or neural generation.',
      bulletTitle: 'Key Systems:',
      bullets: [
        { label: 'AI Generative Search', text: 'Flags texture patterns typical in GAN, Stable Diffusion, or Midjourney systems.' },
        { label: 'Boundary Edge Occlusions', text: 'Detects airbrush overlays, Gaussian crop blurs, and localized noise variance.' },
        { label: 'Focal Specular reflections', text: 'Validates reflection pupil angles relative to light-source vectors.' }
      ]
    }
  ];

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto" id="methods-workflow">
      {/* Title block */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-900/40 border border-blue-800/80 p-2 py-1 rounded text-xs text-blue-300 font-mono">
          <Anchor className="h-3.5 w-3.5" />
          <span>TrustLens Verification Protocol Pipeline</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Forensic Processing & AI Pipeline
        </h2>
        <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
          Learn how the TrustLens AI system scrapes raw social media URL handshakes, extracts public multimedia layers (Text, Graphics, Video streams), and subjects them to highly specialized deep neural classifiers.
        </p>
      </div>

      {/* Visual Flow diagram section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-widest text-blue-400 font-bold">
            ⚡ End-to-End Extraction & Synthesis Flow
          </h3>
          <span className="text-[10px] font-mono text-slate-400">UNIFIED SCRAPER PROTOCOL</span>
        </div>

        {/* Scalable Layout: Stepper Line */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
          {steps.map((st, idx) => (
            <div key={st.num} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 relative flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-mono font-bold text-xs">{st.num}</span>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="hidden md:block h-4 w-4 text-slate-700 absolute -right-2 top-1/2 transform -translate-y-1/2 z-10" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white font-mono">{st.title}</h4>
                <p className="text-[10px] text-slate-400 leading-normal">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote disclaimer info */}
        <p className="text-[11px] text-slate-400 italic bg-slate-950 p-3.5 rounded border border-dashed border-slate-800 leading-relaxed font-mono">
          ℹ️ <strong>System Scope Restriction:</strong> The extraction script is legally and technically mapped to process **public social media nodes only** (unrestricted posts, raw video index files, public captions). The system does not promise perfect truth verification; it identifies synthetic digital manipulation and source network risk scorecards.
        </p>
      </div>

      {/* Content Analysis Overview (Three AI Modules) */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h3 className="text-xl font-display font-bold text-slate-900">
            Content Analysis Modules Overview
          </h3>
          <p className="text-xs text-slate-500">
            The TrustLens Deep Engine incorporates three dedicated multi-spectral modules. Because deepfake audio-video synthesis is highly prevalent, the Video Detection Module remains prioritized.
          </p>
        </div>

        {/* Detailed Modules Layout Grid */}
        <div className="space-y-6">
          {modules.map((mod) => (
            <div 
              key={mod.id}
              className={`rounded-2xl border p-6 md:p-8 transition-all flex flex-col justify-between ${
                mod.isFeatured 
                  ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border-blue-900/80 shadow-md text-white' 
                  : 'bg-white border-slate-150 text-slate-950'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-800/20">
                  <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded uppercase ${
                    mod.isFeatured ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {mod.subtitle}
                  </span>
                  {mod.isFeatured && (
                    <span className="bg-emerald-500 text-slate-950 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded">
                      Main Core Focus
                    </span>
                  )}
                </div>

                <div className="md:grid md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 space-y-3">
                    <h4 className="text-lg md:text-xl font-display font-bold">
                      {mod.title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${mod.isFeatured ? 'text-slate-300' : 'text-slate-600'}`}>
                      {mod.description}
                    </p>
                  </div>

                  <div className="md:col-span-7 space-y-3 mt-4 md:mt-0 p-4 rounded-xl font-sans bg-slate-950/20 border border-slate-800/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-500 block font-bold">
                      {mod.bulletTitle}
                    </span>
                    <ul className="space-y-3">
                      {mod.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="space-y-1">
                          <span className="text-xs font-semibold flex items-center space-x-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 block shrink-0"></span>
                            <span>{b.label}</span>
                          </span>
                          <p className={`text-[11px] pl-3 leading-relaxed ${mod.isFeatured ? 'text-slate-400' : 'text-slate-500'}`}>
                            {b.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continuous updates block */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6.5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-950">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center space-x-1 text-blue-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Linguistic & Photo Forensic Update</span>
          </div>
          <h4 className="text-base font-display font-semibold text-slate-900">Adaptive Signatures Engine</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            As neural generators and deepfake software adapt, our model weights are automatically calibrated using updated GAN profiles, ensuring robust classification with minimized risk of false findings.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center justify-center space-y-1 bg-slate-900 p-4 text-white rounded-xl border border-slate-800 w-full md:w-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Model Precision Confidence</span>
          <span className="text-2xl font-black text-blue-400 font-display">99.4%</span>
          <span className="text-[9px] font-mono text-emerald-400">CLASSIFICATION ROBUST STABILITY</span>
        </div>
      </div>
    </div>
  );
}
