import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PostJobModal } from '../components/PostJobModal';

export const HRDashboard = () => {
  const { data, updateApplicationStatus } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  const myCompany = "ABC Technologies";
  const myJobs = data.jobs.filter(j => j.company === myCompany);
  const activeJobs = myJobs.filter(j => j.status === 'Approved');
  const myJobIds = myJobs.map(j => j.id);

  let apps = data.applications.filter(a => myJobIds.includes(a.jobId));
  const shortlisted = apps.filter(a => ['Shortlisted', 'Interview'].includes(a.status));
  const selected = apps.filter(a => a.status === 'Selected');

  if (selectedJobFilter !== 'all') {
    apps = apps.filter(a => a.jobId === selectedJobFilter);
  }

  if (selectedStatusFilter !== 'all') {
    apps = apps.filter(a => a.status === selectedStatusFilter);
  }

  const previewResume = (name) => {
    alert(`[JobConnect Resume Viewer]\n\nCandidate: ${name}\nStatus: Verified\nSkills: React, Node.js, Express, MongoDB\nAttached Document: Verified PDF.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-4 sm:p-6 rounded-2xl text-white shadow-lg">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30">
              Verified Enterprise Recruiter
            </span>
            <span className="text-xs text-indigo-200">ABC Technologies Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 break-words">HR Talent & Recruitment Hub</h2>
          <p className="text-xs text-slate-300">Publish job vacancies, review applicant resumes, and update recruitment pipeline status.</p>
        </div>
        
        <button
          onClick={() => setShowPostModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition shrink-0 w-full sm:w-auto"
        >
          <span>+ Post New Vacancy</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Jobs Posted</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{myJobs.length}</p>
          <span className="text-[10px] text-indigo-600 font-semibold">All vacancies</span>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Active Approved</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{activeJobs.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Live in market</span>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Applications</p>
          <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">{data.applications.filter(a => myJobIds.includes(a.jobId)).length}</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Candidates</span>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
          <p className="text-xl sm:text-2xl font-black text-purple-600 mt-1">{shortlisted.length}</p>
          <span className="text-[10px] text-purple-600 font-semibold">In interviews</span>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-slate-500">Hired / Selected</p>
          <p className="text-xl sm:text-2xl font-black text-teal-600 mt-1">{selected.length}</p>
          <span className="text-[10px] text-teal-600 font-semibold">Offer accepted</span>
        </div>
      </div>

      {/* Main Grid: My Jobs + Candidate Review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: My Jobs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>My Job Openings</span>
              <span className="text-xs font-normal text-slate-500">{myJobs.length} jobs</span>
            </h3>
            <div className="mt-3 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {myJobs.map(job => {
                const appCount = data.applications.filter(a => a.jobId === job.id).length;
                return (
                  <div key={job.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{job.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        job.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        job.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>{job.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold">{job.location} • ₹{job.salaryMin}–{job.salaryMax} LPA</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-indigo-600 font-bold">{appCount} Applicants</span>
                      <button
                        onClick={() => setSelectedJobFilter(job.id)}
                        className="text-slate-600 hover:text-indigo-700 font-semibold"
                      >
                        View Candidates →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Candidate Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Candidate Pipeline & Review</h3>
                <p className="text-xs text-slate-500">Review resumes, shortlist candidates, or advance to interviews.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium bg-slate-50 text-slate-700 max-w-full"
                >
                  <option value="all">All Vacancies</option>
                  {myJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
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

            {/* Candidates list */}
            <div className="mt-4 space-y-3">
              {apps.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-700 text-xs">No Candidates in this Stage</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Select another filter or post more vacancies.</p>
                </div>
              ) : (
                apps.map(app => {
                  const job = data.jobs.find(j => j.id === app.jobId) || { title: "Role" };
                  return (
                    <div key={app.id} className="p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl transition space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center shrink-0">
                            {app.applicantName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-900 text-sm truncate">{app.applicantName}</h4>
                            <p className="text-xs text-slate-500 font-semibold truncate">
                              Applied for: <span className="text-indigo-600">{job.title}</span> • {app.appliedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start sm:self-auto shrink-0">
                          <span className="text-xs font-semibold text-slate-500">Pipeline Status:</span>
                          <select
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                            className="text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-300 bg-white cursor-pointer"
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
                        <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-500 font-medium break-all">📍 {app.applicantLocation} • ✉️ {app.applicantEmail}</span>
                          <button
                            onClick={() => previewResume(app.applicantName)}
                            className="px-2.5 py-1.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[11px] hover:bg-indigo-100 self-start sm:self-auto shrink-0"
                          >
                            View Resume PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

      {showPostModal && <PostJobModal onClose={() => setShowPostModal(false)} />}
    </div>
  );
};
