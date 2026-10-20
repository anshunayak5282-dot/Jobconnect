import React from 'react';

export function PostJobModal({
  show,
  onClose,
  postForm,
  setPostForm,
  onSubmit
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">Post New Vacancy</h3>
            <p className="text-xs text-slate-500">Will be sent to Super Admin for verification.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={postForm.title}
              onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company *</label>
              <input
                type="text"
                required
                value={postForm.company}
                onChange={(e) => setPostForm({ ...postForm, company: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location *</label>
              <select
                value={postForm.location}
                onChange={(e) => setPostForm({ ...postForm, location: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Ranchi">Ranchi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Job Type *</label>
              <select
                value={postForm.jobType}
                onChange={(e) => setPostForm({ ...postForm, jobType: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Experience *</label>
              <select
                value={postForm.experience}
                onChange={(e) => setPostForm({ ...postForm, experience: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Fresher">Fresher (0-1 yrs)</option>
                <option value="1-3 Years">Junior (1-3 yrs)</option>
                <option value="3-5 Years">Mid-Senior (3-5 yrs)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Min Salary (₹ LPA) *</label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={postForm.salaryMin}
                onChange={(e) => setPostForm({ ...postForm, salaryMin: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Salary (₹ LPA) *</label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={postForm.salaryMax}
                onChange={(e) => setPostForm({ ...postForm, salaryMax: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Required Skills (Comma separated) *</label>
            <input
              type="text"
              required
              value={postForm.skills}
              onChange={(e) => setPostForm({ ...postForm, skills: e.target.value })}
              placeholder="React, Node.js, MongoDB, TypeScript"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Job Description & Responsibilities *</label>
            <textarea
              rows="3"
              required
              value={postForm.description}
              onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
              placeholder="Detail the duties, technology stack, and expectations for the role..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md shadow-indigo-600/30"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJobModal;
