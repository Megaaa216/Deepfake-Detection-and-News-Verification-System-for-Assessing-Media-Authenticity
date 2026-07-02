import React, { useState, useEffect } from 'react';
import { 
  Settings, Sun, Moon, Laptop, User, Bell, 
  Eye, RefreshCw, Download, Trash2, Sparkles, CircleAlert,
  ChevronRight, Text, Sliders, Shield, AlertTriangle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { VerificationResult } from '../types';

interface SettingsViewProps {
  user: {
    loggedIn: boolean;
    email: string | null;
    fullName?: string;
    username?: string;
    avatarUrl?: string;
    role?: 'admin' | 'analyst';
    createdAt?: string;
  };
  onUpdateUser: (newUser: { fullName: string; username: string; email: string; avatarUrl?: string }) => void;
  onLogout: () => void;
  historyList: VerificationResult[];
  onResetHistoryList: () => void;
}

export default function SettingsView({ 
  user, 
  onUpdateUser, 
  onLogout,
  historyList,
  onResetHistoryList 
}: SettingsViewProps) {
  const { 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize, 
    interfaceScaling, 
    setInterfaceScaling, 
    reduceAnimations, 
    setReduceAnimations 
  } = useTheme();

  // Active section in settings internal tabs
  const [activeSection, setActiveSection] = useState<string>('appearance');

  // Account form states
  const [fullNameState, setFullNameState] = useState(user.fullName || '');
  const [usernameState, setUsernameState] = useState(user.username || '');
  const [emailState, setEmailState] = useState(user.email || '');
  const [avatarUrlState, setAvatarUrlState] = useState(user.avatarUrl || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load custom account states when user changes
  useEffect(() => {
    setFullNameState(user.fullName || '');
    setUsernameState(user.username || '');
    setEmailState(user.email || '');
    setAvatarUrlState(user.avatarUrl || '');
  }, [user]);

  // Notifications preferences (persisted locally)
  const [emailCompletion, setEmailCompletion] = useState(() => localStorage.getItem('trustlens_notif_email_completion') !== 'false');
  const [emailSecurity, setEmailSecurity] = useState(() => localStorage.getItem('trustlens_notif_email_security') !== 'false');
  const [emailUpdates, setEmailUpdates] = useState(() => localStorage.getItem('trustlens_notif_email_updates') === 'true');
  const [appFeatures, setAppFeatures] = useState(() => localStorage.getItem('trustlens_notif_app_features') !== 'false');
  const [appMessages, setAppMessages] = useState(() => localStorage.getItem('trustlens_notif_app_messages') !== 'false');

  // Security toggles
  const [loginAlerts, setLoginAlerts] = useState(() => localStorage.getItem('trustlens_sec_login_alerts') !== 'false');

  // Confirmation Modals states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [showResetCacheModal, setShowResetCacheModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Auto-hide feedback message
  useEffect(() => {
    if (feedbackMsg) {
      const timer = setTimeout(() => setFeedbackMsg(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedbackMsg]);

  // Save Account Profile Settings
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameState || !usernameState || !emailState) {
      alert('Please fill out all required fields.');
      return;
    }
    setSaveStatus('saving');
    setTimeout(() => {
      onUpdateUser({
        fullName: fullNameState,
        username: usernameState,
        email: emailState,
        avatarUrl: avatarUrlState
      });
      setSaveStatus('saved');
      setFeedbackMsg({ type: 'success', text: 'Account preferences updated successfully.' });
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  // Cancel Account changes
  const handleCancelAccount = () => {
    setFullNameState(user.fullName || '');
    setUsernameState(user.username || '');
    setEmailState(user.email || '');
    setAvatarUrlState(user.avatarUrl || '');
    setFeedbackMsg({ type: 'info', text: 'Changes discarded.' });
  };

  // Persist notification toggles to localStorage
  const handleNotifChange = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(key, String(value));
    setFeedbackMsg({ type: 'success', text: 'Notification preferences updated.' });
  };

  // Persist security toggles
  const handleSecurityChange = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(key, String(value));
    setFeedbackMsg({ type: 'success', text: 'Security settings updated.' });
  };

  // 1. Download Personal Data (Real implementation: downloads user attributes + activity logs)
  const handleDownloadData = () => {
    const personalData = {
      exportedAt: new Date().toISOString(),
      platform: 'TrustLens',
      identity: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      preferences: {
        theme,
        fontSize,
        interfaceScaling,
        reduceAnimations,
        notifications: {
          emailCompletion,
          emailSecurity,
          emailUpdates,
          appFeatures,
          appMessages
        }
      },
      history: historyList
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(personalData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trustlens-forensic-export-${user.username || 'user'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    setFeedbackMsg({ type: 'success', text: 'Forensic personal data exported.' });
  };

  // 2. Clear Local Cache (reloads browser with cleared state)
  const handleClearCache = () => {
    // Retain only identity token, flush settings variables
    const keysToFlush = [
      'trustlens_theme', 'trustlens_font_size', 'trustlens_interface_scaling', 'trustlens_reduce_animations',
      'trustlens_notif_email_completion', 'trustlens_notif_email_security', 'trustlens_notif_email_updates',
      'trustlens_notif_app_features', 'trustlens_notif_app_messages', 'trustlens_sec_login_alerts'
    ];
    keysToFlush.forEach(key => localStorage.removeItem(key));
    setShowResetCacheModal(false);
    setFeedbackMsg({ type: 'success', text: 'Settings local cache cleared successfully!' });
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  // 3. Delete Account
  const handleDeleteAccountConfirm = () => {
    setShowDeleteModal(false);
    onResetHistoryList();
    onLogout();
    // Redirect to home
    window.location.hash = '#/home';
  };

  const categories = [
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'account', label: 'Account Preferences', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security Preferences', icon: Shield },
    { id: 'accessibility', label: 'Accessibility Settings', icon: Sliders },
    { id: 'privacy', label: 'Data and Privacy', icon: Eye }
  ];

  const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='12' r='12' fill='%23f1f5f9'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>";

  return (
    <div className="space-y-6 animate-fade-in" id="settings-view">
      
      {/* Settings Header with custom cyber styling */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-3">
        <div>
          <h1 className="font-display font-medium text-slate-900 dark:text-slate-100 text-2xl tracking-tight flex items-center space-x-2">
            <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Settings Control Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-mono">
            Manage your credentials, layout appearance, accessibility scalings, and data rights
          </p>
        </div>
        
        {/* Real-time status indicator */}
        <div className="flex items-center space-x-2 bg-slate-200/50 dark:bg-slate-900/55 px-3 py-1.5 rounded-full border border-slate-300/40 dark:border-slate-800 self-start md:self-auto">
          <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping"></span>
          <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Operational
          </span>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-3 rounded-lg flex items-center gap-2 border text-xs font-mono transition-all duration-150 ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
            : 'bg-blue-50 dark:bg-slate-900/40 border-blue-200 dark:border-slate-800 text-blue-800 dark:text-blue-300'
        }`}>
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Grid container with sidebar navigation and card components */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 space-y-1 bg-white dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 cyber-card-glow">
          <p className="text-[10px] uppercase tracking-wider font-mono font-black text-slate-400 dark:text-slate-500 px-3 py-1.5 pb-2">
            Control Categories
          </p>
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeSection === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveSection(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-450'}`} />
                  <span>{cat.label}</span>
                </div>
                <ChevronRight className={`h-3 w-3 opacity-60 ${isActive ? 'translate-x-0.5' : ''} transition-transform`} />
              </button>
            );
          })}
        </nav>

        {/* Content Panel Area */}
        <div className="lg:col-span-9 bg-white dark:bg-[#111930] rounded-xl border border-slate-200 dark:border-slate-800 cyber-card-glow p-6 space-y-6">
          
          {/* 1. Appearance / Theme Category */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Appearance & Brand theme</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Adjust custom UI theme skins to match ambient dark operations or default light styles
                </p>
              </div>

              {/* Theme Selector Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Light Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    theme === 'light'
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50/40 dark:bg-slate-900/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10'
                  }`}
                >
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg dark:bg-slate-800 dark:text-amber-400 mb-4">
                    <Sun className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Light Mode</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-450 mt-1">
                    Classic bright layout engineered for high visibility outdoors and high contrast text reading
                  </span>
                </button>

                {/* Dark Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    theme === 'dark'
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50/40 dark:bg-slate-900/30 ring-1 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10'
                  }`}
                >
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-[#38bdf8] mb-4">
                    <Moon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Dark Mode</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-450 mt-1">
                    Professional TrueSight cybersecurity theme. Dark navy blueprints with slight azure glow layers
                  </span>
                </button>

                {/* System Default Card */}
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    theme === 'system'
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50/40 dark:bg-slate-900/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10'
                  }`}
                >
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg dark:bg-slate-800 dark:text-slate-300 mb-4">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">System Default</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-450 mt-1">
                    Automatically synchronize aesthetics according to your computer's system preferences
                  </span>
                </button>
              </div>

              {/* Glowing Theme Indicator */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">TrueSight AI Visual Sync</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Applying theme skin triggers sub-pixel CSS variables immediately, adjusting layout canvases, forms, tables, buttons, and chart fills without forcing a page refresh!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Account Preferences Category */}
          {activeSection === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Account Preferences</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure display details, username records, and active profile avatar URLs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={fullNameState}
                    onChange={(e) => setFullNameState(e.target.value)}
                    placeholder="e.g. Dr. Al Brent"
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Username Identifier
                  </label>
                  <input
                    type="text"
                    value={usernameState}
                    onChange={(e) => setUsernameState(e.target.value)}
                    placeholder="e.g. abrent_forensics"
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email Address Input */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailState}
                    onChange={(e) => setEmailState(e.target.value)}
                    placeholder="e.g. a.brent@cyber-forensics.verify"
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Avatar Image URL Input / Presets */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Profile Avatar Resource URL
                  </label>
                  <div className="flex gap-3">
                    <img 
                      src={avatarUrlState || defaultAvatarSvg} 
                      alt="User Mini Profile Preview" 
                      className="h-10 w-10 rounded-full shrink-0 object-cover bg-slate-100 dark:bg-slate-800 border dark:border-slate-700"
                      onError={(e)=>{
                        (e.target as HTMLImageElement).src = defaultAvatarSvg;
                      }}
                    />
                    <input
                      type="text"
                      value={avatarUrlState}
                      onChange={(e) => setAvatarUrlState(e.target.value)}
                      placeholder="Paste image URL or leave blank to utilize default SVG"
                      className="w-full text-xs px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Quick-choice Presets */}
                  <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                    <span>Quick Choices:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setAvatarUrlState('')}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 rounded text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        Default SVG (Grey Silhouette)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarUrlState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop')}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 rounded text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        Professional Analyst Face
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarUrlState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop')}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 rounded text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        SecOps Lead Face
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCancelAccount}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-250 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm disabled:opacity-50 transition"
                >
                  {saveStatus === 'saving' ? 'Saving changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* 3. Notification Settings Category */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notification Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Synchronize channel integrations to receive reports alerts, auditing completion hooks, or device logins
                </p>
              </div>

              {/* Category: Email Notifications */}
              <div className="space-y-4">
                <div className="pb-1 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Email Channels
                  </h4>
                </div>
                
                {/* 3a. Complete Reports email notifications */}
                <div className="flex items-center justify-between py-1 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-2 rounded-lg transition">
                  <div>
                    <label className="text-xs font-semibold text-slate-850 dark:text-slate-200 block cursor-pointer">
                      Forensic analysis completion logs
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450">
                      Receive detailed cryptographic signatures and classification verdicts directly in your workspace inbox
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailCompletion}
                    onChange={(e) => handleNotifChange('trustlens_notif_email_completion', e.target.checked, setEmailCompletion)}
                    className="h-4 w-8 bg-slate-305 accent-blue-600 dark:accent-blue-400 rounded-full cursor-pointer"
                  />
                </div>

                {/* 3b. Security Alerts email notifications */}
                <div className="flex items-center justify-between py-1 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-2 rounded-lg transition">
                  <div>
                    <label className="text-xs font-semibold text-slate-850 dark:text-slate-200 block cursor-pointer">
                      Administrative security & auditing warnings
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450">
                      Obtain immediate alerts regarding high severity threat classification audits and system intrusions
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailSecurity}
                    onChange={(e) => handleNotifChange('trustlens_notif_email_security', e.target.checked, setEmailSecurity)}
                    className="h-4 w-8 bg-slate-305 accent-blue-600 dark:accent-blue-400 rounded-full cursor-pointer"
                  />
                </div>

                {/* 3c. System updates email notifications */}
                <div className="flex items-center justify-between py-1 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-2 rounded-lg transition">
                  <div>
                    <label className="text-xs font-semibold text-slate-850 dark:text-slate-200 block cursor-pointer">
                      Core deep learning engine system releases
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450">
                      Stay informed on major forensic model weights, new analysis weights, and backend system upgrades
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailUpdates}
                    onChange={(e) => handleNotifChange('trustlens_notif_email_updates', e.target.checked, setEmailUpdates)}
                    className="h-4 w-8 bg-slate-305 accent-blue-600 dark:accent-blue-400 rounded-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Category: In-App Notifications */}
              <div className="space-y-4 pt-2">
                <div className="pb-1 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Console In-App Broadcasts
                  </h4>
                </div>

                {/* 3d. New Features */}
                <div className="flex items-center justify-between py-1 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-2 rounded-lg transition">
                  <div>
                    <label className="text-xs font-semibold text-slate-850 dark:text-slate-200 block cursor-pointer">
                      New feature announcements & guides
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450">
                      Banner prompts displaying UI adjustments, bento-tools tutorials, and new media checkers
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={appFeatures}
                    onChange={(e) => handleNotifChange('trustlens_notif_app_features', e.target.checked, setAppFeatures)}
                    className="h-4 w-8 bg-slate-305 accent-blue-600 dark:accent-blue-400 rounded-full cursor-pointer"
                  />
                </div>

                {/* 3e. Important Account Messages */}
                <div className="flex items-center justify-between py-1 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-2 rounded-lg transition">
                  <div>
                    <label className="text-xs font-semibold text-slate-850 dark:text-slate-200 block cursor-pointer">
                      Critical administrative alerts & account logs
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-450">
                      In-app status messages representing role modifications, usage limiters, or license reminders
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={appMessages}
                    onChange={(e) => handleNotifChange('trustlens_notif_app_messages', e.target.checked, setAppMessages)}
                    className="h-4 w-8 bg-slate-305 accent-blue-600 dark:accent-blue-400 rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Security Preferences Category */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Security & Credentials control</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enforce strict identity auditing, credential authorization layers, and session inspection hooks
                </p>
              </div>

              {/* Informational Alerts for placeholders */}
              <div className="space-y-4">
                
                {/* 4a. Two-factor Authentication Placeholder */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Multi-Factor Device Authentication (2FA)
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-100/50 dark:bg-slate-850 text-blue-800 dark:text-blue-400 font-bold uppercase tracking-wide">
                      Placeholder
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Protect your administrative analysts against theft by requiring a cryptographic TOTP token from Authenticator devices at system entry.
                  </p>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 italic flex items-center space-x-1">
                    <CircleAlert className="h-3.5 w-3.5 text-amber-500" />
                    <span>This feature will be integrated during the phase 2 security server provisioning cycle.</span>
                  </div>
                </div>

                {/* 4b. Active Sessions Placeholder */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b dark:border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Active Auditing Sessions Tracker
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-100/50 dark:bg-slate-850 text-blue-800 dark:text-blue-400 font-bold uppercase tracking-wide">
                      Placeholder
                    </span>
                  </div>
                  
                  {/* Mock high contrast session log table */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-650 dark:text-slate-350">Chrome / macOS 14.2 (Current Session)</span>
                      <span className="text-green-600 dark:text-green-400 font-bold uppercase text-[9px]">Active</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-405">Safari / iPhone 15 Pro</span>
                      <span className="text-slate-400">Locked — 18 hours ago</span>
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-slate-450 dark:text-slate-500 italic pt-1 border-t dark:border-slate-800 flex items-center space-x-1">
                    <CircleAlert className="h-3.5 w-3.5 text-amber-500" />
                    <span>Real-time session terminations require secure backend token management.</span>
                  </div>
                </div>

                {/* 4c. Login Activity alert toggle */}
                <div className="p-4 bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Session Sign-In Alerts
                    </h4>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400">
                      Receive system in-app security logs whenever external IP coordinates or novel web agents open your console credentials.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={(e) => handleSecurityChange('trustlens_sec_login_alerts', e.target.checked, setLoginAlerts)}
                    className="h-4 w-8 bg-slate-305 accent-blue-600 dark:accent-blue-400 rounded-full cursor-pointer"
                  />
                </div>

                {/* 4d. Connected Devices Placeholder */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Authorized Device Encryption Keys
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-100/50 dark:bg-slate-850 text-blue-800 dark:text-blue-400 font-bold uppercase tracking-wide">
                      Placeholder
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Audit authorized cryptographic tokens of desktop environments verified to watermark media assets on system download.
                  </p>
                  <div className="text-[10px] text-slate-450 dark:text-slate-500 italic flex items-center space-x-1">
                    <CircleAlert className="h-3.5 w-3.5 text-amber-500" />
                    <span>CAI signature keys must be registered relative to specific physical workstations.</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 5. Accessibility Settings Category */}
          {activeSection === 'accessibility' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Accessibility Custom Scaling</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Adjust default font magnification factor layouts, component spacing grids, and animation velocity values
                </p>
              </div>

              <div className="space-y-5">
                
                {/* 5a. Font Size Options */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
                    <Text className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>App-wide Font Sizing</span>
                  </label>
                  
                  {/* Selection cards Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {['small', 'medium', 'large'].map((size) => {
                      const isActive = fontSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFontSize(size as 'small' | 'medium' | 'large')}
                          className={`p-3 rounded-lg border text-center transition capitalize ${
                            isActive
                              ? 'border-blue-600 bg-blue-50/20 dark:border-blue-400 dark:bg-slate-900/35 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'border-slate-200 dark:border-slate-805 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-900/5 text-slate-650 dark:text-slate-400 text-xs'
                          }`}
                        >
                          <span className={size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'}>
                            {size}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5b. Interface Spacing Grid scaling */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Interface Layout Spacing Density</span>
                  </label>
                  
                  {/* Density selector cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Compact */}
                    <button
                      type="button"
                      onClick={() => setInterfaceScaling('compact')}
                      className={`p-3 rounded-lg border text-left transition ${
                        interfaceScaling === 'compact'
                          ? 'border-blue-600 bg-blue-50/20 dark:border-blue-400 dark:bg-slate-900/35 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'border-slate-200 dark:border-slate-805 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 text-slate-650 dark:text-slate-400'
                      }`}
                    >
                      <h5 className="text-xs font-semibold">Compact density</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1">
                        Reduces overall margin, padding grids, list gaps, and card sizing boundaries and fits more statistics on active display grids
                      </p>
                    </button>

                    {/* Comfortable */}
                    <button
                      type="button"
                      onClick={() => setInterfaceScaling('comfortable')}
                      className={`p-3 rounded-lg border text-left transition ${
                        interfaceScaling === 'comfortable'
                          ? 'border-blue-600 bg-blue-50/20 dark:border-blue-400 dark:bg-slate-900/35 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'border-slate-200 dark:border-slate-805 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 text-slate-650 dark:text-slate-400'
                      }`}
                    >
                      <h5 className="text-xs font-semibold">Comfortable space</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1">
                        Deploys spacious slate paddings, large margins, and balanced negative typography, optimizing the screen for comfortable browsing
                      </p>
                    </button>
                  </div>
                </div>

                {/* 5c. Reduce Animation Velocity Switch */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Reduce UI animation velocity
                    </h4>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400">
                      Disables structural translation animations, micro-pings, transitions, and fade layouts to improve responsiveness and decrease CPU consumption
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reduceAnimations}
                    onChange={(e) => setReduceAnimations(e.target.checked)}
                    className="h-4 w-8 bg-slate-305 accent-blue-600 dark:accent-blue-400 rounded-full cursor-pointer"
                  />
                </div>

              </div>
            </div>
          )}

          {/* 6. Data and Privacy Category */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Forensics Data and Privacy</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Examine your legal rights over forensic audit logs, clear temporary structures, or retrieve secure local credentials
                </p>
              </div>

              {/* Data controls list card */}
              <div className="space-y-4">
                
                {/* 6a. Download personal data */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Download Personal Data Export (JSON)</span>
                    </h4>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 max-w-xl">
                      Export a secure human-readable forensic JSON ledger package containing your account identifier logs, local settings variables, and complete media analysis audit history.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadData}
                    className="self-start md:self-auto px-4 py-1.5 text-xs rounded-lg font-semibold text-blue-750 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-4 w-full md:w-auto tracking-wide transition border dark:border-blue-900 text-center"
                  >
                    Export JSON Ledger
                  </button>
                </div>

                {/* 6b. Clear Local Cache */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Flush Settings Local Cache</span>
                    </h4>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 max-w-xl">
                      Wipe all saved dark/light settings preference states, font-size scales, and layout modifiers. Retains account active credentials. Reboots App.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetCacheModal(true)}
                    className="self-start md:self-auto px-4 py-1.5 text-xs rounded-lg font-semibold text-slate-700 bg-slate-105 border hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-center"
                  >
                    Flush Settings Cache
                  </button>
                </div>

                {/* 6c. Manage Stored Analysis History */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Trash2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Manage Stored Forensic History</span>
                    </h4>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 max-w-xl">
                      Completely purge all forensic examination histories, metadata extractions, and classification statistics. Relies on permanent deletion.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowClearHistoryModal(true)}
                    className="self-start md:self-auto px-4 py-1.5 text-xs rounded-lg font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900 text-center shrink-0"
                  >
                    Purge Forensic Logs ({historyList.length} items)
                  </button>
                </div>

                {/* 6d. Delete Account block (Warning style) */}
                <div className="p-5 border border-red-200 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10 rounded-xl space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-800 dark:text-red-400">Danger Zone: Purge Analyst Account</h4>
                      <p className="text-[11px] text-red-700 dark:text-red-400/90 leading-relaxed mt-1">
                        Permanently delete your security workspace, clean localStorage completely, and remove your authorization key. All verification ledger logs and active roles will be destroyed. This operation is irrecoverable.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-1.5 text-xs rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition shadow-sm text-center"
                    >
                      Delete Account Credentials
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL 1: Delete Account Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111930] max-w-md w-full rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl animate-fade-in text-xs">
            <div className="flex items-center space-x-2 text-red-600 border-b border-slate-100 dark:border-slate-800 pb-3">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-sm font-semibold">Strict Account Destruction Triggered</h3>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you absolutely confident you want to delete your analyst account credentials? This will immediately log you out, destroy the local credential key, and erase your forensic database of checks. This is a final operation and metadata cannot be recovered.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded-lg border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                No, Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                className="px-3 py-1.5 rounded-lg bg-red-650 hover:bg-red-700 text-white font-semibold shadow-xs"
              >
                Yes, Destroy Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Clear history confirmation */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111930] max-w-md w-full rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs animate-fade-in">
            <div className="flex items-center space-x-2 text-amber-600 border-b border-slate-100 dark:border-slate-800 pb-3">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-sm font-semibold">Confirm Forensic Ledger Reset</h3>
            </div>
            
            <p className="text-slate-650 dark:text-slate-300 leading-relaxed">
              This will completely wipe your local forensic analysis verification logs ({historyList.length} total entries) and reset the metrics counters to zero.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearHistoryModal(false)}
                className="px-3 py-1.5 rounded-lg border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetHistoryList();
                  setShowClearHistoryModal(false);
                  setFeedbackMsg({ type: 'success', text: 'Forensic checks ledger completely purged!' });
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Reset Settings Cache confirmation */}
      {showResetCacheModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111930] max-w-md w-full rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs animate-fade-in">
            <div className="flex items-center space-x-2 text-blue-600 border-b border-slate-100 dark:border-slate-800 pb-3">
              <CircleAlert className="h-5 w-5" />
              <h3 className="text-sm font-semibold">Flush and Reset Theme Preferences</h3>
            </div>
            
            <p className="text-slate-650 dark:text-slate-300 leading-relaxed">
              This will reset your UI skin theme to 'system', scale sizing to 'medium', density scaling to 'comfortable', and enable animations. The website will reload automatically.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetCacheModal(false)}
                className="px-3 py-1.5 rounded-lg border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCache}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Confirm Cache Flush
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
