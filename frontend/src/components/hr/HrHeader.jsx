import React from 'react';

export function HrHeader({
  companyName,
  onOpenEditProfile,
  onOpenPostJob
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-4 sm:p-6 rounded-2xl text-white shadow-lg">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30 shrink-0">
            Verified Enterprise Recruiter
          </span>
          <span className="text-xs text-indigo-200 break-words">
            {companyName ? `${companyName} Portal` : 'Enterprise Recruiter Portal'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black mt-1 break-words">HR Talent & Recruitment Hub</h2>
        <p className="text-xs text-slate-300 break-words mt-0.5">
          {companyName
            ? `Publish and manage vacancies for ${companyName}, review applicant resumes, and track recruitment.`
            : 'Publish job vacancies, review applicant resumes, and update recruitment pipeline status.'}
        </p>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full sm:w-auto">
        <button
          type="button"
          onClick={onOpenEditProfile}
          className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition flex items-center justify-center gap-1.5 flex-1 sm:flex-initial shrink-0"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit Profile</span>
        </button>
        <button
          onClick={onOpenPostJob}
          className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition shrink-0 flex-1 sm:flex-initial"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Post Vacancy</span>
        </button>
      </div>
    </div>
  );
}
