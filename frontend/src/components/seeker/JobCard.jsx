import React from 'react';

export function JobCard({
  job,
  isSaved,
  hasApplied,
  profileCompleteness,
  onToggleSave,
  onOpenDetail,
  onRedirectToProfile
}) {
  const companyName = job.company || job.companyName || 'Company';
  const skillsList = Array.isArray(job.skills)
    ? job.skills
    : job.skills
    ? String(job.skills).split(',').map((s) => s.trim())
    : [];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-slate-200 flex items-center justify-center font-extrabold text-indigo-700 text-lg shadow-inner shrink-0 group-hover:scale-105 transition">
          {companyName.charAt(0)}
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              onClick={() => onOpenDetail(job)}
              className="font-extrabold text-slate-900 text-base hover:text-indigo-600 cursor-pointer transition"
            >
              {job.title}
            </h3>
            {job.jobType && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {job.jobType}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
              ₹{job.salaryMin}–{job.salaryMax} LPA
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-600 flex items-center gap-3">
            <span className="text-slate-800">{companyName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {job.location}
            </span>
            <span>•</span>
            <span className="text-slate-500">{job.experience}</span>
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {skillsList.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center md:flex-col justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="flex items-center gap-2 w-full justify-end">
          <button
            onClick={() => onToggleSave(job.id)}
            title={isSaved ? 'Remove from saved' : 'Save job'}
            className={`p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition ${
              isSaved
                ? 'text-rose-500 bg-rose-50 border-rose-200'
                : 'text-slate-400 hover:text-rose-500'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>

          {hasApplied ? (
            <button
              onClick={() => onOpenDetail(job)}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Applied
            </button>
          ) : profileCompleteness < 100 ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onRedirectToProfile}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                  title="Redirect to My Profile & Resume"
                >
                  Complete Profile
                </button>
                <button
                  disabled
                  title="Complete your profile to 100% to apply for jobs."
                  className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"
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
              onClick={() => onOpenDetail(job)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20"
            >
              Apply Now
            </button>
          )}
        </div>
        <span className="text-[10px] text-slate-400 hidden md:block">
          Deadline: {job.deadline || 'In 30 days'}
        </span>
      </div>
    </div>
  );
}
