import React from 'react';

export function AdminJobModeration({
  pendingJobs = [],
  onApproveJob,
  onRejectJob
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Job Moderation & Verification Queue
          </h3>
          <p className="text-xs text-slate-500">Review jobs submitted by HR before they are made public to candidates.</p>
        </div>
        <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full font-bold border border-amber-200">
          {pendingJobs.length} Pending Approval
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {pendingJobs.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
            <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="font-bold text-slate-800 text-xs">All Clear! No Pending Vacancies</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Every submitted job has been verified and processed.</p>
          </div>
        ) : (
          pendingJobs.map((job) => {
            const skills = Array.isArray(job.skills)
              ? job.skills
              : job.skills
              ? String(job.skills).split(',').map((s) => s.trim())
              : [];

            return (
              <div
                key={job.id}
                className="p-4 bg-slate-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      Pending Verification
                    </span>
                  </div>
                  <p className="text-slate-600 font-semibold">
                    {job.company || job.companyName} • {job.location} • ₹{job.salaryMin}–{job.salaryMax} LPA • {job.experience}
                  </p>
                  <p className="text-slate-500 text-[11px]">{job.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRejectJob(job.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 font-bold hover:bg-rose-50 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onApproveJob(job.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Approve & Publish
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
