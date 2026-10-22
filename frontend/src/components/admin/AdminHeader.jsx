import React from 'react';

export function AdminHeader() {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
          Platform Master Console
        </div>
        <h2 className="text-xl sm:text-2xl font-black mt-1 break-words">Super Admin Operations & Moderation</h2>
        <p className="text-xs text-slate-300 break-words mt-0.5">
          Oversee ecosystem integrity, verify new HR job postings, monitor accounts, and inspect platform metrics.
        </p>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs shrink-0 w-full sm:w-auto">
        <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-left sm:text-right flex-1 sm:flex-initial">
          <span className="block text-[10px] text-slate-400">Database Engine</span>
          <span className="font-bold text-emerald-400 text-[11px] sm:text-xs">MySQL 8.x</span>
        </div>
        <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-left sm:text-right flex-1 sm:flex-initial">
          <span className="block text-[10px] text-slate-400">Auth Guard</span>
          <span className="font-bold text-indigo-300 text-[11px] sm:text-xs">JWT + bcrypt</span>
        </div>
      </div>
    </div>
  );
}
