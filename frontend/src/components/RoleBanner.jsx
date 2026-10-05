import React from 'react';
import { useAuth } from '../context/AuthContext';

export const RoleBanner = () => {
  const { data, switchRole, resetAllData } = useAuth();
  const currentRole = data.currentUserRole;

  return (
    <aside aria-label="Role Switcher" className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/50 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="font-medium text-slate-300">Active Simulation Role:</span>
        <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${
          currentRole === 'seeker' ? 'bg-indigo-600 text-white border-indigo-400/40' :
          currentRole === 'hr' ? 'bg-purple-600 text-white border-purple-400/40' :
          'bg-rose-600 text-white border-rose-400/40'
        }`}>
          {currentRole === 'seeker' ? 'Candidate' : currentRole === 'hr' ? 'HR Recruiter' : 'Super Admin'}
        </span>
        <span className="hidden md:inline text-slate-400 text-[11px]">• Switch views instantly to test all user journeys</span>
      </div>

      <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
        <button
          onClick={() => switchRole('seeker')}
          className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 ${
            currentRole === 'seeker' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          👤 Candidate
        </button>
        <button
          onClick={() => switchRole('hr')}
          className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 ${
            currentRole === 'hr' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          💼 HR / Recruiter
        </button>
        <button
          onClick={() => switchRole('admin')}
          className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 ${
            currentRole === 'admin' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          🛡️ Admin
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-2">
        <button
          onClick={resetAllData}
          title="Reset demo seed data"
          className="text-[11px] text-slate-400 hover:text-rose-300 flex items-center gap-1 transition"
        >
          🔄 Reset Data
        </button>
      </div>
    </aside>
  );
};
