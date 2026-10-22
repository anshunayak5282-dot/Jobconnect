import React from 'react';

export function AdminJobModeration({
  pendingJobs = [],
  onApproveJob,
  onRejectJob
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="min-w-0">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 break-words">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
            Job Moderation & Verification Queue
          </h3>
          <p className="text-xs text-slate-500 break-words mt-0.5">Review jobs submitted by HR before they are made public to candidates.</p>
        </div>
        <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full font-bold border border-amber-200 self-start sm:self-auto shrink-0">
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
                className="p-3.5 sm:p-4 bg-slate-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-extrabold text-slate-900 text-sm break-words">{job.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                      Pending Verification
                    </span>
                  </div>
                  <p className="text-slate-600 font-semibold break-words">
                    {job.company || job.companyName} • {job.location} • ₹{job.salaryMin}–{job.salaryMax} LPA • {job.experience}
                  </p>
                  <p className="text-slate-500 text-[11px] break-words">{job.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] border border-slate-200 break-words">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => onRejectJob(job.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 font-bold hover:bg-rose-50 transition flex-1 sm:flex-initial text-center"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onApproveJob(job.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Approve & Publish</span>
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
