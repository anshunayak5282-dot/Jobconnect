import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Toast = () => {
  const { toasts } = useAuth();

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
      {toasts.map(toast => {
        let icon = "✓";
        let iconColor = "text-emerald-400";
        if (toast.type === 'info') {
          icon = "ℹ";
          iconColor = "text-indigo-400";
        } else if (toast.type === 'error') {
          icon = "✕";
          iconColor = "text-rose-400";
        }

        return (
          <div
            key={toast.id}
            className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3 text-xs font-semibold animate-fade-in pointer-events-auto"
          >
            <span className={`font-black ${iconColor}`}>{icon}</span>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
