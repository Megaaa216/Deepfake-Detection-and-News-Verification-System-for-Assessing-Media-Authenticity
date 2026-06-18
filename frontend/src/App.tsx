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

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeSubTab, setActiveSubTab] = useState<'image' | 'video' | 'news_link'>('news_link');

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
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        // Safe to ignore
      }
    }
  }, []);

  // Sync state to local storage when changed
  const saveToStorage = (updatedHistory: VerificationResult[], updatedStats: Stats) => {
    localStorage.setItem('veramedia_history', JSON.stringify(updatedHistory));
    localStorage.setItem('veramedia_stats', JSON.stringify(updatedStats));
  };

  const handleLogin = (customUser?: { fullName: string; username: string; email: string }) => {
    const defaultProfile = {
      loggedIn: true,
      email: customUser?.email || 'a.brent@cyber-forensics.verify',
      fullName: customUser?.fullName || 'Dr. Alan Brent',
      username: customUser?.username || 'abrent_forensics',
      role: (customUser?.email === 'a.brent@cyber-forensics.verify' || !customUser?.email) ? 'admin' : 'analyst' as 'admin' | 'analyst',
      createdAt: '2026-01-20',
      avatarUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='12' r='12' fill='%23f1f5f9'/><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%2394a3b8'/></svg>"
    };
    setUser(defaultProfile);
    localStorage.setItem('veramedia_user', JSON.stringify(defaultProfile));
  };

  const handleLogout = () => {
    setUser({
      loggedIn: false,
      email: null,
    });
    localStorage.removeItem('veramedia_user');
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

The created file content seems to have an insertion error: around 