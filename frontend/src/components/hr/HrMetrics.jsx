import React from 'react';

export function HrMetrics({
  totalJobs = 0,
  activeJobs = 0,
  applicationsCount = 0,
  shortlistedCount = 0,
  selectedCount = 0
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-semibold text-slate-500">Total Jobs Posted</p>
        <p className="text-2xl font-black text-slate-900 mt-1">{totalJobs}</p>
        <span className="text-[10px] text-indigo-600 font-semibold">All vacancies</span>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-semibold text-slate-500">Active Approved</p>
        <p className="text-2xl font-black text-emerald-600 mt-1">{activeJobs}</p>
        <span className="text-[10px] text-emerald-600 font-semibold">Live in market</span>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-semibold text-slate-500">Applications Received</p>
        <p className="text-2xl font-black text-indigo-600 mt-1">{applicationsCount}</p>
        <span className="text-[10px] text-indigo-600 font-semibold">Candidates applied</span>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
        <p className="text-2xl font-black text-purple-600 mt-1">{shortlistedCount}</p>
        <span className="text-[10px] text-purple-600 font-semibold">In technical stages</span>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
        <p className="text-xs font-semibold text-slate-500">Hired / Selected</p>
        <p className="text-2xl font-black text-teal-600 mt-1">{selectedCount}</p>
        <span className="text-[10px] text-teal-600 font-semibold">Offer accepted</span>
      </div>
    </div>
  );
}
