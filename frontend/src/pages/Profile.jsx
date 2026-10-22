import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { data, addSkill, removeSkill, showToast } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const p = data.profile;

  const handleAdd = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const previewResume = () => {
    alert(`[JobConnect PDF Viewer]\n\nResume Document: ${p.resumeName}\n\nCandidate: ${p.name}\nTitle: ${p.title}\nSkills: ${p.skills.join(', ')}\nEducation: BIT Mesra\nStatus: Verified.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
              AK
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-3 break-words">{p.name}</h2>
            <p className="text-xs font-bold text-indigo-600 break-words">{p.title}</p>
            <p className="text-xs text-slate-500 mt-1 break-words">📍 {p.location}</p>

            {/* Profile Strength */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-left">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Profile Completeness</span>
                <span className="text-emerald-600">92% (High)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full w-[92%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Verified profile ready for instant HR reviews.</p>
            </div>

            {/* Contact */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-left text-slate-600">
              <div className="break-all">✉️ {p.email}</div>
              <div className="break-all">📞 {p.phone}</div>
            </div>
          </div>

          {/* Active Resume */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center justify-between">
              <span>Active Resume</span>
              <span className="text-xs text-emerald-600 font-semibold">Verified</span>
            </h3>
            
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0">PDF</span>
                <div className="text-xs min-w-0">
                  <p className="font-bold text-slate-800 truncate" title={p.resumeName}>{p.resumeName}</p>
                  <p className="text-[10px] text-slate-400">Attached to applications</p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => showToast("Simulated upload: Resume is current!", "info")}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Upload New
              </button>
              <button
                onClick={previewResume}
                className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">Professional Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-3 break-words">{p.about}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Technical Skills</h3>
              <span className="text-xs text-slate-400">{p.skills.length} skills listed</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.skills.map(s => (
                <span key={s} className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 font-bold text-xs border border-indigo-100 flex items-center gap-1.5 break-words">
                  {s}
                  <button onClick={() => removeSkill(s)} className="text-indigo-400 hover:text-rose-500 text-[10px]">✕</button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAdd} className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. AWS, GraphQL)..."
                className="text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 min-w-0"
              />
              <button type="submit" className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition shrink-0">
                Add
              </button>
            </form>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">Education</h3>
            <div className="mt-3 space-y-3">
              {p.education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <p className="font-bold text-slate-900 break-words">{edu.degree}</p>
                  <p className="text-slate-600 break-words">{edu.institution}</p>
                  <span className="text-[10px] font-bold text-indigo-600 block mt-0.5">Year: {edu.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">Experience</h3>
            <div className="mt-3 space-y-3">
              {p.experience.map((exp, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="font-bold text-slate-900 break-words">{exp.position}</p>
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-indigo-600 font-semibold break-words">{exp.company}</p>
                  <p className="text-slate-600 mt-1 leading-relaxed break-words">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
