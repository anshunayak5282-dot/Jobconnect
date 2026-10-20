import React from 'react';

export function AuthHeroShowcase() {
  return (
    <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-600/25 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
          Connecting Ambition with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200">
            Opportunity
          </span>.
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
    </div>
  );
}
