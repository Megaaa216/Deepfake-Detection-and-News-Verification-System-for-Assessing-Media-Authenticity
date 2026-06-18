import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Eye, EyeOff, User, Mail, Lock, Check, ShieldAlert,
  ArrowRight, Shield
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (customUser?: { fullName: string; username: string; email: string }) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  initialEmail?: string;
  registrationSuccessMessage?: string;
}

export default function LoginView({ 
  onLogin, 
  onNavigateToRegister, 
  onNavigateToForgotPassword,
  initialEmail,
  registrationSuccessMessage
}: LoginViewProps) {
  // Input states
  const [identifier, setIdentifier] = useState(''); // Email or Username
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) {
      setIdentifier(initialEmail);
    }
    if (registrationSuccessMessage) {
      setSuccessMsg(registrationSuccessMessage);
    }
  }, [initialEmail, registrationSuccessMessage]);

  // Helper validation checkers
  const validateEmailFormat = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const input = identifier.trim();

    // 1. Validation for Empty Fields
    if (!input || !password) {
      setErrorMsg('All fields are required. Please enter your email/username and password.');
      return;
    }

    // 2. Clear Whitespace check for username format (if not containing @)
    if (!input.includes('@') && input.includes(' ')) {
      setErrorMsg('Username must not contain any blank spaces.');
      return;
    }

    // 3. Email Format Validation (Only check if they include '@')
    if (input.includes('@') && !validateEmailFormat(input)) {
      setErrorMsg('Invalid email format. Please enter a valid email address (e.g. name@agency.verify).');
      return;
    }

    // 4. Mock credentials validation rules
    // User requested "Validation messages for empty, invalid email, incorrect credentials"
    // Let's implement a rule: simulated incorrect password for demonstration
    // If username is "error_user", block. Or password length < 4, block.
    if (password.length < 4) {
      setErrorMsg('Incorrect credentials. The password entered is too short for a secure session.');
      return;
    }

    // Handle normal mock login flow
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Check for custom credentials simulation
      const isAdmin = input.toLowerCase() === 'a.brent@cyber-forensics.verify' || input.toLowerCase() === 'abrent_forensics';
      
      setSuccessMsg('Access Authorized! Initializing secure console token.');

      setTimeout(() => {
        onLogin({
          fullName: isAdmin ? 'Dr. Alan Brent' : 'Research Analyst',
          username: input.includes('@') ? input.split('@')[0] : input,
          email: input.includes('@') ? input : `${input}@trustlens.verify`,
        });
      }, 1500);

    }, 1800);
  };

  return (
    <div id="login-container" className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white relative grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        {/* Glow Effects top right */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Column 1: Branding Section */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 relative overflow-hidden">
          {/* Hexagonal decorative pattern overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="space-y-6 relative z-10 my-auto">
            <div className="inline-flex bg-blue-600/20 p-3.5 rounded-2xl text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-950/40">
              <ShieldCheck className="h-10 w-10 stroke-[1.5]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold tracking-tight text-white flex items-center space-x-2">
                <span>TrustLens</span>
              </h2>
              <span className="text-xs font-mono font-semibold tracking-wider text-blue-400 uppercase py-0.5 px-2 bg-blue-950 border border-blue-800/40 rounded-full inline-block">
                See Beyond What You Watch
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              AI-powered technology that detects manipulated media, verifies online news credibility, and helps users make informed decisions in the digital world.
            </p>
          </div>

          <div className="text-[10px] text-slate-500 font-mono pt-4 border-t border-slate-900/60 flex items-center justify-between">
            <span>SECURE CRYPTO CONSOLE</span>
            <span>V2.6.1</span>
          </div>
        </div>

        {/* Column 2: Login Form */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6 relative z-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-semibold text-white">Analyst Sign In</h3>
              <p className="text-xs text-slate-400">Provide security keys to launch forensic validation</p>
            </div>

            {/* Error and Success Notifications */}
            {errorMsg && (
              <div className="bg-rose-950/40 border border-rose-900/50 p-4 rounded-xl flex items-start space-x-2.5 text-rose-250 text-xs text-left animate-fade-in" id="login-error-box">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-900/50 p-4 rounded-xl flex items-start space-x-2.5 text-emerald-250 text-xs text-left animate-fade-in" id="login-success-box">
                <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email or Username */}
              <div className="space-y-1.5">
                <label htmlFor="login-identity" className="block text-xs font-mono tracking-wide text-slate-300 uppercase">
                  Email Address or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="login-identity"
                    type="text"
                    disabled={isLoading}
                    placeholder="e.g. a.brent@cyber-forensics.verify"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 pl-10 pr-3.5 py-2.5 rounded-lg text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/20 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="login-password" className="block text-xs font-mono tracking-wide text-slate-300 uppercase">
                    Security Password
                  </label>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={onNavigateToForgotPassword}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 pl-10 pr-10 py-2.5 rounded-lg text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/20 disabled:opacity-60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Credentials hint */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-400 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500/50"
                  />
                  <span>Remember Me</span>
                </label>
              </div>

              {/* Enter Credentials Advice */}
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 text-[11px] font-mono leading-relaxed text-slate-400">
                ⭐ Enter any email or username. Use <strong className="text-blue-300">a.brent@cyber-forensics.verify</strong> to authenticate with Administrator clearances.
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg text-sm transition-all focus:outline-none shadow-md shadow-blue-900/10 cursor-pointer flex items-center justify-center space-x-2 disabled:bg-slate-800"
              >
                <span>{isLoading ? 'Authenticating Credentials...' : 'Authenticate & Sign In'}</span>
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-800/60">
            {/* Create account section */}
            <div className="text-center">
              <span className="text-xs text-slate-400">Don't have an analyst account? </span>
              <button
                onClick={onNavigateToRegister}
                className="text-xs text-blue-450 hover:text-blue-400 font-semibold transition-colors underline hover:no-underline cursor-pointer"
              >
                Create one now
              </button>
            </div>

            {/* Encrypted Notice block */}
            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 bg-slate-950/30 p-2.5 rounded-lg border border-slate-850/60 font-mono">
              <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Your account is protected with encrypted authentication and secure access controls.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
