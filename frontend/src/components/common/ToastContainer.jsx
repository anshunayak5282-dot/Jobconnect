import React from 'react';

export function ToastContainer({ toasts = [], removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center justify-between gap-3 text-xs font-semibold animate-fade-in pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            {t.type === 'info' ? (
              <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : t.type === 'error' ? (
              <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            <span>{t.message}</span>
          </div>
          {removeToast && (
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1 transition"
              title="Dismiss"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
