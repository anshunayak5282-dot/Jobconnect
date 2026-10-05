import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const JobDetailModal = ({ job, onClose }) => {
  const { data, applyForJob } = useAuth();
  const [coverLetter, setCoverLetter] = useState(
    `I am excited to apply for ${job.title} at ${job.company}. My background in ${job.skills.slice(0, 3).join(', ')} aligns well with your team's objectives.`
  );

  const hasApplied = data.applications.some(a => a.jobId === job.id && a.applicantEmail === data.profile.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    applyForJob(job.id, coverLetter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-6 sm:p-8">
        
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xl flex items-center justify-center">
              {job.company.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{job.title}</h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5">{job.company} • {job.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
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
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Required Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold text-xs border border-indigo-100">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Job Description</h4>
            <p className="text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
              {job.description}
            </p>
          </div>

          {hasApplied ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800">
              <span className="text-emerald-600 font-bold text-base">✓</span>
              <div>
                <p className="font-bold text-xs">Application Submitted</p>
                <p className="text-[11px] text-emerald-700">Track real-time progress under 'My Applications'.</p>
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-3">
              <h4 className="font-bold text-slate-900 text-xs mb-2">Apply with Your Candidate Profile</h4>
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">PDF</span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{data.profile.resumeName}</p>
                    <p className="text-[10px] text-slate-500">Verified resume</p>
                  </div>
                </div>
                <span className="text-indigo-600 font-bold text-[11px]">Ready to attach</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">Cover Note / Introduction</label>
                <textarea
                  rows="3"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition">
            Close
          </button>
          
          {!hasApplied && (
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              Submit Application
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
