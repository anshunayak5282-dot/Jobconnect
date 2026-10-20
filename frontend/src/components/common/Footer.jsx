import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            J
          </div>
          <span className="font-bold text-slate-800">JobConnect Engine</span>
          <span>• Full-Stack Architecture (React, Express, MySQL, Node.js)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Roles: Admin, HR Recruiter, Job Seeker</span>
          <span>• JWT Security • REST API Ready</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
