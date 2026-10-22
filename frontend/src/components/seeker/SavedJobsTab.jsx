import React from 'react';

export function SavedJobsTab({
  savedJobs = [],
  profileCompleteness = 0,
  onToggleSave,
  onOpenJobDetail,
  onRedirectToProfile
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-extrabold text-slate-900 break-words">Bookmarked Vacancies</h2>
        <p className="text-xs text-slate-500 mt-0.5">Jobs you have saved to apply for later.</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-sm">No Saved Jobs</h4>
          <p className="text-xs text-slate-500 mt-1">
            Click the heart icon on any job card to save it here for quick reference.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-indigo-300 shadow-sm flex flex-col justify-between gap-3.5 sm:gap-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    {job.jobType}
                  </span>
                  <button
                    onClick={() => onToggleSave(job.id)}
                    className="text-rose-500 hover:text-slate-400 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-2 break-words">{job.title}</h3>
                <p className="text-xs text-slate-500 font-semibold break-words">
                  {job.company || job.companyName} • {job.location}
                </p>
                <p className="text-xs font-extrabold text-emerald-700 mt-1">
                  ₹{job.salaryMin}–{job.salaryMax} LPA
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">Deadline: {job.deadline || 'In 30 days'}</span>
                {profileCompleteness < 100 ? (
                  <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      <button
                        onClick={onRedirectToProfile}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                        title="Redirect to My Profile & Resume"
                      >
                        Complete Profile
                      </button>
                      <button
                        disabled
                        title="Complete your profile to 100% to apply for jobs."
                        className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                    <span className="text-[10px] text-amber-600 font-semibold text-right">
                      Complete your profile to 100% to apply for jobs.
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => onOpenJobDetail(job)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition text-center"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
