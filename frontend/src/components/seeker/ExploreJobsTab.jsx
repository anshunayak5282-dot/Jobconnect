import React from 'react';
import { JobCard } from './JobCard';
import { matchesJobId } from '../../utils/jobUtils';

export function ExploreJobsTab({
  filteredJobs = [],
  keyword,
  setKeyword,
  location,
  setLocation,
  jobType,
  setJobType,
  expFilters = [],
  handleExpCheckboxChange,
  minSalary,
  setMinSalary,
  sortBy,
  setSortBy,
  clearAllFilters,
  savedJobIds = [],
  applications = [],
  profile,
  profileCompleteness = 0,
  onToggleSave,
  onOpenJobDetail,
  onRedirectToProfile
}) {
  return (
    <div>
      {/* HERO SEARCH SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 md:p-12 shadow-xl mb-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Verified Recruitment Platform 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200">Career Breakthrough</span>.
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Connect directly with verified tech enterprises, startup unicorns, and top recruiters across India and globally.
          </p>

          {/* SEARCH BAR BOX */}
          <div className="mt-6 bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch gap-2 text-slate-800">
            <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-slate-200 py-1.5">
              <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skill (e.g. React, Node.js), or company..."
                className="w-full text-xs md:text-sm focus:outline-none bg-transparent placeholder-slate-400 font-medium"
              />
            </div>

            <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-slate-200 py-1.5">
              <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs md:text-sm focus:outline-none bg-transparent text-slate-700 font-medium cursor-pointer"
              >
                <option value="">All Locations</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="flex items-center px-3 gap-2 py-1.5">
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full text-xs md:text-sm focus:outline-none bg-transparent text-slate-700 font-medium cursor-pointer"
              >
                <option value="">All Job Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <button
              onClick={() => {}}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs md:text-sm shrink-0 shadow-lg shadow-indigo-600/30"
            >
              <span>Find Jobs</span>
            </button>
          </div>

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Popular:</span>
            {['React', 'Node.js', 'Fresher', 'Remote', 'MongoDB'].map((tag) => (
              <button
                key={tag}
                onClick={() => setKeyword(tag)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Completeness Alert for Job Seekers */}
      {profileCompleteness < 100 && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0">
              ⚠️
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Complete your profile to 100% to apply for jobs.
              </p>
              <p className="text-xs text-amber-800">
                Your profile is currently at <strong>{profileCompleteness}%</strong>. Complete all required fields to unlock job applications.
              </p>
            </div>
          </div>
          <button
            onClick={onRedirectToProfile}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Complete Profile</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* MAIN JOB LISTING AREA WITH SIDEBAR FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FILTERS SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                Filter Vacancies
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Clear
              </button>
            </div>

            {/* Experience Filter */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Experience
              </label>
              <div className="space-y-1.5 text-xs text-slate-600">
                {[
                  { val: 'Fresher', label: 'Fresher (0 - 1 yrs)' },
                  { val: '1-3 Years', label: 'Junior (1 - 3 yrs)' },
                  { val: '3-5 Years', label: 'Mid-Senior (3 - 5 yrs)' }
                ].map((exp) => (
                  <label key={exp.val} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      value={exp.val}
                      checked={expFilters.includes(exp.val)}
                      onChange={() => handleExpCheckboxChange(exp.val)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{exp.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Salary Slider */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Min Salary
                </label>
                <span className="text-xs font-bold text-indigo-600">
                  ₹{minSalary} LPA
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹0</span>
                <span>₹12L</span>
                <span>₹25L+</span>
              </div>
            </div>

            {/* Status Info Box */}
            <div className="mt-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed">
              <p className="font-bold flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                Admin Verified Jobs Only
              </p>
              <p className="mt-1 text-slate-600">
                All listed jobs are moderated and verified before appearing in search.
              </p>
            </div>
          </div>
        </div>

        {/* JOB CARDS GRID */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-slate-200/80 text-xs text-slate-600">
            <div>
              Showing <span className="font-bold text-slate-900">{filteredJobs.length}</span> active vacancies
            </div>
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Matching Vacancies Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or clearing keywords to see more opportunities.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const isSaved = savedJobIds.some((id) => matchesJobId(id, job.id));
                const hasApplied = applications.some(
                  (a) => matchesJobId(a.jobId, job.id) && a.applicantEmail === profile?.email
                );

                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={isSaved}
                    hasApplied={hasApplied}
                    profileCompleteness={profileCompleteness}
                    onToggleSave={onToggleSave}
                    onOpenDetail={onOpenJobDetail}
                    onRedirectToProfile={onRedirectToProfile}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
