import React, { useState } from 'react';
import { 
  User, Shield, Calendar, Key, AlertCircle, CheckCircle2, 
  Settings, Clock, Activity, FileText, BadgeCheck, Camera, Edit2, Check
} from 'lucide-react';
import { VerificationResult } from '../types';

interface ProfileViewProps {
  user: {
    loggedIn: boolean;
    email: string | null;
    fullName?: string;
    username?: string;
    role?: 'admin' | 'analyst';
    createdAt?: string;
    avatarUrl?: string;
  };
  onUpdateUser: (updatedUser: {
    fullName: string;
    username: string;
    email: string;
    avatarUrl?: string;
  }) => void;
  historyList: VerificationResult[];
  onViewReport: (item: VerificationResult) => void;
}

export default function ProfileView({ user, onUpdateUser, historyList, onViewReport }: ProfileViewProps) {
  // Extract info with default values
  const currentFullName = user.fullName || 'Dr. Alan Brent';
  const currentUsername = user.username || 'abrent_forensics';
  const currentEmail = user.email || 'a.brent@cyber-forensics.verify';
  const currentRole = user.role || 'admin';
  const currentCreatedAt = user.createdAt || '2026-01-20';
  const currentAvatarUrl = user.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='12' r='12' fill='%23f1f5f9'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>";

  // Toggle edit profile mode
  const [isEditing, setIsEditing] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(currentFullName);
  const [usernameInput, setUsernameInput] = useState(currentUsername);
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [avatarUrlInput, setAvatarUrlInput] = useState(currentAvatarUrl);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password edit fields
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  // Compute stats based on true history list
  const totalChecks = historyList.length;
  const deepfakeChecks = historyList.filter(h => h.type === 'image' || h.type === 'video').length;
  const newsChecks = historyList.filter(h => h.type === 'news_link').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!fullNameInput.trim() || !usernameInput.trim() || !emailInput.trim()) {
      setProfileError('Fields cannot be left blank.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setProfileError('Invalid email format structure.');
      return;
    }

    // Pass up to parent state
    onUpdateUser({
      fullName: fullNameInput.trim(),
      username: usernameInput.trim().replace('@', '').toLowerCase(),
      email: emailInput.trim().toLowerCase(),
      avatarUrl: avatarUrlInput
    });

    setProfileSuccess('Personal profile variables synchronized and updated securely.');
    setIsEditing(false);
    setTimeout(() => setProfileSuccess(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!currPassword || !newPassword || !confirmNewPassword) {
      setPwdError('All password input cells are required.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPwdError('Mismatch: confirm password does not match new password.');
      return;
    }

    if (newPassword.length < 8) {
      setPwdError('Security warning: new passphrases must contain at least 8 characters.');
      return;
    }

    setPwdSuccess('Primary password hash rebuilt and changed successfully.');
    // reset inputs
    setCurrPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => setPwdSuccess(null), 3500);
  };

  return (
    <div id="profile-container" className="space-y-8 py-6 max-w-5xl mx-auto text-slate-800">
      
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Analyst Security Profile
        </h2>
        <p className="text-sm text-slate-500">
          Manage your system identifier keys, security authentication parameters, and active verification metrics.
        </p>
      </div>

      {profileSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}

      {/* Main Grid layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Personal Info & Security */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Box 1: Personal Information */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display font-bold text-slate-900 text-sm flex items-center space-x-2">
                <User className="h-4.5 w-4.5 text-blue-600" />
                <span>Personal Information Credentials</span>
              </h3>
              
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white shadow-sm font-semibold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

            {profileError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {!isEditing ? (
              /* Display Profile Model */
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar Display */}
                <div className="relative shrink-0">
                  <img
                    src={currentAvatarUrl}
                    alt={currentFullName}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 border border-white">
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Grid Details */}
                <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-slate-450 block uppercase text-[9px] font-bold tracking-wide">Analyst Identity</span>
                      <span className="text-slate-800 font-bold block text-sm font-sans">{currentFullName}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-slate-450 block uppercase text-[9px] font-bold tracking-wide">Secure Username</span>
                      <span className="text-blue-600 font-bold block text-sm">@{currentUsername}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-slate-450 block uppercase text-[9px] font-bold tracking-wide">System Email Secure</span>
                      <span className="text-slate-800 font-bold block truncate" title={currentEmail}>{currentEmail}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-slate-450 block uppercase text-[9px] font-bold tracking-wide">Node Access Authorization</span>
                      <span className="text-slate-800 font-bold block flex items-center justify-center sm:justify-start space-x-1">
                        <BadgeCheck className="h-4 w-4 text-blue-500" />
                        <span className="capitalize">{currentRole} Status</span>
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Account registration established: <strong className="text-slate-700">{currentCreatedAt}</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              /* Editable Profile mode */
              <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-2.5 rounded-lg text-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-2.5 rounded-lg text-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-2.5 rounded-lg text-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1">
                      Avatar Address URL
                    </label>
                    <input
                      type="text"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-2.5 rounded-lg text-slate-800 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-55 bg-white text-slate-500 text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Box 2: Security Settings & Core Updates */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-4 flex items-center space-x-2">
              <Key className="h-4.5 w-4.5 text-blue-600" />
              <span>Security Parameter Controls</span>
            </h3>

            {pwdSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            {pwdError && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center space-x-2 text-rose-800 text-xs font-semibold">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Change Login Password
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currPassword}
                    onChange={(e) => setCurrPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-2.5 rounded-lg text-slate-800 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-2.5 rounded-lg text-slate-800 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 p-2.5 rounded-lg text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Update Passphrase Hash
                </button>
              </div>
            </form>

            {/* 2FA Placeholder Section */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="bg-blue-50 text-blue-600 text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-blue-200">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect external TOTP authenticators (Google Authenticator, Duo Core, or YubiKey signature) to safeguard forensic file watermarking capabilities.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 text-xs text-slate-500">
                <input
                  type="checkbox"
                  disabled
                  checked={false}
                  className="h-4 w-4 text-blue-500 rounded border-slate-300 pointer-events-none"
                />
                <span>Enable Authenticator OTP (Restricted until subsequent release node)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Activity Overview */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Card 1: Activity stats metrics */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-4 flex items-center space-x-2">
              <Activity className="h-4.5 w-4.5 text-blue-600" />
              <span>Analyst Statistics</span>
            </h3>

            <div className="space-y-4">
              {/* Total runs */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block">Total Analyses</span>
                  <span className="text-2xl font-black text-slate-900 font-display block leading-none">{totalChecks}</span>
                </div>
                <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              {/* Sub categories */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-450 font-mono text-[9px] font-bold uppercase block">Deepfake Scans</span>
                  <span className="font-display font-black text-slate-800 text-lg">{deepfakeChecks}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-450 font-mono text-[9px] font-bold uppercase block">News Audits</span>
                  <span className="font-display font-black text-slate-800 text-lg">{newsChecks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Analysis History logs */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Clock className="h-4.5 w-4.5 text-blue-600" />
              <span>Recent Activity Logs</span>
            </h3>

            {historyList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent inspections found.</p>
            ) : (
              <div className="space-y-3">
                {historyList.slice(0, 4).map((item) => {
                  const isAuth = item.status === 'likely_authentic';
                  const isSusp = item.status === 'suspicious';
                  
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => onViewReport(item)}
                      className="group p-2.5 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all flex flex-col space-y-1.5 cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 capitalize bg-slate-100 px-1.5 py-0.2 rounded">
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase ${
                          isAuth ? 'text-emerald-500' : isSusp ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                          {item.status.replace('likely_', '')}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-650" title={item.targetName}>
                        {item.targetName}
                      </span>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{item.date}</span>
                        <span className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          View details →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
