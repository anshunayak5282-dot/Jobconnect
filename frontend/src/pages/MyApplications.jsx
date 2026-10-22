import React from 'react';
import { useAuth } from '../context/AuthContext';

export const MyApplications = ({ onExplore }) => {
  const { data } = useAuth();
  const myApps = data.applications.filter(a => a.applicantEmail === data.profile.email);
  const stages = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected"];

  if (myApps.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <h4 className="font-bold text-slate-800 text-sm">No Applications Yet</h4>
        <p className="text-xs text-slate-500 mt-1">Explore open jobs and submit your profile with 1 click.</p>
        <button
          onClick={onExplore}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
        >
          Find Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Application Status Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track your live candidate pipeline across applied enterprises in real time.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-500">
          <span className="mr-1">Stages:</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">Applied</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">Under Review</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">Shortlisted</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">Interview</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Selected</span>
        </div>
      </div>

      <div className="space-y-4">
        {myApps.map(app => {
          const job = data.jobs.find(j => j.id === app.jobId) || { title: "Role", company: "Company", location: "India" };
          const isRejected = app.status === "Rejected";
          const currentStageIdx = stages.indexOf(app.status);

          return (
            <div key={app.id} className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-slate-900 text-base break-words">{job.title}</h3>
                  <p className="text-xs font-semibold text-slate-600 break-words mt-0.5">
                    {job.company} • {job.location} • Applied on {app.appliedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-xs text-slate-400">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    app.status === 'Selected' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'Shortlisted' ? 'bg-purple-100 text-purple-800' :
                    app.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                    app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>

              {!isRejected ? (
                <div className="pt-2">
                  {/* Small screens vertical timeline layout (< sm) */}
                  <div className="sm:hidden py-1 px-1">
                    {stages.map((st, idx) => {
                      const isCompleted = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      let circleClass = 'bg-slate-200 text-slate-500 font-bold ring-4 ring-white';
                      let labelClass = 'text-slate-500 font-medium';
                      let statusBadge = (
                        <span className="text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-full text-slate-400 bg-slate-100">
                          Pending
                        </span>
                      );

                      if (isCompleted) {
                        circleClass = isCurrent
                          ? 'bg-purple-600 text-white font-extrabold ring-4 ring-purple-200 ring-offset-1 ring-offset-white shadow-md shadow-purple-600/30'
                          : 'bg-purple-600 text-white font-bold ring-4 ring-white shadow-xs shadow-purple-600/30';
                        labelClass = isCurrent ? 'text-purple-900 font-extrabold' : 'text-slate-800 font-bold';
                        statusBadge = (
                          <span className="text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                            Completed
                          </span>
                        );
                      }

                      if (isCurrent) {
                        statusBadge = (
                          <span className="text-[10px] font-bold shrink-0 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            {st === 'Selected' ? 'Selected & Offered' : 'In Progress'}
                          </span>
                        );
                      }

                      return (
                        <div key={st} className="relative flex items-center gap-3 pb-3 last:pb-0">
                          {/* Vertical Connecting Line between centers of step idx and step idx+1 */}
                          {idx < stages.length - 1 && (
                            <div
                              className={`absolute left-[14px] -translate-x-1/2 top-[14px] h-full w-[2.5px] z-0 ${
                                idx < currentStageIdx ? 'bg-purple-600' : 'bg-slate-200'
                              }`}
                              aria-hidden="true"
                            />
                          )}

                          {/* Step Icon */}
                          <div className="relative z-10 flex items-center justify-center shrink-0">
                            <div
                              className={`w-7 h-7 rounded-full ${circleClass} flex items-center justify-center text-xs transition duration-300`}
                            >
                              {isCompleted ? (
                                <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>
                          </div>

                          {/* Step Label Card */}
                          <div className="flex items-center justify-between flex-1 min-w-0 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-100 relative z-10">
                            <span className={`text-xs ${labelClass} truncate mr-2`}>{st}</span>
                            {statusBadge}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tablet/Desktop horizontal stage tracker (>= sm) */}
                  <div className="hidden sm:block pt-1 pb-2">
                    <div className="relative">
                      {/* Connecting Track Line - Aligns from center of Step 0 (10%) to center of Step 4 (90%) */}
                      <div
                        className="absolute top-4 left-[10%] right-[10%] h-[3px] -translate-y-1/2 bg-slate-200 z-0 rounded-full"
                        aria-hidden="true"
                      >
                        {/* Filled Purple Line up to Current Stage */}
                        <div
                          className="h-full bg-purple-600 transition-all duration-500 ease-in-out rounded-full"
                          style={{
                            width: `${Math.max(0, Math.min(100, (currentStageIdx / (stages.length - 1)) * 100))}%`
                          }}
                        />
                      </div>

                      {/* 5 Steps Grid */}
                      <div className="grid grid-cols-5 relative z-10 text-center">
                        {stages.map((st, idx) => {
                          const isCompleted = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;

                          let circleClass = 'bg-slate-200 text-slate-500 font-bold ring-4 ring-white';
                          let labelClass = 'text-slate-400 font-medium';

                          if (isCompleted) {
                            circleClass = isCurrent
                              ? 'bg-purple-600 text-white font-extrabold ring-4 ring-purple-200 ring-offset-2 ring-offset-white shadow-md shadow-purple-600/30'
                              : 'bg-purple-600 text-white font-bold ring-4 ring-white shadow-sm';
                            labelClass = isCurrent
                              ? 'text-purple-900 font-extrabold'
                              : 'text-slate-700 font-bold';
                          }

                          return (
                            <div key={st} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full ${circleClass} flex items-center justify-center text-xs transition duration-300`}
                              >
                                {isCompleted ? (
                                  <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              <span className={`text-[11px] mt-2 ${labelClass}`}>{st}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <p className="font-bold">Application Status: Not Selected</p>
                  <p className="text-[11px] text-rose-600 mt-0.5">Thank you for your interest. The hiring team decided to proceed with other candidates.</p>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="truncate">
                    Attached: <strong className="text-slate-700 break-all" title={app.resumeUrl}>{app.resumeUrl}</strong>
                  </span>
                </div>
                <span className="text-indigo-600 font-bold shrink-0 self-start sm:self-auto">Updated live by Recruiter</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
