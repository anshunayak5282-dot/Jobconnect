import React from 'react';

export function AdminProfileModeration({
  pendingProfileRequests = [],
  currentUserId,
  onApproveProfileRequest,
  onOpenRejectModal
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            HR Recruiter Profile Verification & Approval Queue
          </h3>
          <p className="text-xs text-slate-500">
            Review and verify credential changes requested by recruiters before updating their official profiles in MySQL.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-50 text-purple-800 px-3 py-1 rounded-full font-bold border border-purple-200">
            {pendingProfileRequests.length} Pending Approval
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {pendingProfileRequests.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
            <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="font-bold text-slate-800 text-xs">All Clear! No Pending Profile Modification Requests</p>
            <p className="text-[11px] text-slate-500 mt-0.5">All recruiter credentials are up-to-date and verified.</p>
          </div>
        ) : (
          pendingProfileRequests.map((req) => {
            const isSelf = String(req.userId || req.user_id) === String(currentUserId);
            const cur = req.current_data || {};
            const prop = req.proposed_data || {};

            return (
              <div key={req.id} className="p-5 bg-slate-50/80 border border-purple-200 rounded-2xl text-xs space-y-4 transition hover:border-purple-300">
                {/* Request Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-100 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-sm shadow-sm">
                      {(req.userName || 'HR').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{req.userName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          {req.companyName || cur.company || 'Enterprise Recruiter'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {req.userEmail} • Submitted {req.created_at ? new Date(req.created_at).toLocaleString() : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pending Super Admin Review
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Details */}
                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        Current Profile (Active in MySQL)
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Original</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-medium">Name:</span>{' '}
                        <span className="font-bold text-slate-800">{cur.name || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Company:</span>{' '}
                        <span className="font-bold text-slate-800">{cur.company || cur.company_name || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Title:</span>{' '}
                        <span className="font-semibold text-slate-700">{cur.title || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Location:</span>{' '}
                        <span className="font-semibold text-slate-700">{cur.location || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Phone:</span>{' '}
                        <span className="font-semibold text-slate-700">{cur.phone || 'Not specified'}</span>
                      </div>
                      {cur.about && (
                        <div>
                          <span className="text-slate-400 font-medium">Bio:</span>{' '}
                          <p className="text-slate-600 text-[10px] line-clamp-2 mt-0.5">{cur.about}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Proposed Details */}
                  <div className="bg-purple-50/50 rounded-xl p-3.5 border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                      <span className="font-bold text-purple-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                        Proposed Changes (Requested by HR)
                      </span>
                      <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded">New Submission</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-purple-600 font-medium">Name:</span>{' '}
                        <span className={`font-bold ${prop.name && prop.name !== cur.name ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-800'}`}>
                          {prop.name || cur.name || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-600 font-medium">Company:</span>{' '}
                        <span className={`font-bold ${(prop.company || prop.company_name) && (prop.company || prop.company_name) !== (cur.company || cur.company_name) ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-800'}`}>
                          {prop.company || prop.company_name || cur.company || cur.company_name || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-600 font-medium">Title:</span>{' '}
                        <span className={`font-semibold ${prop.title && prop.title !== cur.title ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-700'}`}>
                          {prop.title || cur.title || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-600 font-medium">Location:</span>{' '}
                        <span className={`font-semibold ${prop.location && prop.location !== cur.location ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-700'}`}>
                          {prop.location || cur.location || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-600 font-medium">Phone:</span>{' '}
                        <span className={`font-semibold ${prop.phone && prop.phone !== cur.phone ? 'text-purple-950 bg-purple-200/60 px-1 py-0.5 rounded' : 'text-slate-700'}`}>
                          {prop.phone || cur.phone || 'Not specified'}
                        </span>
                      </div>
                      {prop.about && (
                        <div>
                          <span className="text-purple-600 font-medium">Bio:</span>{' '}
                          <p className={`text-[10px] line-clamp-2 mt-0.5 ${prop.about !== cur.about ? 'text-purple-950 bg-purple-200/60 p-1 rounded' : 'text-slate-600'}`}>{prop.about}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions & Self-Approval Prevention */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-purple-100 gap-3">
                  <div>
                    {isSelf ? (
                      <span className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Self-approval blocked: Another Super Admin must review this request.
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">
                        Approving will write proposed credentials to MySQL and notify the recruiter.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenRejectModal(req)}
                      className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 font-bold hover:bg-rose-50 transition"
                    >
                      Reject Request
                    </button>
                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => onApproveProfileRequest(req.id)}
                      className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-md ${
                        isSelf
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Approve & Update MySQL</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
