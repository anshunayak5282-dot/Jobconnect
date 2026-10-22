import React from 'react';

export function AdminMetrics({
  seekersCount = 0,
  hrsCount = 0,
  pendingJobsCount = 0,
  pendingProfileRequestsCount = 0,
  applicationsCount = 0
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 break-words">Total Seekers</span>
          <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{seekersCount}</p>
        <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Active Candidates</span>
      </div>

      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 break-words">HRs & Co.</span>
          <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{hrsCount} HRs</p>
        <span className="text-[10px] text-indigo-600 font-medium block mt-0.5">Verified Employers</span>
      </div>

      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 break-words">Pending Jobs</span>
          <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-amber-600 mt-2">{pendingJobsCount}</p>
        <span className="text-[10px] text-amber-600 font-medium block mt-0.5">Vacancy moderation</span>
      </div>

      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 break-words">HR Requests</span>
          <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
            </svg>
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-purple-600 mt-2">{pendingProfileRequestsCount}</p>
        <span className="text-[10px] text-purple-600 font-medium block mt-0.5">HR edits pending</span>
      </div>

      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 break-words">Applications</span>
          <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-teal-600 mt-2">{applicationsCount}</p>
        <span className="text-[10px] text-teal-600 font-medium block mt-0.5">Platform throughput</span>
      </div>
    </div>
  );
}
