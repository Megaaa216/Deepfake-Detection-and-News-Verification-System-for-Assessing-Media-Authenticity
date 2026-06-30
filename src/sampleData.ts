import { VerificationResult, ActivityTrend, Stats } from './types';

export const INITIAL_HISTORY: VerificationResult[] = [
  {
    id: 'check-101',
    type: 'image',
    targetName: 'https://www.instagram.com/p/C6xD_u0ys8Q/defense_minister.jpg',
    date: '2026-06-12 14:32',
    riskScore: 8,
    status: 'likely_authentic',
    verdict: 'The media segment extracted from Instagram shows high authenticity characteristics consistent with genuine imagery.',
    recommendation: 'Low concern. The file shows standard camera compression artifacts, consistent light source vectors, and realistic structural patterns.',
    size: '3.4 MB',
    platform: 'Instagram',
    reasons: [
      { id: 'img-p1', name: 'Facial Synthesis Integrity', status: 'passed', details: 'No generative adversarial network (GAN) artifacts detected in critical facial regions or around transition edges.' },
      { id: 'img-p2', name: 'Bi-level Noise Consistency', status: 'passed', details: 'Sensor noise levels are uniform across all image segments, indicating no localized copy-paste or paint actions.' },
      { id: 'img-p3', name: 'Specular Lighting & Reflections', status: 'passed', details: 'Reflections in active corneal segments and smooth surfaces align precisely with light sources in the scene geometry.' },
      { id: 'img-p4', name: 'EXIF Metadata Analysis', status: 'passed', details: 'Embedded metadata contains standard camera tags, lens profiles, and high-fidelity markers matching the original press brief.' }
    ]
  },
  {
    id: 'check-102',
    type: 'news_link',
    targetName: 'https://x.com/Reuters/status/180239105183',
    date: '2026-06-12 11:15',
    riskScore: 3,
    status: 'likely_authentic',
    verdict: 'Highly credible journalistic text shared on X (formerly Twitter), validated by independent, high-reputation channels.',
    recommendation: 'Reliable. The news claim corresponds to official press statements. You can read and reference this post with high confidence.',
    sourceCategory: 'Mainstream news',
    platform: 'X',
    reasons: [
      { id: 'news-p1', name: 'Cross-Source Mutual Validation', status: 'passed', details: 'Topic and core quotes are verified across 8 other highly respected independent international agencies including AP and Bloomberg.' },
      { id: 'news-p2', name: 'Domain Integrity & Age', status: 'passed', details: 'X verified account corresponds to Reuters, which stands as a primary authenticated global press entity.' },
      { id: 'news-p3', name: 'Semantic Neutrality', status: 'passed', details: 'The vocabulary and syntactic phrasing utilize standard informative journalism with zero inflammatory modifiers or sensationalist structures.' },
      { id: 'news-p4', name: 'Fact-Check Registry Correspondence', status: 'passed', details: 'Database searches in IFCN network verify that the main event claims contain active confirmation and zero disputes.' }
    ]
  },
  {
    id: 'check-103',
    type: 'video',
    targetName: 'https://www.tiktok.com/@finance_trends/video/732890184',
    date: '2026-06-11 18:22',
    riskScore: 89,
    status: 'likely_deepfake',
    verdict: 'Significant visual and audio-visual temporal inconsistencies identify this TikTok clip as a synthesized deepfake.',
    recommendation: 'Critical Concern. Do not distribute. The target video displays severe digital face transplant and cloned voice lip sync modification.',
    size: '14.8 MB',
    duration: '0:32',
    platform: 'TikTok',
    reasons: [
      { id: 'vid-f1', name: 'Phoneme-Viseme Discrepancy', status: 'failed', details: 'Wavelength spectrum analysis of speech sounds registers a 140ms latency delay relative to facial lip muscle transitions.' },
      { id: 'vid-f2', name: 'Temporal Edge Blending', status: 'failed', details: 'Sub-pixel tracking reveals standard neural mask blending borders around the eyebrows and nasolabial folds, flashing on alternate keyframes.' },
      { id: 'vid-f3', name: 'Ocular Micro-movement Check', status: 'failed', details: 'Corneal gaze angles remain fixed and eyes exhibit a lack of standard biological saccades (micro-movements) over extended speech loops.' },
      { id: 'vid-f4', name: 'Spectral Pattern Noise', status: 'failed', details: 'High-frequency component analysis detects localized Fourier Transform anomalies standard in video upscaling GAN frameworks.' }
    ],
    flagged_frames: [
      { frame_id: '048', image_name: 'frame_01.jpg', verdict: 'AUTHENTIC', details: 'Specular reflections correct. Standard iris contours verified.' },
      { frame_id: '192', image_name: 'frame_02.jpg', verdict: 'AUTHENTIC', details: 'Normal jaw mesh locking verified. Face boundaries intact.' },
      { frame_id: '336', image_name: 'frame_03.jpg', verdict: 'FAKE', details: 'SUSPICIOUS: 140ms lip audio delay. Mesh vertex jitter.' },
      { frame_id: '528', image_name: 'frame_04.jpg', verdict: 'FAKE', details: 'SUSPICIOUS: Frame interpolation anomalies near cheek boundaries.' }
    ]
  },
  {
    id: 'check-104',
    type: 'news_link',
    targetName: 'https://www.facebook.com/patriotnewsreport/posts/2918839218',
    date: '2026-06-10 09:24',
    riskScore: 76,
    status: 'suspicious',
    verdict: 'This Facebook post originated from an unverified, sensationalist network utilizing clickbait text to spread unconfirmed claims.',
    recommendation: 'Verify prior to sharing. Treat claims with healthy skepticism. Search for corroborating peer-reviewed reports on trusted channels.',
    sourceCategory: 'Unverified blog',
    platform: 'Facebook',
    reasons: [
      { id: 'news-w1', name: 'Source Network Status', status: 'failed', details: 'The hosting domain is classified as a clickbait-monetized network. The Facebook page publisher profile has high reports history.' },
      { id: 'news-w2', name: 'Hyperbolic/Sensational Syntax', status: 'warning', details: 'Post utilizes loaded adjectives like "MIRACLE CLAIMS" and "SHOCKING COVERUP" to provoke strong emotional engagement.' },
      { id: 'news-w3', name: 'Absence of Reliable Corroboration', status: 'failed', details: 'Zero reputable global science indices or trusted local news channels have verified or mentioned this alleged breakthrough.' },
      { id: 'news-w4', name: 'Aggressive Ad-to-Content Ratio', status: 'warning', details: 'Page structure linked in post contains intensive pop-up ads and tracking scripts, typical of low-quality monetary arbitrage farms.' }
    ]
  },
  {
    id: 'check-105',
    type: 'image',
    targetName: 'https://www.reddit.com/r/pics/comments/senator_briefing/senator_handshake.png',
    date: '2026-06-09 15:44',
    riskScore: 61,
    status: 'suspicious',
    verdict: 'Local structural anomalies in this Reddit image suggest potential image modification around joint borders and handshake contact segments.',
    recommendation: 'Suspicious. Check other live images from this event. Localized blurring, missing shadows, and edge artifacts suggest manual image compositing.',
    size: '1.9 MB',
    platform: 'Reddit',
    reasons: [
      { id: 'img-w1', name: 'Boundary Occlusion Profiles', status: 'warning', details: 'Localized edge sharpness varies abnormally. The handshake boundary exhibits localized gaussian blurring, indicative of manual blending.' },
      { id: 'img-w2', name: 'Geometric Shadow Vectors', status: 'failed', details: 'The light casting from the figures contradicts the ambient background source vectors. Cast shadows of fingers are physically inconsistent.' },
      { id: 'img-w3', name: 'Color Channel Consistency', status: 'passed', details: 'Chrominance channels correspond correctly throughout the skin-tone registers, showing no drastic patch-wise disparities.' },
      { id: 'img-w4', name: 'Metadata Discrepancy', status: 'warning', details: 'EXIF segments indicate the image file was processed and saved via desktop image editing environments (Adobe Photoshop) prior to posting.' }
    ]
  },
  {
    id: 'check-106',
    type: 'video',
    targetName: 'https://www.youtube.com/watch?v=mars_rover_alien_leak_footage',
    date: '2026-06-08 22:11',
    riskScore: 95,
    status: 'likely_deepfake',
    verdict: 'This viral YouTube video leverages computer-generated graphic (CGI) overlays and synthetically simulated terrain tracks to depict fabricated events.',
    recommendation: 'Extreme danger of misinformation. Do not share. This viral sequence is structurally fabricated utilizing virtual simulation software.',
    size: '28.1 MB',
    duration: '1:10',
    platform: 'YouTube',
    reasons: [
      { id: 'vid-ff1', name: '3D Mesh Projection Drift', status: 'failed', details: 'The tracking coordinates of the moving asset drift off the ground plane mesh constraint, indicating a post-process overlay.' },
      { id: 'vid-ff2', name: 'Physical Lighting Falloff', status: 'failed', details: 'The simulated light intensity across the dynamic asset surface fails to register secondary inverse-square law falloff characteristics.' },
      { id: 'vid-ff3', name: 'Compression Block Anomalies', status: 'warning', details: 'Heavy variable block-size compression was applied specifically around the unknown dynamic structure to conceal sharp rendering lines.' },
      { id: 'vid-ff4', name: 'Official Archive Cross-Check', status: 'failed', details: 'The frame hash does not register on space agency public catalog indexes matching any telemetry timestamps for active rovers.' }
    ]
  },
  {
    id: 'check-107',
    type: 'video',
    targetName: 'https://www.instagram.com/p/private_restricted_story/',
    date: '2026-06-07 10:14',
    riskScore: 0,
    status: 'likely_authentic',
    verdict: 'This content cannot be verified because it is restricted or private.',
    recommendation: 'Access Restricted. The URL corresponds to a private or locked account on Instagram. To verify this asset, please download and upload the file manually.',
    platform: 'Instagram',
    unavailable: true,
    unavailabilityReason: 'Private content',
    reasons: []
  },
  {
    id: 'check-108',
    type: 'news_link',
    targetName: 'https://some-obscure-illegal-forum.tor/threads/conspiracy',
    date: '2026-06-06 19:45',
    riskScore: 0,
    status: 'likely_authentic',
    verdict: 'The system cannot retrieve content from this untrusted or unsupported platform.',
    recommendation: 'Unsupported Platform. Standard scraper systems cannot securely hook into this specialized protocol or network.',
    platform: 'Other',
    unavailable: true,
    unavailabilityReason: 'Unsupported platform',
    reasons: []
  }
];

export const INITIAL_STATS: Stats = {
  totalChecks: 247,
  trustedCount: 154,
  suspiciousCount: 55,
  highRiskCount: 38
};

export const WEEKLY_ACTIVITY: ActivityTrend[] = [
  { day: 'Mon', mediaChecks: 12, linkChecks: 15 },
  { day: 'Tue', mediaChecks: 18, linkChecks: 22 },
  { day: 'Wed', mediaChecks: 28, linkChecks: 31 },
  { day: 'Thu', mediaChecks: 22, linkChecks: 19 },
  { day: 'Fri', mediaChecks: 35, linkChecks: 40 },
  { day: 'Sat', mediaChecks: 14, linkChecks: 18 },
  { day: 'Sun', mediaChecks: 19, linkChecks: 25 }
];

export const MOCK_SCENARIOS = {
  image: [
    {
      targetName: 'military_parade_assembly.jpg',
      riskScore: 11,
      status: 'likely_authentic',
      verdict: 'The image displays authentic physical properties, uniform sensory signature, and unmanipulated geometric bounds.',
      recommendation: 'Low concern. Pixel properties conform perfectly to the sensor array size, showing standard photojournalism output with intact metadata structural lines.',
      reasons: [
        { id: 'sc-i1', name: 'No Generative Pattern Identifiers', status: 'passed', details: 'Neural network probe signals returned clean results. Zero indicators of GAN, Stable Diffusion, or Midjourney structures.' },
        { id: 'sc-i2', name: 'Lighting Vector Mapping', status: 'passed', details: 'Primary light ray models match standard outdoor solar azimuth angles for the reported timestamp and location coordinates.' },
        { id: 'sc-i3', name: 'Consistent Noise Matrix', status: 'passed', details: 'Statistical noise distribution is uniform throughout the image. No signs of paint overlays, digital smoothing, or feather edits.' }
      ],
      size: '5.1 MB'
    },
    {
      targetName: 'world_summit_unplanned_clash.png',
      riskScore: 84,
      status: 'likely_deepfake',
      verdict: 'Target image contains significant localized high-frequency visual discontinuities in face-to-neck blend interfaces.',
      recommendation: 'Critical concern. This image contains fabricated elements. Do not distribute. The faces on the participants were synthetically swapped.',
      reasons: [
        { id: 'sc-i4', name: 'Mismatched Eye Specular Reflections', status: 'failed', details: 'Luminance reflection points in the eye pupils have non-corresponding angles, confirming artificial portrait generation.' },
        { id: 'sc-i5', name: 'Digital Face Swap Overlap Edge', status: 'failed', details: 'Sub-pixel contour evaluation detects a continuous boundary margin of reduced noise density wrapping the outer facial perimeter.' },
        { id: 'sc-i6', name: 'EXIF Metadata Absence', status: 'warning', details: 'All device, focal, and temporal EXIF header directories were fully stripped, which is standard in web generator script channels.' }
      ],
      size: '2.8 MB'
    },
    {
      targetName: 'protest_crowd_emergency_evac.webp',
      riskScore: 57,
      status: 'suspicious',
      verdict: 'This photo contains signs of copy-paste duplicate patterns, suggesting a crowd size enhancement edit.',
      recommendation: 'Suspicious. Check reports from alternative witnesses. Portions of the crowd density seem synthetically multiplied and duplicated.',
      reasons: [
        { id: 'sc-i7', name: 'Duplicate Block Spotting', status: 'failed', details: 'Advanced pattern comparison detected four identical sub-pixel clusters of people in different areas of the same picture.' },
        { id: 'sc-i8', name: 'Mismatched Focus Depth', status: 'warning', details: 'Individual features in the far background show crisp spatial high-end edges while mid-ground assets are normally lens-blurred.' },
        { id: 'sc-i9', name: 'Compressed Block Noise Ratio', status: 'passed', details: 'Overall file compression matches modern web scaling algorithms which does not explicitly indicate an adversarial attack.' }
      ],
      size: '1.2 MB'
    }
  ],
  video: [
    {
      targetName: 'president_security_briefing_raw.mp4',
      riskScore: 6,
      status: 'likely_authentic',
      verdict: 'Temporal stability check shows no dynamic facial warping, and audio matching aligns flawlessly across the full duration.',
      recommendation: 'Low concern. Video streams contain clean temporal noise transitions, constant compression block structure, and aligned audio.',
      reasons: [
        { id: 'sc-v1', name: 'Frame To Frame Consistency', status: 'passed', details: 'Dynamic visual differences between consecutive frames are normal, with zero pixel position jumps or mask-edge shifts.' },
        { id: 'sc-v2', name: 'Lip Synchronization Mapping', status: 'passed', details: 'The movement curves of mouth muscles match the physical phonetic components of the spoken track with less than 20ms delta.' },
        { id: 'sc-v3', name: 'Natural Micro-expression Vectors', status: 'passed', details: 'The system detected authentic facial blinking, micro-ticks of muscles, and genuine pupil contractions mapping naturally to ambient lighting.' }
      ],
      size: '22.4 MB',
      duration: '0:45'
    },
    {
      targetName: 'leak_whistleblower_confession.mp4',
      riskScore: 92,
      status: 'likely_deepfake',
      verdict: 'Phonemic analysis indicates synthetic voice cloning, paired with visible facial replacement masking standard in DeepFaceLab.',
      recommendation: 'Highly suspicious. Digital voice synthesizer and deepfake portrait replacement are present. Confirm with primary source networks.',
      reasons: [
        { id: 'sc-v4', name: 'Neural Voice Synthesis Detection', status: 'failed', details: 'High-frequency resonance analysis flags artificial voice synthesis. The speech pattern has uniform breathing tempos and synthesized formants.' },
        { id: 'sc-v5', name: 'Boundary Mask Warp Detection', status: 'failed', details: 'During rapid rotation of the speaker head, facial features distort slightly relative to the background ear and neck geometry.' },
        { id: 'sc-v6', name: 'Missing Biological Saccades', status: 'warning', details: 'The biological blinking rate is 86% below natural baseline levels, and pupil size remains perfectly fixed regardless of screen illumination changes.' }
      ],
      size: '18.1 MB',
      duration: '0:35'
    }
  ],
  news_link: [
    {
      targetName: 'https://www.bbc.co.uk/news/world-europe-regional-cooperation-economic-stimulus.html',
      riskScore: 2,
      status: 'likely_authentic',
      verdict: 'This URL represents a premier credible source domain with highly verified editorial safeguards and wide-scale peer replication.',
      recommendation: 'Highly Credible. Verified as standard quality journalism based on long-term domain reputation whitelist and clear cross-citation.',
      sourceCategory: 'Mainstream news',
      reasons: [
        { id: 'sc-n1', name: 'Approved Domain Authority', status: 'passed', details: 'The host domain bbc.co.uk is registered on the global elite journalism registry with high reputation. Zero malicious proxy profiles found.' },
        { id: 'sc-n2', name: 'Active Press Association Records', status: 'passed', details: 'The core statements, quotes, and timeline conform directly to transcripts distributed directly by the central European Press Agency.' },
        { id: 'sc-n3', name: 'Objective Rhetoric Scoring', status: 'passed', details: 'Natural language analysis outputs highly information-centric content with professional, neutral modifiers, avoiding clickbait rhetoric.' }
      ]
    },
    {
      targetName: 'https://www.patriot-truth-network-report.org/breaking-secret-compound-in-water-supply-causes-mass-hypnosis.html',
      riskScore: 94,
      status: 'likely_deepfake', // In this system used as likely fake / false news
      verdict: 'Extreme lack of factual backing, freshly registered network source, and highly inflammatory rhetoric indicate engineered misinformation.',
      recommendation: 'Do NOT share. The article represents an orchestrated misinformation narrative utilizing false scientific authorities.',
      sourceCategory: 'Conspiracy blog',
      reasons: [
        { id: 'sc-n4', name: 'Unregistered & High Risk Network Domain', status: 'failed', details: 'The domain was set up only 12 days ago in an offshore privacy registry with no associated staff, physical offices, or publishing history.' },
        { id: 'sc-n5', name: 'Absolute Isolation Score', status: 'failed', details: 'Zero reports about the water supply concern are indexed by official municipal databases, scientific groups, or mainstream reporters.' },
        { id: 'sc-n6', name: 'Sensational Adjective Aggression', status: 'failed', details: 'Sentiment classifier flags a high-danger concentration of emotive conspiracy trigger terms ("DEATH COVERUP", "TRUTH REVEALED", "SECRET ELITES").' }
      ]
    },
    {
      targetName: 'https://www.finance-daily-insider-blog.com/new-laws-to-confiscate-personal-vehicles-by-august.html',
      riskScore: 71,
      status: 'suspicious',
      verdict: 'Clickbait article misrepresenting a preliminary regional study as an active legislation. High danger of misinterpretation.',
      recommendation: 'High risk of hyperbole. Read carefully. The article takes draft research slides entirely out of context to generate fear clicks.',
      sourceCategory: 'Unverified blog',
      reasons: [
        { id: 'sc-n7', name: 'Article Context Distortion Check', status: 'failed', details: 'Cross-comparison with original policy documents indicates a massive divergence between original research scope and this blog post assertions.' },
        { id: 'sc-n8', name: 'Domain History Flag', status: 'warning', details: 'The host domain has changed focus 3 times in the last year, switching from crypto sales to local politics to general health claims.' },
        { id: 'sc-n9', name: 'Out-of-Jurisdiction Sourcing', status: 'warning', details: 'Claims reference state acts but cite a completely different country legal terminology, indicating copy-paste template fabrication.' }
      ]
    }
  ]
};
