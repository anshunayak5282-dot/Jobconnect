import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const { data } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const currentRole = data.currentUserRole;

  const seekerTabs = [
    { id: 'explore', label: 'Explore Jobs' },
    { id: 'applications', label: `My Applications (${data.applications.filter(a => a.applicantEmail === data.profile.email).length})` },
    { id: 'saved', label: `Saved (${data.savedJobIds.length})` },
    { id: 'profile', label: 'My Profile & Resume' }
  ];

  return (
    <header className="glass-nav border-b border-slate-200 sticky top-9 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent">
              JobConnect
            </span>
            <span className="block text-[10px] font-semibold text-indigo-700 tracking-wider uppercase -mt-1">
              React + Tailwind OS
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
          {currentRole === 'seeker' && seekerTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                activeTab === t.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}

          {currentRole === 'hr' && (
            <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-xl border border-purple-100">
              💼 Enterprise Recruiter Portal • ABC Tech
            </span>
          )}

          {currentRole === 'admin' && (
            <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
              🛡️ Super Admin Master Console
            </span>
          )}
        </nav>

        {/* User Pill, Login button & Notifications */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            title="Open Sign In / Register Page"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            <span className="hidden sm:inline">Sign In / Switch</span>
          </button>

          <div
            onClick={onOpenLogin}
            className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full border border-slate-200/80 cursor-pointer transition"
          >
            <div className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center ${
              currentRole === 'seeker' ? 'bg-indigo-600' : currentRole === 'hr' ? 'bg-purple-600' : 'bg-rose-600'
            }`}>
              {currentRole === 'seeker' ? 'AK' : currentRole === 'hr' ? 'PS' : 'AD'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentRole === 'seeker' ? data.profile.name : currentRole === 'hr' ? 'Priya Sharma' : 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-500 leading-none">
                {currentRole === 'seeker' ? 'Candidate' : currentRole === 'hr' ? 'HR Recruiter' : 'Super Admin'}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotif && (
              <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    Activity Feed
                  </h4>
                  <button onClick={() => setShowNotif(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
                </div>
                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto text-xs">
                  {data.notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-bold text-slate-800 text-xs">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.text}</p>
                      <span className="text-[10px] text-indigo-600 font-semibold block mt-1">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
