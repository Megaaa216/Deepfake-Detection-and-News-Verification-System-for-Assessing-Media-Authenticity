import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import VerifyView from './components/VerifyView';
import MethodsView from './components/MethodsView';
import DashboardView from './components/DashboardView';
import ReportsView from './components/ReportsView';
import AboutView from './components/AboutView';

import { VerificationResult, Stats } from './types';
import { INITIAL_HISTORY, INITIAL_STATS } from './sampleData';

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeSubTab, setActiveSubTab] = useState<'image' | 'video' | 'news_link'>('image');

  // Authenticated analyst state
  const [user, setUser] = useState<{ loggedIn: boolean; email: string | null }>({
    loggedIn: false,
    email: null,
  });

  // History & Metrics State
  const [historyList, setHistoryList] = useState<VerificationResult[]>([]);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);

  // Cross-view selections (e.g. clicking "view details" on history routes to report preset)
  const [reportFocusItem, setReportFocusItem] = useState<VerificationResult | null>(null);

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
  }, []);

  // Sync state to local storage when changed
  const saveToStorage = (updatedHistory: VerificationResult[], updatedStats: Stats) => {
    localStorage.setItem('veramedia_history', JSON.stringify(updatedHistory));
    localStorage.setItem('veramedia_stats', JSON.stringify(updatedStats));
  };

  const handleLogin = () => {
    setUser({
      loggedIn: true,
      email: 'a.brent@cyber-forensics.verify',
    });
  };

  const handleLogout = () => {
    setUser({
      loggedIn: false,
      email: null,
    });
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
    setActiveTab('verify');
  };

  return (
    <div id="app-viewport" className="min-h-screen bg-slate-100 flex flex-col font-sans transition-colors duration-150 text-slate-800">
      
      {/* Top sticky navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
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
            onNavigateToTab={setActiveTab} 
          />
        )}

        {activeTab === 'verify' && (
          <VerifyView 
            activeSubTab={activeSubTab} 
            setActiveSubTab={setActiveSubTab} 
            onAddHistoryItem={handleAddHistoryItem} 
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
            onViewReport={handleViewHistoricalReport}
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

      </main>

      {/* Trust verification footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-450 py-8 text-xs font-mono text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-slate-205">
            Deepfake Detection and News Verification System for Assessing Media Authenticity — Professional Prototype Console
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-500">
            <span>© 2026 VeraMedia Secure Network. All rights reserved.</span>
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
