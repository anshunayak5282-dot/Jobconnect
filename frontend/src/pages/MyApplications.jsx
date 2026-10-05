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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Application Status Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track your live candidate pipeline across applied enterprises in real time.</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto pb-1">
          <span>Stages:</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">Applied</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">Under Review</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">Shortlisted</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">Interview</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Selected</span>
        </div>
      </div>

      <div className="space-y-4">
        {myApps.map(app => {
          const job = data.jobs.find(j => j.id === app.jobId) || { title: "Role", company: "Company", location: "India" };
          const isRejected = app.status === "Rejected";
          const currentStageIdx = stages.indexOf(app.status);

          return (
            <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{job.title}</h3>
                  <p className="text-xs font-semibold text-slate-600">
                    {job.company} • {job.location} • Applied on {app.appliedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
                  <div className="grid grid-cols-5 gap-1 relative text-center">
                    {stages.map((st, idx) => {
                      const isPassed = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      let circleClass = "bg-slate-200 text-slate-500";
                      let labelClass = "text-slate-400";
                      if (isPassed) {
                        circleClass = "bg-indigo-600 text-white shadow-md shadow-indigo-600/30";
                        labelClass = "text-indigo-900 font-bold";
                      }
                      if (isCurrent && st === 'Selected') {
                        circleClass = "bg-emerald-500 text-white shadow-md shadow-emerald-500/30";
                        labelClass = "text-emerald-700 font-black";
                      }

                      return (
                        <div key={st} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full ${circleClass} flex items-center justify-center font-bold text-xs transition duration-300`}>
                            {isPassed ? '✓' : (idx + 1)}
                          </div>
                          <span className={`text-[10px] mt-1.5 ${labelClass}`}>{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <p className="font-bold">Application Status: Not Selected</p>
                  <p className="text-[11px] text-rose-600 mt-0.5">Thank you for your interest. The hiring team decided to proceed with other candidates.</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span>Attached: <strong className="text-slate-700">{app.resumeUrl}</strong></span>
                <span className="text-indigo-600 font-bold">Updated live by Recruiter</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
