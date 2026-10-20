import React from 'react';

export function CandidateDetailModal({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">{candidate.name}</h3>
            <p className="text-xs text-indigo-600 font-bold">
              {candidate.email} • {candidate.phone} • {candidate.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-700">
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-1">About Candidate</h4>
            <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {candidate.about || 'No summary provided.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-1">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {(candidate.skills || []).map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold text-xs border border-indigo-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-1">Education & Background</h4>
            <div className="space-y-2">
              {(candidate.education || []).map((e, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800">{e.degree}</p>
                  <p className="text-slate-500 text-[11px]">{e.institution} ({e.year})</p>
                </div>
              ))}
            </div>
          </div>

          {candidate.experience && candidate.experience.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">Work Experience</h4>
              <div className="space-y-2">
                {candidate.experience.map((exp, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800">
                      {exp.position} • <span className="text-indigo-600 font-semibold">{exp.company}</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">{exp.startDate} – {exp.endDate}</p>
                    {exp.description && <p className="text-slate-600 text-[11px] mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {candidate.projects && candidate.projects.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">Featured Projects</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {candidate.projects.map((proj, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800">{proj.title}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetailModal;
