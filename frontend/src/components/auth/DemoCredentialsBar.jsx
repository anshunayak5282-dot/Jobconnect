import React from 'react';

export function DemoCredentialsBar({ onFillDemoCredentials }) {
  return (
    <div className="mb-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"></path>
          </svg>
          Quick Test: Fill Demo Credentials
        </span>
        <span className="text-[10px] text-indigo-600 font-semibold">1-Click Auto Fill</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onFillDemoCredentials('user')}
          className="p-2 rounded-xl bg-white border border-indigo-100 hover:border-indigo-300 hover:shadow-sm text-left transition group"
        >
          <span className="block text-[10px] font-bold text-indigo-700 group-hover:text-indigo-900">👤 Candidate</span>
          <span className="block text-[9px] text-slate-500 truncate">ankit.dev@example.com</span>
        </button>
        <button
          type="button"
          onClick={() => onFillDemoCredentials('hr')}
          className="p-2 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-sm text-left transition group"
        >
          <span className="block text-[10px] font-bold text-purple-700 group-hover:text-purple-900">💼 Recruiter</span>
          <span className="block text-[9px] text-slate-500 truncate">priya.hr@abctech.com</span>
        </button>
        <button
          type="button"
          onClick={() => onFillDemoCredentials('admin')}
          className="p-2 rounded-xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-sm text-left transition group"
        >
          <span className="block text-[10px] font-bold text-rose-700 group-hover:text-rose-900">🛡️ Admin</span>
          <span className="block text-[9px] text-slate-500 truncate">admin@jobconnect.io</span>
        </button>
      </div>
    </div>
  );
}
