import React, { useState } from 'react';
import { ShieldCheck, Menu, X, KeyRound, User, LogOut, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { loggedIn: boolean; email: string | null };
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, user, onLogin, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const navItems = [
    { id: 'home', name: 'Home' },
    { id: 'verify', name: 'Verify Media' },
    { id: 'methods', name: 'Verification Methods' },
    { id: 'history', name: 'History' },
    { id: 'reports', name: 'Reports' },
    { id: 'about', name: 'About' },
  ];

  const handleLinkClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim()) {
      onLogin();
      setShowLoginModal(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleLinkClick('home')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-inner flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 stroke-[2]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg leading-tight tracking-tight block text-white">
                VeraMedia
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase block text-blue-400">
                Media Authenticity System
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-950 text-blue-400 border-b-2 border-blue-500 rounded-b-none'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Far Right Control: Auth / Login */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>SECURE PROTOCOL ACTIVE</span>
            </div>

            {user.loggedIn ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-medium text-slate-300">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="max-w-[120px] truncate">{user.email || 'Analyst'}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-md cursor-pointer hover:shadow-blue-900/30"
              >
                <KeyRound className="h-4 w-4" />
                <span>Analyst Portal</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-950 text-blue-400 font-semibold border-l-4 border-blue-500'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
          <div className="pt-4 pb-4 border-t border-slate-850 px-4 flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-950 p-2 rounded-md">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>SECURE CONNECTION: HOST DIRECT</span>
            </div>
            {user.loggedIn ? (
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-850">
                <span className="text-sm font-medium text-slate-300 truncate">{user.email}</span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 border border-rose-900 px-3 py-1 rounded bg-rose-950/10 hover:bg-rose-950/30 transition-all font-medium flex items-center space-x-1"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 font-medium py-2 rounded-lg text-white"
              >
                <KeyRound className="h-4 w-4" />
                <span>Analyst Portal</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-850 rounded-2xl p-6 text-white shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600/20 p-2.5 rounded-lg text-blue-400 border border-blue-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-white">System Analyst Sign In</h3>
                <p className="text-xs text-slate-400">Restricted portal for verified research personnel</p>
              </div>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono tracking-wide text-slate-300 uppercase mb-1.5">
                  Analyst Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@agency.verify"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 px-3.5 py-2 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wide text-slate-300 uppercase mb-1.5">
                  Security Passcode
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 px-3.5 py-2 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none"
                />
              </div>

              <div className="bg-slate-950/50 p-2.5 rounded border border-slate-850 text-[11px] text-slate-400 leading-relaxed font-mono">
                ℹ️ Use any credentials to sign in. In production, this secures auditing records and generates custom cryptographic signatures for exported reports.
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="w-1/2 border border-slate-800 hover:bg-slate-800 text-slate-300 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Access Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
