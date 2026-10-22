import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            J
          </div>
          <span className="font-bold text-slate-800">JobConnect Engine</span>
          <span className="text-[11px] sm:text-xs">• Full-Stack Architecture (React, Express, MySQL, Node.js)</span>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-[11px] sm:text-xs">
          <span>Roles: Admin, HR Recruiter, Job Seeker</span>
          <span>• JWT Security • REST API Ready</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
