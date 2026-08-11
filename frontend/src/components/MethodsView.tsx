import React from 'react';
import { 
  Globe, Cpu, FileCheck, Shield, ChevronRight, HelpCircle, 
  ArrowRight, Search, FileText, Video, ShieldAlert,
  MessageSquare, Anchor, Database, Layers, CheckCircle
} from 'lucide-react';

export default function MethodsView() {
  const steps = [
    { num: '01', title: 'User Pastes Video Link', desc: 'Securely inputs public YouTube or Facebook video URL into scanner.' },
    { num: '02', title: 'Link Validation', desc: 'System confirms syntax and verifies connection status.' },
    { num: '03', title: 'Platform ID', desc: 'Detects platform profiles (YouTube, Facebook).' },
    { num: '04', title: 'Keyframe Extraction', desc: 'Extracts 128 keyframes and crops human facial target bounding boxes.' },
    { num: '05', title: 'AI Model Analysis', desc: 'Parallel execution of ResNeXt50 spatial feature backbone and LSTM temporal neural classifiers.' },
    { num: '06', title: 'Risk Score Calculation', desc: 'Applies calibrated trimmed-mean aggregation to compute final deepfake risk score.' },
    { num: '07', title: 'Save to Case History', desc: 'Logs outcomes securely to analyst verification history.' },
  ];

  const modules = [
    {
      id: 'mod-vid-spatial',
      title: '🎥 Spatial Facial Mesh Module',
      subtitle: 'RESNEXT50 DEEPFAKE SPATIAL FEATURE CLASSIFICATION',
      isFeatured: true,
      description: 'Scans spatial keyframes to identify artificial face-swaps, facial landmark distortions, specular light vector inconsistencies, and boundary pixel jitter.',
      bulletTitle: 'Spatial Algorithmic Layers:',
      bullets: [
        { label: 'Facial Crop Bounding Box Inspection', text: 'Scans face-mesh keypoints across frame sequences to track digital mask boundaries, pixel interpolation drift, and edge blending halos.' },
        { label: 'Specular Reflection & Shadow Vectors', text: 'Analyzes pupil light reflection coherence and facial landmark lighting alignment to detect synthetic overlays.' },
        { label: 'High-Pass Noise & Artifact Filtering', text: 'Evaluates sensor noise floors and JPEG compression discrepancies across facial crop patches.' }
      ]
    },
    {
      id: 'mod-vid-temporal',
      title: '⚡ Temporal Sequence & Acoustic Module',
      subtitle: 'BIDIRECTIONAL LSTM TEMPORAL COHERENCE & AUDIO LIP-SYNC',
      isFeatured: false,
      description: 'Tracks frame-to-frame transitional continuity and acoustic waveform synchronization across extracted video keyframe sequences.',
      bulletTitle: 'Temporal Algorithmic Layers:',
      bullets: [
        { label: 'Bidirectional LSTM Sequence Modeling', text: 'Identifies micro-flickering anomalies, unnatural blinking frequencies, and inter-frame facial movement jumps.' },
        { label: 'Phoneme-Viseme Audio Alignment', text: 'Inspects raw speech WAV frequencies for synthetic formant artifacts, cloning resonance signatures, and lip synchronization delays.' },
        { label: 'Trimmed-Mean Score Aggregation', text: 'Filters outlier frame noise to yield a highly calibrated deepfake certainty percentage.' }
      ]
    }
  ];

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto" id="methods-workflow">
      {/* Title block */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-900/40 border border-blue-800/80 p-2 py-1 rounded text-xs text-blue-300 font-mono">
          <Anchor className="h-3.5 w-3.5" />
          <span>TrustLens Deepfake Video Verification Protocol</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
          Forensic Processing & AI Pipeline
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Learn how the TrustLens AI system ingests public video URLs, extracts keyframe sequence tensors and face crops, and subjects them to ResNeXt50 spatial and LSTM temporal neural classifiers.
        </p>
      </div>

      {/* Visual Flow diagram section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-widest text-blue-400 font-bold">
            ⚡ Video Extraction & Synthesis Flow
          </h3>
          <span className="text-[10px] font-mono text-slate-400">RESNEXT50 + LSTM PROTOCOL</span>
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
          ℹ️ <strong>System Scope Restriction:</strong> The extraction script processes **public YouTube and Facebook video URLs only**. The system identifies synthetic facial manipulation and temporal anomaly indicators to generate evidence-based risk reports.
        </p>
      </div>

      {/* Content Analysis Overview (Two AI Modules) */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            Video Detection Modules Overview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The TrustLens Deep Engine incorporates two dedicated neural sub-modules for spatial facial crop evaluation and temporal sequence coherence tracking.
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
                  : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-950 dark:text-slate-100'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-800/20">
                  <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded uppercase ${
                    mod.isFeatured ? 'bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {mod.subtitle}
                  </span>
                  {mod.isFeatured && (
                    <span className="bg-emerald-500 text-slate-950 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded">
                      Spatial Backbone
                    </span>
                  )}
                </div>

                <div className="md:grid md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 space-y-3">
                    <h4 className="text-lg md:text-xl font-display font-bold">
                      {mod.title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${mod.isFeatured ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
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
                          <p className={`text-[11px] pl-3 leading-relaxed ${mod.isFeatured ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
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
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-950 dark:text-slate-100">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Video Model Calibration</span>
          </div>
          <h4 className="text-base font-display font-semibold text-slate-900 dark:text-white">Adaptive Deepfake Model Engine</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            As neural generators and face-swap software evolve, model weights are calibrated against updated deepfake video benchmarks to ensure robust classification with minimized risk of false findings.
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
