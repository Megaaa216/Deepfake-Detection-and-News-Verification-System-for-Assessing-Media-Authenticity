import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import VerifyView from './components/VerifyView';
import MethodsView from './components/MethodsView';
import DashboardView from './components/DashboardView';
import ReportsView from './components/ReportsView';
import AboutView from './components/AboutView';

// Import newly added pages
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ForgotPasswordView from './components/ForgotPasswordView';
import ProfileView from './components/ProfileView';
import DetailedResultView from './components/DetailedResultView';
import AdminDashboardView from './components/AdminDashboardView';
import SettingsView from './components/SettingsView';

import { VerificationResult, Stats } from './types';
import { INITIAL_HISTORY, INITIAL_STATS } from './sampleData';
import { authService } from './services/api';

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeSubTab, setActiveSubTab] = useState<'image' | 'video' | 'news_link'>('video');

  // Track dynamic result item ID for results detail representation
  const [selectedResultId, setSelectedResultId] = useState<string>('check-103');

  // Authenticated analyst state with profile properties
  const [user, setUser] = useState<{
    loggedIn: boolean;
    email: string | null;
    fullName?: string;
    username?: string;
    role?: 'admin' | 'analyst';
    createdAt?: string;
    avatarUrl?: string;
  }>({
    loggedIn: false,
    email: null,
  });

  // History & Metrics State
  const [historyList, setHistoryList] = useState<VerificationResult[]>([]);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);

  // Registration success notification state
  const [registrationSuccessInfo, setRegistrationSuccessInfo] = useState<{ email?: string; message?: string } | null>(null);

  // Cross-view selections (e.g. clicking "view details" on history routes to report preset)
  const [reportFocusItem, setReportFocusItem] = useState<VerificationResult | null>(null);

  // Synchronize URL routing on load and on state mutations
  useEffect(() => {
    const syncRoute = () => {
      const hash = window.location.hash || ''; // e.g. '#/profile', '#/results/check-102'
      const path = window.location.pathname || '';

      let targetTab = 'home';
      let paramId = '';

      if (hash.startsWith('#/')) {
        const parts = hash.slice(2).split('/');
        targetTab = parts[0];
        if (parts[1]) {
          paramId = parts[1];
        }
      } else if (path !== '/' && path !== '/index.html') {
        const parts = path.slice(1).split('/');
        targetTab = parts[0];
        if (parts[1]) {
          paramId = parts[1];
        }
      }

      const knownTabs = [
        'home', 'verify', 'methods', 'history', 'reports', 'about', 
        'login', 'register', 'forgot-password', 'profile', 'results', 'admin', 'settings'
      ];

      if (knownTabs.includes(targetTab)) {
        setActiveTab(targetTab);
        if (targetTab === 'results' && paramId) {
          setSelectedResultId(paramId);
        }
      }
    };

    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  // Update URL hash whenever active properties undergo client changes
  const handleTabChange = (newTab: string, optionalParam?: string) => {
    setActiveTab(newTab);
    if (newTab === 'results' && optionalParam) {
      setSelectedResultId(optionalParam);
      window.location.hash = `#/results/${optionalParam}`;
    } else {
      window.location.hash = `#/${newTab}`;
    }
  };

  // Load baseline on mount
  useEffect(() => {
    const cachedHistory = localStorage.getItem('veramedia_history');
    if (cachedHistory) {
      try {
        setHistoryList(JSON.parse(cachedHistory));
      } catch (e) {
        setHistoryList(INITIAL_HISTORY);
      }
    } else {
      setHistoryList(INITIAL_HISTORY);
    }

    const cachedStats = localStorage.getItem('veramedia_stats');
    if (cachedStats) {
      try {
        setStats(JSON.parse(cachedStats));
      } catch (e) {
        setStats(INITIAL_STATS);
      }
    } else {
      setStats(INITIAL_STATS);
    }

    const cachedUser = localStorage.getItem('veramedia_user');
    const token = localStorage.getItem('accessToken') || localStorage.getItem('veramedia_accessToken');
    if (cachedUser && token) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        setUser({ ...parsedUser, loggedIn: true });
      } catch (e) {
        // Safe to ignore
      }
    } else {
      setUser({ loggedIn: false, email: null });
    }
  }, []);

  // Redirect protected tabs to login if not authenticated
  useEffect(() => {
    const protectedTabs = ['history', 'verify', 'reports', 'admin', 'profile', 'settings'];
    if (protectedTabs.includes(activeTab)) {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('veramedia_accessToken');
      if (!token || !user.loggedIn) {
        handleTabChange('login');
      }
    }
  }, [activeTab, user.loggedIn]);

  // Sync state to local storage when changed
  const saveToStorage = (updatedHistory: VerificationResult[], updatedStats: Stats) => {
    localStorage.setItem('veramedia_history', JSON.stringify(updatedHistory));
    localStorage.setItem('veramedia_stats', JSON.stringify(updatedStats));
  };

  const handleLogin = (customUser?: { fullName: string; username: string; email: string; role?: 'admin' | 'analyst'; avatarUrl?: string }) => {
    const defaultProfile = {
      loggedIn: true,
      email: customUser?.email || 'a.brent@cyber-forensics.verify',
      fullName: customUser?.fullName || 'Dr. Alan Brent',
      username: customUser?.username || 'abrent_forensics',
      role: customUser?.role || ((customUser?.email === 'a.brent@cyber-forensics.verify' || !customUser?.email) ? 'admin' : 'analyst'),
      createdAt: '2026-01-20',
      avatarUrl: customUser?.avatarUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='12' r='12' fill='%23f1f5f9'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>"
    };
    setUser(defaultProfile);
    localStorage.setItem('veramedia_user', JSON.stringify(defaultProfile));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Backend logout warning:', e);
    }
    setUser({
      loggedIn: false,
      email: null,
    });
    localStorage.removeItem('veramedia_user');
    handleTabChange('login');
  };

  const handleUpdateProfile = (updatedUser: { fullName: string; username: string; email: string, avatarUrl?: string }) => {
    const freshUser = {
      ...user,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl || user.avatarUrl
    };
    setUser(freshUser);
    localStorage.setItem('veramedia_user', JSON.stringify(freshUser));
  };

  const handleAddHistoryItem = (newItem: VerificationResult) => {
    const updatedHistory = [newItem, ...historyList];
    setHistoryList(updatedHistory);

    // Calculate updated summary stats
    const total = stats.totalChecks + 1;
    let trusted = stats.trustedCount;
    let susp = stats.suspiciousCount;
    let high = stats.highRiskCount;

    if (newItem.status === 'likely_authentic') {
      trusted += 1;
    } else if (newItem.status === 'suspicious') {
      susp += 1;
    } else {
      high += 1;
    }

    const updatedStats = {
      totalChecks: total,
      trustedCount: trusted,
      suspiciousCount: susp,
      highRiskCount: high,
    };

    setStats(updatedStats);
    saveToStorage(updatedHistory, updatedStats);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const targetItem = historyList.find(h => h.id === id);
    const updatedHistory = historyList.filter(item => item.id !== id);
    setHistoryList(updatedHistory);

    // Adjust counts downwards
    if (targetItem) {
      let trusted = stats.trustedCount;
      let susp = stats.suspiciousCount;
      let high = stats.highRiskCount;

      if (targetItem.status === 'likely_authentic') {
        trusted = Math.max(0, trusted - 1);
      } else if (targetItem.status === 'suspicious') {
        susp = Math.max(0, susp - 1);
      } else {
        high = Math.max(0, high - 1);
      }

      const updatedStats = {
        totalChecks: Math.max(0, stats.totalChecks - 1),
        trustedCount: trusted,
        suspiciousCount: susp,
        highRiskCount: high,
      };

      setStats(updatedStats);
      saveToStorage(updatedHistory, updatedStats);
    } else {
      saveToStorage(updatedHistory, stats);
    }

    // Clean up focus item if deleted
    if (reportFocusItem?.id === id) {
      setReportFocusItem(null);
    }
  };

  const handleResetHistory = () => {
    setHistoryList(INITIAL_HISTORY);
    setStats(INITIAL_STATS);
    localStorage.removeItem('veramedia_history');
    localStorage.removeItem('veramedia_stats');
  };

  // Switch to report view from history log item selection
  const handleViewHistoricalReport = (item: VerificationResult) => {
    setReportFocusItem(item);
    setActiveTab('reports');
  };

  // Quick navigation from CTA buttons on Home page
  const handleNavigateToVerify = (format: 'image' | 'video' | 'news_link') => {
    setActiveSubTab(format);
    handleTabChange('verify');
  };

  return (
    <div id="app-viewport" className="min-h-screen bg-slate-100 dark:bg-[#0a1120] flex flex-col font-sans transition-colors duration-200 text-slate-800 dark:text-slate-200">
      
      {/* Top sticky navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />

      {/* Main body viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Router switches */}
        {activeTab === 'home' && (
          <HomeView 
            onNavigateToVerify={handleNavigateToVerify} 
            onNavigateToTab={handleTabChange} 
          />
        )}

        {activeTab === 'verify' && (
          <VerifyView 
            user={user}
            onNavigateToTab={handleTabChange}
            activeSubTab={activeSubTab} 
            setActiveSubTab={setActiveSubTab} 
            onAddHistoryItem={(newItem) => {
              handleAddHistoryItem(newItem);
              handleTabChange('results', newItem.id);
            }} 
          />
        )}

        {activeTab === 'methods' && (
          <MethodsView />
        )}

        {activeTab === 'history' && (
          <DashboardView 
            historyList={historyList} 
            stats={stats} 
            onDeleteHistoryItem={handleDeleteHistoryItem} 
            onResetHistoryList={handleResetHistory}
            onViewReport={(item) => handleTabChange('results', item.id)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView 
            historyList={historyList} 
            preselectedResult={reportFocusItem} 
            onClearPreselection={() => setReportFocusItem(null)} 
          />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}

        {/* 0. Dedicated Login Page */}
        {activeTab === 'login' && (
          <LoginView 
            onLogin={(customUser) => {
              handleLogin(customUser);
              setRegistrationSuccessInfo(null);
              handleTabChange('home');
            }}
            onNavigateToRegister={() => {
              setRegistrationSuccessInfo(null);
              handleTabChange('register');
            }}
            onNavigateToForgotPassword={() => {
              setRegistrationSuccessInfo(null);
              handleTabChange('forgot-password');
            }}
            initialEmail={registrationSuccessInfo?.email}
            registrationSuccessMessage={registrationSuccessInfo?.message}
          />
        )}

        {/* 1. Register Dedicated Page */}
        {activeTab === 'register' && (
          <RegisterView 
            onRegisterSuccess={(newUser) => {
              setRegistrationSuccessInfo({
                email: newUser.email,
                message: "Security credentials created successfully! Please enter your password to sign in now."
              });
              handleTabChange('login');
            }}
            onNavigateToLogin={() => {
              setRegistrationSuccessInfo(null);
              handleTabChange('login');
            }}
          />
        )}

        {/* 2. Forgot Password Recovery Page */}
        {activeTab === 'forgot-password' && (
          <ForgotPasswordView 
            onNavigateToLogin={() => handleTabChange('login')}
          />
        )}

        {/* 3. User Profile Management Page */}
        {activeTab === 'profile' && (
          <ProfileView 
            user={user} 
            onUpdateUser={handleUpdateProfile} 
            historyList={historyList} 
            onViewReport={(item) => handleTabChange('results', item.id)}
          />
        )}

        {/* 3.1. Settings Control Center (Only for Authenticated Analysts) */}
        {activeTab === 'settings' && (
          user.loggedIn ? (
            <SettingsView 
              user={user} 
              onUpdateUser={handleUpdateProfile} 
              onLogout={handleLogout}
              historyList={historyList} 
              onResetHistoryList={handleResetHistory}
            />
          ) : (
            <HomeView 
              onNavigateToVerify={handleNavigateToVerify} 
              onNavigateToTab={handleTabChange} 
            />
          )
        )}

        {/* 4. Detailed Analysis Result Page */}
        {activeTab === 'results' && (
          <DetailedResultView 
            resultId={selectedResultId} 
            historyList={historyList} 
            onBackToHistory={() => handleTabChange('history')}
          />
        )}

        {/* 5. Admin Dashboard Controller */}
        {activeTab === 'admin' && (
          <AdminDashboardView 
            historyList={historyList} 
            onViewResult={(id) => handleTabChange('results', id)} 
            onExportReport={handleViewHistoricalReport}
          />
        )}

      </main>

      {/* Trust verification footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-450 py-8 text-xs font-mono text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-slate-205">
            TrustLens Deepfake Detection and News Verification System for Assessing Media Authenticity — Professional Prototype Console
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-500">
            <span>© 2026 TrustLens Secure Network. All rights reserved.</span>
            <span>•</span>
            <span>IFCN FACT REGISTER COMPLIANT</span>
            <span>•</span>
            <span>CAI-SIGNATURE COMPATIBLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
