import React from 'react';

export function HrMetrics({
  totalJobs = 0,
  activeJobs = 0,
  applicationsCount = 0,
  shortlistedCount = 0,
  selectedCount = 0
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 break-words">Total Jobs Posted</p>
        <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalJobs}</p>
        <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">All vacancies</span>
      </div>
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 break-words">Active Approved</p>
        <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{activeJobs}</p>
        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Live in market</span>
      </div>
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 break-words">Applications</p>
        <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">{applicationsCount}</p>
        <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">Candidates applied</span>
      </div>
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 break-words">Shortlisted</p>
        <p className="text-xl sm:text-2xl font-black text-purple-600 mt-1">{shortlistedCount}</p>
        <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">In technical stages</span>
      </div>
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
        <p className="text-xs font-semibold text-slate-500 break-words">Hired / Selected</p>
        <p className="text-xl sm:text-2xl font-black text-teal-600 mt-1">{selectedCount}</p>
        <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">Offer accepted</span>
      </div>
    </div>
  );
}
