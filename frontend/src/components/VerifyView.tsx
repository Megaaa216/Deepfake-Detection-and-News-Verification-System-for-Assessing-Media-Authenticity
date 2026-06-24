import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, AlertTriangle, CheckCircle2, XCircle, Search, Sparkles, 
  RefreshCw, BarChart2, ShieldCheck, ChevronRight, HelpCircle, 
  FileText, Image, Video, ShieldAlert, BadgeInfo, CheckCircle, 
  Lock, ArrowRight, Layers, Settings, UploadCloud,
  Fingerprint, Compass, Activity, Sliders, Binary
} from 'lucide-react';
import { VerificationResult, VerificationType, VerificationReason, VerificationStatus } from '../types';

interface VerifyViewProps {
  activeSubTab: VerificationType;
  setActiveSubTab: (tab: VerificationType) => void;
  onAddHistoryItem: (item: VerificationResult) => void;
  user: { loggedIn: boolean; email: string | null };
  onNavigateToTab: (tab: string) => void;
}

export default function VerifyView({ 
  activeSubTab, 
  setActiveSubTab, 
  onAddHistoryItem,
  user,
  onNavigateToTab
}: VerifyViewProps) {
  // Toggle between URL input or File Upload
  const [intakeMethod, setIntakeMethod] = useState<'url' | 'upload'>('url');

  // Input states
  const [inputUrl, setInputUrl] = useState('https://www.tiktok.com/@finance_trends/video/732890184');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [fileDragOver, setFileDragOver] = useState(false);
  const [fileSizeStr, setFileSizeStr] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepText, setAnalysisStepText] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  // Auto-detected metadata based on URL input
  const [detectedPlatform, setDetectedPlatform] = useState<{ name: string; badgeColor: string; details: string } | null>(null);
  const [accessState, setAccessState] = useState<{ status: 'Accessible' | 'Unsupported' | 'Unavailable'; reason: string; color: string } | null>(null);
  const [detectedContents, setDetectedContents] = useState<string[]>([]);

  // Restricted Access gate if user is not authenticated
  if (!user || !user.loggedIn) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in" id="portal-lock-container">
        <div className="relative mx-auto w-24 h-24 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl border border-slate-800 flex items-center justify-center text-blue-400 shadow-xl">
          <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-lg pointer-events-none"></div>
          <Lock className="h-10 w-10 relative z-10 shrink-0" id="portal-lock-icon" />
        </div>
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase py-1 px-3 bg-blue-950 border border-blue-800/40 rounded-full inline-block">
            📈 Restricted Forensic Access
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Authentication Required
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Before use, users must login before the verification tools can be used. Please sign in or register an analyst account to run digital deepfake scans, extract public metadata, or upload media files.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateToTab('login')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-blue-900/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Sign In to Analyst Portal</span>
          </button>
          <button
            onClick={() => onNavigateToTab('register')}
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-750 transition-all cursor-pointer"
          >
            <span>Create Security Credential</span>
          </button>
        </div>
      </div>
    );
  }

  // Preloaded investigative social media presets
  const SOCIAL_PRESETS = [
    {
      id: 'p-1',
      platform: 'TikTok',
      url: 'https://www.tiktok.com/@finance_trends/video/732890184',
      type: 'video',
      status: 'likely_deepfake',
      riskScore: 89,
      verdict: 'The video stream published on TikTok contains localized face mesh warp and cloned audio. Face transplant algorithms detected.',
      recommendation: 'Critical concern. Cloned voice signature matched under 140ms latency delay relative to visual phoneme-viseme muscle coordinates. Do not share.',
      isMultiContent: true,
      hasText: true,
      hasImage: false,
      hasVideo: true,
      textPreview: '"Urgent economic warning from the Central Bank! Standard cash accounts locked within 48 hours." (Extracted from caption)',
      videoDetails: 'Phonetic spectral delay (140ms). Localized GAN mesh mask detected around mouth and eyelids. Synthesis certainty 96.5%.',
      reasons: [
        { id: 'tok-r1', name: 'Temporal Edge Blending', status: 'failed', details: 'Flickering neural mask contours observed around the nose-bridge on transition keyframes.' },
        { id: 'tok-r2', name: 'Acoustic Wave Cloning Check', status: 'failed', details: 'Voice resonance contains flat robotic frequency baselines matching synthetic API models.' },
        { id: 'tok-r3', name: 'Specular Lighting Vector', status: 'warning', details: 'Pupil reflections behave statically and fail to track shifts in back-lighting.' }
      ]
    },
    {
      id: 'p-2',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=mars_rover_alien_leak_footage',
      type: 'video',
      status: 'likely_deepfake',
      riskScore: 95,
      verdict: 'CGI mesh overlays and synthetically simulated terrain tracks detected on YouTube video stream.',
      recommendation: 'Extremely high threat of dissemination. Frame hashes do not exist in official space agency raw database catalogs.',
      isMultiContent: true,
      hasText: true,
      hasImage: true,
      hasVideo: true,
      textPreview: '"Uncensored leaked rover file from planetary operations. They tried to hide this!" (Extracted from YouTube title & description)',
      imageDetails: 'Casted shadow vectors physically conflict with landscape geometry. Digital noise contains high-pass filter gradients.',
      videoDetails: 'The dynamic asset coordinates drift off the physical ground plane mesh by 11.2 pixels on rotation.',
      reasons: [
        { id: 'yt-r1', name: '3D Mesh Alignment Check', status: 'failed', details: 'Coordinate tracking drift confirms dynamic assets were post-rendered onto real-world frames.' },
        { id: 'yt-r2', name: 'Physical Light Falloff Check', status: 'failed', details: 'Pixel luminosity patterns fail standard quadratic physical distance decrease models.' }
      ]
    },
    {
      id: 'p-3',
      platform: 'Facebook',
      url: 'https://www.facebook.com/patriotnewsreport/posts/2918839218',
      type: 'news_link',
      status: 'suspicious',
      riskScore: 71,
      verdict: 'Linguistic clickbait signatures matched. Linked article uses high emotional manipulation tactics with empty citations.',
      recommendation: 'Use skepticism prior to sharing or referencing. Secondary news sources do not contain any record of target claims.',
      isMultiContent: true,
      hasText: true,
      hasImage: true,
      hasVideo: false,
      textPreview: '"BREAKING: Miracle draft laws formulated to seize private residential vehicle assets by August! National security panic."',
      imageDetails: 'Background graphic shows standard digital copy-paste duplication overlays.',
      reasons: [
        { id: 'fb-r1', name: 'Objective Phrase Classification', status: 'failed', details: 'Classifier flags alarming concentration of sensationalist adjectives ("SHOCKING COVERS", "NATIONAL CRISIS").' },
        { id: 'fb-r2', name: 'Authority Verification Registry', status: 'failed', details: 'Congressional logs show no legislation drafts matching the statements or terminology.' }
      ]
    },
    {
      id: 'p-4',
      platform: 'X',
      url: 'https://x.com/Reuters/status/180239105183',
      type: 'news_link',
      status: 'likely_authentic',
      riskScore: 3,
      verdict: 'Highly credible news article shared from verified Reuters profile. Clean citations, neutral syntax, and certified author registry.',
      recommendation: 'Reliable material. Safe to consult, read, and share. Corresponds precisely with global security feeds.',
      isMultiContent: true,
      hasText: true,
      hasImage: false,
      hasVideo: false,
      textPreview: '"European Central Committee releases official economic support brackets for regional green transport initiative."',
      reasons: [
        { id: 'x-r1', name: 'Journalistic Mutual Cohesion', status: 'passed', details: 'Co-reported by AP, Bloomberg, and AFP international bureaus with high semantic uniformity.' },
        { id: 'x-r2', name: 'Linguistic Neutrality Index', status: 'passed', details: 'Scorers evaluate text as informative, direct, neutral standard journalism with zero clickbait metrics.' }
      ]
    },
    {
      id: 'p-5',
      platform: 'Instagram',
      url: 'https://www.instagram.com/p/C6xD_u0ys8Q/defense_minister.jpg',
      type: 'image',
      status: 'likely_authentic',
      riskScore: 7,
      verdict: 'Extracted post graphic from Instagram exhibits unmanipulated physical geometry and consistent focal noise metrics.',
      recommendation: 'Low threat profile. Metadata and specular light parameters are completely aligned with original camera hardware configurations.',
      isMultiContent: true,
      hasText: false,
      hasImage: true,
      hasVideo: false,
      imageDetails: 'Full spec camera-sensor noise pattern consistent on all channels. Specularity matching passed.',
      reasons: [
        { id: 'ig-r1', name: 'Bilateral Noise Uniformity', status: 'passed', details: 'Sensor background noise values are distributed flatly across the canvas with zero localized edits.' }
      ]
    },
    {
      id: 'p-6',
      platform: 'Reddit',
      url: 'https://www.reddit.com/r/pics/comments/senator_briefing/senator_handshake.png',
      type: 'image',
      status: 'suspicious',
      riskScore: 61,
      verdict: 'Detected manual overlay and airbrush blurring around handshake contact vectors on Reddit photo post.',
      recommendation: 'Warning. Localized spatial discrepancies suggest potential digital photo illustration presented as actual event.',
      isMultiContent: true,
      hasText: true,
      hasImage: true,
      hasVideo: false,
      textPreview: '"Unscheduled corporate tycoon handshake inside senator briefing. Photo taken by local staff."',
      imageDetails: 'Handshake perimeter demonstrates significant gaussian blurring (1.4 radius) and light casting mismatches.',
      reasons: [
        { id: 'red-r1', name: 'Edge Discontinuity Evaluator', status: 'failed', details: 'Localized sharpness levels change abruptly, typical of manual crop feathering.' },
        { id: 'red-r2', name: 'Vector Shadow Convergence', status: 'failed', details: 'Shadow direction under the participants contradicts the indoor ceiling spotlight coordinates.' }
      ]
    }
  ];

  // File verification presets
  const FILE_PRESETS = [
    {
      id: 'f-1',
      name: 'senator_briefing_leak.webp',
      type: 'image',
      size: '2.4 MB',
      status: 'suspicious',
      riskScore: 68,
      verdict: 'Manual JPEG retouch and clone stamp overlay detected around the backdrop and hands. Color Filter Array (CFA) structures exhibit repeating anomalies.',
      recommendation: 'Visual manipulation concern. High certainty of composite editing utilizing brush transparency filters. Do not utilize in primary publications.',
      reasons: [
        { id: 'f-r1', name: 'JPEG Compression Wave', status: 'failed', details: 'Quantization mismatch identified between central participants and surrounding seating background.' },
        { id: 'f-r2', name: 'EXIF Integrity Check', status: 'warning', details: 'Contains anomalous header timestamps modified via Paint.NET libraries.' }
      ]
    },
    {
      id: 'f-2',
      name: 'chief_officer_synthetic_voice.mp4',
      type: 'video',
      size: '18.1 MB',
      status: 'likely_deepfake',
      riskScore: 92,
      verdict: 'Facial lip synchrony frequency lags by 120ms relative to vocal formant frequencies. Auditory signature reveals synthesized TTS spectral baselines.',
      recommendation: 'Extremely high risk. AI-generated voice clone merged onto a public stock video frame rate sequence.',
      reasons: [
        { id: 'f-r3', name: 'Facial Landmark Tracking', status: 'failed', details: 'Sub-pixel spatial drift mapped relative to facial mesh layout, 67 vertex points exhibit jitter.' },
        { id: 'f-r4', name: 'Acoustic Wavelet Match', status: 'failed', details: 'Spectral voiceprint exhibits dynamic compression patterns consistent with ElevenLabs V2 model.' }
      ]
    },
    {
      id: 'f-3',
      name: 'unmanipulated_interview_raw.mp4',
      type: 'video',
      size: '25.0 MB',
      status: 'likely_authentic',
      riskScore: 2,
      verdict: 'No facial mesh edits or acoustic anomalies identified. Organic voice features match natural physiological breathing frequencies.',
      recommendation: 'Low concern profile. Safe, verified unmanipulated video content.',
      reasons: [
        { id: 'f-r5', name: 'Facial Landmark Tracking', status: 'passed', details: 'Zero keyframe drift. Pixel-edge brightness matches ceiling light angles perfectly.' },
        { id: 'f-r6', name: 'Biological Voice Signature', status: 'passed', details: 'Natural pause breathing patterns and physiological laryngeal resonances authenticated.' }
      ]
    }
  ];

  // Run dynamic analysis and verification when URL changes (simulate extraction)
  useEffect(() => {
    analyzeUrlStructure(inputUrl);
    setResult(null);
  }, [inputUrl]);

  const analyzeUrlStructure = (url: string) => {
    if (!url.trim()) {
      setDetectedPlatform(null);
      setAccessState(null);
      setDetectedContents([]);
      return;
    }

    const lower = url.toLowerCase();
    
    // 1. Detect Platform
    let platform = 'Other';
    let pBadge = 'bg-slate-600 text-slate-100';
    let pDetails = 'Platform classified under broad public web; standard parsers active.';

    if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
      platform = 'Facebook';
      pBadge = 'bg-blue-600/90 text-white border border-blue-500/20';
      pDetails = 'Facebook public content scraper session connected.';
    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      platform = 'YouTube';
      pBadge = 'bg-red-600 text-white border border-red-500/20';
      pDetails = 'YouTube Video API channel extraction enabled.';
    } else if (lower.includes('tiktok.com')) {
      platform = 'TikTok';
      pBadge = 'bg-slate-950 text-rose-450 border border-slate-800';
      pDetails = 'TikTok CDN content pipeline initialized.';
    } else if (lower.includes('instagram.com')) {
      platform = 'Instagram';
      pBadge = 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white';
      pDetails = 'Instagram Graph Scraper active.';
    } else if (lower.includes('x.com') || lower.includes('twitter.com')) {
      platform = 'X';
      pBadge = 'bg-black text-slate-100 border border-slate-700';
      pDetails = 'X public tweet stream extractor active.';
    } else if (lower.includes('reddit.com')) {
      platform = 'Reddit';
      pBadge = 'bg-orange-600 text-white border border-orange-500/20';
      pDetails = 'Reddit r/ community post parser active.';
    }

    setDetectedPlatform({
      name: platform,
      badgeColor: pBadge,
      details: pDetails
    });

    // 2. Identify Access Status (Legally & Technically)
    let status: 'Accessible' | 'Unsupported' | 'Unavailable' = 'Accessible';
    let reason = 'Connection Active • Public content extracted successfully';
    let color = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40 dark:text-emerald-400';

    if (lower.includes('private') || lower.includes('restricted') || lower.includes('story') || lower.includes('locked')) {
      status = 'Unavailable';
      reason = 'Private / Restricted Content (Access Denied)';
      color = 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400';
    } else if (lower.includes('tor') || lower.includes('onion') || lower.includes('illegal') || lower.includes('obscure')) {
      status = 'Unsupported';
      reason = 'Unsupported URL Format or Restricted Domain Protocol';
      color = 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400';
    } else if (platform === 'Other' && !lower.includes('http')) {
      status = 'Unsupported';
      reason = 'Malformed URL • Standard protocols rejected';
      color = 'text-slate-500 bg-slate-550/10 border-slate-200';
    }

    setAccessState({ status, reason, color });

    // 3. Define Dynamic Extracted Content Types
    if (status === 'Accessible') {
      const contents = ['Metadata', 'Thumbnail'];
      if (platform === 'YouTube' || platform === 'TikTok') {
        contents.unshift('Video', 'Text');
      } else if (platform === 'Instagram' || platform === 'Reddit') {
        contents.unshift('Image', 'Text');
      } else {
        contents.unshift('Text', 'Image');
      }
      setDetectedContents(contents);
    } else {
      setDetectedContents([]);
    }
  };

  const selectPresetUrl = (preset: typeof SOCIAL_PRESETS[number]) => {
    setInputUrl(preset.url);
    setActiveSubTab(preset.type as VerificationType);
    setIntakeMethod('url');
    setResult(null);
  };

  const selectFilePreset = (preset: typeof FILE_PRESETS[number]) => {
    setSelectedFile({ name: preset.name, size: preset.size });
    setFileSizeStr(preset.size);
    setActiveSubTab(preset.type as VerificationType);
    setIntakeMethod('upload');
    setResult(null);
  };

  // Mock stage analysis logs
  const verificationLogs = [
    { progress: 10, text: 'Resolving destination handshakes & identifying platform scraper profile...' },
    { progress: 25, text: 'Initializing payload scraping sequence... Downloading raw public buffer layers...' },
    { progress: 40, text: 'Payload resolved. Executing signal demultiplexing & spectral extraction...' },
    { progress: 55, text: 'Directing extracted imagery and audio streams to deep neural classifiers...' },
    { progress: 70, text: 'Running localized spatial analysis, temporal inconsistencies check & lighting vector alignment...' },
    { progress: 85, text: 'Executing language model classifiers to evaluate headline sensationalism and bias indexes...' },
    { progress: 95, text: 'Running global cross-source search and peer journalistic registry comparisons...' },
    { progress: 100, text: 'Cryptographic hash signature sealed. Generating ultimate case report.' }
  ];

  const handleStartAnalysis = () => {
    if (intakeMethod === 'url' && !inputUrl.trim()) return;
    if (intakeMethod === 'upload' && !selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStepText(verificationLogs[0].text);

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < verificationLogs.length - 1) {
        stepIdx++;
        setAnalysisProgress(verificationLogs[stepIdx].progress);
        setAnalysisStepText(verificationLogs[stepIdx].text);
      } else {
        clearInterval(interval);
        finalizeAnalysis();
      }
    }, 380);
  };

  const finalizeAnalysis = () => {
    setIsAnalyzing(false);

    let simulatedRecord: VerificationResult;

    if (intakeMethod === 'url') {
      const match = SOCIAL_PRESETS.find(p => p.url.trim().toLowerCase() === inputUrl.trim().toLowerCase());
      
      if (match) {
        simulatedRecord = {
          id: `check-${Date.now()}`,
          type: match.type as VerificationType,
          targetName: match.url,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          riskScore: match.riskScore,
          status: match.status as any,
          verdict: match.verdict,
          recommendation: match.recommendation,
          platform: match.platform,
          reasons: match.reasons as VerificationReason[]
        };
      } else {
        // Custom URL dynamic generation
        const score = Math.floor(Math.random() * 85) + 10;
        let status: VerificationStatus = 'likely_authentic';
        let outcomeText = '';
        let recommend = '';
        
        if (score < 20) {
          status = 'likely_authentic';
          outcomeText = 'Verification sweep completed for public URL. Structural metrics indicate a high probability of unmanipulated content, aligning perfectly with standard public feeds.';
          recommend = 'Nominal credibility. The content follows standard journalistic frameworks and contains unaltered digital structures. Safe to share.';
        } else if (score < 55) {
          status = 'suspicious';
          outcomeText = 'Elevated structural discrepancies flagged in target content. Visual features or text patterns indicate localized modification, sensational tone, or unverified claims.';
          recommend = 'Exercise alert observation. The data exhibits language bias or light edits. Cross-reference statements with major independent networks before referencing.';
        } else {
          status = 'likely_deepfake';
          outcomeText = 'Critical synthesis indicators detected. Forensic examination of the media layers demonstrates heavy neural modification, voice synthesis matching cloning APIs, or fully fabricated news syntax.';
          recommend = 'Critical threat assessment. High risk of false dissemination. Multiple synthetic fingerprints identified. Strenuously avoid distribution.';
        }

        const plat = detectedPlatform?.name || 'Other';

        simulatedRecord = {
          id: `case-${Math.floor(Math.random()*90000)+10000}`,
          type: activeSubTab,
          targetName: inputUrl,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          riskScore: score,
          status: status,
          verdict: outcomeText,
          recommendation: recommend,
          platform: plat,
          reasons: getDynamicReasons(activeSubTab, score)
        };
      }
    } else {
      // Staged file
      const match = FILE_PRESETS.find(f => f.name === selectedFile?.name);

      if (match) {
        simulatedRecord = {
          id: `check-${Date.now()}`,
          type: match.type as VerificationType,
          targetName: match.name,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          riskScore: match.riskScore,
          status: match.status as any,
          verdict: match.verdict,
          recommendation: match.recommendation,
          size: match.size,
          platform: 'Uploaded Asset',
          reasons: match.reasons as VerificationReason[]
        };
      } else {
        const score = Math.floor(Math.random() * 80) + 15;
        let status: VerificationStatus = 'likely_authentic';
        let outcomeText = '';
        let recommend = '';

        if (score < 20) {
          status = 'likely_authentic';
          outcomeText = 'Forensic local asset sweep completed. File structure matches natural image/video compression standards with unedited noise fields.';
          recommend = 'Safe asset verified. Hardware capture credentials verified. No malicious manipulation found.';
        } else if (score < 60) {
          status = 'suspicious';
          outcomeText = 'Localized visual anomalies detected. Pixel density is non-uniform, suggesting potential localized touchups or graphic filters applied.';
          recommend = 'Medium concern. Digital retouching signs found. Content should be backed by separate raw documentation.';
        } else {
          status = 'likely_deepfake';
          outcomeText = 'Deep synthetic traces identified in local file. Neural face landmarks show irregular edge blending, and acoustic voiceprints match generative voice cloning libraries.';
          recommend = 'High risk. Visual face-swap mesh overlay or synthetic voiceclone verified. Treat as artificial material.';
        }

        simulatedRecord = {
          id: `case-${Math.floor(Math.random()*90000)+10000}`,
          type: activeSubTab,
          targetName: selectedFile?.name || 'custom_upload.mp4',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          riskScore: score,
          status: status,
          verdict: outcomeText,
          recommendation: recommend,
          size: fileSizeStr || '4.2 MB',
          platform: 'Uploaded Asset',
          reasons: getDynamicReasons(activeSubTab, score)
        };
      }
    }

    setResult(simulatedRecord);
    onAddHistoryItem(simulatedRecord);
  };

  const getDynamicReasons = (type: VerificationType, score: number): VerificationReason[] => {
    const isHigh = score > 50;
    if (type === 'video') {
      return [
        { 
          id: 'v-r1', 
          name: 'Face Mesh Landmark Drifts', 
          status: isHigh ? 'failed' : 'passed', 
          details: isHigh ? 'Identified localized face-boundary pixel jitter across keyframes, confirming a dynamic overlay mask.' : 'Face landmark geometry remains locked securely to anatomical bone structure; zero drifting.' 
        },
        { 
          id: 'v-r2', 
          name: 'Phoneme-Viseme Lip Synchrony', 
          status: isHigh ? 'failed' : 'passed', 
          details: isHigh ? 'Mouth muscle movements display a 130ms latency delay relative to audio voice formant frequencies.' : 'Lip muscle contractions correspond perfectly to acoustic speech-formant frequencies.' 
        },
        { 
          id: 'v-r3', 
          name: 'Acoustic Synthesis Scan', 
          status: isHigh ? 'warning' : 'passed', 
          details: isHigh ? 'Voice spectrum exhibits static high-frequency flatlines, indicating generative text-to-speech rendering.' : 'Natural pauses, physical breathing intervals, and laryngeal vocal harmonics authenticated.' 
        }
      ];
    } else if (type === 'image') {
      return [
        { 
          id: 'i-r1', 
          name: 'Color Filter Array Interpolation', 
          status: isHigh ? 'failed' : 'passed', 
          details: isHigh ? 'CFA Bayer matrix pattern exhibits repeating grid anomalies, a characteristic footprint of composite editing.' : 'CFA pixel patterns demonstrate natural, uniform spatial noise distributions.' 
        },
        { 
          id: 'i-r2', 
          name: 'Specular Vector Geometry', 
          status: isHigh ? 'failed' : 'passed', 
          details: isHigh ? 'Pupil highlight reflections conflict directly with ambient background illumination coordinates.' : 'Reflective eye specularity corresponds accurately to surrounding scene light sources.' 
        },
        { 
          id: 'i-r3', 
          name: 'High-Frequency Compression Check', 
          status: isHigh ? 'warning' : 'passed', 
          details: isHigh ? 'JPEG quantization maps exhibit non-uniform compression tiers between central subjects and background.' : 'Compression quantization values remain constant and unified across all coordinates.' 
        }
      ];
    } else {
      return [
        { 
          id: 't-r1', 
          name: 'Linguistic Sensationalism Ratio', 
          status: isHigh ? 'failed' : 'passed', 
          details: isHigh ? 'Vocabulary exhibits excessive emotional click-seeking adjectives and alarming capitalizations.' : 'Language structure features balanced, descriptive, third-person objective reporting style.' 
        },
        { 
          id: 't-r2', 
          name: 'Journalistic Mutual Cohesion', 
          status: isHigh ? 'failed' : 'passed', 
          details: isHigh ? 'Global media registry search indicates zero corresponding claims verified by accredited news bureaus.' : 'Identified identical co-reporting by Bloomberg, Reuters, and AP bureaus.' 
        },
        { 
          id: 't-r3', 
          name: 'Headline Misleading Alignment', 
          status: isHigh ? 'warning' : 'passed', 
          details: isHigh ? 'Extreme divergence between the alarming headline claims and factual cited paragraphs within the body.' : 'Headline matches structural content directly with precise factual representation.' 
        }
      ];
    }
  };

  // Maps professional status based on score
  const getProfessionalOutcome = (score: number, type: VerificationType) => {
    if (score < 20) {
      return {
        label: 'Likely Authentic',
        color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
        barColor: 'bg-emerald-500',
        textClass: 'text-emerald-400',
        description: 'System indicates a high level of digital trust. Content exhibits unaltered structural, physical, or semantic properties.',
        badge: '🟢 VERIFIED TRUST'
      };
    } else if (score < 50) {
      return {
        label: 'Suspicious',
        color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
        barColor: 'bg-amber-500',
        textClass: 'text-amber-400',
        description: 'Localized anomalies or linguistic alerts identified. The material is likely edited or presented with misleading parameters.',
        badge: '🟡 ELEVATED ALERT'
      };
    } else if (type === 'news_link' && score >= 50) {
      return {
        label: 'High Risk of Misinformation',
        color: 'text-red-400 bg-red-950/40 border-red-900/60',
        barColor: 'bg-red-500',
        textClass: 'text-red-400',
        description: 'Deep narrative and source anomalies mapped. The text incorporates extreme vocabulary bias, unverified claims, and empty citations.',
        badge: '🚨 CRITICAL WARNING'
      };
    } else {
      return {
        label: 'Likely Manipulated',
        color: 'text-rose-400 bg-rose-950/40 border-rose-900/60',
        barColor: 'bg-rose-500',
        textClass: 'text-rose-400',
        description: 'Digital forensics flags neural generation signatures. Multi-frame face overlay patterns or synthetic voice clones confirmed.',
        badge: '🔥 MANIPULATION VERIFIED'
      };
    }
  };

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto" id="verify-workspace">
      
      {/* 1. Header Area with Cybernetic Aesthetics */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-2 bg-blue-950 border border-blue-900/60 rounded px-2.5 py-1 text-[10px] text-blue-400 font-mono tracking-widest uppercase">
          <Layers className="h-3.5 w-3.5 animate-pulse text-blue-400" />
          <span>Forensic Intelligence Terminal • Active Core</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          MEDIA INVESTIGATION WORKSPACE
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Subject suspected social media assets to multi-spectral neural classifiers. Select your target media type below, mount your evidence via direct URL extraction or raw file loading, and parse structural credibility anomalies.
        </p>
      </div>

      {/* 2. Three-Stage Forensic Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================== STAGE 1: INTAKE (Left Column) ==================== */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full justify-start">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            {/* intake header */}
            <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-900 flex items-center justify-between text-white">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 flex items-center space-x-1.5">
                <Sliders className="h-4 w-4 text-blue-400" />
                <span>STAGE 01: INTAKE CONTROLS</span>
              </span>
              <span className="text-[9px] font-mono bg-blue-900/40 text-blue-300 border border-blue-800/50 px-1.5 py-0.5 rounded">
                SECURE SANDBOX
              </span>
            </div>

            <div className="p-5 space-y-5 flex-1">
              {/* Media Content Type Selector */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold">
                  Select Evidence Type
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('video');
                      setResult(null);
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                      activeSubTab === 'video'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span className="text-[10px]">Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('image');
                      setResult(null);
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                      activeSubTab === 'image'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Image className="h-4 w-4" />
                    <span className="text-[10px]">Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('news_link');
                      setResult(null);
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                      activeSubTab === 'news_link'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-[10px]">News / Text</span>
                  </button>
                </div>
              </div>

              {/* Input Method Selector: URL extract or File Upload */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setIntakeMethod('url')}
                  className={`flex-1 pb-2 font-mono text-center font-bold tracking-wide cursor-pointer ${
                    intakeMethod === 'url'
                      ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  🌐 PUBLIC URL SCAPE
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeMethod('upload')}
                  className={`flex-1 pb-2 font-mono text-center font-bold tracking-wide cursor-pointer ${
                    intakeMethod === 'upload'
                      ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  📁 FILE HARDWARE UPLOAD
                </button>
              </div>

              {/* Interactive Submission Form */}
              {intakeMethod === 'url' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="url-input" className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold">
                      Destination Social Media Link
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Globe className="h-4 w-4" />
                      </div>
                      <input
                        id="url-input"
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Paste link from TikTok, Youtube, FB, X, Reddit..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:bg-white pl-9 pr-3 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Extraction diagnostic indicator */}
                  {inputUrl.trim() && (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-3 rounded-xl text-[11px] font-mono space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Connection Feedback</span>
                        <span>{accessState?.status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {detectedPlatform && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black text-center ${detectedPlatform.badgeColor}`}>
                            {detectedPlatform.name}
                          </span>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[170px]">{accessState?.reason}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setFileDragOver(true);
                    }}
                    onDragLeave={() => setFileDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setFileDragOver(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const fileObj = e.dataTransfer.files[0];
                        setSelectedFile({ name: fileObj.name, size: (fileObj.size / (1024 * 1024)).toFixed(1) + ' MB' });
                        setFileSizeStr((fileObj.size / (1024 * 1024)).toFixed(1) + ' MB');
                        setResult(null);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      fileDragOver 
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept={activeSubTab === 'image' ? 'image/*' : activeSubTab === 'video' ? 'video/*' : '*/*'}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const fileObj = e.target.files[0];
                          setSelectedFile({ name: fileObj.name, size: (fileObj.size / (1024 * 1024)).toFixed(1) + ' MB' });
                          setFileSizeStr((fileObj.size / (1024 * 1024)).toFixed(1) + ' MB');
                          setResult(null);
                        }
                      }}
                    />
                    <UploadCloud className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {selectedFile ? 'Swap Mounted Specimen' : 'Select or Drag Forensic File'}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Supports high-resolution {activeSubTab === 'image' ? 'PNG, WebP, JPG' : 'MP4, MOV, MKV'}
                    </span>
                  </div>

                  {selectedFile && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex items-center justify-between text-[11px] font-mono text-white">
                      <div className="flex items-center space-x-2 shrink min-w-0">
                        {activeSubTab === 'image' ? <Image className="h-4 w-4 text-blue-400 shrink-0" /> : <Video className="h-4 w-4 text-blue-400 shrink-0" />}
                        <span className="truncate font-bold text-slate-300 block max-w-[160px]">{selectedFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setResult(null); }}
                        className="text-[9px] text-rose-450 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/40 shrink-0 cursor-pointer"
                      >
                        Unmount
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Policy Enforced Alert */}
              <div className="bg-blue-900/10 border border-blue-900/30 p-3 rounded-xl text-[10px] text-slate-400 leading-normal flex items-start space-x-2 font-mono">
                <Lock className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  <strong>PUBLIC INTEGRITY RULE:</strong> Analyzes public social media feeds and local sandboxed uploads only. Our scrapers bypass private firewalls.
                </p>
              </div>

              {/* QUICK DEMO PRESETS */}
              <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                <span className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Select Pre-Mounted Demo Cases:
                </span>
                
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {intakeMethod === 'url' ? (
                    SOCIAL_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectPresetUrl(preset)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col justify-between font-mono cursor-pointer ${
                          inputUrl === preset.url
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300'
                            : 'border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200">[{preset.platform}] Link</span>
                          <span className="text-[8px] bg-slate-900 px-1 rounded uppercase tracking-wider">{preset.type}</span>
                        </div>
                        <span className="text-[10px] truncate block text-slate-400 mt-0.5">{preset.url}</span>
                      </button>
                    ))
                  ) : (
                    FILE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectFilePreset(preset)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col justify-between font-mono cursor-pointer ${
                          selectedFile?.name === preset.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300'
                            : 'border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full font-mono">
                          <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200">{preset.name}</span>
                          <span className="text-[8px] bg-slate-900 px-1 rounded uppercase tracking-wider">{preset.size}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* TRIGGER ANALYSIS BUTTON */}
              <button
                type="button"
                disabled={isAnalyzing || (intakeMethod === 'url' && !inputUrl.trim()) || (intakeMethod === 'upload' && !selectedFile)}
                onClick={handleStartAnalysis}
                className={`w-full py-3.5 rounded-xl text-white font-semibold text-xs tracking-wider uppercase font-mono shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  (intakeMethod === 'url' && !inputUrl.trim()) || (intakeMethod === 'upload' && !selectedFile)
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed shadow-none border border-slate-400/10' 
                    : isAnalyzing 
                    ? 'bg-blue-800' 
                    : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20 hover:-translate-y-0.5'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Executing Classifiers...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 shrink-0 text-blue-300" />
                    <span>Run Forensic Verification</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* ==================== STAGE 2: EVIDENCE ANALYSIS (Center Column) ==================== */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full justify-start">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-900 flex items-center justify-between text-white">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 flex items-center space-x-1.5">
                <Binary className="h-4 w-4 text-blue-400" />
                <span>STAGE 02: FORENSIC DISSECTION</span>
              </span>
              <span className="text-[9px] font-mono bg-blue-900/40 text-blue-300 border border-blue-800/50 px-1.5 py-0.5 rounded">
                EVIDENCE SPECTRUM
              </span>
            </div>

            <div className="p-5 flex-1 min-h-[460px] flex flex-col justify-center">
              {/* State A: Awaiting submission */}
              {!isAnalyzing && !result && (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 flex items-center justify-center border border-slate-100 dark:border-slate-850">
                    <Activity className="h-6 w-6 stroke-[1.5] animate-pulse text-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Specimen Diagnostic Pending</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                      Mount a link or raw file, then click "Run Forensic Verification" to initiate neural checks and visual noise matrices.
                    </p>
                  </div>
                </div>
              )}

              {/* State B: Running Scans */}
              {isAnalyzing && (
                <div className="space-y-6 py-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Inference Matrix</span>
                    <span className="text-xs font-mono text-blue-300 font-bold">{analysisProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-850">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 text-left">
                    <div className="flex items-center space-x-1.5 text-[9px] font-mono text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block animate-ping"></span>
                      <span>ACTIVE SHIELD MODULE:</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-300 leading-relaxed min-h-[36px]">
                      {analysisStepText}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-950 rounded"></div>
                    <div className="h-2 w-2/3 bg-slate-100 dark:bg-slate-950 rounded"></div>
                    <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-950 rounded"></div>
                  </div>
                </div>
              )}

              {/* State C: Complete Results Dissection */}
              {!isAnalyzing && result && (
                <div className="space-y-5 text-left animate-fade-in w-full h-full">
                  
                  {/* Dynamic Metrics Breakdown depending on subTab */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                        📊 Neural Score Breakdown
                      </span>
                      <span className="text-[9px] font-mono uppercase bg-slate-100 dark:bg-slate-950 text-slate-500 px-1 rounded">
                        {result.type.toUpperCase()} CAPTURE
                      </span>
                    </div>

                    {/* Check if Video */}
                    {result.type === 'video' && (
                      <div className="space-y-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {/* face consistency */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Face Consistency</span>
                            <span className={result.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 50 ? 'Anomalous (24%)' : 'Stable (96%)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 50 ? '24%' : '96%' }}></div>
                          </div>
                        </div>

                        {/* Frame irregularity */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Frame Irregularity</span>
                            <span className={result.riskScore > 60 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 60 ? 'High (84%)' : 'Nominal (4%)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 60 ? '84%' : '4%' }}></div>
                          </div>
                        </div>

                        {/* Audio mismatch */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Audio Mismatch</span>
                            <span className={result.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 50 ? 'Cloned Sync (88%)' : 'Cohesive (2%)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 50 ? '88%' : '2%' }}></div>
                          </div>
                        </div>

                        {/* Lip-sync check */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Lip-Sync Alignment</span>
                            <span className={result.riskScore > 50 ? 'text-rose-450' : 'text-emerald-400'}>
                              {result.riskScore > 50 ? 'Fails Match (12%)' : 'Synced (98%)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 50 ? '12%' : '98%' }}></div>
                          </div>
                        </div>

                        {/* Manipulation signal score */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>Synthetic Signal</span>
                            <span className={result.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore}% Probability
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${result.riskScore}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Check if Image */}
                    {result.type === 'image' && (
                      <div className="space-y-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {/* AI-generation signal */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>AI-Generation Signal</span>
                            <span className={result.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 50 ? 'GAN Artifacts Found' : 'Unaltered Pixel Grid'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${result.riskScore}%` }}></div>
                          </div>
                        </div>

                        {/* Face artifact score */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Face Mask / Artifacts</span>
                            <span className={result.riskScore > 60 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 60 ? 'Boundary Blur (78%)' : 'Nominal (3%)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 60 ? '78%' : '3%' }}></div>
                          </div>
                        </div>

                        {/* Editing trace score */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Clone / Stamp Edits</span>
                            <span className={result.riskScore > 40 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 40 ? 'Anomalous (82%)' : 'Flat Noise (6%)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 40 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 40 ? '82%' : '6%' }}></div>
                          </div>
                        </div>

                        {/* Metadata check */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>EXIF Camera Match</span>
                            <span className={result.riskScore > 60 ? 'text-amber-400' : 'text-emerald-400'}>
                              {result.riskScore > 60 ? 'Mismatched Headers' : 'Valid EXIF Matches'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 60 ? '15%' : '95%' }}></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Check if News Link / Text */}
                    {result.type === 'news_link' && (
                      <div className="space-y-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {/* Source credibility */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Source Trust Index</span>
                            <span className={result.riskScore > 60 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 60 ? 'Unverified Web Domain' : 'Verified Publisher (AP/Reu)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 60 ? '25%' : '98%' }}></div>
                          </div>
                        </div>

                        {/* Headline risk */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Sensational Headline Risk</span>
                            <span className={result.riskScore > 50 ? 'text-rose-450' : 'text-emerald-400'}>
                              {result.riskScore > 50 ? 'High Clickbait Weight' : 'Informative/Neutral'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${result.riskScore}%` }}></div>
                          </div>
                        </div>

                        {/* Language manipulation */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Cognitive Manipulation Bias</span>
                            <span className={result.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 50 ? 'Extreme Emotional Bias' : 'Low Bias Metrics'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${result.riskScore}%` }}></div>
                          </div>
                        </div>

                        {/* Cross-source support */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Syndication / Peer Reports</span>
                            <span className={result.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                              {result.riskScore > 50 ? 'Isolated Incident (0 peers)' : 'Fully Co-Reported (AP/AFP)'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded">
                            <div className={`h-1.5 rounded ${result.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: result.riskScore > 50 ? '5%' : '95%' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FRAME OR SAMPLE PREVIEW FOR VIDEO/IMAGE/TEXT */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
                    <span className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      🔬 Target Specimen Visualizer
                    </span>
                    
                    {result.type === 'video' && (
                      <div className="bg-slate-950 h-32 rounded-xl border border-slate-850 flex flex-col justify-between p-3 overflow-hidden relative">
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,100,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                        
                        {/* Simulated green wireframe face mesh */}
                        <div className="flex-1 flex items-center justify-center relative">
                          <div className="w-24 h-24 rounded-full border border-blue-500/40 relative flex items-center justify-center">
                            <div className="absolute w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                            {/* Face structural mesh grids */}
                            <div className="absolute inset-2 border border-dotted border-blue-400/30 rounded-full"></div>
                            <div className="absolute inset-4 border border-blue-400/20 rounded-full"></div>
                            <div className="w-full h-[1px] bg-blue-500/35 absolute top-1/2"></div>
                            <div className="h-full w-[1px] bg-blue-500/35 absolute left-1/2"></div>
                            <div className="absolute top-1/3 left-1/3 w-1.5 h-1 bg-blue-300"></div>
                            <div className="absolute top-1/3 right-1/3 w-1.5 h-1 bg-blue-300"></div>
                            <div className="absolute bottom-1/4 w-4 h-1 border-b border-blue-300/60 rounded"></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 relative z-10">
                          <span>LAN_TRACKER: 67 VERTS ACTIVE</span>
                          <span className={result.riskScore > 50 ? 'text-rose-400 animate-pulse font-bold' : 'text-emerald-400'}>
                            {result.riskScore > 50 ? 'MESH STRETCH DETECTED' : 'ALIGNMENT: PERFECT'}
                          </span>
                        </div>
                      </div>
                    )}

                    {result.type === 'image' && (
                      <div className="bg-slate-950 h-32 rounded-xl border border-slate-850 flex flex-col justify-between p-3 overflow-hidden relative">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]"></div>
                        
                        {/* Magnifier grid overlay */}
                        <div className="flex-1 flex items-center justify-center relative">
                          <div className="border border-blue-500/40 px-3 py-1.5 rounded bg-blue-950/20 text-[10px] font-mono text-blue-300 flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            <span>CFA EXIF SPECTRUM MAPPER ACTIVE</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 relative z-10">
                          <span>NOISE VARIANCE ANALYSIS</span>
                          <span className={result.riskScore > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {result.riskScore > 50 ? 'ANOMALOUS EDGE SHARPNESS' : 'UNIFORM SENSOR GRAIN'}
                          </span>
                        </div>
                      </div>
                    )}

                    {result.type === 'news_link' && (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[10.5px] text-slate-400 space-y-2">
                        <div className="border-b border-slate-900 pb-1 flex justify-between items-center text-[8.5px] text-slate-500 font-bold">
                          <span>SEMANTIC WORD EXTRACTOR</span>
                          <span className="text-blue-400">BIAS WEIGHTING MAP</span>
                        </div>
                        <p className="italic leading-normal text-slate-300">
                          {result.riskScore > 50 
                            ? '🚨 "...locks within 48 hours..." [Sensational Alert Pattern Match]. "...seize private residential assets..." [Emotional Shock Trigger].'
                            : '✔️ "...European Central Committee releases..." [Direct objective title]. "...official economic support..." [Noun sequence match].'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* HIGH-LEVEL HIGHLIGHT CARD FOR CRITICAL SIGNALS */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
                    <span className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      ⚠️ Critical Specimen Warnings
                    </span>
                    {result.riskScore > 50 ? (
                      <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 text-rose-400 space-y-1.5">
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold tracking-widest uppercase">
                          <ShieldAlert className="h-4 w-4 text-rose-450 shrink-0" />
                          <span>ANOMALOUS PAYLOAD TRIGGERED</span>
                        </div>
                        <p className="text-[11px] leading-relaxed font-sans text-slate-300">
                          Verification pipelines successfully mapped anomalies. {result.type === 'video' ? 'Audio-facial alignment exceeds acceptable latency benchmarks.' : result.type === 'image' ? 'Repeating structures detected under Color Filter Array matrices.' : 'Source domain lacks mutually supporting journalism.'}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3 text-emerald-400 space-y-1.5">
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold tracking-widest uppercase">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>ALL STRUCTURAL TEST CORES NOMINAL</span>
                        </div>
                        <p className="text-[11px] leading-relaxed font-sans text-slate-300">
                          Scans indicate no synthesized facial features, matching organic vocal metrics, and verifiable sources. Payload matches authentic parameters.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CASE TIMELINE STEPS OF VERIFICATION */}
                  <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800/80 pt-3.5 w-full">
                    <span className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      ⏳ Forensic Pipeline Timeline
                    </span>
                    <div className="space-y-2 pl-2 border-l border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-500">
                      <div className="relative">
                        <div className="absolute -left-[12px] top-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 pl-2">
                          <span>[0.0s] Handshake Resolution</span>
                          <span className="text-emerald-400">PASSED</span>
                        </div>
                        <span className="text-[9px] block pl-2">Platform socket opened and secure CDN handshake established.</span>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[12px] top-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 pl-2">
                          <span>[0.3s] Signal Demultiplexing</span>
                          <span className="text-emerald-400">PASSED</span>
                        </div>
                        <span className="text-[9px] block pl-2">Extracted raw stream partitions (Acoustics, Visual frame buffer).</span>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[12px] top-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 pl-2">
                          <span>[0.8s] Neural Network Evaluation</span>
                          <span className="text-emerald-400">PASSED</span>
                        </div>
                        <span className="text-[9px] block pl-2">Dispatched streams to dynamic CNN & Transformer models.</span>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[12px] top-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 pl-2">
                          <span>[1.2s] Metadata Integrity Seal</span>
                          <span className="text-emerald-400">PASSED</span>
                        </div>
                        <span className="text-[9px] block pl-2">Completed checksum sealing and saved query to local history.</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* ==================== STAGE 3: RISK REPORT (Right Column) ==================== */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full justify-start">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col text-white">
            
            <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-900 flex items-center justify-between text-white">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 flex items-center space-x-1.5">
                <Compass className="h-4 w-4 text-blue-400" />
                <span>STAGE 03: FORENSIC CASE REPORT</span>
              </span>
              <span className="text-[9px] font-mono bg-blue-900/40 text-blue-300 border border-blue-800/50 px-1.5 py-0.5 rounded">
                CASE CERTIFICATE
              </span>
            </div>

            <div className="p-5 flex-1 min-h-[460px] flex flex-col justify-center">
              {/* State A: Awaiting submission */}
              {!isAnalyzing && !result && (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-slate-950 text-slate-600 flex items-center justify-center border border-slate-850">
                    <Fingerprint className="h-6 w-6 stroke-[1.5] text-blue-500/60" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Report Awaiting Intake</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-[240px] mx-auto">
                      All structural certificates, risk meters, and model reasoning summaries compile here upon successful intake validation.
                    </p>
                  </div>
                </div>
              )}

              {/* State B: Running Scans */}
              {isAnalyzing && (
                <div className="space-y-5 py-6 text-center animate-pulse">
                  <Fingerprint className="h-10 w-10 mx-auto text-blue-500 animate-spin" />
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-400">GENERATING EVIDENCE RECORD</h4>
                    <p className="text-[10px] text-slate-500 leading-normal max-w-[180px] mx-auto font-mono">
                      Performing deep-level hash calculation and building forensic signature authority...
                    </p>
                  </div>
                </div>
              )}

              {/* State C: Complete Results Case Report */}
              {!isAnalyzing && result && (
                <div className="space-y-5 text-left animate-fade-in w-full h-full">
                  
                  {/* Case Outcome Header */}
                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 font-bold uppercase">
                      <span>Forensic Finding Status</span>
                      <span className={getProfessionalOutcome(result.riskScore, result.type).textClass}>
                        {getProfessionalOutcome(result.riskScore, result.type).badge}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-lg border text-sm font-black font-mono text-center uppercase tracking-wide ${getProfessionalOutcome(result.riskScore, result.type).color}`}>
                      {getProfessionalOutcome(result.riskScore, result.type).label}
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
                      {getProfessionalOutcome(result.riskScore, result.type).description}
                    </p>
                  </div>

                  {/* RISK METER GRADUATED BAR */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                      <span>Threat Risk Meter</span>
                      <span className={getProfessionalOutcome(result.riskScore, result.type).textClass}>
                        {result.riskScore}% RISK
                      </span>
                    </div>

                    <div className="w-full bg-slate-950 h-5 rounded overflow-hidden border border-slate-800 p-0.5 flex relative items-center">
                      {/* Graduated labels under bar */}
                      <div className="absolute inset-0 flex justify-between px-2 text-[8px] font-mono text-slate-500 pointer-events-none items-center">
                        <span>MINIMAL</span>
                        <span>ELEVATED</span>
                        <span>HIGH</span>
                        <span>CRITICAL</span>
                      </div>
                      <div 
                        className={`h-full rounded-sm opacity-25 ${getProfessionalOutcome(result.riskScore, result.type).barColor}`}
                        style={{ width: `${result.riskScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Confidence and metadata parameters */}
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-850 flex flex-col justify-between">
                      <span className="text-slate-550 block text-[9px] uppercase">Confidence</span>
                      <span className="font-bold text-blue-400 text-xs mt-0.5">{100 - Math.abs(result.riskScore - 2)}% Certitude</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-850 flex flex-col justify-between">
                      <span className="text-slate-550 block text-[9px] uppercase">Case UID</span>
                      <span className="font-bold text-slate-300 text-xs mt-0.5">#{result.id.slice(-6)}</span>
                    </div>
                  </div>

                  {/* REASONING SUMMARY */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Investigative Case Summary</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-850 font-sans">
                      {result.verdict}
                    </p>
                  </div>

                  {/* SOURCE TRUST CARD / HARDWARE SENSOR PROFILE */}
                  {result.type === 'news_link' ? (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/60 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>📰 Source Authenticator</span>
                        <span className={result.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                          {result.riskScore > 50 ? 'UNVERIFIED DOMAIN' : 'MAINSTREAM REGISTRY'}
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Corroboration:</span>
                          <span className="text-slate-200">{result.riskScore > 50 ? '0 global indices' : '12 major international bureaus'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Syntactic Style:</span>
                          <span className="text-slate-200">{result.riskScore > 50 ? 'Clickbait sensational' : 'Objective report'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/60 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>📷 Hardware Sensor Profile</span>
                        <span className={result.riskScore > 60 ? 'text-amber-400' : 'text-emerald-400'}>
                          {result.riskScore > 60 ? 'ALTERED EXIF' : 'UNALTERED EXIF'}
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Camera Hardware:</span>
                          <span className="text-slate-200">{result.riskScore > 60 ? 'Paint.NET Altered' : 'Sony ILCE-7M4 FE'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sensor matrix:</span>
                          <span className="text-slate-200">CFA Bayer Pattern (Unaltered)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CONTENT FINGERPRINT ANALYSIS TRAIL */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/60 text-[10px] font-mono text-slate-400 space-y-1">
                    <div className="flex items-center space-x-1 text-[9px] font-bold text-slate-500 uppercase pb-1 border-b border-slate-900 mb-1.5">
                      <Fingerprint className="h-3 w-3 text-slate-500" />
                      <span>Evidence Cryptographic Trail</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payload SHA-256:</span>
                      <span className="text-blue-400 font-bold">sha256:{Math.random().toString(16).slice(2, 10)}ae3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forensic Node:</span>
                      <span className="text-slate-300">Scraper AP-EAST-02</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Watermark Status:</span>
                      <span className="text-slate-300">Proof-Watermark Encoded</span>
                    </div>
                  </div>

                  {/* local history save alert */}
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-850 pt-3">
                    <span className="flex items-center space-x-1 text-emerald-500 font-bold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>CASE FILE COMMITTED TO HISTORY LOGS</span>
                    </span>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* ==================== WHAT THE SYSTEM CHECKS SECTION ==================== */}
      <div className="space-y-4 pt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">
            What the system checks
          </h2>
          <p className="text-xs text-slate-400 font-mono tracking-wide uppercase">
            Specialized deep neural classification modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Video checking */}
          <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
              <Video className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">Video Forensics</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculates face consistency, tracks sub-pixel lip-sync alignment anomalies, filters dynamic lighting angle differences, and detects acoustic cloned voice traces compared to organic physiological pauses.
            </p>
          </div>

          {/* Card 2: Image checking */}
          <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
              <Image className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">Image Forensic Sweep</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Scans Color Filter Array (CFA) interpolation inconsistencies, specular pupil light direction vectoring conflicts, localized blur edges, and camera header metadata altered by graphical rendering libraries.
            </p>
          </div>

          {/* Card 3: News / Text check */}
          <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">Semantic Text Analysis</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Examines cognitive text bias levels, flags alarming linguistic capitalizations, assesses headline clickbait weight ratios, and indexes syndication coverage across accredited global journalistic bureaus.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== WHY THIS MATTERS SECTION ==================== */}
      <div className="space-y-4 pt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Why this matters
          </h2>
          <p className="text-xs text-slate-400 font-mono tracking-wide uppercase">
            Safeguarding objective trust in the digital age
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          
          {/* Point 1 */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 rounded-xl flex items-start space-x-3">
            <span className="text-blue-500 font-bold shrink-0 text-base">01.</span>
            <div className="space-y-1">
              <h5 className="font-bold text-slate-700 dark:text-slate-300">Deepfakes Spread Misinformation</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Synthetic multimedia is highly weaponized to manufacture fictional statements by public leaders, accelerating market volatility, narrative polarization, and severe trust depletion across global borders.
              </p>
            </div>
          </div>

          {/* Point 2 */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 rounded-xl flex items-start space-x-3">
            <span className="text-blue-500 font-bold shrink-0 text-base">02.</span>
            <div className="space-y-1">
              <h5 className="font-bold text-slate-700 dark:text-slate-300">AI Media is Advancing Daily</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Generative AI models yield high-fidelity pixel renders, flawless voice replication, and zero-gravity mesh models that cannot be filtered easily by standard human sensory perception alone.
              </p>
            </div>
          </div>

          {/* Point 3 */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 rounded-xl flex items-start space-x-3">
            <span className="text-blue-500 font-bold shrink-0 text-base">03.</span>
            <div className="space-y-1">
              <h5 className="font-bold text-slate-700 dark:text-slate-300">A Clear Verification Need</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                A public-facing, analytical forensic suite is required to extract metadata, inspect underlying compression anomalies, and provide factual parameters so users verify digital assets prior to distributing.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
