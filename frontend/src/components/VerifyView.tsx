import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, AlertTriangle, CheckCircle2, XCircle, Search, Sparkles, 
  RefreshCw, BarChart2, ShieldCheck, ChevronRight, HelpCircle, 
  FileText, Image, Video, ShieldAlert, BadgeInfo, CheckCircle, 
  Lock, ArrowRight, Eye, EyeOff, Layers, Settings, ExternalLink,
  UploadCloud
} from 'lucide-react';
import { VerificationResult, VerificationType, VerificationReason } from '../types';

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
  // Main form states
  const [inputUrl, setInputUrl] = useState('https://www.tiktok.com/@finance_trends/video/732890184');
  const [selectedContentType, setSelectedContentType] = useState<'all' | 'video' | 'text' | 'image'>('all');

  // Manual File Verification states
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [fileDragOver, setFileDragOver] = useState(false);
  const [fileSizeStr, setFileSizeStr] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepText, setAnalysisStepText] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  // Auto-detected states based on inputUrl
  const [detectedPlatform, setDetectedPlatform] = useState<{ name: string; badgeColor: string; details: string } | null>(null);
  const [accessState, setAccessState] = useState<{ status: 'Accessible' | 'Unsupported' | 'Unavailable'; reason: string; color: string } | null>(null);
  const [detectedContents, setDetectedContents] = useState<string[]>([]);

  // Restricted Access lock gate if user is not authenticated
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

  // Pre-loaded social media presets
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
      imageDetails: 'Full spec camera-sensor noise pattern consistent on all channels.Specularity matching passed.',
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
    },
    {
      id: 'p-7',
      platform: 'Instagram',
      url: 'https://www.instagram.com/p/private_restricted_story/',
      type: 'video',
      status: 'likely_authentic',
      riskScore: 0,
      verdict: 'Access Denied. Instagram account or story is privatized/restricted.',
      recommendation: '🔒 Private Content Status. Our scraping API cannot legally index raw data streams from secured profile limits. Please download the media and use manual file analysis.',
      unavailable: true,
      unavailabilityReason: 'Private content',
      reasons: []
    },
    {
      id: 'p-8',
      platform: 'Other',
      url: 'https://some-obscure-illegal-forum.tor/threads/conspiracy_alert',
      type: 'news_link',
      status: 'likely_authentic',
      riskScore: 0,
      verdict: 'Extraction Failed. Target site protocol is unsupported by standard indexing pipelines.',
      recommendation: '⛔ Unsupported Platform. Web address belongs to restricted tor/onion networks or unrecognized custom protocols. Scraper rejected standard handshakes.',
      unavailable: true,
      unavailabilityReason: 'Unsupported platform',
      reasons: []
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
    // Auto reset result so they can click "Run Verification"
    setResult(null);
  };

  // Mock analysis logs
  const verificationLogs = [
    { progress: 15, text: 'Resolving destination handshakes & identifying platform scraper profile...' },
    { progress: 35, text: 'Executing secure public extraction... Extracting captions, images, and raw media blocks...' },
    { progress: 55, text: 'Routing media data to deepfake Neural Core & examining temporal spatial consistency...' },
    { progress: 75, text: 'Comparing extracted claims with accredited independent fact-checking registries...' },
    { progress: 90, text: 'Evaluating EXIF visual boundaries, chromatic noise, and voice frequency patterns...' },
    { progress: 100, text: 'Structuring risk reports and publishing verified outcome to history log.' }
  ];

  const handleStartAnalysis = () => {
    if (!inputUrl.trim()) return;

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
        finalizeSocialAnalysis();
      }
    }, 450);
  };

  const finalizeSocialAnalysis = () => {
    setIsAnalyzing(false);

    // Find matched scenario
    const match = SOCIAL_PRESETS.find(p => p.url.trim().toLowerCase() === inputUrl.trim().toLowerCase());
    
    let simulatedRecord: VerificationResult;

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
        unavailable: match.unavailable,
        unavailabilityReason: match.unavailabilityReason,
        reasons: match.reasons as VerificationReason[]
      };
    } else {
      // Custom scenario based on access state
      const acc = accessState?.status;
      if (acc === 'Unavailable') {
        simulatedRecord = {
          id: `check-${Date.now()}`,
          type: 'news_link',
          targetName: inputUrl,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          riskScore: 0,
          status: 'likely_authentic',
          verdict: 'Verification aborted. Secure platform protocol prevents automated data scraping on restricted channels.',
          recommendation: '🔒 Locked or Private Content. The system cannot perform AI inference on this link due to security protocols. Please download and upload the text/media file manually.',
          platform: detectedPlatform?.name || 'Other',
          unavailable: true,
          unavailabilityReason: 'Private content',
          reasons: []
        };
      } else if (acc === 'Unsupported') {
        simulatedRecord = {
          id: `check-${Date.now()}`,
          type: 'news_link',
          targetName: inputUrl,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          riskScore: 0,
          status: 'likely_authentic',
          verdict: 'Analytical extraction failed. Destination web host protocol stands unsupported.',
          recommendation: '⛔ Unsupported Platform. The scraper cannot find public multimedia handles on this target Web address. Please submit files directly.',
          platform: 'Other',
          unavailable: true,
          unavailabilityReason: 'Unsupported platform',
          reasons: []
        };
      } else {
        // Normal accessible custom logic
        const defaultScore = Math.floor(Math.random() * 45) + 15; // standard suspicious range
        const plat = detectedPlatform?.name || 'Other';
        simulatedRecord = {
          id: `check-${Date.now()}`,
          type: plat === 'YouTube' || plat === 'TikTok' ? 'video' : 'news_link',
          targetName: inputUrl,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          riskScore: defaultScore,
          status: defaultScore < 20 ? 'likely_authentic' : defaultScore < 60 ? 'suspicious' : 'likely_deepfake',
          verdict: `Authenticity sweep completed for public ${plat} content link. Our AI modules extracted the primary public elements and verified semantic structures.`,
          recommendation: defaultScore < 30 ? 'Low concern. Credibility indices look standard.' : 'Caution. The extracted captions contain uncorroborated claims with some language bias. Double check statements prior to sharing.',
          platform: plat,
          reasons: [
            { id: 'cust-r1', name: 'Platform API Signature Check', status: 'passed', details: `Source content is authenticated on public database logs of ${plat}.` },
            { id: 'cust-r2', name: 'Content Type Routing', status: 'passed', details: 'Correctly routed extracted components for Deepfake, image artifacts, and text factuality check.' },
            { id: 'cust-r3', name: 'Neural Fraud Search', status: 'warning', details: 'Localized noise levels look stable, but natural text classifier detected clickbait phrases.' }
          ] as VerificationReason[]
        };
      }
    }

    setResult(simulatedRecord);
    onAddHistoryItem(simulatedRecord);
  };

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

  const handleStartFileAnalysis = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStepText('Initializing local file extraction... Decompressing media header maps...');

    const fileLogs = [
      { progress: 20, text: 'Reading image header clusters and EXIF camera-sensor matrices...' },
      { progress: 45, text: 'Executing localized pixel density contrast mapping & checking for double-compression anomalies...' },
      { progress: 70, text: 'Running neural landmarks tracking and scanning for vector light gradients mismatch...' },
      { progress: 90, text: 'Drafting cryptographic proof markers and generating composite status score...' },
      { progress: 100, text: 'Finalizing media credibility report and appending telemetry registry.' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < fileLogs.length) {
        setAnalysisProgress(fileLogs[stepIdx].progress);
        setAnalysisStepText(fileLogs[stepIdx].text);
        stepIdx++;
      } else {
        clearInterval(interval);
        finalizeFileAnalysis();
      }
    }, 450);
  };

  const finalizeFileAnalysis = () => {
    setIsAnalyzing(false);

    // Look if any file match by name (preset)
    const match = FILE_PRESETS.find(f => f.name === selectedFile?.name);

    let simulatedRecord: VerificationResult;

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
      // Custom uploaded file
      const defaultScore = Math.floor(Math.random() * 40) + 10;
      const isImg = activeSubTab === 'image';
      simulatedRecord = {
        id: `check-${Date.now()}`,
        type: activeSubTab,
        targetName: selectedFile?.name || (isImg ? 'custom_image.jpg' : 'custom_video.mp4'),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        riskScore: defaultScore,
        status: defaultScore < 20 ? 'likely_authentic' : defaultScore < 55 ? 'suspicious' : 'likely_deepfake',
        verdict: `Forensic analysis complete for uploaded ${isImg ? 'image' : 'video'} asset. Noise-level scans indicate average pixel consistency with some secondary compression traces.`,
        recommendation: 'Normal warning credentials. Use caution and mutual confirmation before referencing raw web evidence.',
        size: fileSizeStr || '4.8 MB',
        platform: 'Uploaded Asset',
        reasons: [
          { id: 'uf-r1', name: 'CFA Artifact Authenticator', status: 'passed', details: 'Color array interpolation features align with standard camera sensor models.' },
          { id: 'uf-r2', name: 'High-Frequency Noise Grid', status: 'warning', details: 'Quantization ratios exhibit minor discrepancies, likely due to file format conversion.' }
        ]
      };
    }

    setResult(simulatedRecord);
    onAddHistoryItem(simulatedRecord);
  };

  const getStatusDisplay = (status: string, isUnavailable?: boolean) => {
    if (isUnavailable) {
      return {
        badgeColor: 'bg-slate-950 border border-slate-800 text-slate-400',
        text: 'Unavailable / Inaccessible Link',
        colorClass: 'text-slate-400'
      };
    }
    switch (status) {
      case 'likely_authentic':
        return {
          badgeColor: 'bg-emerald-950/20 border border-emerald-900/50 text-emerald-400',
          text: 'Likely Authentic Content',
          colorClass: 'text-emerald-400'
        };
      case 'suspicious':
        return {
          badgeColor: 'bg-amber-950/20 border border-amber-900/50 text-amber-400',
          text: 'Suspicious / Edited Content',
          colorClass: 'text-amber-450'
        };
      case 'likely_deepfake':
      default:
        return {
          badgeColor: 'bg-rose-950/20 border border-rose-900/50 text-rose-450',
          text: 'Likely Deepfake / False News Info',
          colorClass: 'text-rose-450'
        };
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto" id="verify-workspace">
      {/* Title block */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 bg-blue-950 border border-blue-900/60 rounded px-2.5 py-1 text-[11px] text-blue-400 font-mono">
          <Layers className="h-3 w-3" />
          <span>Unified Social Media Media Scanner Active</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Social Media Content Verification Console
        </h2>
        <p className="text-sm text-slate-500">
          Paste a public link from social media platforms below. The system automatically identifies the destination, verifies its access parameters, extracts public content, and routes text/imagery/video to target AI detection neural networks.
        </p>
      </div>

      {/* Verification Format Sub-Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-1.5 flex flex-wrap gap-2 text-slate-900 dark:text-slate-100 animate-fade-in" id="verify-format-tabs">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('news_link');
            setResult(null);
            setSelectedFile(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 cursor-pointer select-none ${
            activeSubTab === 'news_link'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <Globe className="h-4 w-4 text-blue-400" />
          <span>Verify Social/News Link</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('image');
            setResult(null);
            setSelectedFile(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 cursor-pointer select-none ${
            activeSubTab === 'image'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <Image className="h-4 w-4 text-blue-500" />
          <span>Verify Picture / Image</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('video');
            setResult(null);
            setSelectedFile(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 cursor-pointer select-none ${
            activeSubTab === 'video'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <Video className="h-4 w-4 text-blue-500" />
          <span>Verify Video Stream</span>
        </button>
      </div>

      {/* Grid Workspace */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: URL Paste Form & Scraper parameters */}
        <div className="lg:col-span-7 space-y-6">
          {activeSubTab === 'news_link' ? (
            <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden text-slate-900">
              {/* HUD Status Header */}
              <div className="bg-slate-950 p-4 border-b border-slate-900 text-white flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-blue-400 flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>DYNAMIC SCRAPER SHELL</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">STATUS: PORT ACTIVE</span>
              </div>

            <div className="p-6 space-y-6">
              {/* URL Input Form */}
              <div className="space-y-2.5">
                <label htmlFor="social-url-input" className="block text-xs font-mono tracking-wider uppercase text-slate-500 font-bold">
                  Paste Public Social Media URL (Facebook, YouTube, TikTok, X, Reddit, etc.)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <input
                    id="social-url-input"
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@creator/video/1234567..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white pl-11 pr-3.5 py-3 rounded-xl text-slate-800 text-sm font-medium focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Dynamic Extraction Status Hud */}
              {inputUrl.trim() && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3 animate-fade-in text-xs">
                  <h4 className="font-mono font-bold text-slate-700 tracking-wider uppercase text-[10px]">
                    🔍 URL extraction engine feedback:
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Platform identified */}
                    <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Recognized Platform:</span>
                      {detectedPlatform ? (
                        <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md text-center w-fit ${detectedPlatform.badgeColor}`}>
                          {detectedPlatform.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">None</span>
                      )}
                    </div>

                    {/* Access state detected */}
                    <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Access Status:</span>
                      {accessState ? (
                        <span className={`px-2 py-0.5 text-[11px] font-semibold border rounded-md ${accessState.color}`}>
                          {accessState.status}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">None</span>
                      )}
                    </div>
                  </div>

                  {/* Access Status Detail Advice */}
                  {accessState && (
                    <p className="text-[11px] text-slate-500 leading-normal bg-white p-2 border border-slate-100 rounded font-mono">
                      {accessState.reason}
                    </p>
                  )}

                  {/* Content type selection routing */}
                  {detectedContents.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Extracted Component Streams:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {detectedContents.map((content) => (
                          <span 
                            key={content} 
                            onClick={() => {
                              if (['Text', 'Image', 'Video'].includes(content)) {
                                setSelectedContentType(content.toLowerCase() as any);
                              }
                            }}
                            className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold cursor-pointer border ${
                              selectedContentType === content.toLowerCase() || (selectedContentType === 'all' && (content === 'Text' || content === 'Image' || content === 'Video'))
                                ? 'bg-blue-600 border-blue-500 text-white' 
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {content === 'Video' && '🎞️ '}
                            {content === 'Image' && '🖼️ '}
                            {content === 'Text' && '🔤 '}
                            {content === 'Metadata' && '🏷️ '}
                            {content === 'Thumbnail' && '🎴 '}
                            {content}
                          </span>
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400 block font-sans">
                        💡 Click component tags above to isolate analysis routing or leave defaulted.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Verified Presets List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    💡 Select Quick-Run Demo Presets
                  </span>
                  <span className="text-[10px] text-blue-600 font-mono">Multi-Platform Ready</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SOCIAL_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => selectPresetUrl(preset)}
                      className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between min-h-[76px] cursor-pointer ${
                        inputUrl === preset.url
                          ? 'border-blue-500 bg-blue-50/40 text-blue-900 ring-2 ring-blue-100'
                          : 'border-slate-150 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold block text-slate-800 font-mono text-[10px]">[{preset.platform}] Link</span>
                          <span className={`text-[8px] font-mono uppercase px-1 rounded border font-bold ${
                            preset.unavailable 
                              ? 'bg-slate-100 text-slate-500 border-slate-200' 
                              : preset.status === 'likely_authentic' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : preset.status === 'suspicious' 
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : 'bg-rose-50 text-rose-500 border-rose-100'
                          }`}>
                            {preset.unavailable ? 'Unavailable' : preset.status.replace('likely_', '')}
                          </span>
                        </div>
                        <span className="text-[11px] truncate block text-slate-600 font-mono mt-0.5">{preset.url}</span>
                      </div>
                      
                      <div className="flex items-center justify-between w-full text-[9px] text-slate-400 mt-1 font-mono">
                        <span>Analysis Routing: {preset.type.toUpperCase()}</span>
                        <span>{preset.riskScore > 0 ? `Risk: ${preset.riskScore}%` : ''}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Run Verification Button */}
              <button
                type="button"
                disabled={isAnalyzing || !inputUrl.trim() || accessState?.status === 'Unsupported' && !inputUrl.includes('tor')}
                onClick={handleStartAnalysis}
                className={`w-full py-4 rounded-xl text-white font-semibold shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  !inputUrl.trim()
                    ? 'bg-slate-350 text-slate-100 cursor-not-allowed shadow-none' 
                    : isAnalyzing 
                    ? 'bg-blue-800' 
                    : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20 hover:-translate-y-0.5'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Scraping & Synthesizing Content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 shrink-0" />
                    <span>Verify Public Social Media Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
          ) : (
            <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden text-slate-900 animate-fade-in" id="manual-forensic-card">
              {/* HUD Status Header */}
              <div className="bg-slate-950 p-4 border-b border-slate-900 text-white flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-blue-400 flex items-center space-x-1.5">
                  <UploadCloud className="h-4 w-4 text-blue-500" />
                  <span>MANUAL {activeSubTab.toUpperCase()} FORENSIC PORT</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">STATUS: INTERFACE STABLE</span>
              </div>

              <div className="p-6 space-y-6">
                {/* Drag / Drop Interactive Area */}
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
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all select-none ${
                    fileDragOver 
                      ? 'border-blue-550 border-blue-500 bg-blue-50 text-slate-900' 
                      : 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept={activeSubTab === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const fileObj = e.target.files[0];
                        setSelectedFile({ name: fileObj.name, size: (fileObj.size / (1024 * 1024)).toFixed(1) + ' MB' });
                        setFileSizeStr((fileObj.size / (1024 * 1024)).toFixed(1) + ' MB');
                        setResult(null);
                      }
                    }}
                  />
                  <UploadCloud className="h-11 w-11 mx-auto text-blue-500 mb-3" />
                  <span className="block text-sm font-bold text-slate-800">
                    {selectedFile ? 'Change Selected Asset' : `Drag & drop your ${activeSubTab === 'image' ? 'photograph' : 'raw video'} here`}
                  </span>
                  <span className="block text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Supports high-resolution {activeSubTab === 'image' ? 'PNG, WebP, JPG up to 25MB' : 'MP4, MOV, MKV up to 100MB'} formats.
                  </span>
                </div>

                {/* Show Currently Selected/Staged File */}
                {selectedFile && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex items-center justify-between text-xs font-mono text-white animate-fade-in shadow-inner">
                    <div className="flex items-center space-x-3">
                      {activeSubTab === 'image' ? (
                        <Image className="h-5 w-5 text-blue-400 shrink-0" />
                      ) : (
                        <Video className="h-5 w-5 text-blue-400 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="block font-bold text-slate-200 truncate max-w-[210px]">{selectedFile.name}</span>
                        <span className="text-slate-550 text-[10px] block mt-0.5">{selectedFile.size} • Staged for neural checking</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setResult(null);
                      }}
                      className="text-[10px] text-rose-450 hover:text-rose-400 bg-rose-950/20 px-2.5 py-1 rounded border border-rose-900/30 shrink-0"
                    >
                      Clear File
                    </button>
                  </div>
                )}

                {/* Staged Presets */}
                <div className="space-y-3">
                  <span className="block text-xs font-mono font-bold tracking-wider uppercase text-slate-400">
                    💡 Select Quick-Run Demo Media Presets
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FILE_PRESETS.filter(p => p.type === activeSubTab).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedFile({ name: preset.name, size: preset.size });
                          setFileSizeStr(preset.size);
                          setResult(null);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-[82px] cursor-pointer select-none ${
                          selectedFile?.name === preset.name
                            ? 'bg-blue-50 border-blue-400 text-slate-900 shadow-sm'
                            : 'bg-slate-50/50 hover:bg-slate-55/75 border-slate-150 hover:border-slate-250 text-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between w-full space-x-1">
                          <span className="text-xs font-bold truncate block decoration-slate-400 max-w-[130px]">{preset.name}</span>
                          <span className={`text-[8.5px] uppercase font-mono font-black border px-1.5 rounded ${
                            preset.status === 'likely_authentic' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : preset.status === 'suspicious' 
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : 'bg-rose-50 text-rose-550 border-rose-100'
                          }`}>
                            {preset.status.replace('likely_', '')}
                          </span>
                        </div>
                        <span className="text-[11px] truncate block text-slate-650 font-mono mt-0.5">{preset.size} • Local Backup Reference</span>
                        
                        <div className="flex items-center justify-between w-full text-[9px] text-slate-400 mt-1 font-mono">
                          <span>Metadata: EXIF ACTIVE</span>
                          <span>Risk: {preset.riskScore}%</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verify Trigger Button */}
                <button
                  type="button"
                  disabled={isAnalyzing || !selectedFile}
                  onClick={handleStartFileAnalysis}
                  className={`w-full py-4 rounded-xl text-white font-semibold shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    !selectedFile
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-250 shadow-none' 
                      : isAnalyzing 
                      ? 'bg-blue-805 bg-blue-800' 
                      : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20 hover:-translate-y-0.5'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Extracting Frames & Analyzing Metadata...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 shrink-0" />
                      <span>Start Media Forensic Verification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Scope notice banner */}
          <div className="bg-blue-900/10 border border-blue-900/40 rounded-xl p-4.5 text-slate-350 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-blue-300 font-mono font-bold uppercase tracking-wide">
              <BadgeInfo className="h-4 w-4 text-blue-400" />
              <span>Public Scope Limitations Notice</span>
            </div>
            <p className="leading-relaxed">
              TrustLens acts as a public-facing forensic framework. It evaluates raw data structures, visual noise inconsistencies, semantic indicators, and temporal frame alignment. The platform is engineered to evaluate public content only and does not promise perfect truth verification; always verify physical state media prior to making critical narrative conclusions.
            </p>
          </div>
        </div>

        {/* Right Side: Active loading spinner or deep verification results */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Loader screen */}
          {isAnalyzing && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6 animate-pulse">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">SCRAPER ENGINE PUMP ACTIVE</span>
                <span className="text-sm font-mono text-blue-300 font-bold">{analysisProgress}%</span>
              </div>
              
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-305"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block animate-ping"></span>
                  <span>CURRENT HOOK:</span>
                </div>
                <p className="text-xs font-mono text-slate-300 leading-relaxed min-h-[36px]">
                  {analysisStepText}
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-wider">
                SCRAPING ENVIRONMENT PROTECTED BY EXIF-AES SECURITIES
              </div>
            </div>
          )}

          {/* 2. Ideal default state */}
          {!isAnalyzing && !result && (
            <div className="bg-white border border-slate-150 rounded-2xl p-8 text-center space-y-4 text-slate-950">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                <BarChart2 className="h-7 w-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-800">Scraper Diagnostics Pending</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Provide a valid social media URL link or trigger one of our active demo platform presets on the left. TrustLens will inspect destination availability and perform deep analytical scans.
                </p>
              </div>
            </div>
          )}

          {/* 3. Detailed Forensic Results */}
          {!isAnalyzing && result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-white shadow-xl animate-fade-in space-y-6 p-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display font-semibold text-white text-base">Credibility Findings</h3>
                  <p className="text-[10px] font-mono text-slate-400">UID: {result.id} • {result.date}</p>
                </div>
                <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-mono text-[10px] text-blue-400">
                  {result.platform ? result.platform.toUpperCase() : 'WEB'} SCAVENGER
                </div>
              </div>

              {/* ACCESS STATUS AND ACC_AVAILABILITY HANDLING */}
              {result.unavailable ? (
                /* Clear unavailable status layout instead of fake mock evaluation scores */
                <div className="space-y-4 animate-fade-in" id="unavailable-status-box">
                  <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-rose-450 font-mono font-bold text-xs uppercase tracking-wider">
                      <Lock className="h-4 w-4 shrink-0" />
                      <span>URL INACCESSIBLE / RESTRICTED</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      This content is not publicly indexable. The reference URL is flagged under: <span className="text-rose-400 font-bold font-mono">[{result.unavailabilityReason || 'Restricted Content'}]</span>.
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Our system enforces ethical scraping protocols. Private stories, restricted group databases, and illegal TOR networks cannot be read.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-xs">
                    <span className="font-mono font-bold text-slate-400 uppercase tracking-widest text-[9px] block">Alternative Solution</span>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      To verify this asset, please download the original image or video file directly onto your secure hardware. Once saved, upload the raw file to the platform from Home for localized pixel-noise and voice cloning audits.
                    </p>
                  </div>

                  {/* History saving tag indicator */}
                  <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded">
                    <CheckCircle className="h-3 w-3 text-slate-500" />
                    <span>Inaccessible query logged to local history</span>
                  </div>
                </div>
              ) : (
                /* Successful accessible results layout */
                <div className="space-y-6">
                  {/* Rating indicator */}
                  <div className="grid grid-cols-12 gap-4 items-center bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <div className="col-span-5 text-center border-r border-slate-850 pr-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Risk Score</span>
                      <div>
                        <span className={`text-3xl font-display font-black tracking-tight ${
                          result.riskScore < 20 
                            ? 'text-emerald-400' 
                            : result.riskScore < 70 
                            ? 'text-amber-400' 
                            : 'text-rose-400'
                        }`}>
                          {result.riskScore}%
                        </span>
                      </div>
                    </div>

                    <div className="col-span-7 pl-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Forensic Status</span>
                      <div className={`p-1.5 rounded-lg border text-[10px] font-bold text-center uppercase tracking-wider font-mono ${
                        result.status === 'likely_authentic' 
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400'
                          : result.status === 'suspicious'
                          ? 'bg-amber-950/20 border-amber-800/40 text-amber-400'
                          : 'bg-rose-950/20 border-rose-850/45 text-rose-400'
                      }`}>
                        {getStatusDisplay(result.status).text}
                      </div>
                    </div>
                  </div>

                  {/* Prediction, platform, content type */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                    <div className="bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-slate-500 block text-[9px] uppercase">Platform</span>
                      <span className="font-bold text-slate-200">{result.platform}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-slate-500 block text-[9px] uppercase">Core Routing</span>
                      <span className="font-bold text-slate-200">{result.type.toUpperCase()}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-slate-500 block text-[9px] uppercase">Confidence</span>
                      <span className="font-bold text-blue-400">{100 - result.riskScore}%</span>
                    </div>
                  </div>

                  {/* Verdict block */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Primary Verdict</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/50 p-3 rounded-lg border border-slate-850">
                      {result.verdict}
                    </p>
                  </div>

                  {/* MULTI_CONTENT DISPLAY BLOCK WITH HEAVY VIDEO DEEPFAKE EMBELLISHMENTS */}
                  {/* Social media URLs contain text (captions), image (thumbnails/graphics) and videos. Highlight Video! */}
                  <div className="space-y-3.5 pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">Routed Content Analysis</span>
                    
                    <div className="space-y-3">
                      {/* 1. Video analysis (Always Highlighted & Largest as requested: deepfake is main focus) */}
                      {(result.type === 'video' || result.platform === 'TikTok' || result.platform === 'YouTube') && (
                        <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-blue-950 p-4 rounded-xl border border-blue-900/60 shadow-md ring-1 ring-blue-500/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center space-x-1.5 text-xs text-blue-300 font-bold tracking-wide uppercase">
                              <Video className="h-4.5 w-4.5 text-blue-400 shrink-0" />
                              <span>🎞️ Video Analysis Module (Deepfake Core)</span>
                            </span>
                            <span className="text-[9px] font-mono uppercase bg-blue-900 text-white px-1.5 rounded font-black">CRITICAL CHECK</span>
                          </div>
                          
                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-xs text-slate-300 space-y-1.5">
                            <p className="leading-relaxed">
                              {result.status === 'likely_deepfake' 
                                ? '⚠️ Cloned acoustic structures (DeepVoice) identified relative to viseme facial coordinates. Neural temporal maps detected sub-pixel masking edges.'
                                : '✔️ Frame sequence stability confirmed. No anomalous GAN-model mesh overlays mapped in standard timeline.'}
                            </p>
                            <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-400 font-mono flex justify-between">
                              <span>Temporal consistency: {result.status === 'likely_deepfake' ? 'Anomalous' : 'Normalized'}</span>
                              <span>Voice spectrum: {result.status === 'likely_deepfake' ? 'AI Synthesizer' : 'Organic'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Text analysis */}
                      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 text-xs space-y-2">
                        <span className="flex items-center space-x-1.5 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                          <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>🔤 Text Analysis (Fake News Scans)</span>
                        </span>
                        <p className="text-slate-400 leading-relaxed text-[11px] bg-slate-900 p-2 rounded text-left">
                          {result.status === 'likely_deepfake' || result.status === 'suspicious'
                            ? 'Detected high lexical complexity, emotional click-seeking phrases, and absence of verifiable peer publications in mainstream news databases.'
                            : 'Vocabulary metrics utilize direct, descriptive, neutral informative parameters. Domain matches official press channels.'}
                        </p>
                      </div>

                      {/* 3. Image analysis */}
                      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 text-xs space-y-2">
                        <span className="flex items-center space-x-1.5 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                          <Image className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>🖼️ Image Analysis (Visual Edits Scans)</span>
                        </span>
                        <p className="text-slate-400 leading-relaxed text-[11px] bg-slate-900 p-2 rounded text-left">
                          {result.status === 'likely_deepfake' || result.status === 'suspicious'
                            ? 'Boundary evaluation flags localized lighting and specular anomalies. Compression indices suggest manual re-saving via graphic software.'
                            : 'Spatial noise levels stand highly correlated. SPEC reflection points in the eye pupils correspond securely.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Technical evidentiary rule markers */}
                  {result.reasons && result.reasons.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block">Neural Rules Checklist</span>
                      <div className="space-y-2">
                        {result.reasons.map((reason) => (
                          <div key={reason.id} className="bg-slate-950 p-3 rounded-lg border border-slate-850/60 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-200">{reason.name}</span>
                              <span className={`text-[8px] font-mono uppercase px-1.5 rounded border font-bold ${
                                reason.status === 'passed'
                                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50'
                                  : 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                              }`}>
                                {reason.status}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              {reason.details}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation and saved tag */}
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-dashed border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                      <div className="flex items-center space-x-1">
                        <ShieldAlert className="h-3.5 w-3.5 text-blue-500" />
                        <span>Security Advice</span>
                      </div>
                      <span className="text-emerald-500 font-semibold flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 shrink-0" />
                        <span>Analysis Saved to History</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
