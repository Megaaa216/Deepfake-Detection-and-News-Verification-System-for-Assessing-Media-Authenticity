import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, User, Mail, Lock, Check, ShieldAlert } from 'lucide-react';

interface RegisterViewProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: (newUser: { fullName: string; username: string; email: string }) => void;
}

export default function RegisterView({ onNavigateToLogin, onRegisterSuccess }: RegisterViewProps) {
  // Input states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Helper validation checkers
  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const validatePasswordStrength = (val: string) => {
    // Check at least 8 characters and contains both letters and numbers
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    return val.length >= 8 && hasLetter && hasNumber;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Check empty fields
    if (!fullName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('All fields are required. Please enter details in all fields.');
      return;
    }

    // 2. Clear whitespace checks
    if (username.includes(' ')) {
      setErrorMsg('Username must not contain any blank spaces.');
      return;
    }

    // 3. Email validation
    if (!validateEmail(email)) {
      setErrorMsg('Invalid email format. Please enter a valid email address (e.g., name@agency.verify).');
      return;
    }

    // 4. Password mismatch check
    if (password !== confirmPassword) {
      setErrorMsg('Password mismatch. Confirm password must match password exactly.');
      return;
    }

    // 5. Password strength check
    if (!validatePasswordStrength(password)) {
      setErrorMsg('Weak password warning. Password must be at least 8 characters long and include both letters and numbers.');
      return;
    }

    // 6. Check Terms & Privacy checkbox
    if (!termsAccepted) {
      setErrorMsg('You must agree to the VeraMedia Terms of Service & Privacy Policy.');
      return;
    }

    // Successful registration
    setSuccessMsg('Security credentials generated! Your account has been registered successfully.');
    
    setTimeout(() => {
      onRegisterSuccess({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase()
      });
    }, 2000);
  };

  return (
    <div id="register-container" className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-white relative">
        {/* Glow Effects top right */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="bg-blue-600/20 p-2.5 rounded-xl text-blue-400 border border-blue-500/30 shrink-0">
              <ShieldCheck className="h-6 w-6" id="register-security-icon" />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-white">Analyst Register</h3>
              <p className="text-xs text-slate-400">Initialize custom digital signatures to inspect media</p>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            Welcome to VeraMedia. Registering creates a secure local credential block used to encrypt and watermark forensic files.
          </p>

          {/* Error and Success Notifications */}
          {errorMsg && (
            <div className="bg-rose-950/40 border border-rose-900/50 p-4 rounded-xl flex items-start space-x-2.5 text-rose-200 text-xs text-left animate-fade-in" id="register-error-box">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-450 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-semibold">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/40 border border-emerald-900/50 p-4 rounded-xl flex items-start space-x-2.5 text-emerald-200 text-xs text-left animate-fade-in" id="register-success-box">
              <Check className="h-4.5 w-4.5 text-emerald-450 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="block text-xs font-mono tracking-wide text-slate-300 uppercase mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  placeholder="e.g. Dr. Alan Brent"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 pl-10 pr-3.5 py-2.5 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Username & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label htmlFor="reg-username" className="block text-xs font-mono tracking-wide text-slate-300 uppercase mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <span className="text-xs font-bold font-mono">@</span>
                  </div>
                  <input
                    id="reg-username"
                    type="text"
                    required
                    placeholder="abrent_forensics"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 pl-8 pr-3.5 py-2.5 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Email address */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-mono tracking-wide text-slate-300 uppercase mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@agency.verify"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 pl-10 pr-3.5 py-2.5 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-xs font-mono tracking-wide text-slate-300 uppercase mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 pl-10 pr-10 py-2.5 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm" className="block text-xs font-mono tracking-wide text-slate-300 uppercase mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 pl-10 pr-10 py-2.5 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-start space-x-2 pt-2 pb-2">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms-checkbox" className="text-xs text-slate-400 leading-normal select-none">
                I agree to the <span className="text-blue-400 hover:underline cursor-pointer">Terms of Service</span> & <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span> regarding verified digital telemetry storage.
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                id="register-btn"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg text-sm transition-all shadow-md cursor-pointer hover:shadow-blue-900/30"
              >
                Register Security Account
              </button>
            </div>
          </form>

          {/* Link to Login */}
          <div className="text-center pt-4 border-t border-slate-800/80">
            <span className="text-slate-400 text-xs">Already registered? </span>
            <button
              onClick={onNavigateToLogin}
              id="back-to-login"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline hover:no-underline"
            >
              Sign In to Analyst Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
