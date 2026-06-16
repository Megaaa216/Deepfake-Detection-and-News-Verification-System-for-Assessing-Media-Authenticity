import React, { useState } from 'react';
import { 
  Users, BarChart3, Database, ShieldAlert, CheckCircle2, AlertTriangle, 
  Trash2, UserCheck, Shield, ToggleLeft, ToggleRight, Eye, Download, 
  TrendingUp, PieChart, Info, MoreVertical, Layers, Search, Check, Ban
} from 'lucide-react';
import { VerificationResult } from '../types';

interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: 'admin' | 'analyst';
  registrationDate: string;
  status: 'Active' | 'Disabled';
}

interface AdminDashboardViewProps {
  historyList: VerificationResult[];
  onViewResult: (id: string) => void;
  onExportReport: (item: VerificationResult) => void;
}

export default function AdminDashboardView({ historyList, onViewResult, onExportReport }: AdminDashboardViewProps) {
  // 1. Interactive state for mock Users list
  const [users, setUsers] = useState<UserAccount[]>([
    { id: 'usr-001', fullName: 'Dr. Alan Brent', username: 'abrent_forensics', email: 'a.brent@cyber-forensics.verify', role: 'admin', registrationDate: '2026-01-20', status: 'Active' },
    { id: 'usr-002', fullName: 'Prof. Carolyn Vance', username: 'vance_metrics', email: 'c.vance@central-news.verify', role: 'analyst', registrationDate: '2026-02-14', status: 'Active' },
    { id: 'usr-003', fullName: 'Marcus Thorne', username: 'thorne_deepintel', email: 'm.thorne@cyber-forensics.verify', role: 'analyst', registrationDate: '2026-03-01', status: 'Active' },
    { id: 'usr-004', fullName: 'Sarah Jenkins', username: 's_jenkins', email: 's.jenkins@journalism-safety.net', role: 'analyst', registrationDate: '2026-04-11', status: 'Disabled' },
    { id: 'usr-055', fullName: 'Dr. Kenji Sato', username: 'sato_verification', email: 'k.sato@global-telemetry.verify', role: 'analyst', registrationDate: '2026-05-18', status: 'Active' }
  ]);

  // Selected User for detail inspect modal
  const [inspectUser, setInspectUser] = useState<UserAccount | null>(null);
  const [usernameSearch, setUsernameSearch] = useState('');
  const [dashboardNotice, setDashboardNotice] = useState<string | null>(null);

  // Dynamic values based on states
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter(u => u.status === 'Active').length;

  // Analysis counter
  const totalAnalyses = historyList.length;
  const deepfakeAnalyses = historyList.filter(h => h.type === 'image' || h.type === 'video').length;
  const newsVerifications = historyList.filter(h => h.type === 'news_link').length;
  const suspiciousCount = historyList.filter(h => h.status === 'suspicious').length;
  const highRiskCount = historyList.filter(h => h.status === 'likely_deepfake').length;

  // ------------------ Actions ------------------
  const triggerNotice = (msg: string) => {
    setDashboardNotice(msg);
    setTimeout(() => setDashboardNotice(null), 3050);
  };

  const handleEditRole = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'admin' ? 'analyst' : 'admin';
        triggerNotice(`User "${u.fullName}" role changed back to ${newRole.toUpperCase()}.`);
        return { ...u, role: newRole as 'admin' | 'analyst' };
      }
      return u;
    }));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        triggerNotice(`User status updated: "${u.fullName}" has been set to ${newStatus}.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (confirm(`Are you sure you wish to delete user "${target?.fullName}" from the secure directory?This is irreversible.`)) {
      setUsers(users.filter(u => u.id !== userId));
      triggerNotice(`User "${target?.fullName}" profile successfully purged.`);
      if (inspectUser?.id === userId) {
        setInspectUser(null);
      }
    }
  };

  // Filter users query
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(usernameSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(usernameSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(usernameSearch.toLowerCase())
  );

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto text-slate-805 text-left font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            System Admin Security Console
          </h2>
          <p className="text-sm text-slate-500">
            Authoritative node control panel: audit users, verify live media trends, and regulate risk policies.
          </p>
        </div>

        <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 px-4 rounded-full font-mono border border-blue-200 uppercase font-black tracking-widest shrink-0 w-fit flex items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>ADMIN CREDENTIALS CONFIRMED</span>
        </div>
      </div>

      {dashboardNotice && (
        <div className="bg-slate-900 text-white border border-slate-800 p-4 rounded-xl flex items-center space-x-3 text-xs font-mono shadow-md animate-fade-in" id="admin-toast-notice">
          <Info className="h-4 w-4 text-blue-400 shrink-0" />
          <span>{dashboardNotice}</span>
        </div>
      )}

      {/* 1. System Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[9px] font-mono font-bold tracking-widest text-slate-450 uppercase block">System Users</span>
          <span className="text-2xl font-black text-slate-800 font-display block">{totalUsersCount}</span>
          <span className="text-[10px] text-emerald-600 font-mono block">✓ {activeUsersCount} Active Nodes</span>
        </div>

        {/* Combined Runs */}
        <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[9px] font-mono font-bold tracking-widest text-slate-450 uppercase block">Total Analyses</span>
          <span className="text-2xl font-black text-slate-800 font-display block">{totalAnalyses}</span>
          <span className="text-[10px] text-slate-450 font-mono block">Forensic Log entries</span>
        </div>

        {/* Deepfake Scans */}
        <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[9px] font-mono font-bold tracking-widest text-blue-600 uppercase block">Deepfake Checks</span>
          <span className="text-2xl font-black text-blue-700 font-display block">{deepfakeAnalyses}</span>
          <span className="text-[10px] text-slate-400 font-mono block">Photos & Videos</span>
        </div>

        {/* News checks */}
        <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-550 uppercase block">News Audits</span>
          <span className="text-2xl font-black text-emerald-600 font-display block">{newsVerifications}</span>
          <span className="text-[10px] text-slate-400 font-mono block">Links & Citations</span>
        </div>

        {/* Suspicious Warning */}
        <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[9px] font-mono font-bold tracking-widest text-amber-550 block uppercase">Suspicious Alerts</span>
          <span className="text-2xl font-black text-amber-600 font-display block">{suspiciousCount}</span>
          <span className="text-[10px] text-slate-400 font-mono block">Attention Flagged</span>
        </div>

        {/* High Risk Alerts */}
        <div className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[9px] font-mono font-bold tracking-widest text-rose-550 block uppercase">High Risk Alerts</span>
          <span className="text-2xl font-black text-rose-600 font-display block">{highRiskCount}</span>
          <span className="text-[10px] text-rose-500 font-mono font-bold block">🚨 Synthesis anomalies</span>
        </div>
      </div>

      {/* 2. User Directory Management Table */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Users className="h-4.5 w-4.5 text-blue-600" />
              <span>Analyst Directory Management</span>
            </h3>
            <span className="text-xs text-slate-450 block">Modify role clearance, activate accounts, or terminate directory listings.</span>
          </div>

          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search user email or profile..."
              value={usernameSearch}
              onChange={(e) => setUsernameSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 pl-9 pr-3 py-1.5 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-450 font-mono text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">Unique User ID</th>
                <th className="px-5 py-3 font-semibold">Full Profile</th>
                <th className="px-5 py-3 font-semibold">User Email</th>
                <th className="px-5 py-3 font-semibold">Clearance Role</th>
                <th className="px-5 py-3 font-semibold">Registration Date</th>
                <th className="px-5 py-3 font-semibold text-center">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Administrative Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">No profile matches found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isActive = u.status === 'Active';
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr key={u.id} className="hover:bg-slate-51 transition-colors">
                      {/* ID */}
                      <td className="px-5 py-3 font-mono text-slate-450 text-[11px] font-bold">
                        {u.id}
                      </td>

                      {/* Profile info */}
                      <td className="px-5 py-3 font-sans">
                        <span className="font-bold text-slate-900 block">{u.fullName}</span>
                        <span className="text-[10px] text-blue-600 block">@{u.username}</span>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3 font-mono text-slate-500 truncate max-w-[150px]" title={u.email}>
                        {u.email}
                      </td>

                      {/* Role clearance */}
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase font-mono border ${
                          isAdmin 
                            ? 'bg-purple-10 text-purple-700 border-purple-150' 
                            : 'bg-indigo-10 text-indigo-700 border-indigo-150'
                        }`}>
                          <Shield className="h-3 w-3" />
                          <span>{u.role}</span>
                        </span>
                      </td>

                      {/* Reg date */}
                      <td className="px-5 py-3 font-mono text-slate-450 text-[11px]">
                        {u.registrationDate}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-block py-0.5 px-2.5 rounded-full font-semibold text-[10px] uppercase border tracking-wider ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                            : 'bg-slate-50 text-slate-450 border-slate-200'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      {/* Option button block */}
                      <td className="px-5 py-3 text-right space-x-1 text-xs">
                        <button
                          onClick={() => setInspectUser(u)}
                          title="Inspect user details metadata"
                          className="p-1 px-2 border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 hover:bg-blue-50/20 rounded transition-all cursor-pointer inline-flex items-center"
                        >
                          <Eye className="h-3 w-3" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          title={isActive ? 'Disable user access' : 'Enable user access'}
                          className={`p-1 border hover:bg-slate-100 rounded transition-all cursor-pointer inline-flex items-center ${
                            isActive ? 'text-amber-500 border-amber-100 hover:border-amber-400 hover:bg-amber-50/10' : 'text-emerald-500 border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50/10'
                          }`}
                        >
                          {isActive ? <Ban className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                        </button>

                        <button
                          onClick={() => handleEditRole(u.id)}
                          title="Toggle Authorization role level"
                          className="p-1 border border-slate-200 hover:border-purple-300 text-purple-600 hover:bg-purple-50 rounded transition-all cursor-pointer inline-flex items-center font-mono text-[10px] font-bold"
                        >
                          <span>Clearance</span>
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Purge user profile"
                          className="p-1 border border-transparent hover:border-rose-200 text-slate-350 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer inline-flex items-center"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect User Modal overlays */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative animate-fade-in text-left">
            <button
              onClick={() => setInspectUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
              <div className="bg-blue-600/20 p-2.5 rounded-lg text-blue-400 border border-blue-500/30">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-display font-semibold text-white">Security Directory Inspect</h3>
                <p className="text-[11px] font-mono text-slate-400 uppercase">System Key Reference ID: {inspectUser.id}</p>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Profile Name</span>
                <span className="text-white block font-sans font-bold text-sm">{inspectUser.fullName}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">Authority Role</span>
                  <span className="text-purple-400 block font-bold text-xs uppercase">{inspectUser.role} clearance</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">Account Status</span>
                  <span className={`block font-bold text-xs ${inspectUser.status === 'Active' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {inspectUser.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Analyst Email Link</span>
                <span className="text-blue-300 block text-xs underline truncate">{inspectUser.email}</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded border border-slate-800 text-[11px] leading-relaxed text-slate-400 font-sans">
                🛡️ This investigator holds authentic digital keys to sign official certificates. Last logged scan activity: <strong className="text-slate-202 text-xs font-mono">{new Date().toISOString().slice(0, 10)} 15:20</strong>.
              </div>
            </div>

            <div className="pt-4 flex space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setInspectUser(null)}
                className="w-full bg-slate-800 hover:bg-slate-705 text-white py-2 rounded-lg text-xs font-semibold cursor-pointer text-center"
              >
                Close Audit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Analysis Monitoring table logs */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-display font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Database className="h-4.5 w-4.5 text-blue-600" />
            <span>Global Pipeline Analysis Watchtower</span>
          </h3>
          <span className="text-xs text-slate-450 block">Inspect forensic runs across all nodes. Click details to audit dynamic metadata.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-450 font-mono text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">Audit Check ID</th>
                <th className="px-5 py-3 font-semibold">Responsible Node</th>
                <th className="px-5 py-3 font-semibold">Forensic Format</th>
                <th className="px-5 py-3 font-semibold">Verification Target</th>
                <th className="px-5 py-3 font-semibold text-center font-bold">Severity</th>
                <th className="px-5 py-3 font-semibold text-center">Score</th>
                <th className="px-5 py-3 font-semibold text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyList.map((item, index) => {
                const isAuth = item.status === 'likely_authentic';
                const isSusp = item.status === 'suspicious';
                const analystName = index % 3 === 0 ? 'Dr. Alan Brent' : index % 3 === 1 ? 'Prof. Carolyn Vance' : 'Marcus Thorne';
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* ID */}
                    <td className="px-5 py-3 font-mono font-bold text-slate-450 text-[10px]">
                      {item.id}
                    </td>

                    {/* Analyst */}
                    <td className="px-5 py-3 font-sans">
                      <span className="font-semibold text-slate-800">{analystName}</span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-3 uppercase font-mono text-[10px] text-slate-500">
                      {item.type.replace('_', ' ')}
                    </td>

                    {/* Target Name */}
                    <td className="px-5 py-3 max-w-[210px] truncate font-semibold text-slate-900" title={item.targetName}>
                      {item.targetName}
                    </td>

                    {/* Risk Badge */}
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block py-0.5 px-2.5 rounded-full font-semibold text-[9px] uppercase border tracking-wider ${
                        isAuth 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                          : isSusp 
                          ? 'bg-amber-50 text-amber-700 border-amber-150' 
                          : 'bg-rose-50 text-rose-700 border-rose-150'
                      }`}>
                        {item.status.replace('likely_', '')}
                      </span>
                    </td>

                    {/* Risk score */}
                    <td className="px-5 py-3 text-center font-mono font-bold text-xs">
                      {item.riskScore}%
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onViewResult(item.id)}
                        className="px-2 py-1 border border-slate-205 hover:border-blue-450 text-slate-600 hover:text-blue-700 hover:bg-blue-50/10 rounded transition-all cursor-pointer text-[10px] font-semibold"
                      >
                        Inspect Result
                      </button>
                      
                      <button
                        onClick={() => onExportReport(item)}
                        className="p-1 px-1.5 border border-transparent text-slate-450 hover:text-slate-850 hover:bg-slate-50 rounded transition-all cursor-pointer inline-flex items-center"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Statistics responsive SVG charts block */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Stats: Historical Analysis Trends */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-medium text-slate-900 text-sm flex items-center space-x-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
              <span>Analyses Historical Growth</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Time Period: 6 Months</span>
          </div>

          {/* Area trend SVG Chart */}
          <div className="relative pt-2">
            <svg viewBox="0 0 500 180" className="w-full h-auto overflow-visible select-none font-mono text-[9px] text-slate-400">
              <g stroke="#f3f4f6" strokeWidth="1">
                <line x1="30" y1="20" x2="480" y2="20" />
                <line x1="30" y1="55" x2="480" y2="55" />
                <line x1="30" y1="90" x2="480" y2="90" />
                <line x1="30" y1="125" x2="480" y2="125" />
                <line x1="30" y1="150" x2="480" y2="150" stroke="#e2e8f0" strokeWidth="1.5" />
              </g>

              {/* Y markers */}
              <text x="22" y="24" textAnchor="end">120</text>
              <text x="22" y="59" textAnchor="end">80</text>
              <text x="22" y="94" textAnchor="end">40</text>
              <text x="22" y="129" textAnchor="end">20</text>
              <text x="22" y="154" textAnchor="end">0</text>

              {/* Path points for area and line charts: Jan (20), Feb (45), Mar (32), Apr (78), May (95), Jun (110)
                  X maps index 0-5 to (40, 120, 200, 280, 360, 440)
                  Y maps 0-120 to height (150 to 20). Formula: 150 - (val / 120 * 130)
                  Jan (20) -> 128
                  Feb (45) -> 101.2
                  Mar (32) -> 115.3
                  Apr (78) -> 65.5
                  May (95) -> 47.1
                  Jun (110) -> 30.8
              */}
              <path 
                d="M 40,128 L 120,101.2 L 200,115.3 L 280,65.5 L 360,47.1 L 440,30.8" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              <path 
                d="M 40,150 L 40,128 L 120,101.2 L 200,115.3 L 280,65.5 L 360,47.1 L 440,30.8 L 440,150 Z" 
                fill="url(#admin-area-grad)" 
                opacity="0.12"
              />

              <circle cx="440" cy="30.8" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

              {/* X markers */}
              <text x="40" y="166" textAnchor="middle">Jan</text>
              <text x="120" y="166" textAnchor="middle">Feb</text>
              <text x="200" y="166" textAnchor="middle">Mar</text>
              <text x="280" y="166" textAnchor="middle">Apr</text>
              <text x="360" y="166" textAnchor="middle">May</text>
              <text x="440" y="166" textAnchor="middle" className="font-bold text-slate-805">Jun (Active)</text>

              <defs>
                <linearGradient id="admin-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right Stats: Types & Risk Distributions */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-medium text-slate-900 text-sm flex items-center space-x-1.5">
              <PieChart className="h-4.5 w-4.5 text-blue-600" />
              <span>Classification Distribution Ranges</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Dynamic Levels</span>
          </div>

          {/* Bar metrics representing distributions */}
          <div className="pt-2 space-y-4 text-xs">
            {/* Row 1: Deepfakes vs news */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Deepfake Detection Blocks</span>
                <span className="font-mono text-slate-400">Total volume: {deepfakeAnalyses}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.max(10, Math.round((deepfakeAnalyses / (totalAnalyses || 1)) * 100))}%` }} />
              </div>
            </div>

            {/* Row 2: News Link Auditing */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">News Credibility Auditing</span>
                <span className="font-mono text-slate-400">Total volume: {newsVerifications}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.max(10, Math.round((newsVerifications / (totalAnalyses || 1)) * 100))}%` }} />
              </div>
            </div>

            {/* Row 3: Coordinated suspicious ratio */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Suspicious Severity warnings</span>
                <span className="font-mono text-slate-400">{suspiciousCount} warnings ({Math.round(totalAnalyses ? (suspiciousCount / totalAnalyses) * 100 : 0)}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.max(5, Math.round((suspiciousCount / (totalAnalyses || 1)) * 100))}%` }} />
              </div>
            </div>

            {/* Row 4: High risk alerts */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Likely Deepfake / Falsehood Alerts</span>
                <span className="font-mono text-slate-400">{highRiskCount} alerts ({Math.round(totalAnalyses ? (highRiskCount / totalAnalyses) * 100 : 0)}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.max(5, Math.round((highRiskCount / (totalAnalyses || 1)) * 100))}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
