import React from 'react';
import { matchesJobId } from '../../utils/jobUtils';

export function HrPipeline({
  hrFilteredApps = [],
  hrJobs = [],
  hrJobFilter = 'all',
  setHrJobFilter,
  hrStatusFilter = 'all',
  setHrStatusFilter,
  myCompany,
  updateApplicationStatus,
  previewResume,
  openCandidateDetail
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Candidate Pipeline & Review</h3>
          <p className="text-xs text-slate-500">Review resumes, shortlist candidates, or advance to interviews.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={hrJobFilter}
            onChange={(e) => setHrJobFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium bg-slate-50 text-slate-700 max-w-full"
          >
            <option value="all">
              {myCompany ? `All ${myCompany} Vacancies` : 'All My Vacancies'}
            </option>
            {hrJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {jobTitleOrCompany(j)}
              </option>
            ))}
          </select>
          <select
            value={hrStatusFilter}
            onChange={(e) => setHrStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium bg-slate-50 text-slate-700 max-w-full"
          >
            <option value="all">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {hrFilteredApps.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-700 text-xs">No Candidates in this Stage</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {hrJobs.length === 0
                ? 'Publish your first job vacancy to start receiving applicant resumes.'
                : 'Select another filter or post more vacancies.'}
            </p>
          </div>
        ) : (
          hrFilteredApps.map((app) => {
            const job = hrJobs.find((j) => matchesJobId(j.id, app.jobId)) || { title: 'Role' };

            return (
              <div key={app.id} className="p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center shrink-0">
                      {(app.applicantName || 'C').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-sm break-words">{app.applicantName}</h4>
                      <p className="text-xs text-slate-500 font-semibold break-words">
                        Applied for: <span className="text-indigo-600">{job.title}</span> • {app.appliedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="text-xs font-semibold text-slate-500 shrink-0">Pipeline:</span>
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-300 bg-white cursor-pointer ${
                        app.status === 'Selected'
                          ? 'text-emerald-700 border-emerald-300'
                          : app.status === 'Interview'
                          ? 'text-blue-700 border-blue-300'
                          : app.status === 'Shortlisted'
                          ? 'text-purple-700 border-purple-300'
                          : app.status === 'Rejected'
                          ? 'text-rose-700 border-rose-300'
                          : 'text-slate-800'
                      }`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview Scheduled</option>
                      <option value="Selected">Offer / Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <p className="italic text-[11px] text-slate-700 break-words">"{app.coverLetter}"</p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium break-all">
                      📍 {app.applicantLocation} • ✉️ {app.applicantEmail} • 📞 {app.applicantPhone}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => previewResume(app.applicantName, app.resumeUrl || app.resume, 'Candidate', app.applicantLocation)}
                        className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-bold text-[11px] hover:bg-indigo-100"
                      >
                        View Resume PDF
                      </button>
                      <button
                        onClick={() => openCandidateDetail(app.applicantEmail)}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold text-[11px] hover:bg-slate-200"
                      >
                        Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function jobTitleOrCompany(j) {
  return j.title || j.company || 'Vacancy';
}
