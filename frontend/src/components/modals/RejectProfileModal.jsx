import React from 'react';

export function RejectProfileModal({
  requestData,
  onClose,
  rejectReasonText,
  setRejectReasonText,
  onConfirmReject
}) {
  if (!requestData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 animate-fade-in p-4 sm:p-6">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
            <h3 className="font-extrabold text-slate-900 text-sm break-words">Reject Profile Change Request</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold shrink-0 p-1"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 space-y-3 text-xs">
          <p className="text-slate-600 leading-relaxed break-words">
            Rejecting this request will keep <strong>{requestData.userName}</strong>'s current profile details unchanged in MySQL. The recruiter will be notified of the reason.
          </p>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for Rejection *</label>
            <textarea
              rows="3"
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              placeholder="Provide an explanation for the recruiter..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              'Unable to verify company registration and corporate domain.',
              'Incomplete organization credentials provided.',
              'Unauthorized recruiter profile modification.'
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setRejectReasonText(preset)}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition font-medium"
              >
                {preset.slice(0, 32)}...
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirmReject(requestData.id, rejectReasonText)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-md shadow-rose-600/30 text-center"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RejectProfileModal;
