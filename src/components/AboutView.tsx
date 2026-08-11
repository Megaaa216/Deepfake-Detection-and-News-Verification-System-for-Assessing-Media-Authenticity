import { ShieldCheck, Info, Share2, Award, Users, BookOpen } from 'lucide-react';

export default function AboutView() {
  const objectives = [
    {
      title: 'Counter Visual Video Synthesis',
      description: 'Arm users with deep technical insight to expose synthesized facial overlays, face-swaps, or cloned voiceovers before synthetic video clips go viral.'
    },
    {
      title: 'ResNeXt50 + LSTM Pipeline',
      description: 'Analyze spatial facial crop keyframes and temporal sequence tensors using ResNeXt50 feature backbones and bidirectional LSTM classifiers.'
    },
    {
      title: 'Cultivate Safer Sharing',
      description: 'Encourage online users to pause, run validation checks on high-risk video clips, and verify critical context prior to hitting share.'
    }
  ];

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      {/* Title block */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
          The TrustLens Mission
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Supporting researchers, analysts, and public digital education with industrial-grade tools for assessing deepfake video authenticity.
        </p>
      </div>

      {/* Main explanation bento card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 text-white relative overflow-hidden shadow-lg space-y-6">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center space-x-3 text-blue-400 font-mono text-xs uppercase tracking-widest">
          <Info className="h-4 w-4" />
          <span>General Purpose Statement</span>
        </div>

        <div className="space-y-4 relative z-10">
          <h3 className="text-lg md:text-xl font-display font-medium text-white max-w-xl leading-snug">
            A standalone technical client designed specifically to test, audit, and trace synthetic video deepfake artifacts.
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            As Generative AI video pipelines can fabricate realistic face-swaps and voice-cloning programs simulate human speeches, verifying video media has evolved past visual intuition.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            TrustLens helps users assess whether video assets are manipulated or synthetic. It serves as an analytical safeguard designed to support video media verification and safer sharing online.
          </p>
        </div>
      </div>

      {/* Core Objectives Header */}
      <div className="space-y-6">
        <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white text-center">Core Pillars of Action</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {objectives.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3 hover:border-blue-150 transition-colors">
              <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 block">Pillar #0{idx + 1}</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform specifications bullet list with icons */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-950 dark:text-white">Who we support</h4>
          <div className="space-y-3.5">
            <div className="flex space-x-3">
              <span className="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg h-fit shrink-0">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <span className="text-xs font-semibold block text-slate-900 dark:text-white">Academic & Digital Literacy Classes</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Provides students an interactive environment to discover visual deepfake traces and temporal sequence anomalies.</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg h-fit shrink-0">
                <Users className="h-4 w-4" />
              </span>
              <div>
                <span className="text-xs font-semibold block text-slate-900 dark:text-white">Media Forensic Analysts</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Accelerates workflow by outputting detailed spatial/temporal reasoning logs and 16 keyframe evidence previews.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-150 dark:border-slate-800 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold block">Model Architecture</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white block">ResNeXt50 + LSTM Neural Pipeline</span>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Combines deep convolutional spatial feature extraction with bidirectional LSTM sequence modeling for video deepfake detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
