import { Search, Globe, Cpu, FileCheck, Shield, ChevronRight, HelpCircle } from 'lucide-react';

export default function MethodsView() {
  const methods = [
    {
      id: 'mn-1',
      title: 'Similar News Search & Cross-Indexing',
      icon: <Search className="h-6 w-6 text-blue-600" />,
      tag: 'CROSS-CHECKING LAYER',
      description: 'The system automatically extracts core claim statements, entity tags, and key milestones, then scans an aggregated global index of high-reputation mainstream agencies.',
      details: [
        'Queries 1500+ international white-listed editorial repositories in parallel.',
        'Uses Semantic similarity searches to match differing phrasing of the same claim.',
        'Identifies absolute temporal latency - tracking who reported the rumor first.',
        'Flags claims directly disputed or verified by active IFCN fact-check nodes.'
      ]
    },
    {
      id: 'mn-2',
      title: 'Source Credibility & Network Audits',
      icon: <Globe className="h-6 w-6 text-sky-600" />,
      tag: 'DOMAIN METADATA LAYER',
      description: 'Inspects host registry age, corporate transparency indexes, and historical factual reputation scorecards of the news distributor.',
      details: [
        'Analyzes domain WHOIS registrations to highlight clickbait networks created under 30 days ago.',
        'Cross-checks corporate transparency profiles and board attributes.',
        'Calculates advertiser redirection ratios and structural tracker densities.',
        'Maintains whitelist / blacklist reputation scores dynamically updated by academic panels.'
      ]
    },
    {
      id: 'mn-3',
      title: 'AI Content Analysis & Linguistic Parsing',
      icon: <Cpu className="h-6 w-6 text-indigo-600" />,
      tag: 'COGNITIVE LINGUISTIC LAYER',
      description: 'Reviews syntactic article structure, loaded headline vocabulary, and emotional rhetoric intensity levels which trigger misinformation warning flags.',
      details: [
        'Flags hyperbole densities (excess exclamation marks, clickbait keywords like "SHOCKING").',
        'Scores semantic neutral representation metrics comparing claim verses supportive evidence.',
        'Identifies translated templated articles constructed by automated spin-scripts.',
        'Highlights synthetic grammar anomalies and typical automated wording styles.'
      ]
    },
    {
      id: 'mn-4',
      title: 'Media Authenticity & Neural Forensic Probe',
      icon: <FileCheck className="h-6 w-6 text-emerald-600" />,
      tag: 'COMPUTER VISION LAYER',
      description: 'Locates microscopic structural artifacts, lighting vectors, and audio temporal inconsistencies inside photos or video frames.',
      details: [
        'Identifies Generative AI patterns by analyzing high-frequency noise dispersion (GAN/diffusion).',
        'Tracks pupil corneal angle light vectors to check of physical solar compatibility.',
        'Monitors facial boundaries, ear asymmetries, or visual halos across multiple sequential frames.',
        'Performs voice cloning spectrum checks to detect synthetic phonetic tracks and lip mismatch.'
      ]
    }
  ];

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Forensic Verification Architecture
        </h2>
        <p className="text-sm text-slate-500">
          How VeraMedia performs deep cryptographic checks, content profiling, and model-based deepfake analysis.
        </p>
      </div>

      {/* Grid of methods */}
      <div className="grid md:grid-cols-2 gap-6">
        {methods.map((method) => (
          <div 
            key={method.id} 
            className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-blue-200 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 group-hover:scale-105 transition-transform">
                  {method.icon}
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-450 bg-slate-100/60 px-2.5 py-0.5 rounded-full uppercase">
                  {method.tag}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-display font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                  {method.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {method.description}
                </p>
              </div>

              {/* Technical check bullets */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  Core Analytics Pipeline
                </span>
                <ul className="space-y-1.5">
                  {method.details.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-[11px] text-slate-505 line-clamp-2 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust reassurance panel */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center space-x-1 bg-blue-800/40 text-blue-300 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-blue-700/60">
            <span>Dynamic Adaptability</span>
          </div>
          <h4 className="text-base font-display font-semibold text-white">Continuous Model Hardening Against Adversarial Attacks</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            As deepfake generation frameworks adapt (using techniques like visual noise injecting), our models receive daily signatures, adapting thresholds dynamically to maintain precision and avoid high false alarm numbers.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center justify-center space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-850 w-full md:w-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">System Authenticity Confidence</span>
          <span className="text-2xl font-black text-blue-400 font-display">99.4%</span>
          <span className="text-[9px] font-mono text-emerald-500">STABLE CLASSIFICATION</span>
        </div>
      </div>
    </div>
  );
}
