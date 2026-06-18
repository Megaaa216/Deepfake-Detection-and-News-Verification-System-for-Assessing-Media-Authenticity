import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Check, Mail, Lock, Eye, EyeOff, Hash, ArrowLeft } from 'lucide-react';

interface ForgotPasswordViewProps {
  onNavigateToLogin: () => void;
}

export default function ForgotPasswordView({ onNavigateToLogin }: ForgotPasswordViewProps) {
  // Navigation steps: 1 = request code, 2 = verify & reset
  const [step, setStep] = useState<1 | 2>(1);

  // Form input states
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI state
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email format.');
      return;
    }

    setIsSendingCode(true);

    // Simulate sending recovery code
    setTimeout(() => {
      setIsSendingCode(false);
      setSuccessMsg('A security recovery code of 6 digits has been dispatched to your email address.');
      setVerificationCode(''); // Initial value placeholder
      
      // Move to step 2 after a brief delay
      setTimeout(() => {
        setStep(2);
        setSuccessMsg(null);
      }, 1500);

    }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!verificationCode.trim() || !newPassword || !confirmNewPassword) {
      setErrorMsg('All fields are required. Please input the code and new passwords.');
      return;
    }

    if (verificationCode.trim().length < 4) {
      setErrorMsg('Verification code is invalid. Codes are at least 4-6 numeric values.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match. Please verify the matching values.');
      return;
    }

    // Password strength check
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (newPassword.length < 8 || !hasLetter || !hasNumber) {
      setErrorMsg('Weak password warning. Password must be at least 8 characters long and include both letters and numbers.');
      return;
    }

    // Success!
    setSuccessMsg('Your security password has been updated securely. Redirecting to login shortly...');
    
    setTimeout(() => {
      onNavigateToLogin();
    }, 2000);
  };

  return (
    <div id="forgot-password-container" className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-850 rounded-2xl shadow-xl overflow-hidden text-white relative">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="bg-blue-600/20 p-2.5 rounded-xl text-blue-400 border border-blue-500/30 shrink-0">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-white">Password Recovery</h3>
              <p className="text-xs text-slate-400">Restore authenticated analyst console access</p>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <span className={`px-2 py-0.5 rounded-full ${step === 1 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>
              Step 1: Code Request
            </span>
            <span className="text-slate-600">→</span>
            <span className={`px-2 py-0.5 rounded-full ${step === 2 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>
              Step 2: Reset Credentials
            </span>
          </div>

          {/* Status feedback alerts */}
          {errorMsg && (
            <div className="bg-rose-950/40 border border-rose-900/50 p-4 rounded-xl flex items-start space-x-2.5 text-rose-200 text-xs text-left animate-fade-in" id="recovery-error-box">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-450 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-semibold">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/40 border border-emerald-900/50 p-4 rounded-xl flex items-start space-x-2.5 text-emerald-200 text-xs text-left animate-fade-in" id="recovery-success-box">
              <Check className="h-4.5 w-4.5 text-emerald-450 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Step 1 Form */}
          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className="text-xs text-slate-300 leading-normal">
                Input your registered analyst email address. Our security node will transmit a digital verification token to initiate reset.
              </p>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-mono tracking-wide text-slate-300 uppercase">
                  Analyst Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@agency.verify"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 pl-9 pr-3.5 py-2 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingCode}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center space-x-2 disabled:bg-slate-800"
              >
                <span>{isSendingCode ? 'Transmitting Code...' : 'Send Recovery Code'}</span>
              </button>
            </form>
          ) : (
            /* Step 2 Form */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-slate-300 leading-normal">
                Enter the security code sent to <strong className="text-blue-400">{email}</strong> and configure your new authentication passphrase.
              </p>

              {/* Code */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono tracking-wide text-slate-300 uppercase">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Hash className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 583920"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 pl-9 pr-3.5 py-2.5 tracking-widest text-center text-lg font-mono rounded-lg text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono tracking-wide text-slate-300 uppercase">
                  New Passphrase
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 pl-9 pr-10 py-2 rounded-lg text-white placeholder-slate-550 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono tracking-wide text-slate-300 uppercase">
                  Confirm New Passphrase
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 pl-9 pr-10 py-2 rounded-lg text-white placeholder-slate-550 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-800 hover:bg-slate-800 text-slate-300 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          )}

          {/* Footer Back Button */}
          <div className="text-center pt-4 border-t border-slate-850">
            <button
              onClick={onNavigateToLogin}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Analyst Log In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
