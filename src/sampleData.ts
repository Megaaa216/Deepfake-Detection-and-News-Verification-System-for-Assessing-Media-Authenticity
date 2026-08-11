import { VerificationResult, ActivityTrend, Stats } from './types';

export const INITIAL_HISTORY: VerificationResult[] = [
  {
    id: 'check-101',
    type: 'video',
    targetName: 'https://www.youtube.com/watch?v=official_press_briefing_2026',
    date: '2026-06-12 14:32',
    riskScore: 8,
    status: 'likely_authentic',
    summary: 'Authentic Media Profile Verified (8.0% risk score). Evaluated 128 keyframes. ResNeXt50+LSTM spatial feature maps confirmed natural frame-to-frame spatial consistency, high facial landmark alignment, and authentic motion vectors.',
    recommended_action: 'Low concern (8.0% risk index). Media asset exhibits natural facial muscle dynamics, coherent spatial lighting, and authentic temporal frame transitions.',
    verdict: 'Authentic Media Profile Verified (8.0% risk score). Evaluated 128 keyframes. ResNeXt50+LSTM spatial feature maps confirmed natural frame-to-frame spatial consistency, high facial landmark alignment, and authentic motion vectors.',
    recommendation: 'Low concern (8.0% risk index). Media asset exhibits natural facial muscle dynamics, coherent spatial lighting, and authentic temporal frame transitions.',
    size: '18.4 MB',
    duration: '0:45',
    platform: 'YouTube',
    reasons: [
      { id: 'vid-p1', name: 'Facial Synthesis Integrity', status: 'passed', details: 'No generative adversarial network (GAN) artifacts detected in critical facial regions or around transition edges.' },
      { id: 'vid-p2', name: 'Bi-level Noise Consistency', status: 'passed', details: 'Sensor noise levels are uniform across keyframes, indicating no localized facial manipulation.' },
      { id: 'vid-p3', name: 'Specular Lighting & Reflections', status: 'passed', details: 'Reflections in active corneal segments and facial lighting align precisely with scene geometry.' },
      { id: 'vid-p4', name: 'Temporal Motion Vectors', status: 'passed', details: 'Frame-to-frame motion vectors remain coherent with zero micro-flickering anomalies.' }
    ]
  },
  {
    id: 'check-103',
    type: 'video',
    targetName: 'https://www.facebook.com/watch/?v=732890184_synthetic_speech',
    date: '2026-06-11 18:22',
    riskScore: 89,
    status: 'likely_deepfake',
    summary: 'High Risk Deepfake Detected (89.0% anomaly score). Evaluated 128 keyframes. ResNeXt50+LSTM spatial feature maps detected localized facial mesh warp, boundary jitter, and inter-frame temporal anomalies.',
    recommended_action: 'Critical concern. High likelihood of synthetic facial manipulation (89.0% risk index). Do not disseminate or publish without secondary forensic verification.',
    verdict: 'High Risk Deepfake Detected (89.0% anomaly score). Evaluated 128 keyframes. ResNeXt50+LSTM spatial feature maps detected localized facial mesh warp, boundary jitter, and inter-frame temporal anomalies.',
    recommendation: 'Critical concern. High likelihood of synthetic facial manipulation (89.0% risk index). Do not disseminate or publish without secondary forensic verification.',
    size: '14.8 MB',
    duration: '0:32',
    platform: 'Facebook',
    reasons: [
      { id: 'vid-f1', name: 'Phoneme-Viseme Discrepancy', status: 'failed', details: 'Wavelength spectrum analysis of speech sounds registers a 140ms latency delay relative to facial lip muscle transitions.' },
      { id: 'vid-f2', name: 'Temporal Edge Blending', status: 'failed', details: 'Sub-pixel tracking reveals neural mask blending borders around the eyebrows and nasolabial folds.' },
      { id: 'vid-f3', name: 'Ocular Micro-movement Check', status: 'failed', details: 'Corneal gaze angles remain fixed and eyes exhibit a lack of standard biological saccades over extended speech loops.' },
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
    id: 'check-106',
    type: 'video',
    targetName: 'https://www.youtube.com/watch?v=mars_rover_deepfake_simulation',
    date: '2026-06-08 22:11',
    riskScore: 95,
    status: 'likely_deepfake',
    summary: 'High Risk Deepfake Detected (95.0% anomaly score). Evaluated 128 keyframes. ResNeXt50+LSTM spatial feature maps detected localized facial mesh warp, boundary jitter, and inter-frame temporal anomalies.',
    recommended_action: 'Extreme danger of misinformation. Do not share. This viral sequence is structurally fabricated utilizing virtual simulation software.',
    verdict: 'High Risk Deepfake Detected (95.0% anomaly score). Evaluated 128 keyframes. ResNeXt50+LSTM spatial feature maps detected localized facial mesh warp, boundary jitter, and inter-frame temporal anomalies.',
    recommendation: 'Extreme danger of misinformation. Do not share. This viral sequence is structurally fabricated utilizing virtual simulation software.',
    size: '28.1 MB',
    duration: '1:10',
    platform: 'YouTube',
    reasons: [
      { id: 'vid-ff1', name: '3D Mesh Projection Drift', status: 'failed', details: 'The tracking coordinates of the moving asset drift off the ground plane mesh constraint, indicating a post-process overlay.' },
      { id: 'vid-ff2', name: 'Physical Lighting Falloff', status: 'failed', details: 'The simulated light intensity across the dynamic asset surface fails to register secondary inverse-square law falloff characteristics.' },
      { id: 'vid-ff3', name: 'Compression Block Anomalies', status: 'warning', details: 'Heavy variable block-size compression was applied specifically around the dynamic structure to conceal rendering lines.' },
      { id: 'vid-ff4', name: 'Temporal Keyframe Jitter', status: 'failed', details: 'Inter-frame spatial feature maps exhibit critical variance standard in synthesized video deepfakes.' }
    ]
  }
];

export const INITIAL_STATS: Stats = {
  totalChecks: 24,
  trustedCount: 16,
  suspiciousCount: 3,
  highRiskCount: 5
};

export const MOCK_ACTIVITY_TRENDS: ActivityTrend[] = [
  { day: 'Mon', mediaChecks: 2, linkChecks: 0 },
  { day: 'Tue', mediaChecks: 4, linkChecks: 0 },
  { day: 'Wed', mediaChecks: 3, linkChecks: 0 },
  { day: 'Thu', mediaChecks: 6, linkChecks: 0 },
  { day: 'Fri', mediaChecks: 5, linkChecks: 0 },
  { day: 'Sat', mediaChecks: 1, linkChecks: 0 },
  { day: 'Sun', mediaChecks: 3, linkChecks: 0 }
];
