import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Check, Mail, Lock, Eye, EyeOff, Hash, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';

interface ForgotPasswordViewProps {
  onNavigateToLogin: () => void;
}

export default function ForgotPasswordView({ onNavigateToLogin }: ForgotPasswordViewProps) {
  // Navigation steps: 1 = request code, 2 = verify OTP, 3 = reset password
  const [step, setStep] = useState<1 | 2 | 3>(1);

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
  const [isLoading, setIsLoading] = useState(false);

  // Helper validation checker
  const validateEmailFormat = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!validateEmailFormat(email)) {
      setErrorMsg('Please enter a valid email format.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword({ email: email.trim().toLowerCase() });
      setSuccessMsg('A security recovery code has been dispatched to your email address.');
      
      // Move to step 2 after a brief delay
      setTimeout(() => {
        setStep(2);
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch recovery code. Please check your email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!verificationCode.trim()) {
      setErrorMsg('Please enter the verification code.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyForgotPassword({
        email: email.trim().toLowerCase(),
        code: verificationCode.trim(),
      });

      setSuccessMsg('Verification OTP is authorized! You may now configure a new passphrase.');
      
      // Move to step 3 after a brief delay
      setTimeout(() => {
        setStep(3);
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired verification OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword || !confirmNewPassword) {
      setErrorMsg('Both password fields are required.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match. Please verify matching values.');
      return;
    }

    // Password strength check
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (newPassword.length < 8 || !hasLetter || !hasNumber) {
      setErrorMsg('Weak password warning. Password must be at least 8 characters long and include both letters and numbers.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        email: email.trim().toLowerCase(),
        code: verificationCode.trim(),
        password: newPassword,
      });

      setSuccessMsg('Your security password has been updated securely. Redirecting to login shortly...');
      
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update credentials. Please request a new recovery code.');
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex items-center justify-between text-[10px] font-mono gap-1">
            <span className={`px-2 py-0.5 rounded-full text-center flex-1 ${step === 1 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-450'}`}>
              1. Code Request
            </span>
            <span className="text-slate-600">→</span>
            <span className={`px-2 py-0.5 rounded-full text-center flex-1 ${step === 2 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-450'}`}>
              2. Verify OTP
            </span>
            <span className="text-slate-600">→</span>
            <span className={`px-2 py-0.5 rounded-full text-center flex-1 ${step === 3 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-450'}`}>
              3. Reset Passphrase
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

          {/* Step 1 Form: Request OTP */}
          {step === 1 && (
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
                    disabled={isLoading}
                    placeholder="name@agency.verify"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 pl-9 pr-3.5 py-2 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center space-x-2 disabled:bg-slate-800"
              >
                <span>{isLoading ? 'Transmitting Code...' : 'Send Recovery Code'}</span>
              </button>
            </form>
          )}

          {/* Step 2 Form: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-slate-300 leading-normal">
                Enter the security code sent to <strong className="text-blue-400">{email}</strong> to authenticate authorization.
              </p>

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
                    disabled={isLoading}
                    maxLength={6}
                    placeholder="e.g. 583920"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 pl-9 pr-3.5 py-2.5 tracking-widest text-center text-lg font-mono rounded-lg text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setStep(1);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="w-1/3 border border-slate-800 hover:bg-slate-800 text-slate-300 py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:bg-slate-800"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP Code'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3 Form: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-slate-300 leading-normal">
                Verify OTP authorized! Please define your new security passphrase below.
              </p>

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
                    disabled={isLoading}
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
                    disabled={isLoading}
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:bg-slate-800"
                >
                  {isLoading ? 'Updating Credentials...' : 'Update & Reset Passphrase'}
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
