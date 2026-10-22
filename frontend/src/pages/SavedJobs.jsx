import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobDetailModal } from '../components/JobDetailModal';

export const SavedJobs = () => {
  const { data, toggleSaveJob } = useAuth();
  const saved = data.jobs.filter(j => data.savedJobIds.includes(j.id));
  const [selectedJob, setSelectedJob] = useState(null);

  if (saved.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 animate-fade-in">
        <h4 className="font-bold text-slate-800 text-sm">No Saved Jobs</h4>
        <p className="text-xs text-slate-500 mt-1">Click the heart bookmark on any vacancy to save it for quick reference.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-extrabold text-slate-900 break-words">Bookmarked Vacancies</h2>
        <p className="text-xs text-slate-500 mt-0.5">Jobs you have saved to apply for later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {saved.map(job => (
          <div key={job.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-indigo-300 shadow-sm flex flex-col justify-between gap-3.5 sm:gap-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">{job.jobType}</span>
                <button
                  onClick={() => toggleSaveJob(job.id)}
                  className="text-rose-500 hover:text-slate-400 text-xs font-bold"
                >
                  Remove
                </button>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-2 break-words">{job.title}</h3>
              <p className="text-xs text-slate-500 font-semibold break-words">{job.company} • {job.location}</p>
              <p className="text-xs font-extrabold text-emerald-700 mt-1">₹{job.salaryMin}–{job.salaryMax} LPA</p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Deadline: {job.deadline}</span>
              <button
                onClick={() => setSelectedJob(job)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition text-center"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};
