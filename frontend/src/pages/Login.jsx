import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = ({ onBack }) => {
  const { switchRole, showToast } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loginRole, setLoginRole] = useState('seeker');
  const [email, setEmail] = useState('ankit.dev@example.com');
  const [password, setPassword] = useState('candidate123');
  const [showPass, setShowPass] = useState(false);

  // Registration state
  const [regRole, setRegRole] = useState('user');
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const fillDemo = (role) => {
    setMode('login');
    if (role === 'user') {
      setLoginRole('seeker');
      setEmail('ankit.dev@example.com');
      setPassword('candidate123');
      showToast("Auto-filled Candidate credentials!", "info");
    } else if (role === 'hr') {
      setLoginRole('hr');
      setEmail('priya.hr@abctech.com');
      setPassword('recruiter123');
      showToast("Auto-filled HR Recruiter credentials!", "info");
    } else if (role === 'admin') {
      setLoginRole('admin');
      setEmail('admin@jobconnect.io');
      setPassword('superadmin123');
      showToast("Auto-filled Super Admin credentials!", "info");
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    switchRole(loginRole);
    showToast("Authenticated successfully with JWT!", "success");
    onBack();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    showToast(`Account registered for ${regName}! Please sign in.`, "success");
    setMode('login');
    setEmail(regEmail);
    setPassword(regPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-10 animate-fade-in">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left: Brand showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              React + Tailwind OS
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Connecting Ambition with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200">Opportunity</span>.
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              One secure gateway for Job Seekers to land high-impact careers, HRs to recruit verified talent, and Administrators to monitor operations.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold">✓</span>
                <span>1-Click Fast Track Applications & Resume Vault</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold">✓</span>
                <span>Live 5-Stage Candidate Status Stepper</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold">✓</span>
                <span>Admin Verified Vacancies & Encrypted JWT Auth</span>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="mt-6 text-xs text-indigo-300 hover:text-white flex items-center gap-1.5 font-bold transition"
          >
            ← Back to Job Portal
          </button>
        </div>

        {/* Right: Auth form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setMode('login')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                  mode === 'login' ? 'bg-white text-indigo-600' : 'text-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                  mode === 'register' ? 'bg-white text-indigo-600' : 'text-slate-600'
                }`}
              >
                Create Account
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">JWT Secure RBAC</span>
          </div>

          {/* 1-Click Demo Fillers */}
          <div className="mb-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
            <span className="text-[11px] font-bold text-indigo-950 block mb-2">
              ⚡ Quick Test: 1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => fillDemo('user')} className="p-2 rounded-xl bg-white border border-indigo-100 text-left hover:shadow-sm">
                <span className="block text-[10px] font-bold text-indigo-700">👤 Candidate</span>
                <span className="block text-[9px] text-slate-500 truncate">ankit.dev</span>
              </button>
              <button onClick={() => fillDemo('hr')} className="p-2 rounded-xl bg-white border border-purple-100 text-left hover:shadow-sm">
                <span className="block text-[10px] font-bold text-purple-700">💼 Recruiter</span>
                <span className="block text-[9px] text-slate-500 truncate">priya.hr</span>
              </button>
              <button onClick={() => fillDemo('admin')} className="p-2 rounded-xl bg-white border border-rose-100 text-left hover:shadow-sm">
                <span className="block text-[10px] font-bold text-rose-700">🛡️ Admin</span>
                <span className="block text-[9px] text-slate-500 truncate">admin@</span>
              </button>
            </div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Sign in role:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['seeker', 'hr', 'admin'].map(r => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setLoginRole(r)}
                      className={`p-2 rounded-xl border text-center font-bold capitalize transition ${
                        loginRole === r ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {r === 'seeker' ? 'Candidate' : r === 'hr' ? 'HR Recruiter' : 'Admin'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
              >
                Sign In to JobConnect
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Register role:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('user')}
                    className={`p-2 rounded-xl border text-center font-bold transition ${
                      regRole === 'user' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                    }`}
                  >
                    👤 Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('hr')}
                    className={`p-2 rounded-xl border text-center font-bold transition ${
                      regRole === 'hr' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200'
                    }`}
                  >
                    💼 HR Recruiter
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {regRole === 'hr' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="Acme Technologies"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
              >
                Create Free Account
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
