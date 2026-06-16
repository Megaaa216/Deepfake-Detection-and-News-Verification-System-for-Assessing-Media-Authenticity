import React, { useState } from 'react';
import { 
  ShieldCheck, Menu, X, KeyRound, User, LogOut, CheckCircle2, 
  ChevronDown, Settings, Clock, FileText, UserPlus, ShieldAlert,
  ArrowRight, Sparkles, HelpCircle, HardDrive
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    loggedIn: boolean;
    email: string | null;
    fullName?: string;
    username?: string;
    role?: 'admin' | 'analyst';
    createdAt?: string;
    avatarUrl?: string;
  };
  onLogin: (customUser?: { fullName: string; username: string; email: string }) => void;
  onLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, user, onLogin, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom dropdown menu state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Dynamic system Navigation Items based on user state
  const navItems: { id: string; name: string }[] = [];

  if (user.loggedIn) {
    navItems.push({ id: 'home', name: 'Home' });
    navItems.push({ id: 'verify', name: 'Verify Media' });
    navItems.push({ id: 'history', name: 'History' });
    navItems.push({ id: 'reports', name: 'Reports' });
    navItems.push({ id: 'profile', name: 'Profile' });
    navItems.push({ id: 'settings', name: 'Settings' });
    if (user.role === 'admin') {
      navItems.push({ id: 'admin', name: 'Admin Dashboard' });
    }
    navItems.push({ id: 'logout', name: 'Logout' });
  } else {
    navItems.push({ id: 'home', name: 'Home' });
    navItems.push({ id: 'methods', name: 'Verification Methods' });
    navItems.push({ id: 'about', name: 'About' });
    navItems.push({ id: 'login', name: 'Login' });
    navItems.push({ id: 'register', name: 'Register' });
  }

  const handleLinkClick = (id: string) => {
    if (id === 'logout') {
      onLogout();
      setActiveTab('home');
    } else {
      setActiveTab(id);
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-880 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleLinkClick('home')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-inner flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 stroke-[2]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg leading-tight tracking-tight block text-white">
                TrustLens
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

          {/* Far Right Control: Auth / User drop dropdown */}
          <div className="hidden sm:flex items-center space-x-3 relative">
            <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>SECURE PROTOCOL ACTIVE</span>
            </div>

            {user.loggedIn ? (
              /* Logged In Dropdown toggle */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                  className="flex items-center space-x-2 bg-slate-80 transition-all border border-slate-750 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <img
                    src={user.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='12' r='12' fill='%23f1f5f9'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>"}
                    alt={user.fullName || 'Analyst'}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-md object-cover border border-slate-700"
                  />
                  <span className="max-w-[100px] truncate">{user.fullName || 'Analyst'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>

                {/* Dropdown menu modal box */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-xl py-1 text-left z-50 animate-fade-in font-sans">
                    <div className="px-3.5 py-2 border-b border-slate-850">
                      <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block font-bold">Logged in as</span>
                      <span className="text-xs text-white truncate font-semibold block">{user.email}</span>
                      <span className="text-[10px] text-blue-400 block font-mono capitalize">({user.role} clearance)</span>
                    </div>

                    <button
                      onClick={() => handleLinkClick('profile')}
                      className="w-full px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-850 flex items-center space-x-2 block text-left"
                    >
                      <User className="h-3.5 w-3.5 text-blue-400" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => handleLinkClick('history')}
                      className="w-full px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-850 flex items-center space-x-2 block text-left"
                    >
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      <span>History</span>
                    </button>

                    <button
                      onClick={() => handleLinkClick('reports')}
                      className="w-full px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-850 flex items-center space-x-2 block text-left"
                    >
                      <FileText className="h-3.5 w-3.5 text-blue-400" />
                      <span>Reports</span>
                    </button>

                    <button
                      onClick={() => handleLinkClick('settings')}
                      className="w-full px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-850 flex items-center space-x-2 block text-left"
                    >
                      <Settings className="h-3.5 w-3.5 text-blue-400" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-slate-850 my-1"></div>

                    <button
                      onClick={() => {
                        onLogout();
                        handleLinkClick('home');
                      }}
                      className="w-full px-4 py-2 text-xs text-rose-450 hover:text-rose-300 hover:bg-rose-950/20 flex items-center space-x-2 block text-left font-bold"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions: Login or Register */
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleLinkClick('login')}
                  className="flex items-center space-x-1.5 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Login</span>
                </button>
                
                <button
                  onClick={() => handleLinkClick('register')}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer hover:shadow-blue-900/30"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register</span>
                </button>
              </div>
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

      {/* Mobile Menu responsive */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 animate-fade-in text-left">
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
              <span>SECURE PROTOCOL RUNNING</span>
            </div>

            {user.loggedIn ? (
              <div className="space-y-2 bg-slate-955 p-3 rounded-xl border border-slate-850">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='12' r='12' fill='%23f1f5f9'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>"}
                    alt={user.fullName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-md object-cover border border-slate-700"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white block">{user.fullName}</span>
                    <span className="text-xs text-slate-450 block truncate">{user.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs font-mono font-bold font-semibold">
                  <button onClick={() => handleLinkClick('profile')} className="p-1 px-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:text-white flex items-center justify-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>Profile</span>
                  </button>
                  <button onClick={() => handleLinkClick('history')} className="p-1 px-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:text-white flex items-center justify-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>History</span>
                  </button>
                  <button onClick={() => handleLinkClick('reports')} className="p-1 px-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:text-white flex items-center justify-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>Reports</span>
                  </button>
                  <button onClick={() => handleLinkClick('settings')} className="p-1 px-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:text-white flex items-center justify-center space-x-1">
                    <Settings className="h-3 w-3" />
                    <span>Settings</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    handleLinkClick('home');
                  }}
                  className="w-full text-center mt-3 text-xs text-rose-400 border border-rose-900 py-1.5 rounded bg-rose-950/10 hover:bg-rose-950/30 transition-all font-semibold flex items-center justify-center space-x-1"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout Administrator Session</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    handleLinkClick('login');
                  }}
                  className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-750 font-medium py-2 rounded-lg text-white text-xs cursor-pointer"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>Log In</span>
                </button>
                
                <button
                  onClick={() => {
                    handleLinkClick('register');
                  }}
                  className="flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-500 font-medium py-2 rounded-lg text-white text-xs cursor-pointer shadow-md"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
