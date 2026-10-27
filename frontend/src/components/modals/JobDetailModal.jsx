import React from 'react';
import { matchesJobId } from '../../utils/jobUtils';

export function JobDetailModal({
  job,
  onClose,
  applications = [],
  profile,
  profileCompleteness = 0,
  isLoggedIn = true,
  coverLetter,
  setCoverLetter,
  onApply,
  onRedirectToProfile,
  onRequireLogin
}) {
  if (!job) return null;

  const hasApplied = applications.some(
    (a) => matchesJobId(a.jobId, job.id) && a.applicantEmail === profile?.email
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-4 sm:p-6 sm:p-8">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-lg sm:text-xl flex items-center justify-center shrink-0">
              {(job.company || job.companyName || 'C').charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight break-words">{job.title}</h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5 break-words">
                {job.company || job.companyName} • {job.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold shrink-0 p-1"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl sm:rounded-2xl border border-slate-100">
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">SALARY</span>
              <span className="font-extrabold text-slate-900">₹{job.salaryMin}–{job.salaryMax} LPA</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">JOB TYPE</span>
              <span className="font-extrabold text-slate-900">{job.jobType}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">EXPERIENCE</span>
              <span className="font-extrabold text-slate-900">{job.experience}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">DEADLINE</span>
              <span className="font-extrabold text-slate-900">{job.deadline}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
              Required Tech Stack & Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(job.skills) ? job.skills : (job.skills ? String(job.skills).split(',') : [])).map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold text-xs border border-indigo-100 break-words"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Role Overview</h4>
            <p className="text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100 break-words">
              {job.description}
            </p>
          </div>

          {!isLoggedIn ? (
            <div className="border-t border-slate-100 pt-3">
              <div className="p-3.5 sm:p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-indigo-900">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm shrink-0">💼</span>
                  <div>
                    <p className="font-bold text-xs sm:text-sm">Sign in to Apply for this Vacancy</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 break-words">
                      Please log in with your candidate account to submit your resume and application.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onRequireLogin) onRequireLogin({ type: 'apply', jobId: job.id });
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 shrink-0 flex items-center justify-center gap-1.5 w-full sm:w-auto self-start sm:self-auto"
                >
                  <span>Apply Now</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ) : hasApplied ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800">
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-bold text-xs">Application Submitted</p>
                <p className="text-[11px] text-emerald-700">
                  You applied for this vacancy with your verified resume. Track live progress under 'My Applications'.
                </p>
              </div>
            </div>
          ) : profileCompleteness < 100 ? (
            <div className="border-t border-slate-100 pt-3">
              <div className="p-3.5 sm:p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="p-2 bg-amber-100 text-amber-700 rounded-xl font-bold text-sm shrink-0">⚠️</span>
                  <div>
                    <p className="font-bold text-xs sm:text-sm">Complete your profile to 100% to apply for jobs.</p>
                    <p className="text-[11px] text-amber-800 mt-0.5 break-words">
                      Your profile is currently at <strong>{profileCompleteness}%</strong>. All candidate details must be completed before applying.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onRedirectToProfile) onRedirectToProfile();
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 shrink-0 flex items-center justify-center gap-1.5 w-full sm:w-auto self-start sm:self-auto"
                >
                  <span>Complete Profile</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-3">
              <h4 className="font-bold text-slate-900 text-xs mb-2">Apply with Your Candidate Profile</h4>
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shrink-0">PDF</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 text-xs truncate" title={profile?.resumeName || 'Candidate_Resume.pdf'}>
                      {profile?.resumeName || 'Candidate_Resume.pdf'}
                    </p>
                    <p className="text-[10px] text-slate-500">Uploaded {profile?.resumeUploadDate || 'Active'}</p>
                  </div>
                </div>
                <span className="text-indigo-600 font-bold text-[11px] shrink-0 self-end sm:self-auto">Ready to attach</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">Cover Note / Introduction (Optional)</label>
                <textarea
                  rows="3"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly describe why you are a good match for this role..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition text-center"
          >
            Close
          </button>
          
          {!isLoggedIn ? (
            <button
              onClick={() => {
                onClose();
                if (onRequireLogin) onRequireLogin({ type: 'apply', jobId: job.id });
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <span>Apply Now</span>
            </button>
          ) : !hasApplied && (
            profileCompleteness < 100 ? (
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onRedirectToProfile) onRedirectToProfile();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition text-center"
                >
                  Complete Profile
                </button>
                <button
                  type="button"
                  disabled
                  title="Complete your profile to 100% to apply for jobs."
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2 text-center"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  <span>Apply (Disabled)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onApply(job.id)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                <span>Submit Application</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailModal;
