import React from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { data, approveJob, rejectJob, toggleUserStatus } = useAuth();
  const pendingJobs = data.jobs.filter(j => j.status === 'Pending');
  const seekers = data.users.filter(u => u.role === 'user');
  const hrs = data.users.filter(u => u.role === 'hr');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
            Platform Master Console
          </div>
          <h2 className="text-2xl font-black mt-1">Super Admin Operations & Moderation</h2>
          <p className="text-xs text-slate-300">Oversee ecosystem integrity, verify new HR job postings, monitor accounts, and inspect platform metrics.</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-right">
            <span className="block text-[10px] text-slate-400">Database Engine</span>
            <span className="font-bold text-emerald-400">MongoDB Mongoose 8.x</span>
          </div>
          <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-right">
            <span className="block text-[10px] text-slate-400">Auth Guard</span>
            <span className="font-bold text-indigo-300">JWT + bcrypt</span>
          </div>
        </div>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Seekers</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{seekers.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Active Candidates</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">HRs & Companies</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{hrs.length} HRs</p>
          <span className="text-[10px] text-indigo-600 font-medium">Verified Employers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Pending Approvals</p>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingJobs.length}</p>
          <span className="text-[10px] text-amber-600 font-medium">Requires moderation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Total Applications</p>
          <p className="text-2xl font-black text-teal-600 mt-2">{data.applications.length}</p>
          <span className="text-[10px] text-teal-600 font-medium">Platform throughput</span>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Job Moderation & Verification Queue
            </h3>
            <p className="text-xs text-slate-500">Review jobs submitted by HR before they are made public to candidates.</p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full font-bold border border-amber-200">
            {pendingJobs.length} Pending Approval
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {pendingJobs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-2xl text-emerald-500 block mb-1">✓</span>
              <p className="font-bold text-slate-800 text-xs">All Clear! No Pending Vacancies</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Every submitted job has been verified and processed.</p>
            </div>
          ) : (
            pendingJobs.map(job => (
              <div key={job.id} className="p-4 bg-slate-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{job.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Pending Verification</span>
                  </div>
                  <p className="text-slate-600 font-semibold">{job.company} • {job.location} • ₹{job.salaryMin}–{job.salaryMax} LPA • {job.experience}</p>
                  <p className="text-slate-500 text-[11px]">{job.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.skills.map(s => <span key={s} className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] border border-slate-200">{s}</span>)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => rejectJob(job.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 font-bold hover:bg-rose-50 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => approveJob(job.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20"
                  >
                    ✓ Approve & Publish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Directory */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="pb-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base">User & Employer Directory</h3>
          <p className="text-xs text-slate-500">View and manage system credentials and roles.</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-rose-100 text-rose-800' :
                      u.role === 'hr' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]"
                    >
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
