import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { matchesJobId } from '../../utils/jobUtils';

export function HrJobOpenings({
  hrJobs = [],
  applications = [],
  hrJobFilter = 'all',
  setHrJobFilter,
  myCompany,
  onOpenPostJob,
  onDeleteJob
}) {
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Lock body scroll and handle Escape key while delete confirmation modal is open
  useEffect(() => {
    if (!jobToDelete) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        setJobToDelete(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [jobToDelete, isDeleting]);

  const handleConfirmDelete = async () => {
    if (!jobToDelete || !onDeleteJob) return;
    setIsDeleting(true);
    try {
      const res = await onDeleteJob(jobToDelete.id);
      if (res && res.success !== false) {
        if (matchesJobId(hrJobFilter, jobToDelete.id)) {
          setHrJobFilter('all');
        }
        setJobToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
      {/* Panel Header */}
      <div className="pb-3.5 border-b border-slate-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
            <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm text-slate-900 leading-tight">My Job Openings</h3>
            <p className="text-[11px] text-slate-400">Manage vacancies & review applicants</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100/80 shrink-0">
          {hrJobs.length} {hrJobs.length === 1 ? 'Job' : 'Jobs'}
        </span>
      </div>

      {/* Active filter helper tag */}
      {hrJobFilter !== 'all' && (
        <div className="mt-3 px-3 py-1.5 bg-purple-50/80 border border-purple-200/70 rounded-xl flex items-center justify-between text-xs animate-fade-in">
          <span className="text-[11px] text-purple-900 font-medium truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Filtering pipeline by selected opening
          </span>
          <button
            type="button"
            onClick={() => setHrJobFilter('all')}
            className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline shrink-0 ml-2"
          >
            Reset filter
          </button>
        </div>
      )}

      {/* Compact & Independently Scrollable Job Card List */}
      <div className="mt-3.5 space-y-3 max-h-[540px] overflow-y-auto pr-1">
        {hrJobs.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-purple-200 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-xl shadow-sm">
              💼
            </div>
            <p className="font-bold text-slate-800 text-xs sm:text-sm">No Job Openings Posted Yet</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              You haven't posted any vacancies for {myCompany || 'your organization'} yet.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenPostJob}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs transition inline-flex items-center gap-1.5 shadow-md shadow-purple-600/20"
              >
                <span>+ Post Your First Job</span>
              </button>
            </div>
          </div>
        ) : (
          hrJobs.map((job) => {
            const appCount = applications.filter((a) => matchesJobId(a.jobId, job.id)).length;
            const isSelected = hrJobFilter !== 'all' && matchesJobId(hrJobFilter, job.id);

            return (
              <div
                key={job.id}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 space-y-3 bg-white text-xs ${
                  isSelected
                    ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-md bg-purple-50/20'
                    : 'border-slate-200/80 hover:border-purple-300 hover:shadow-sm'
                }`}
              >
                {/* Card Top: Title & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug truncate" title={job.title}>
                      {job.title}
                    </h4>
                    {job.jobType && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-[10px] border border-purple-100">
                        {job.jobType}
                      </span>
                    )}
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${
                      job.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        : job.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        job.status === 'Approved'
                          ? 'bg-emerald-500'
                          : job.status === 'Pending'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-slate-400'
                      }`}
                    ></span>
                    {job.status}
                  </span>
                </div>

                {/* Card Middle: Location & Salary Details */}
                <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-y border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600 min-w-0">
                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{job.location || 'India'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold min-w-0">
                    <svg className="w-3.5 h-3.5 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">₹{job.salaryMin}–{job.salaryMax} LPA</span>
                  </div>
                </div>

                {/* Card Bottom: Applicant Count & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md font-extrabold text-[11px] ${
                      appCount > 0
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {appCount}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {appCount === 1 ? 'Applicant' : 'Applicants'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setJobToDelete(job);
                      }}
                      className="p-1.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition active:scale-95 shrink-0"
                      title="Delete Post"
                      aria-label={`Delete Post ${job.title}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHrJobFilter(isSelected ? 'all' : job.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60'
                      }`}
                    >
                      <span>{isSelected ? 'Viewing' : 'View Candidates'}</span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Vacancy Confirmation Modal (Portaled to document.body to prevent layout distortion) */}
      {jobToDelete && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              setJobToDelete(null);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-fade-in space-y-4 relative my-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-vacancy-modal-title"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h4 id="delete-vacancy-modal-title" className="font-extrabold text-slate-900 text-base">Delete Vacancy?</h4>
                <p className="text-xs text-slate-500 mt-0.5 break-words">
                  Are you sure you want to delete <span className="font-bold text-slate-800">"{jobToDelete.title}"</span>?
                </p>
              </div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setJobToDelete(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 shrink-0 transition"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>⚠️</span> Irreversible Action
              </p>
              <p className="text-[11px] text-rose-700 leading-relaxed break-words">
                This will permanently delete this job post from MySQL. All applicant resumes and pipeline stages attached to this opening will also be safely removed.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs transition shadow-md shadow-rose-600/30 flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
