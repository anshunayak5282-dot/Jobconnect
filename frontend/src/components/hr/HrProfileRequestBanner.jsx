import React from 'react';

export function HrProfileRequestBanner({
  request,
  myCompany,
  currentUser,
  onRevise
}) {
  if (!request) return null;

  if (request.status === 'Pending') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600 shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-sm text-amber-950">Profile Modification Pending Admin Approval</h4>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Pending Approval
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              You submitted updates to your recruiter credentials. The Super Admin is reviewing the proposed changes. Your current profile remains active in MySQL until approved.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-amber-900 font-medium bg-amber-100/60 px-3 py-1.5 rounded-lg border border-amber-200/60">
              <span><strong>Requested Name:</strong> {request.proposed_data?.name || currentUser?.name}</span>
              <span><strong>Company:</strong> {request.proposed_data?.company || request.proposed_data?.company_name || myCompany || 'N/A'}</span>
              {request.proposed_data?.title && (
                <span><strong>Title:</strong> {request.proposed_data.title}</span>
              )}
              {request.proposed_data?.location && (
                <span><strong>Location:</strong> {request.proposed_data.location}</span>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRevise(request)}
          className="self-start md:self-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Revise Submission</span>
        </button>
      </div>
    );
  }

  if (request.status === 'Rejected') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 text-rose-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-sm text-rose-950">Profile Modification Request Rejected by Super Admin</h4>
              <span className="px-2 py-0.5 bg-rose-200 text-rose-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Rejected
              </span>
            </div>
            <div className="mt-1 text-xs text-rose-800">
              <strong>Admin Rejection Reason:</strong>{' '}
              <span className="italic">{request.admin_notes || 'Proposed details could not be verified by platform administrator.'}</span>
            </div>
            <p className="text-[11px] text-rose-700 mt-1">
              Your existing profile credentials were kept unchanged in MySQL. You can update and resubmit your details for review at any time.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRevise(request)}
          className="self-start md:self-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Edit & Resubmit Profile</span>
        </button>
      </div>
    );
  }

  return null;
}
