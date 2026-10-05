import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/JobCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { JobDetailModal } from '../components/JobDetailModal';

export const Home = () => {
  const { data } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [expFilters, setExpFilters] = useState([]);
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = useMemo(() => {
    // Only show Approved jobs to candidates
    let list = data.jobs.filter(j => j.status === 'Approved');

    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q)) ||
        j.description.toLowerCase().includes(q)
      );
    }

    if (location) {
      list = list.filter(j => j.location.toLowerCase() === location.toLowerCase());
    }

    if (jobType) {
      list = list.filter(j => j.jobType === jobType);
    }

    if (minSalary > 0) {
      list = list.filter(j => j.salaryMax >= minSalary);
    }

    if (expFilters.length > 0) {
      list = list.filter(j => expFilters.includes(j.experience));
    }

    if (sortBy === 'salary') {
      list.sort((a, b) => b.salaryMax - a.salaryMax);
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [data.jobs, keyword, location, jobType, minSalary, expFilters, sortBy]);

  const clearAllFilters = () => {
    setKeyword('');
    setLocation('');
    setJobType('');
    setExpFilters([]);
    setMinSalary(0);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 md:p-12 shadow-xl mb-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Verified Recruitment OS 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200">Career Breakthrough</span>.
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Connect directly with verified tech enterprises, startup unicorns, and top recruiters across India and globally.
          </p>

          {/* Search Box */}
          <div className="mt-6 bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch gap-2 text-slate-800">
            <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-slate-200 py-1.5">
              <span className="text-indigo-500">🔍</span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skill (React, Node.js), or company..."
                className="w-full text-xs md:text-sm focus:outline-none bg-transparent placeholder-slate-400 font-medium"
              />
            </div>

            <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-slate-200 py-1.5">
              <span className="text-indigo-500">📍</span>
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
              Find Jobs
            </button>
          </div>

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Popular:</span>
            {['React', 'Node.js', 'Fresher', 'Remote', 'MongoDB'].map(tag => (
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

      {/* Main Grid: Sidebar + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterSidebar
            expFilters={expFilters}
            setExpFilters={setExpFilters}
            minSalary={minSalary}
            setMinSalary={setMinSalary}
            onClear={clearAllFilters}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
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

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
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
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenDetail={(j) => setSelectedJob(j)}
                />
              ))}
            </div>
          )}
        </div>
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
